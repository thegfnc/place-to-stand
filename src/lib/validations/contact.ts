import { z } from 'zod'

const optionalString = z
  .string()
  .trim()
  .max(256, 'Must be 256 characters or fewer.')
  .optional()
  .or(z.literal(''))

const optionalUrl = z
  .string()
  .trim()
  .optional()
  .refine(value => !value || z.string().url().safeParse(value).success, {
    message: 'Please enter a valid URL.',
  })
  .or(z.literal(''))

export const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email('Please enter a valid email address.'),
  company: optionalString,
  website: optionalUrl,
  message: z.string().min(10, 'Message must be at least 10 characters.'),
})

export type ContactFormValues = z.infer<typeof contactSchema>
