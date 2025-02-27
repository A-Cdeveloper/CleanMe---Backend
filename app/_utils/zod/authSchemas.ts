import { z } from "zod";

// Shared Fields
export const emailSchema = z
  .string()
  .refine((value) => value.trim() !== "", {
    message: "Email je obavezan",
  })
  .refine((value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), {
    message: "Email nije validan.",
  })
  .transform((val) => val.trim());

export const phoneSchema = z
  .string()
  .refine(
    (value) => {
      if (value !== "" && value !== null && value !== undefined) {
        return /^(\+381|0)\s*(6[0-689]|1[1-9])\s*\d{6,7}$/.test(value);
      }
      return true;
    },
    {
      message:
        "Telefon mora da počinje sa +381 ili 0, a broj mora biti validan borj registrovan u Srbiji.",
    }
  )
  .transform((val) => val.trim());

// Strict Password Validation for Registration
export const registerPasswordSchema = z
  .string()
  .refine((value) => value.trim() !== "", {
    message: "Lozinka je obavezna",
  })
  .refine((value) => value.length >= 8, {
    message: "Lozinka mora imati najmanje 8 karaktera.",
  })
  .refine((value) => value.length <= 100, {
    message: "Lozinka mora biti kraća od 100 karaktera.",
  })
  .refine((value) => /[A-Z]/.test(value), {
    message: "Lozinka mora imati najmanje jedno veliko slovo.",
  })
  .refine((value) => /[0-9]/.test(value), {
    message: "Lozinka mora imati najmanje jedan broj.",
  })
  .refine((value) => /[@$!%*?&#]/.test(value), {
    message: "Lozinka mora imati najmanje jedan specijalan karakter.",
  })
  .transform((val) => val.trim());

// Basic Password Validation for Login
const loginPasswordSchema = z.string().min(1, "Lozinka je obavezna.");

// Full Register Schema
export const registerSchema = z.object({
  firstname: z
    .string()
    .min(1, "Ime je obavezno")
    .max(50, "Ime mora biti kraće od 50 karaktera.")
    .transform((val) => val.trim()),
  lastname: z
    .string()
    .min(1, "Prezime je obavezno")
    .max(50, "Prezime mora biti kraće od 50 karaktera.")
    .transform((val) => val.trim()),
  phone: phoneSchema,
  email: emailSchema,
  password: registerPasswordSchema,
});

// Login Schema Using Shared Fields
export const loginSchema = z.object({
  email: emailSchema,
  password: loginPasswordSchema,
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z.object({
  password: registerPasswordSchema,
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
