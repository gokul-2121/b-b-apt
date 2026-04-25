import { z } from 'zod'

const datePattern = /^\d{4}-\d{2}-\d{2}$/

const imageUrlSchema = z
  .string()
  .trim()
  .refine((value) => {
    if (value === '') {
      return true
    }

    if (value.startsWith('/')) {
      return true
    }

    return /^https?:\/\//i.test(value)
  }, 'Image URL must be an absolute URL or a root-relative path')

export const newsInputSchema = z.object({
  title: z.string().trim().min(3).max(160),
  date: z.string().trim().regex(datePattern, 'Date must be in YYYY-MM-DD format'),
  excerpt: z.string().trim().min(8).max(280),
  content: z.string().trim().min(16).max(5000),
  imageUrl: imageUrlSchema,
  published: z.boolean().default(true),
})

export const newsUpdateSchema = newsInputSchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  'At least one field is required for update'
)

export const galleryInputSchema = z.object({
  title: z.string().trim().min(2).max(120),
  alt: z.string().trim().min(2).max(160),
  category: z.string().trim().min(2).max(64),
  caption: z.string().trim().max(500).default(''),
  imageUrl: imageUrlSchema,
  layout: z.enum(['normal', 'large', 'tall']).default('normal'),
  visible: z.boolean().default(true),
  featured: z.boolean().default(false),
})

export const galleryUpdateSchema = galleryInputSchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  'At least one field is required for update'
)
