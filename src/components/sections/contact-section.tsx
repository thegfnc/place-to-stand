'use client'

import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { AnimatedSection } from '@/src/components/layout/animated-section'
import { Button } from '@/src/components/ui/button'
import { Input } from '@/src/components/ui/input'
import { Label } from '@/src/components/ui/label'
import { Textarea } from '@/src/components/ui/textarea'
import { toast } from '@/src/components/ui/use-toast'
import {
  sendContact,
  type ContactActionResult,
} from '../../../app/actions/send-contact'
import {
  contactSchema,
  type ContactFormValues,
} from '@/src/lib/validations/contact'

export function ContactSection() {
  const [isPending, startTransition] = useTransition()
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  })

  const onSubmit = form.handleSubmit(values => {
    startTransition(() => {
      void sendContact(values).then((result: ContactActionResult) => {
        if (!result.success) {
          if (result.errors) {
            Object.entries(result.errors).forEach(([key, messages]) => {
              const typedMessages = messages as string[] | undefined
              const firstMessage = typedMessages?.[0]
              if (firstMessage) {
                form.setError(key as keyof ContactFormValues, {
                  message: firstMessage,
                })
              }
            })
          }

          toast({
            variant: 'destructive',
            title: 'Something went wrong',
            description: result.message ?? 'Please try again.',
          })
          return
        }

        toast({
          title: 'Thank you!',
          description: 'Your message has been sent.',
        })
        form.reset()
      })
    })
  })

  return (
    <AnimatedSection id='contact' className='flex flex-col gap-20'>
      <div className='flex flex-col items-center gap-4 text-center'>
        <span className='text-sm font-semibold uppercase tracking-[0.1em] text-ink/60'>
          Contact
        </span>
        <h2 className='max-w-5xl text-balance font-headline text-3xl font-semibold uppercase !leading-[.9] text-ink md:text-5xl'>
          Let’s move forward together
        </h2>
        <p className='max-w-xl text-balance text-lg !leading-snug text-ink/60'>
          Tell us about the investments you&apos;d like to make and we&apos;ll
          follow up within one business day.
        </p>
      </div>
      <div className='mx-auto w-full max-w-3xl gap-10 rounded-xl border border-ink/10 bg-white/80 p-10 shadow-lg backdrop-blur'>
        <form noValidate onSubmit={onSubmit} className='flex flex-col gap-6'>
          <div className='flex flex-col gap-2'>
            <Label htmlFor='name'>Name</Label>
            <Input
              id='name'
              {...form.register('name')}
              aria-invalid={!!form.formState.errors.name}
            />
            {form.formState.errors.name ? (
              <p className='text-sm text-red-600'>
                {form.formState.errors.name.message}
              </p>
            ) : null}
          </div>
          <div className='flex flex-col gap-2'>
            <Label htmlFor='email'>Email</Label>
            <Input
              id='email'
              type='email'
              {...form.register('email')}
              aria-invalid={!!form.formState.errors.email}
            />
            {form.formState.errors.email ? (
              <p className='text-sm text-red-600'>
                {form.formState.errors.email.message}
              </p>
            ) : null}
          </div>
          <div className='flex flex-col gap-2'>
            <Label htmlFor='message'>Message</Label>
            <Textarea
              id='message'
              rows={5}
              {...form.register('message')}
              aria-invalid={!!form.formState.errors.message}
            />
            {form.formState.errors.message ? (
              <p className='text-sm text-red-600'>
                {form.formState.errors.message.message}
              </p>
            ) : null}
          </div>
          <Button
            type='submit'
            disabled={isPending}
            className='self-start px-8'
          >
            {isPending ? 'Sending...' : 'Send Message'}
          </Button>
        </form>
      </div>
    </AnimatedSection>
  )
}
