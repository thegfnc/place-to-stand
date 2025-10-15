import { UnifyPanel } from '@/src/components/unify/shared/panel'
import { CreateTaskForm } from '@/src/components/unify/tasks/create-task-form'
import { TaskBoardClient } from '@/src/components/unify/tasks/task-board-client'
import type { TaskStatusId } from '@/src/lib/unify/constants'

interface KanbanTask {
  id: string
  title: string
  description?: string | null
  status: TaskStatusId
  assigneeId?: string | null
  assigneeLabel?: string | null
  reviewerId?: string | null
  reviewerLabel?: string | null
  dueDate?: string | null
  startDate?: string | null
  projectId: string
  projectLabel: string
  clientLabel?: string | null
  loggedMinutes: number
  position: number
}

interface UnifyKanbanBoardProps {
  tasks: KanbanTask[]
  team: Array<{ id: string; label: string }>
  projects: Array<{ id: string; name: string; clientName?: string | null }>
}

export function UnifyKanbanBoard({
  tasks,
  team,
  projects,
}: UnifyKanbanBoardProps) {
  return (
    <UnifyPanel
      id='board'
      title='Work in motion'
      description='Drag tasks across columns, assign teammates, and keep delivery on track.'
      actions={
        <span className='text-xs uppercase tracking-[0.3em] text-slate-500'>
          Phase 1 Internal Beta
        </span>
      }
    >
      <CreateTaskForm projects={projects} team={team} />
      <TaskBoardClient tasks={tasks} team={team} projects={projects} />
    </UnifyPanel>
  )
}
