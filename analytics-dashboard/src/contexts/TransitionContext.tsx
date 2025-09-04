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
      
      {/* Global Transition Overlay */}
      {transitionState.isTransitioning && (
        <>
          <div
            className="fixed inset-0 z-[9999] pointer-events-none gpu-accelerated"
            style={{
              backgroundImage: `url(${transitionState.sourceImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              animation: 'seamlessTransition 2000ms cubic-bezier(0.23, 1, 0.32, 1) forwards',
              willChange: 'transform, opacity'
            }}
          />
          <style>
            {`
              @keyframes seamlessTransition {
                0% {
                  transform: scale(1) translateZ(0);
                  opacity: 1;
                }
                45% {
                  transform: scale(2.2) translateZ(0);
                  opacity: 1;
                }
                75% {
                  transform: scale(2.8) translateZ(0);
                  opacity: 1;
                }
                90% {
                  transform: scale(3.2) translateZ(0);
                  opacity: 0.9;
                }
                100% {
                  transform: scale(3.5) translateZ(0);
                  opacity: 0;
                }
              }
            `}
          </style>
        </>
      )}
    </TransitionContext.Provider>
  )
}
