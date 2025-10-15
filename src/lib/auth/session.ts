'use server'

import type { Route } from 'next'
import { redirect } from 'next/navigation'
import type { User } from '@supabase/supabase-js'
import {
  createSupabaseServerClient,
  createSupabaseServiceRoleClient,
} from '@/src/lib/supabase/clients'
import type { ProfilesRow, UserRole } from '@/src/lib/supabase/types'

async function getVerifiedUser(): Promise<User | null> {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error) {
    console.error('Failed to load Supabase user', error)
    return null
  }

  return user
}

export async function getCurrentUser(): Promise<User | null> {
  return getVerifiedUser()
}

export async function requireUser(): Promise<User> {
  const user = await getVerifiedUser()
  if (!user) {
    redirect('/unify/login' as Route)
  }
  return user
}

export async function getCurrentProfile(): Promise<ProfilesRow | null> {
  const user = await getVerifiedUser()
  if (!user) {
    return null
  }

  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle()

  if (error) {
    console.error('Failed to load profile', error)
    return null
  }

  return data
}

export async function requireProfile(allowedRoles?: UserRole[]) {
  const user = await requireUser()
  const supabase = await createSupabaseServerClient()
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle()

  if (error) {
    console.error('Failed to load profile', error)
    redirect('/unify/login?reason=profile-missing' as Route)
  }

  if (!profile) {
    redirect('/unify/login?reason=profile-missing' as Route)
  }

  if (allowedRoles && !allowedRoles.includes(profile.role)) {
    redirect('/unify/unauthorized' as Route)
  }

  return profile
}

export async function createUserWithRole(params: {
  email: string
  password: string
  fullName?: string
  role: UserRole
}) {
  const adminClient = createSupabaseServiceRoleClient()

  const { data, error } = await adminClient.auth.admin.createUser({
    email: params.email,
    password: params.password,
    email_confirm: true,
    app_metadata: {
      role: params.role,
    },
    user_metadata: {
      full_name: params.fullName,
    },
  })

  if (error) {
    throw error
  }

  return data.user
}
