'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Mail, Shield, AlertTriangle, CheckCircle, ChevronDown, ChevronUp, Eye, EyeOff, Loader2 } from 'lucide-react';

interface PayPalFormData {
  paypalEmail: string;
  confirmEmail: string;
}

export default function PayPalSettingsPanel() {
  const [isOpen, setIsOpen] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [savedEmail, setSavedEmail] = useState<string | null>('miguel.r@gmail.com');
  const [showEmail, setShowEmail] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isDirty },
  } = useForm<PayPalFormData>({
    defaultValues: {
      paypalEmail: '',
      confirmEmail: '',
    },
  });

  const watchedEmail = watch('paypalEmail');

  const onSubmit = async (data: PayPalFormData) => {
    // Backend integration point: PUT /api/user/paypal-email with { email: data.paypalEmail }
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setSavedEmail(data.paypalEmail);
    setIsSaving(false);
    setIsEditing(false);
    reset();
    toast.success('Correo de PayPal guardado ✓', {
      description: `Los retiros se enviarán a ${data.paypalEmail}`,
    });
  };

  const maskedEmail = savedEmail
    ? savedEmail.replace(/(.{2})(.*)(@.*)/, (_, a, b, c) => a + '*'.repeat(Math.max(b.length, 3)) + c)
    : null;

  return (
    <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
      {/* Header — toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-4 flex items-center justify-between hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
            <Mail size={18} className="text-primary" />
          </div>
          <div className="text-left">
            <p className="font-semibold text-sm text-foreground">Correo de PayPal para retiros</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {savedEmail
                ? showEmail ? savedEmail : maskedEmail
                : 'No configurado — configura tu correo para retirar'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {savedEmail ? (
            <span className="badge-success px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1">
              <CheckCircle size={10} />
              Activo
            </span>
          ) : (
            <span className="badge-warning px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1">
              <AlertTriangle size={10} />
              Pendiente
            </span>
          )}
          {isOpen ? (
            <ChevronUp size={16} className="text-muted-foreground" />
          ) : (
            <ChevronDown size={16} className="text-muted-foreground" />
          )}
        </div>
      </button>

      {/* Expanded Content */}
      {isOpen && (
        <div className="px-5 pb-5 border-t border-border">
          {/* Saved Email Display */}
          {savedEmail && !isEditing && (
            <div className="mt-4">
              <div className="flex items-center justify-between p-4 bg-success/5 border border-success/20 rounded-xl mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center">
                    <CheckCircle size={16} className="text-success" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Correo configurado</p>
                    <p className="text-sm font-semibold text-foreground font-mono">
                      {showEmail ? savedEmail : maskedEmail}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowEmail(!showEmail)}
                  className="p-2 rounded-lg hover:bg-muted/50 transition-colors"
                  aria-label={showEmail ? 'Ocultar correo' : 'Mostrar correo'}
                >
                  {showEmail ? (
                    <EyeOff size={15} className="text-muted-foreground" />
                  ) : (
                    <Eye size={15} className="text-muted-foreground" />
                  )}
                </button>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex-1 btn-secondary py-2.5 text-sm font-medium"
                >
                  Cambiar correo
                </button>
                <button
                  disabled
                  className="flex-1 btn-primary py-2.5 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Necesitas 500 monedas para retirar"
                >
                  Solicitar retiro
                </button>
              </div>

              <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1.5">
                <Shield size={11} />
                Los retiros se procesan en 1–3 días hábiles vía PayPal
              </p>
            </div>
          )}

          {/* Edit / New Email Form */}
          {(!savedEmail || isEditing) && (
            <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
              {/* Warning if no email */}
              {!savedEmail && (
                <div className="flex items-start gap-3 p-3 bg-warning/5 border border-warning/20 rounded-xl">
                  <AlertTriangle size={16} className="text-warning mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-warning">Correo de PayPal requerido</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Debes configurar tu correo de PayPal antes de poder solicitar retiros de monedas.
                    </p>
                  </div>
                </div>
              )}

              {/* PayPal Email Field */}
              <div>
                <label htmlFor="paypalEmail" className="block text-sm font-medium text-foreground mb-1.5">
                  Correo electrónico de PayPal
                </label>
                <p className="text-xs text-muted-foreground mb-2">
                  Ingresa exactamente el correo asociado a tu cuenta de PayPal
                </p>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                  <input
                    id="paypalEmail"
                    type="email"
                    placeholder="tu@correo.com"
                    className="input-field w-full pl-10 pr-4 py-2.5 text-sm"
                    {...register('paypalEmail', {
                      required: 'El correo de PayPal es obligatorio',
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: 'Ingresa un correo electrónico válido',
                      },
                    })}
                  />
                </div>
                {errors.paypalEmail && (
                  <p className="text-danger text-xs mt-1.5 flex items-center gap-1">
                    <AlertTriangle size={11} />
                    {errors.paypalEmail.message}
                  </p>
                )}
              </div>

              {/* Confirm Email Field */}
              <div>
                <label htmlFor="confirmEmail" className="block text-sm font-medium text-foreground mb-1.5">
                  Confirmar correo de PayPal
                </label>
                <p className="text-xs text-muted-foreground mb-2">
                  Repite tu correo para evitar errores en los retiros
                </p>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                  <input
                    id="confirmEmail"
                    type="email"
                    placeholder="tu@correo.com"
                    className="input-field w-full pl-10 pr-4 py-2.5 text-sm"
                    {...register('confirmEmail', {
                      required: 'Por favor confirma tu correo',
                      validate: value =>
                        value === watchedEmail || 'Los correos no coinciden',
                    })}
                  />
                </div>
                {errors.confirmEmail && (
                  <p className="text-danger text-xs mt-1.5 flex items-center gap-1">
                    <AlertTriangle size={11} />
                    {errors.confirmEmail.message}
                  </p>
                )}
              </div>

              {/* Form Actions */}
              <div className="flex gap-3 pt-1">
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => { setIsEditing(false); reset(); }}
                    className="flex-1 btn-secondary py-2.5 text-sm font-medium"
                  >
                    Cancelar
                  </button>
                )}
                <button
                  type="submit"
                  disabled={isSaving || !isDirty}
                  className="flex-1 btn-primary py-2.5 text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      Guardando…
                    </>
                  ) : (
                    <>
                      <Shield size={15} />
                      Guardar correo de PayPal
                    </>
                  )}
                </button>
              </div>

              <p className="text-xs text-muted-foreground flex items-center gap-1.5 pt-1">
                <Shield size={11} />
                Tu correo está encriptado y solo se usa para procesar retiros
              </p>
            </form>
          )}
        </div>
      )}
    </div>
  );
}