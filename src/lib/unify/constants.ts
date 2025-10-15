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
