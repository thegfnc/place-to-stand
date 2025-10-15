export type UserRole = 'admin' | 'worker' | 'client'

export type TaskStatus =
  | 'backlog'
  | 'on_deck'
  | 'in_progress'
  | 'blocked'
  | 'awaiting_review'
  | 'done'

type TimestampString = string

type Nullable<T> = T | null

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: Nullable<string>
          role: UserRole
          avatar_url: Nullable<string>
          created_at: TimestampString
          updated_at: TimestampString
        }
        Insert: {
          id: string
          email: string
          full_name?: Nullable<string>
          role?: UserRole
          avatar_url?: Nullable<string>
          created_at?: TimestampString
          updated_at?: TimestampString
        }
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>
        Relationships: []
      }
      clients: {
        Row: {
          id: string
          name: string
          status: string
          notes: Nullable<string>
          created_by: Nullable<string>
          created_at: TimestampString
          updated_at: TimestampString
        }
        Insert: {
          id?: string
          name: string
          status?: string
          notes?: Nullable<string>
          created_by?: Nullable<string>
          created_at?: TimestampString
          updated_at?: TimestampString
        }
        Update: Partial<Database['public']['Tables']['clients']['Insert']>
        Relationships: [
          {
            foreignKeyName: 'clients_created_by_fkey'
            columns: ['created_by']
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      projects: {
        Row: {
          id: string
          client_id: string
          name: string
          code: Nullable<string>
          summary: Nullable<string>
          status: string
          budget_hours: Nullable<number>
          created_by: Nullable<string>
          created_at: TimestampString
          updated_at: TimestampString
        }
        Insert: {
          id?: string
          client_id: string
          name: string
          code?: Nullable<string>
          summary?: Nullable<string>
          status?: string
          budget_hours?: Nullable<number>
          created_by?: Nullable<string>
          created_at?: TimestampString
          updated_at?: TimestampString
        }
        Update: Partial<Database['public']['Tables']['projects']['Insert']>
        Relationships: [
          {
            foreignKeyName: 'projects_client_id_fkey'
            columns: ['client_id']
            referencedRelation: 'clients'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'projects_created_by_fkey'
            columns: ['created_by']
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      project_hour_blocks: {
        Row: {
          id: string
          project_id: string
          purchased_hours: number
          effective_date: string
          note: Nullable<string>
          recorded_by: Nullable<string>
          created_at: TimestampString
        }
        Insert: {
          id?: string
          project_id: string
          purchased_hours: number
          effective_date?: string
          note?: Nullable<string>
          recorded_by?: Nullable<string>
          created_at?: TimestampString
        }
        Update: Partial<
          Database['public']['Tables']['project_hour_blocks']['Insert']
        >
        Relationships: [
          {
            foreignKeyName: 'project_hour_blocks_project_id_fkey'
            columns: ['project_id']
            referencedRelation: 'projects'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'project_hour_blocks_recorded_by_fkey'
            columns: ['recorded_by']
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      tasks: {
        Row: {
          id: string
          project_id: string
          title: string
          description: Nullable<string>
          status: TaskStatus
          assignee_id: Nullable<string>
          reviewer_id: Nullable<string>
          due_date: Nullable<string>
          start_date: Nullable<string>
          position: number
          created_by: Nullable<string>
          created_at: TimestampString
          updated_at: TimestampString
        }
        Insert: {
          id?: string
          project_id: string
          title: string
          description?: Nullable<string>
          status?: TaskStatus
          assignee_id?: Nullable<string>
          reviewer_id?: Nullable<string>
          due_date?: Nullable<string>
          start_date?: Nullable<string>
          position?: number
          created_by?: Nullable<string>
          created_at?: TimestampString
          updated_at?: TimestampString
        }
        Update: Partial<Database['public']['Tables']['tasks']['Insert']>
        Relationships: [
          {
            foreignKeyName: 'tasks_project_id_fkey'
            columns: ['project_id']
            referencedRelation: 'projects'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'tasks_assignee_id_fkey'
            columns: ['assignee_id']
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'tasks_reviewer_id_fkey'
            columns: ['reviewer_id']
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      time_entries: {
        Row: {
          id: string
          task_id: string
          person_id: string
          minutes: number
          entry_date: string
          notes: Nullable<string>
          created_at: TimestampString
        }
        Insert: {
          id?: string
          task_id: string
          person_id: string
          minutes: number
          entry_date?: string
          notes?: Nullable<string>
          created_at?: TimestampString
        }
        Update: Partial<Database['public']['Tables']['time_entries']['Insert']>
        Relationships: [
          {
            foreignKeyName: 'time_entries_task_id_fkey'
            columns: ['task_id']
            referencedRelation: 'tasks'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'time_entries_person_id_fkey'
            columns: ['person_id']
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      task_status_history: {
        Row: {
          id: string
          task_id: string
          previous_status: Nullable<TaskStatus>
          new_status: TaskStatus
          changed_by: Nullable<string>
          changed_at: TimestampString
        }
        Insert: {
          id?: string
          task_id: string
          previous_status?: Nullable<TaskStatus>
          new_status: TaskStatus
          changed_by?: Nullable<string>
          changed_at?: TimestampString
        }
        Update: Partial<
          Database['public']['Tables']['task_status_history']['Insert']
        >
        Relationships: [
          {
            foreignKeyName: 'task_status_history_task_id_fkey'
            columns: ['task_id']
            referencedRelation: 'tasks'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'task_status_history_changed_by_fkey'
            columns: ['changed_by']
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
    }
    Views: Record<string, never>
    Functions: {
      current_user_has_role: {
        Args: { allowed_roles: UserRole[] }
        Returns: boolean
      }
    }
    Enums: {
      user_role: UserRole
      task_status: TaskStatus
    }
  }
}

export type Tables = Database['public']['Tables']

export type ProfilesRow = Tables['profiles']['Row']
export type ClientsRow = Tables['clients']['Row']
export type ProjectsRow = Tables['projects']['Row']
export type ProjectHourBlockRow = Tables['project_hour_blocks']['Row']
export type TaskRow = Tables['tasks']['Row']
export type TimeEntryRow = Tables['time_entries']['Row']
export type TaskStatusHistoryRow = Tables['task_status_history']['Row']
