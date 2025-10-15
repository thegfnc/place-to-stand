import type { Route } from 'next'
import { redirect } from 'next/navigation'

export default function UnifyHomePage() {
  redirect('/unify/clients' as Route)
}
