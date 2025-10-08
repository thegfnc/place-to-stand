'use server'

import { Resend } from 'resend'
import {
  contactSchema,
  type ContactFormValues,
} from '@/src/lib/validations/contact'

export type ContactActionResult =
  | { success: true }
  | {
      success: false
      message?: string
      errors?: Partial<Record<keyof ContactFormValues, string[]>>
    }

export async function sendContact(
  values: ContactFormValues
): Promise<ContactActionResult> {
  const parsed = contactSchema.safeParse(values)
  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.flatten().fieldErrors,
    } as const
  }

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    return {
      success: false,
      message: 'Email service is not configured. Please try again later.',
    } as const
  }

  try {
    const resend = new Resend(apiKey)
    await resend.emails.send({
      from: 'Place To Stand <hello@placetostandagency.com>',
      to: ['hello@placetostandagency.com'],
      subject: `New inquiry from ${parsed.data.name}`,
      text: `Name: ${parsed.data.name}\nEmail: ${parsed.data.email}\nMessage: ${parsed.data.message}`,
    })

    return {
      success: true,
    } as const
  } catch (error) {
    console.error('Contact form submission failed', error)
    return {
      success: false,
      message: 'Something went wrong while sending your message.',
    } as const
  }
}
