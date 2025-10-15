export const TASK_STATUSES = [
  { id: 'backlog', label: 'Backlog' },
  { id: 'on_deck', label: 'On Deck' },
  { id: 'in_progress', label: 'In Progress' },
  { id: 'blocked', label: 'Blocked' },
  { id: 'awaiting_review', label: 'Awaiting Review' },
  { id: 'done', label: 'Done' },
] as const

export type TaskStatusId = (typeof TASK_STATUSES)[number]['id']

export function getStatusLabel(id: string) {
  return TASK_STATUSES.find(status => status.id === id)?.label ?? id
}

export const CLIENT_STATUSES = [
  { id: 'active', label: 'Active' },
  { id: 'paused', label: 'Paused' },
  { id: 'inactive', label: 'Inactive' },
] as const

export type ClientStatusId = (typeof CLIENT_STATUSES)[number]['id']

export const PROJECT_STATUSES = [
  { id: 'active', label: 'Active' },
  { id: 'on_hold', label: 'On Hold' },
  { id: 'completed', label: 'Completed' },
  { id: 'archived', label: 'Archived' },
] as const

export type ProjectStatusId = (typeof PROJECT_STATUSES)[number]['id']
