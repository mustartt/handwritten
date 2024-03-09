import {z} from "zod";

export const registerStepSchema1 = z.object({
    email: z.string().email(),
});

export const registerStepSchema2 = registerStepSchema1.extend({
    name: z.string().min(3).max(64),
    password: z.string()
        .min(8, {message: "Password must be at least 8 characters long"})
        .max(64, {message: "Password cannot be more than 64 characters long"})
        .regex(/[A-Z]/, {message: "Password must contain at least one uppercase letter"})
        .regex(/[a-z]/, {message: "Password must contain at least one lowercase letter"})
        .regex(/[0-9]/, {message: "Password must contain at least one number"}),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

export type RegisterFormSchema = typeof registerStepSchema2;

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1, {message: 'Password cannot be empty'})
});

export type LoginSchema = typeof loginSchema;
