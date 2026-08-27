'use client'

import { createContext, useCallback, useContext, useState } from 'react'
import PageLoader from './PageLoader'

const LoaderContext = createContext(null)

/** True once the curtain has lifted; gates entrance reveals below it (the hero). */
export function useLoader() {
  const context = useContext(LoaderContext)
  if (!context) throw new Error('useLoader must be used inside <LoaderProvider>')
  return context
}

export default function LoaderProvider({ children }) {
  const [ready, setReady] = useState(false)
  const handleReady = useCallback(() => setReady(true), [])

  return (
    <LoaderContext.Provider value={{ ready }}>
      {children}
      <PageLoader onComplete={handleReady} />
    </LoaderContext.Provider>
  )
}
