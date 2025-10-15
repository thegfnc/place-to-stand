import { format } from 'date-fns'
import { UnifyPanel } from '@/src/components/unify/shared/panel'
import { LogTimeEntryForm } from '@/src/components/unify/time/log-time-entry-form'

interface ProjectSummary {
  id: string
  name: string
  clientName?: string | null
  purchasedHours: number
  loggedHours: number
}

interface RecentEntry {
  id: string
  taskLabel: string
  entryDate: string
  minutes: number
  personLabel: string
}

interface TimeTrackingPanelProps {
  totalLoggedHours: number
  projectSummaries: ProjectSummary[]
  tasks: Array<{ id: string; label: string }>
  recentEntries: RecentEntry[]
}

function formatHours(value: number) {
  return `${value.toFixed(1)} h`
}

export function TimeTrackingPanel({
  totalLoggedHours,
  projectSummaries,
  tasks,
  recentEntries,
}: TimeTrackingPanelProps) {
  const topProjects = [...projectSummaries]
    .sort((a, b) => b.loggedHours - a.loggedHours)
    .slice(0, 5)

  return (
    <UnifyPanel
      id='time'
      title='Time & budget burn-down'
      description='Capture time entries and keep an eye on remaining retainers.'
    >
      <div className='grid gap-6 lg:grid-cols-[2fr_3fr]'>
        <div className='space-y-6'>
          <div className='rounded-xl border border-slate-800 bg-slate-950/40 p-4 text-sm text-slate-200'>
            <p className='text-xs uppercase tracking-[0.3em] text-slate-500'>
              Total logged
            </p>
            <p className='mt-2 font-headline text-3xl text-white'>
              {formatHours(totalLoggedHours)}
            </p>
          </div>
          <LogTimeEntryForm tasks={tasks} />
        </div>
        <div className='space-y-6'>
          <div>
            <h3 className='text-xs uppercase tracking-[0.3em] text-slate-500'>
              Active retainers
            </h3>
            <ul className='mt-3 space-y-2 text-xs text-slate-300'>
              {topProjects.length > 0 ? (
                topProjects.map(project => {
                  const hoursRemaining = Math.max(
                    project.purchasedHours - project.loggedHours,
                    0
                  )
                  const burnPercent = project.purchasedHours
                    ? Math.min(
                        Math.round(
                          (project.loggedHours / project.purchasedHours) * 100
                        ),
                        100
                      )
                    : 0

                  return (
                    <li
                      key={project.id}
                      className='rounded-lg border border-slate-800 bg-slate-950/40 p-3'
                    >
                      <div className='flex items-center justify-between'>
                        <div>
                          <p className='font-semibold text-white'>
                            {project.name}
                          </p>
                          {project.clientName && (
                            <p className='text-[11px] uppercase tracking-[0.3em] text-slate-500'>
                              {project.clientName}
                            </p>
                          )}
                        </div>
                        <p className='text-xs text-slate-400'>
                          {formatHours(project.loggedHours)} /{' '}
                          {project.purchasedHours > 0
                            ? formatHours(project.purchasedHours)
                            : '∞'}
                        </p>
                      </div>
                      <div className='mt-2 h-2 rounded-full bg-slate-800'>
                        <div
                          className='h-2 rounded-full bg-emerald-500'
                          style={{ width: `${burnPercent}%` }}
                        />
                      </div>
                      <p className='mt-2 text-[11px] text-slate-500'>
                        {hoursRemaining > 0
                          ? `${formatHours(hoursRemaining)} remaining`
                          : 'Retainer exhausted'}
                      </p>
                    </li>
                  )
                })
              ) : (
                <li className='rounded-lg border border-dashed border-slate-800 bg-slate-950/40 p-4 text-center text-slate-500'>
                  No projects with tracked hours yet.
                </li>
              )}
            </ul>
          </div>
          <div>
            <h3 className='text-xs uppercase tracking-[0.3em] text-slate-500'>
              Recent entries
            </h3>
            <ul className='mt-3 space-y-2 text-xs text-slate-300'>
              {recentEntries.length > 0 ? (
                recentEntries.map(entry => (
                  <li
                    key={entry.id}
                    className='rounded-lg border border-slate-800 bg-slate-950/40 p-3'
                  >
                    <div className='flex items-center justify-between'>
                      <p className='font-medium text-white'>
                        {entry.taskLabel}
                      </p>
                      <span className='text-emerald-300'>
                        {formatHours(entry.minutes / 60)}
                      </span>
                    </div>
                    <div className='mt-1 flex items-center justify-between text-[11px] uppercase tracking-[0.3em] text-slate-500'>
                      <span>{entry.personLabel}</span>
                      <span>{format(new Date(entry.entryDate), 'MMM d')}</span>
                    </div>
                  </li>
                ))
              ) : (
                <li className='rounded-lg border border-dashed border-slate-800 bg-slate-950/40 p-4 text-center text-slate-500'>
                  No time entries recorded yet.
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </UnifyPanel>
  )
}
