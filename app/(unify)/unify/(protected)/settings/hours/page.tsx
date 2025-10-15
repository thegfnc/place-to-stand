import { createSupabaseServerClient } from '@/src/lib/supabase/clients'
import { UnifyPanel } from '@/src/components/unify/shared/panel'
import { AddHourBlockForm } from '@/src/components/unify/admin/forms/add-hour-block-form'
import { HourBlocksTable } from '@/src/components/unify/settings/hour-blocks-table'
import type { ProjectsRow, ProjectHourBlockRow } from '@/src/lib/supabase/types'

export default async function SettingsHoursPage() {
  const supabase = await createSupabaseServerClient()

  const [projectsResponse, hourBlocksResponse] = await Promise.all([
    supabase.from('projects').select('id, name').order('name'),
    supabase
      .from('project_hour_blocks')
      .select(
        `
          id,
          project_id,
          purchased_hours,
          effective_date,
          note,
          project:projects ( id, name, client_id, client:clients ( id, name ) )
        `
      )
      .order('effective_date', { ascending: false }),
  ])

  if (projectsResponse.error) {
    throw new Error(projectsResponse.error.message)
  }

  if (hourBlocksResponse.error) {
    throw new Error(hourBlocksResponse.error.message)
  }

  const projects = (projectsResponse.data ?? []) as Array<
    Pick<ProjectsRow, 'id' | 'name'>
  >

  const hourBlocks = (hourBlocksResponse.data ?? []) as Array<
    Pick<
      ProjectHourBlockRow,
      'id' | 'project_id' | 'purchased_hours' | 'effective_date' | 'note'
    > & {
      project?: {
        id: string
        name: string
        client_id: string
        client?: { id: string; name: string } | null
      } | null
    }
  >

  const tableData = hourBlocks
    .map(block => {
      const projectId = block.project?.id ?? block.project_id
      const clientId = block.project?.client_id

      if (!projectId || !clientId) {
        return null
      }

      const purchasedHours =
        typeof block.purchased_hours === 'number'
          ? block.purchased_hours
          : Number(block.purchased_hours ?? 0)

      return {
        id: block.id,
        projectId,
        clientId,
        projectName: block.project?.name ?? 'Unknown project',
        clientName: block.project?.client?.name ?? null,
        purchasedHours,
        effectiveDate: block.effective_date,
        note: block.note,
      }
    })
    .filter((block): block is NonNullable<typeof block> => Boolean(block))

  return (
    <div className='space-y-8'>
      <UnifyPanel
        title='Record purchased hours'
        description='Log retainers or budget adjustments against a project.'
      >
        <AddHourBlockForm projects={projects} />
      </UnifyPanel>

      <UnifyPanel
        title='Hour blocks ledger'
        description='Adjust or retire hour blocks as retainers evolve.'
      >
        <HourBlocksTable hourBlocks={tableData} />
      </UnifyPanel>
    </div>
  )
}
