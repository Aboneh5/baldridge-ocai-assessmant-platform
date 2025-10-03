'use client'

import Link from 'next/link'
import { Plus } from 'lucide-react'

interface CreateSurveyButtonProps {
  userRole: string
}

export function CreateSurveyButton({ userRole }: CreateSurveyButtonProps) {
  const canCreate = ['ORG_ADMIN', 'FACILITATOR'].includes(userRole)

  if (!canCreate) {
    return null
  }

  return (
    <Link
      href="/surveys/new"
      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
    >
      <Plus className="h-4 w-4 mr-2" />
      Create Survey
    </Link>
  )
}
