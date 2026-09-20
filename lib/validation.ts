import { z } from 'zod';

// Basic Indian mobile number: 10 digits, optionally prefixed with +91
const mobileRegex = /^(\+91)?[6-9]\d{9}$/;

export const registerSchema = z
  .object({
    fullName: z.string().trim().min(2, 'Full name is too short').max(100),
    email: z.string().trim().toLowerCase().email('Enter a valid email'),
    mobile: z.string().trim().regex(mobileRegex, 'Enter a valid 10-digit mobile number'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(72)
      .regex(/[A-Z]/, 'Password must contain an uppercase letter')
      .regex(/[a-z]/, 'Password must contain a lowercase letter')
      .regex(/[0-9]/, 'Password must contain a number'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const loginSchema = z.object({
  identifier: z.string().trim().min(3, 'Enter your email or mobile number'),
  password: z.string().min(1, 'Password is required'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().trim().toLowerCase().email('Enter a valid email'),
});

export const resetPasswordSchema = z
  .object({
    token: z.string().min(10),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain an uppercase letter')
      .regex(/[a-z]/, 'Password must contain a lowercase letter')
      .regex(/[0-9]/, 'Password must contain a number'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const addressSchema = z.object({
  fullName: z.string().trim().min(2).max(100),
  mobile: z.string().trim().regex(mobileRegex, 'Enter a valid 10-digit mobile number'),
  line1: z.string().trim().min(5, 'Enter a complete address'),
  city: z.string().trim().min(2),
  state: z.string().trim().min(2),
  pincode: z.string().trim().regex(/^\d{6}$/, 'Enter a valid 6-digit pincode'),
  country: z.string().trim().default('India'),
});

export const contactSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().toLowerCase().email('Enter a valid email'),
  subject: z.string().trim().min(3).max(150),
  message: z.string().trim().min(10, 'Message is too short').max(3000),
});

export const bookSchema = z.object({
  title: z.string().trim().min(1),
  author: z.string().trim().min(1),
  description: z.string().trim().min(1),
  categoryId: z.string().min(1),
  subcategoryId: z.string().optional().nullable(),
  publisher: z.string().optional().nullable(),
  isbn: z.string().optional().nullable(),
  language: z.string().default('English'),
  pages: z.coerce.number().int().positive().optional().nullable(),
  publicationYear: z.coerce.number().int().min(1000).max(3000).optional().nullable(),
  type: z.enum(['READING', 'PHYSICAL', 'BOTH']),
  originalPrice: z.coerce.number().nonnegative(),
  sellingPrice: z.coerce.number().nonnegative(),
  discountPercent: z.coerce.number().int().min(0).max(100).default(0),
  stockQuantity: z.coerce.number().int().min(0).default(0),
  featured: z.coerce.boolean().default(false),
  published: z.coerce.boolean().default(false),
  readingEnabled: z.coerce.boolean().default(false),
  storeEnabled: z.coerce.boolean().default(false),
  downloadEnabled: z.coerce.boolean().default(false),
});

export const reviewSchema = z.object({
  bookId: z.string().min(1),
  orderId: z.string().min(1),
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().trim().min(3).max(2000),
});

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}
