import { z } from 'zod';

export const registerSchema = z
    .object({
        name: z
            .string()
            .min(2, 'Name must have at least 2 characters'),

        email: z
            .string()
            .min(1, 'Email is required')
            .email('Enter a valid email'),

        password: z
            .string()
            .min(8, 'Password must have at least 8 characters'),

        confirmPassword: z
            .string()
            .min(1, 'Confirm your password'),
    })
    .refine(
        (data) =>
            data.password === data.confirmPassword,
        {
            message: 'Passwords do not match',
            path: ['confirmPassword'],
        },
    );

export type RegisterFormData =
    z.infer<typeof registerSchema>;