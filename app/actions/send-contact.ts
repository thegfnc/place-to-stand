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
  const audienceId =
    process.env.RESEND_AUDIENCE_ID ?? '469b29de-2269-47c7-81c6-6a294e181e14'
  const asanaAccessToken = process.env.ASANA_ACCESS_TOKEN
  const asanaWorkspaceGid = process.env.ASANA_WORKSPACE_GID
  const asanaProjectGid = process.env.ASANA_PROJECT_GID
  const asanaSectionGid = process.env.ASANA_SECTION_GID
  if (!apiKey) {
    return {
      success: false,
      message: 'Email service is not configured. Please try again later.',
    } as const
  }

  if (!asanaAccessToken || !asanaWorkspaceGid || !asanaProjectGid) {
    return {
      success: false,
      message: 'Lead management is not configured. Please try again later.',
    } as const
  }

  try {
    const resend = new Resend(apiKey)
    await resend.emails.send({
      from: 'Place To Stand <noreply@notifications.placetostandagency.com>',
      to: [
        'hello@placetostandagency.com',
        'damon@placetostandagency.com',
        'jason@placetostandagency.com',
      ],
      subject: `New inquiry from ${parsed.data.name}`,
      text: `Name: ${parsed.data.name}\nEmail: ${parsed.data.email}\nMessage: ${parsed.data.message}`,
    })

    const trimmedName = parsed.data.name.trim()
    const [firstName, ...restOfName] = trimmedName.split(/\s+/)
    const lastName = restOfName.join(' ').trim()

    const contactPayload: {
      email: string
      audienceId: string
      unsubscribed: boolean
      firstName?: string
      lastName?: string
    } = {
      email: parsed.data.email,
      audienceId,
      unsubscribed: false,
    }

    if (firstName) {
      contactPayload.firstName = firstName
    }

    if (lastName) {
      contactPayload.lastName = lastName
    }

    const { error: contactError } = await resend.contacts.create(contactPayload)

    if (contactError) {
      const normalizedMessage = contactError.message?.toLowerCase() ?? ''
      const contactAlreadyExists = normalizedMessage.includes('already exists')

      if (!contactAlreadyExists) {
        throw new Error(
          `Failed to add contact to Resend audience: ${contactError.message}`
        )
      }
    }

    const asanaPayload: {
      data: {
        name: string
        notes: string
        workspace: string
        projects: string[]
        memberships?: Array<{ project: string; section: string }>
      }
    } = {
      data: {
        name: `New lead: ${parsed.data.name}`,
        notes: `Name: ${parsed.data.name}\nEmail: ${parsed.data.email}\nMessage: ${parsed.data.message}`,
        workspace: asanaWorkspaceGid,
        projects: [asanaProjectGid],
      },
    }

    if (asanaSectionGid) {
      asanaPayload.data.memberships = [
        { project: asanaProjectGid, section: asanaSectionGid },
      ]
    }

    const asanaResponse = await fetch('https://app.asana.com/api/1.0/tasks', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${asanaAccessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(asanaPayload),
    })

    if (!asanaResponse.ok) {
      const errorText = await asanaResponse.text()
      console.error('Failed to create Asana task', {
        status: asanaResponse.status,
        statusText: asanaResponse.statusText,
        body: errorText,
      })

      throw new Error('Failed to create a lead task. Please try again later.')
    }

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
