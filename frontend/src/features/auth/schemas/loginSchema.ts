import { z } from 'zod';
import type { TFunction } from 'i18next';

export function createLoginSchema(t: TFunction) {
  return z.object({
    email: z
      .string()
      .min(1, t('auth.validation.emailRequired'))
      .email(t('auth.validation.invalidEmail')),

    password: z
      .string()
      .min(1, t('auth.validation.passwordRequired'))
      .min(6, t('auth.validation.passwordMinLength')),
  });
}

export type LoginFormData = z.infer<ReturnType<typeof createLoginSchema>>;
