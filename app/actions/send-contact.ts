'use server'

import { after } from 'next/server'
import { Resend } from 'resend'
import { checkBotId } from 'botid/server'
import {
  contactSchema,
  type ContactFormValues,
} from '@/src/lib/validations/contact'

const WEBSITE_SOURCE_DETAIL = 'https://placetostandagency.com/'

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

  try {
    const verification = await checkBotId({
      advancedOptions: {
        checkLevel: 'basic',
      },
    })

    if (verification.isBot) {
      console.warn('BotID blocked a contact submission attempt')

      return {
        success: false,
        message:
          "We couldn't verify your request. Please refresh and try again.",
      } as const
    }
  } catch (error) {
    console.error('BotID verification failed', error)

    return {
      success: false,
      message:
        'Unable to verify your request at this time. Please try again later.',
    } as const
  }

  const apiKey = process.env.RESEND_API_KEY
  const audienceId = process.env.RESEND_AUDIENCE_ID
  const portalLeadsEndpoint = process.env.PORTAL_LEADS_ENDPOINT
  const portalLeadsToken = process.env.PORTAL_LEADS_TOKEN

  if (!apiKey) {
    return {
      success: false,
      message: 'Email service is not configured. Please try again later.',
    } as const
  }

  if (!audienceId) {
    return {
      success: false,
      message: 'Audience management is not configured. Please try again later.',
    } as const
  }

  if (!portalLeadsEndpoint || !portalLeadsToken) {
    return {
      success: false,
      message: 'Lead management is not configured. Please try again later.',
    } as const
  }

  const { name, email, message, company, website } = parsed.data

  after(async () => {
    try {
      const resend = new Resend(apiKey)

      const trimmedName = name.trim()
      const [firstName, ...restOfName] = trimmedName.split(/\s+/)
      const lastName = restOfName.join(' ').trim()
      const trimmedCompany = company?.trim()
      const trimmedWebsite = website?.trim()
      const trimmedMessage = message.trim()
      const greetingName = firstName || trimmedName || 'there'

      const detailLines = [`Name: ${name}`, `Email: ${email}`]

      if (trimmedCompany) {
        detailLines.push(`Company: ${trimmedCompany}`)
      }

      if (trimmedWebsite) {
        detailLines.push(`Website: ${trimmedWebsite}`)
      }

      if (trimmedMessage) {
        detailLines.push('', 'Message:', ...trimmedMessage.split(/\r?\n/))
      }

      const clientEmailLines = [
        `Hi ${greetingName},`,
        '',
        "Thanks for reaching out to Place To Stand. Here's a quick summary of what you shared:",
        '',
        `Name: ${name}`,
        `Email: ${email}`,
      ]

      if (trimmedCompany) {
        clientEmailLines.push(`Company: ${trimmedCompany}`)
      }

      if (trimmedWebsite) {
        clientEmailLines.push(`Website: ${trimmedWebsite}`)
      }

      if (trimmedMessage) {
        clientEmailLines.push('', 'Message:')
        clientEmailLines.push(...trimmedMessage.split(/\r?\n/))
      }

      clientEmailLines.push(
        '',
        "We'll get back to you within one business day. If you need to add anything in the meantime, please reach out to hello@placetostandagency.com.",
        '',
        'Talk soon,',
        'The Place To Stand Team'
      )

      const contactPayload: {
        email: string
        audienceId: string
        unsubscribed: boolean
        firstName?: string
        lastName?: string
      } = {
        email,
        audienceId,
        unsubscribed: false,
      }

      if (firstName) {
        contactPayload.firstName = firstName
      }

      if (lastName) {
        contactPayload.lastName = lastName
      }

      const { error: contactError } =
        await resend.contacts.create(contactPayload)

      if (contactError) {
        const normalizedMessage = contactError.message?.toLowerCase() ?? ''
        const contactAlreadyExists =
          normalizedMessage.includes('already exists')

        if (!contactAlreadyExists) {
          throw new Error(
            `Failed to add contact to Resend audience: ${contactError.message}`
          )
        }
      }

      const portalPayload = {
        name: trimmedName || name,
        email,
        company: trimmedCompany ?? null,
        website: trimmedWebsite ?? null,
        message: trimmedMessage || null,
        sourceDetail: WEBSITE_SOURCE_DETAIL,
      }

      const portalResponse = await fetch(portalLeadsEndpoint, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${portalLeadsToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(portalPayload),
      })

      if (!portalResponse.ok) {
        const errorText = await portalResponse.text()
        console.error('Failed to create portal lead', {
          status: portalResponse.status,
          statusText: portalResponse.statusText,
          body: errorText,
        })

        throw new Error(
          'Failed to create a lead record. Please try again later.'
        )
      }

      const emailLines = [...detailLines]

      await resend.emails.send({
        from: 'Place To Stand <noreply@notifications.placetostandagency.com>',
        to: ['hello@placetostandagency.com'],
        replyTo: email,
        subject: `New inquiry from ${name}`,
        text: emailLines.join('\n'),
      })

      await resend.emails.send({
        from: 'Place To Stand <noreply@notifications.placetostandagency.com>',
        to: [email],
        replyTo: 'hello@placetostandagency.com',
        subject: 'Thanks for contacting Place To Stand',
        text: clientEmailLines.join('\n'),
      })
    } catch (error) {
      console.error('Contact background job failed', error)
    }
  })

  return {
    success: true,
  } as const
}
