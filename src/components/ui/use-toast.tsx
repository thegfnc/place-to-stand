'use client'

import * as React from 'react'
import type { ToastProps } from '@radix-ui/react-toast'
import {
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  Toast,
  type ToastVariant,
} from './toast'

type ToastActionElement = React.ReactElement<typeof ToastAction>

const TOAST_LIMIT = 5
const TOAST_REMOVE_DELAY = 1000

const actionTypes = {
  ADD_TOAST: 'ADD_TOAST',
  UPDATE_TOAST: 'UPDATE_TOAST',
  DISMISS_TOAST: 'DISMISS_TOAST',
  REMOVE_TOAST: 'REMOVE_TOAST',
} as const

type ActionType = typeof actionTypes

type ToastActionType =
  | {
      type: ActionType['ADD_TOAST']
      toast: ToastData
    }
  | {
      type: ActionType['UPDATE_TOAST']
      toast: Partial<ToastData>
    }
  | {
      type: ActionType['DISMISS_TOAST']
      toastId?: ToastData['id']
    }
  | {
      type: ActionType['REMOVE_TOAST']
      toastId?: ToastData['id']
    }

type State = {
  toasts: ToastData[]
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    dispatch({
      type: actionTypes.REMOVE_TOAST,
      toastId,
    })
  }, TOAST_REMOVE_DELAY)

  toastTimeouts.set(toastId, timeout)
}

export type ToastData = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
  variant?: ToastVariant
}

const toastReducer = (state: State, action: ToastActionType): State => {
  switch (action.type) {
    case actionTypes.ADD_TOAST:
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case actionTypes.UPDATE_TOAST:
      return {
        ...state,
        toasts: state.toasts.map(toast =>
          toast.id === action.toast.id ? { ...toast, ...action.toast } : toast
        ),
      }

    case actionTypes.DISMISS_TOAST: {
      const { toastId } = action

      if (toastId) {
        addToRemoveQueue(toastId)
      } else {
        state.toasts.forEach(toast => {
          addToRemoveQueue(toast.id)
        })
      }

      return {
        ...state,
        toasts: state.toasts.map(toast =>
          toast.id === toastId || toastId === undefined
            ? {
                ...toast,
                open: false,
              }
            : toast
        ),
      }
    }

    case actionTypes.REMOVE_TOAST:
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        }
      }
      return {
        ...state,
        toasts: state.toasts.filter(toast => toast.id !== action.toastId),
      }
  }
}

const listeners: Array<React.Dispatch<React.SetStateAction<State>>> = []

let memoryState: State = { toasts: [] }

function dispatch(action: ToastActionType) {
  memoryState = toastReducer(memoryState, action)
  listeners.forEach(listener => {
    listener(memoryState)
  })
}

export function toast({ ...props }: Omit<ToastData, 'id'>) {
  const id = crypto.randomUUID()

  const update = (props: Partial<ToastData>) =>
    dispatch({
      type: actionTypes.UPDATE_TOAST,
      toast: { ...props, id },
    })
  const dismiss = () =>
    dispatch({ type: actionTypes.DISMISS_TOAST, toastId: id })

  dispatch({
    type: actionTypes.ADD_TOAST,
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: open => {
        if (!open) dismiss()
      },
    },
  })

  return {
    id,
    dismiss,
    update,
  }
}

export function useToast() {
  const [toastState, setToastState] = React.useState<State>(memoryState)

  React.useEffect(() => {
    listeners.push(setToastState)
    return () => {
      const index = listeners.indexOf(setToastState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [])

  return {
    ...toastState,
    toast,
    dismiss: (toastId?: string) =>
      dispatch({
        type: actionTypes.DISMISS_TOAST,
        toastId,
      }),
  }
}

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(({ id, title, description, action, ...props }) => (
        <Toast key={id} {...props}>
          <div className='flex w-full flex-col gap-1'>
            {title ? <ToastTitle>{title}</ToastTitle> : null}
            {description ? (
              <ToastDescription>{description}</ToastDescription>
            ) : null}
          </div>
          {action}
          <ToastClose />
        </Toast>
      ))}
      <ToastViewport />
    </ToastProvider>
  )
}
