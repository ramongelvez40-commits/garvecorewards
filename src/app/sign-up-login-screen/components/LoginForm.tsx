'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Mail, Lock, Eye, EyeOff, Loader2, AlertTriangle, Copy, Check } from 'lucide-react';

import { useRouter } from 'next/navigation';
import { saveUserSession, emailToUserId } from '@/lib/userStore';

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

const DEMO_CREDENTIALS = {
  email: 'miguel.r@garvecoapp.com',
  password: 'Garveco2026!',
};

interface LoginFormProps {
  onSwitchToSignUp: () => void;
}

export default function LoginForm({ onSwitchToSignUp }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedField, setCopiedField] = useState<'email' | 'password' | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm<LoginFormData>({
    defaultValues: { email: '', password: '', rememberMe: false },
  });

  const handleCopy = (field: 'email' | 'password') => {
    const val = field === 'email' ? DEMO_CREDENTIALS.email : DEMO_CREDENTIALS.password;
    navigator.clipboard.writeText(val).catch(() => {});
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleAutofill = () => {
    setValue('email', DEMO_CREDENTIALS.email);
    setValue('password', DEMO_CREDENTIALS.password);
  };

  const onSubmit = async (data: LoginFormData) => {
    // Backend integration point: POST /api/auth/login with { email, password }
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1400));

    if (
      data.email !== DEMO_CREDENTIALS.email ||
      data.password !== DEMO_CREDENTIALS.password
    ) {
      setError('root', {
        message: 'Credenciales inválidas — usa las cuentas demo de abajo para iniciar sesión',
      });
      setIsLoading(false);
      return;
    }

    // Persist user session so offer walls receive the real user ID
    saveUserSession({
      userId: emailToUserId(data.email),
      email: data.email,
      displayName: 'Miguel R.',
    });

    toast.success('¡Bienvenido de vuelta, Miguel! 🎉');
    setIsLoading(false);
    router.push('/');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Bienvenido de vuelta</h2>
        <p className="text-muted-foreground text-sm mt-1">Ingresa a tu cuenta para ver tus recompensas</p>
      </div>

      {/* Root Error */}
      {errors.root && (
        <div className="flex items-start gap-3 p-3 bg-danger/5 border border-danger/20 rounded-xl">
          <AlertTriangle size={15} className="text-danger mt-0.5 shrink-0" />
          <p className="text-danger text-xs leading-snug">{errors.root.message}</p>
        </div>
      )}

      {/* Email */}
      <div>
        <label htmlFor="login-email" className="block text-sm font-medium text-foreground mb-1.5">
          Correo electrónico
        </label>
        <div className="relative">
          <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <input
            id="login-email"
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
        <div className="flex items-center justify-between mb-1.5">
          <label htmlFor="login-password" className="text-sm font-medium text-foreground">
            Contraseña
          </label>
          <button type="button" className="text-xs text-primary hover:text-primary/80 transition-colors font-medium">
            ¿Olvidaste tu contraseña?
          </button>
        </div>
        <div className="relative">
          <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <input
            id="login-password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            className="input-field w-full pl-10 pr-11 py-2.5 text-sm"
            autoComplete="current-password"
            {...register('password', {
              required: 'La contraseña es obligatoria',
              minLength: {
                value: 6,
                message: 'La contraseña debe tener al menos 6 caracteres',
              },
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
        {errors.password && (
          <p className="text-danger text-xs mt-1.5 flex items-center gap-1">
            <AlertTriangle size={11} />
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Remember Me */}
      <div className="flex items-center gap-2.5">
        <input
          id="rememberMe"
          type="checkbox"
          className="w-4 h-4 rounded border-border bg-input accent-primary cursor-pointer"
          {...register('rememberMe')}
        />
        <label htmlFor="rememberMe" className="text-sm text-muted-foreground cursor-pointer">
          Recordar mi sesión por 30 días
        </label>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading}
        className="btn-primary w-full py-3 text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Iniciando sesión…
          </>
        ) : (
          'Iniciar sesión'
        )}
      </button>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-border" />
        <span className="text-xs text-muted-foreground">o continúa con</span>
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

      {/* Switch to Sign Up */}
      <p className="text-center text-sm text-muted-foreground">
        ¿No tienes cuenta?{' '}
        <button
          type="button"
          onClick={onSwitchToSignUp}
          className="text-primary font-semibold hover:text-primary/80 transition-colors"
        >
          Regístrate gratis
        </button>
      </p>

      {/* Demo Credentials Box */}
      <div className="mt-2 p-4 bg-muted/50 border border-border rounded-xl">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold text-foreground">Cuenta demo</p>
          <button
            type="button"
            onClick={handleAutofill}
            className="text-xs text-primary font-medium hover:text-primary/80 transition-colors px-2 py-1 rounded-lg hover:bg-primary/10"
          >
            Autocompletar
          </button>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between bg-background rounded-lg px-3 py-2">
            <div>
              <p className="text-xs text-muted-foreground">Email</p>
              <p className="text-xs font-mono font-medium text-foreground">{DEMO_CREDENTIALS.email}</p>
            </div>
            <button
              type="button"
              onClick={() => handleCopy('email')}
              className="p-1.5 rounded-md hover:bg-border transition-colors"
              aria-label="Copiar email"
            >
              {copiedField === 'email' ? (
                <Check size={13} className="text-success" />
              ) : (
                <Copy size={13} className="text-muted-foreground" />
              )}
            </button>
          </div>
          <div className="flex items-center justify-between bg-background rounded-lg px-3 py-2">
            <div>
              <p className="text-xs text-muted-foreground">Contraseña</p>
              <p className="text-xs font-mono font-medium text-foreground">{DEMO_CREDENTIALS.password}</p>
            </div>
            <button
              type="button"
              onClick={() => handleCopy('password')}
              className="p-1.5 rounded-md hover:bg-border transition-colors"
              aria-label="Copiar contraseña"
            >
              {copiedField === 'password' ? (
                <Check size={13} className="text-success" />
              ) : (
                <Copy size={13} className="text-muted-foreground" />
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}