import { Suspense } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { getModuleById } from '../data/modules.js'

export default function ModulePage() {
  const { moduleId } = useParams()
  const module = getModuleById(moduleId)

  if (!module) return <Navigate to="/" replace />

  const { Component } = module

  return (
    <Suspense fallback={<div className="mx-auto max-w-4xl px-4 py-16 text-center text-stone-400">Loading…</div>}>
      <Component module={module} />
    </Suspense>
  )
}
