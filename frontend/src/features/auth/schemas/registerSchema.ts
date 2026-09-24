import type { TFunction } from 'i18next';
import { z } from 'zod';

export function createRegisterSchema(t: TFunction) {
  return z
    .object({
      name: z.string().min(2, t('auth.validation.nameMinLength')),

      email: z
        .string()
        .min(1, t('auth.validation.emailRequired'))
        .email(t('auth.validation.invalidEmail')),

      password: z.string().min(8, t('auth.validation.passwordMinLengthRegister')),

      confirmPassword: z.string().min(1, t('auth.validation.confirmPasswordRequired')),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t('auth.validation.passwordsDoNotMatch'),
      path: ['confirmPassword'],
    });
}

export type RegisterFormData = z.infer<ReturnType<typeof createRegisterSchema>>;
