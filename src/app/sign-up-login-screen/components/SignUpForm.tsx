'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Mail, Lock, Eye, EyeOff, Loader2, AlertTriangle, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { saveUserSession, emailToUserId } from '@/lib/userStore';

interface SignUpFormData {
  fullName: string;
  email: string;
  password: string;
  referralCode: string;
  agreeTerms: boolean;
}

interface SignUpFormProps {
  onSwitchToLogin: () => void;
}

export default function SignUpForm({ onSwitchToLogin }: SignUpFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignUpFormData>({
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      referralCode: '',
      agreeTerms: false,
    },
  });

  const watchedPassword = watch('password');

  const getPasswordStrength = (pwd: string): { label: string; color: string; width: string } => {
    if (!pwd) return { label: '', color: '', width: '0%' };
    if (pwd.length < 6) return { label: 'Muy débil', color: 'bg-danger', width: '25%' };
    if (pwd.length < 8) return { label: 'Débil', color: 'bg-warning', width: '50%' };
    if (!/[A-Z]/.test(pwd) || !/[0-9]/.test(pwd)) return { label: 'Regular', color: 'bg-primary', width: '75%' };
    return { label: 'Fuerte', color: 'bg-success', width: '100%' };
  };

  const strength = getPasswordStrength(watchedPassword);

  const onSubmit = async (data: SignUpFormData) => {
    // Backend integration point: POST /api/auth/register with user data
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1600));
    setIsLoading(false);

    // Persist user session so offer walls receive the real user ID
    saveUserSession({
      userId: emailToUserId(data.email),
      email: data.email,
      displayName: data.fullName,
    });

    toast.success('¡Cuenta creada exitosamente! 🎉', {
      description: 'Bienvenido a GarvecoRewards. Ya tienes 50 monedas de bienvenida.',
    });
    router.push('/');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Crea tu cuenta</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Recibe 50 monedas de bienvenida al registrarte
        </p>
      </div>

      {/* Welcome Bonus Banner */}
      <div className="flex items-center gap-3 p-3 bg-primary/5 border border-primary/20 rounded-xl">
        <span className="text-2xl" role="img" aria-label="gift">🎁</span>
        <div>
          <p className="text-xs font-semibold text-primary">Bono de bienvenida</p>
          <p className="text-xs text-muted-foreground">+50 monedas gratis al crear tu cuenta hoy</p>
        </div>
      </div>

      {/* Full Name */}
      <div>
        <label htmlFor="signup-name" className="block text-sm font-medium text-foreground mb-1.5">
          Nombre completo
        </label>
        <div className="relative">
          <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <input
            id="signup-name"
            type="text"
            placeholder="Tu nombre completo"
            className="input-field w-full pl-10 pr-4 py-2.5 text-sm"
            autoComplete="name"
            {...register('fullName', {
              required: 'El nombre es obligatorio',
              minLength: { value: 2, message: 'El nombre debe tener al menos 2 caracteres' },
            })}
          />
        </div>
        {errors.fullName && (
          <p className="text-danger text-xs mt-1.5 flex items-center gap-1">
            <AlertTriangle size={11} />
            {errors.fullName.message}
          </p>
        )}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="signup-email" className="block text-sm font-medium text-foreground mb-1.5">
          Correo electrónico
        </label>
        <div className="relative">
          <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <input
            id="signup-email"
            type="email"
            placeholder="tu@correo.com"
            className="input-field w-full pl-10 pr-4 py-2.5 text-sm"
            autoComplete="email"
            {...register('email', {
              required: 'El correo electrónico es obligatorio',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Ingresa un correo electrónico válido',
              },
            })}
          />
        </div>
        {errors.email && (
          <p className="text-danger text-xs mt-1.5 flex items-center gap-1">
            <AlertTriangle size={11} />
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Password */}
      <div>
        <label htmlFor="signup-password" className="block text-sm font-medium text-foreground mb-1.5">
          Contraseña
        </label>
        <p className="text-xs text-muted-foreground mb-2">
          Mínimo 8 caracteres, incluye mayúsculas y números para mayor seguridad
        </p>
        <div className="relative">
          <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <input
            id="signup-password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Crea una contraseña segura"
            className="input-field w-full pl-10 pr-11 py-2.5 text-sm"
            autoComplete="new-password"
            {...register('password', {
              required: 'La contraseña es obligatoria',
              minLength: { value: 6, message: 'La contraseña debe tener al menos 6 caracteres' },
            })}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>
        {/* Password Strength */}
        {watchedPassword && (
          <div className="mt-2">
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${strength.color}`}
                style={{ width: strength.width }}
              />
            </div>
            <p className={`text-xs mt-1 font-medium ${
              strength.label === 'Fuerte' ? 'text-success' :
              strength.label === 'Regular' ? 'text-primary' :
              strength.label === 'Débil' ? 'text-warning' : 'text-danger'
            }`}>
              {strength.label}
            </p>
          </div>
        )}
        {errors.password && (
          <p className="text-danger text-xs mt-1.5 flex items-center gap-1">
            <AlertTriangle size={11} />
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Referral Code (optional) */}
      <div>
        <label htmlFor="signup-referral" className="block text-sm font-medium text-foreground mb-1.5">
          Código de referido{' '}
          <span className="text-muted-foreground font-normal">(opcional)</span>
        </label>
        <p className="text-xs text-muted-foreground mb-2">
          Si alguien te invitó, ingresa su código para que ambos ganen monedas extra
        </p>
        <input
          id="signup-referral"
          type="text"
          placeholder="Ej: GARV-X7K2M"
          className="input-field w-full px-4 py-2.5 text-sm font-mono uppercase tracking-wider"
          {...register('referralCode')}
        />
      </div>

      {/* Terms */}
      <div className="flex items-start gap-2.5">
        <input
          id="agreeTerms"
          type="checkbox"
          className="w-4 h-4 rounded border-border bg-input accent-primary cursor-pointer mt-0.5 shrink-0"
          {...register('agreeTerms', {
            required: 'Debes aceptar los términos para continuar',
          })}
        />
        <label htmlFor="agreeTerms" className="text-xs text-muted-foreground cursor-pointer leading-relaxed">
          Acepto los{' '}
          <span className="text-primary font-medium">Términos de Servicio</span>
          {' '}y la{' '}
          <span className="text-primary font-medium">Política de Privacidad</span>
          {' '}de GarvecoRewards
        </label>
      </div>
      {errors.agreeTerms && (
        <p className="text-danger text-xs flex items-center gap-1 -mt-2">
          <AlertTriangle size={11} />
          {errors.agreeTerms.message}
        </p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading}
        className="btn-primary w-full py-3 text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Creando cuenta…
          </>
        ) : (
          'Crear cuenta gratis 🪙'
        )}
      </button>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-border" />
        <span className="text-xs text-muted-foreground">o regístrate con</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* Google OAuth */}
      <button
        type="button"
        className="btn-secondary w-full py-2.5 text-sm font-medium flex items-center justify-center gap-2.5"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-label="Google logo">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        Continuar con Google
      </button>

      {/* Switch to Login */}
      <p className="text-center text-sm text-muted-foreground">
        ¿Ya tienes cuenta?{' '}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="text-primary font-semibold hover:text-primary/80 transition-colors"
        >
          Inicia sesión
        </button>
      </p>
    </form>
  );
}