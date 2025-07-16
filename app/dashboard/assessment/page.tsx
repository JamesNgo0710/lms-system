import { redirect } from 'next/navigation'

// Redirect to topics if someone tries to access /dashboard/assessment directly
export default function AssessmentIndexPage() {
  redirect('/dashboard/topics')
}