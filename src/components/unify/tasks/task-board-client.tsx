'use client'

import { useEffect, useMemo, useState, useTransition } from 'react'
import {
  DndContext,
  type DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { TASK_STATUSES, type TaskStatusId } from '@/src/lib/unify/constants'
import { moveTask } from '@/app/(unify)/unify/actions/move-task'
import type { MoveTaskInput } from '@/app/(unify)/unify/actions/move-task'
import { TaskEditForm } from '@/src/components/unify/tasks/task-edit-form'
import { cn } from '@/src/lib/utils'

interface TaskBoardTask {
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

interface TaskBoardClientProps {
  tasks: TaskBoardTask[]
  team: Array<{ id: string; label: string }>
  projects: Array<{ id: string; name: string; clientName?: string | null }>
}

function groupTasks(tasks: TaskBoardTask[]) {
  return TASK_STATUSES.reduce<Record<TaskStatusId, TaskBoardTask[]>>(
    (acc, status) => {
      acc[status.id] = tasks
        .filter(task => task.status === status.id)
        .sort((a, b) => b.position - a.position)
      return acc
    },
    {} as Record<TaskStatusId, TaskBoardTask[]>
  )
}

function findColumnId(
  columns: Record<TaskStatusId, TaskBoardTask[]>,
  taskId: string
) {
  return (TASK_STATUSES.find(status =>
    columns[status.id as TaskStatusId]?.some(task => task.id === taskId)
  )?.id ?? null) as TaskStatusId | null
}

const sensorsConfig = { activationConstraint: { distance: 8 } }

function SortableTaskCard({
  task,
  onEdit,
}: {
  task: TaskBoardTask
  onEdit: (task: TaskBoardTask) => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const hoursLogged = task.loggedMinutes / 60

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        'cursor-grab rounded-xl border border-slate-800 bg-slate-900/70 p-4 text-sm shadow-md shadow-slate-950/20 transition hover:border-slate-700 active:cursor-grabbing',
        isDragging && 'border-emerald-400/60 bg-emerald-500/10'
      )}
    >
      <div className='flex items-start justify-between gap-2'>
        <div>
          <h3 className='font-semibold text-white'>{task.title}</h3>
          <p className='text-xs text-slate-400'>{task.projectLabel}</p>
        </div>
        <button
          type='button'
          onClick={() => onEdit(task)}
          className='text-xs uppercase tracking-[0.3em] text-slate-400 hover:text-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400'
        >
          Edit
        </button>
      </div>
      <div className='mt-3 flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.2em] text-slate-500'>
        {task.assigneeLabel && <span>Assignee · {task.assigneeLabel}</span>}
        {task.reviewerLabel && <span>Reviewer · {task.reviewerLabel}</span>}
        {hoursLogged > 0 && (
          <span className='text-emerald-300'>
            {hoursLogged.toFixed(1)} h logged
          </span>
        )}
        {task.dueDate && (
          <span className='text-slate-200'>Due {task.dueDate}</span>
        )}
      </div>
      {task.description && (
        <p className='mt-3 text-xs text-slate-300'>{task.description}</p>
      )}
    </div>
  )
}

export function TaskBoardClient({
  tasks,
  team,
  projects,
}: TaskBoardClientProps) {
  const sensors = useSensors(useSensor(PointerSensor, sensorsConfig))
  const [columns, setColumns] = useState<Record<TaskStatusId, TaskBoardTask[]>>(
    () => groupTasks(tasks)
  )
  const [selectedTask, setSelectedTask] = useState<TaskBoardTask | null>(null)
  const [moveError, setMoveError] = useState<string | null>(null)
  const [, startTransition] = useTransition()

  useEffect(() => {
    setColumns(groupTasks(tasks))
  }, [tasks])

  const columnTotals = useMemo(() => {
    return TASK_STATUSES.map(status => ({
      id: status.id,
      count: columns[status.id]?.length ?? 0,
    }))
  }, [columns])

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over) {
      return
    }

    const activeId = active.id as string
    const overId = over.id as string

    const sourceColumnId = findColumnId(columns, activeId)
    if (!sourceColumnId) {
      return
    }

    let destinationColumnId: TaskStatusId | null = null

    if (TASK_STATUSES.some(status => status.id === overId)) {
      destinationColumnId = overId as TaskStatusId
    } else {
      destinationColumnId = findColumnId(columns, overId)
    }

    if (!destinationColumnId) {
      return
    }

    if (sourceColumnId === destinationColumnId && activeId === overId) {
      return
    }

    setColumns(prev => {
      const next = Object.fromEntries(
        Object.entries(prev).map(([key, value]) => [key, [...value]])
      ) as Record<TaskStatusId, TaskBoardTask[]>
      const sourceTasks = next[sourceColumnId]
      const destinationTasks =
        sourceColumnId === destinationColumnId
          ? sourceTasks
          : next[destinationColumnId]

      const fromIndex = sourceTasks.findIndex(task => task.id === activeId)
      if (fromIndex === -1) {
        return prev
      }

      const [movedTask] = sourceTasks.splice(fromIndex, 1)
      const overIndex = destinationTasks.findIndex(task => task.id === overId)
      const insertIndex = overIndex === -1 ? destinationTasks.length : overIndex

      const updatedTask = {
        ...movedTask,
        status: destinationColumnId,
        position: Date.now(),
      }

      destinationTasks.splice(insertIndex, 0, updatedTask)

      next[sourceColumnId] =
        sourceColumnId === destinationColumnId ? destinationTasks : sourceTasks
      next[destinationColumnId] = destinationTasks

      return next
    })

    setMoveError(null)

    startTransition(async () => {
      const payload: MoveTaskInput = {
        taskId: activeId,
        status: destinationColumnId,
        position: Date.now(),
      }

      try {
        await moveTask(payload)
      } catch (error) {
        console.error('Failed to persist task move', error)
        setMoveError('Unable to save the new order. Refresh to resync.')
      }
    })
  }

  return (
    <div className='space-y-4'>
      {moveError && (
        <p className='rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-200'>
          {moveError}
        </p>
      )}
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-3'>
          {TASK_STATUSES.map(status => {
            const items = columns[status.id]
            return (
              <div
                key={status.id}
                className='flex h-full flex-col rounded-2xl border border-slate-800 bg-slate-950/40 p-4 backdrop-blur'
              >
                <div className='mb-3 flex items-center justify-between text-xs uppercase tracking-[0.3em] text-slate-400'>
                  <span>{status.label}</span>
                  <span className='text-slate-500'>
                    {columnTotals.find(item => item.id === status.id)?.count ??
                      0}
                  </span>
                </div>
                <div className='flex-1 space-y-3'>
                  <SortableContext
                    items={items?.map(task => task.id) ?? []}
                    strategy={verticalListSortingStrategy}
                  >
                    {items?.length ? (
                      items.map(task => (
                        <SortableTaskCard
                          key={task.id}
                          task={task}
                          onEdit={setSelectedTask}
                        />
                      ))
                    ) : (
                      <p className='rounded-lg border border-dashed border-slate-800 bg-slate-950/50 px-4 py-6 text-center text-xs text-slate-500'>
                        Drag tasks here
                      </p>
                    )}
                  </SortableContext>
                </div>
              </div>
            )
          })}
        </div>
      </DndContext>

      {selectedTask && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-6 backdrop-blur'>
          <div className='relative w-full max-w-3xl rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-2xl shadow-slate-950/40'>
            <button
              type='button'
              onClick={() => setSelectedTask(null)}
              className='absolute right-5 top-4 text-xs uppercase tracking-[0.3em] text-slate-400 hover:text-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400'
            >
              Close
            </button>
            <h2 className='mb-4 font-headline text-2xl text-white'>
              Edit task
            </h2>
            <TaskEditForm
              task={{
                id: selectedTask.id,
                title: selectedTask.title,
                description: selectedTask.description,
                status: selectedTask.status,
                assigneeId: selectedTask.assigneeId,
                reviewerId: selectedTask.reviewerId,
                dueDate: selectedTask.dueDate,
                startDate: selectedTask.startDate,
                projectId: selectedTask.projectId,
              }}
              projects={projects}
              team={team}
              onClose={() => setSelectedTask(null)}
            />
          </div>
        </div>
      )}
    </div>
  )
}
