import React, { createContext, useContext, useState, useCallback } from 'react'

interface TransitionState {
  isTransitioning: boolean
  transitionType: 'email' | 'linkedin' | null
  sourceImage: string | null
  targetBackground: string | null
}

interface TransitionContextType {
  transitionState: TransitionState
  startTransition: (type: 'email' | 'linkedin') => void
  completeTransition: () => void
}

const TransitionContext = createContext<TransitionContextType | null>(null)

export const useTransition = () => {
  const context = useContext(TransitionContext)
  if (!context) {
    throw new Error('useTransition must be used within TransitionProvider')
  }
  return context
}

interface TransitionProviderProps {
  children: React.ReactNode
}

export const TransitionProvider: React.FC<TransitionProviderProps> = ({ children }) => {
  const [transitionState, setTransitionState] = useState<TransitionState>({
    isTransitioning: false,
    transitionType: null,
    sourceImage: null,
    targetBackground: null
  })

  const startTransition = useCallback((type: 'email' | 'linkedin') => {
    const sourceImage = type === 'email' ? '/sunset_email.png' : '/blue_linkedin.png'
    const targetBackground = type === 'email' 
      ? 'linear-gradient(135deg, #f87171, #fb923c, #f97316)'
      : 'linear-gradient(135deg, #1e40af, #3b82f6, #60a5fa)'

    setTransitionState({
      isTransitioning: true,
      transitionType: type,
      sourceImage,
      targetBackground
    })
  }, [])

  const completeTransition = useCallback(() => {
    // Don't immediately clear - let the target page fade in first
    setTimeout(() => {
      setTransitionState({
        isTransitioning: false,
        transitionType: null,
        sourceImage: null,
        targetBackground: null
      })
    }, 800) // Allow time for target page to fully load
  }, [])

  return (
    <TransitionContext.Provider value={{
      transitionState,
      startTransition,
      completeTransition
    }}>
      {children}
      
      {/* No overlay needed - clean elegant transition */}
    </TransitionContext.Provider>
  )
}
