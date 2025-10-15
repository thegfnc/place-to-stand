import { requireProfile } from '@/src/lib/auth/session'
import { createSupabaseServerClient } from '@/src/lib/supabase/clients'
import { UnifyPanel } from '@/src/components/unify/shared/panel'
import { TeamTable } from '@/src/components/unify/settings/team-table'
import { TeamAddButton } from '@/src/components/unify/settings/team-table'
import type { ProfilesRow } from '@/src/lib/supabase/types'

export default async function SettingsTeamPage() {
  const currentProfile = await requireProfile(['admin'])
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, email, role')
    .order('full_name', { ascending: true })

  if (error) {
    throw new Error(error.message)
  }

  const members = (data ?? []) as Array<
    Pick<ProfilesRow, 'id' | 'full_name' | 'email' | 'role'>
  >

  const sortedMembers = [...members].sort((a, b) => {
    const aName = a.full_name?.toLowerCase() ?? a.email.toLowerCase()
    const bName = b.full_name?.toLowerCase() ?? b.email.toLowerCase()
    return aName.localeCompare(bName)
  })

  const tableMembers = sortedMembers.map(member => ({
    id: member.id,
    fullName: member.full_name,
    email: member.email,
    role: member.role,
  }))

  return (
    <div className='space-y-8'>
      <UnifyPanel
        title='Invite a teammate'
        description='Provision access for internal staff, contractors, or clients.'
        actions={<TeamAddButton />}
      >
        <p className='text-sm text-slate-400'>
          Use the invite teammate dialog to send a new account invite with a
          temporary password.
        </p>
      </UnifyPanel>

      <UnifyPanel
        title='Team access'
        description='Adjust roles, update contact details, or remove access.'
      >
        <TeamTable
          members={tableMembers}
          currentProfileId={currentProfile.id}
        />
      </UnifyPanel>
    </div>
  )
}
