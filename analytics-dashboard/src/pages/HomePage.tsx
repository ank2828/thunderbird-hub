import { useNavigate } from 'react-router-dom'
import { useState, useEffect, useCallback, useMemo } from 'react'
import FlowingLines from '../components/FlowingLines'
import { useTransition } from '../contexts/TransitionContext'

function HomePage() {
  const navigate = useNavigate()
  const { startTransition } = useTransition()
  const [activeButton, setActiveButton] = useState<'email' | 'linkedin' | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [screenDimensions, setScreenDimensions] = useState({ width: 1920, height: 1080 })
  const [isLoaded, setIsLoaded] = useState(false)

  // Memoize scale calculation for better performance - reduced for image quality
  const scaleMultiplier = useMemo(() => 
    Math.max(screenDimensions.width / 1200, screenDimensions.height / 800) * 1.6,
    [screenDimensions]
  )

  // Optimize resize handling with debouncing
  const handleResize = useCallback(() => {
    setScreenDimensions({ width: window.innerWidth, height: window.innerHeight })
  }, [])

  useEffect(() => {
    setScreenDimensions({ width: window.innerWidth, height: window.innerHeight })
    setIsLoaded(true)
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [handleResize])

  const handleNavigation = (destination: 'email' | 'linkedin') => {
    if (isAnimating) return
    
    // Apple-style: Single coordinated motion sequence
    setIsAnimating(true)
    setActiveButton(destination)
    
    // Phase 1: Immediate visual feedback (0ms)
    requestAnimationFrame(() => {
      // Phase 2: Start transition overlay after button begins scaling (100ms)
      setTimeout(() => {
        startTransition(destination)
      }, 100)
      
      // Phase 3: Navigate at perfect handoff moment (400ms)
      setTimeout(() => {
        const routePath = destination === 'email' ? '/email-dashboard' : '/linkedin-dashboard'
        navigate(routePath)
      }, 400)
    })
  }

  return (
    <div 
      className="min-h-screen bg-black relative overflow-hidden smooth-animation"
      style={{
        opacity: isLoaded ? 1 : 0,
        transition: 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
      }}
    >
      {/* Animated flowing lines behind everything - full screen */}
      <FlowingLines />
      
      <main className="min-h-screen flex flex-col px-8 py-12 relative z-10 gpu-accelerated">
        {/* Hero Text */}
        <div 
          className="text-center mb-8 relative gpu-accelerated" 
          style={{ 
            paddingTop: '120px',
            opacity: isAnimating ? 0 : (isLoaded ? 1 : 0),
            transform: isLoaded ? 'translateY(0)' : 'translateY(20px)',
            transition: isAnimating 
              ? 'opacity 200ms cubic-bezier(0.4, 0, 1, 1)' // Fast fade during transition
              : 'opacity 800ms cubic-bezier(0.4, 0, 0.2, 1), transform 800ms cubic-bezier(0.4, 0, 0.2, 1)', // Normal load
            height: '400px'
          }}
        >
          
          {/* Hero text content */}
          <div className="relative" style={{ zIndex: 20 }}>
            <div style={{ 
              fontSize: '72px',
              fontFamily: 'Inter, system-ui, sans-serif',
              fontWeight: '900',
              color: '#ffffff',
              lineHeight: '0.95',
              letterSpacing: '-0.02em',
              marginBottom: '10px'
            }}>
              THUNDERBIRD LABS
            </div>
            <div style={{ 
              fontSize: '84px',
              fontFamily: 'Inter, system-ui, sans-serif',
              fontWeight: '900',
              color: '#ffffff',
              lineHeight: '0.9',
              letterSpacing: '-0.03em',
              marginBottom: '30px'
            }}>
              PROSPECTING HUB
            </div>
            <div style={{ 
              fontSize: '28px',
              fontFamily: 'Montserrat, system-ui, sans-serif',
              fontWeight: '400',
              fontStyle: 'italic',
              color: '#ffffff',
              opacity: '0.8',
              letterSpacing: '0.01em'
            }}>
              Scale your prospecting. Track your success.
            </div>
          </div>
        </div>
        
        {/* Module Boxes Container */}
        <div className="flex-1 flex justify-center items-center">
          <div className="flex flex-row justify-center items-center">
            {/* Module Box 1 - Sunset Email */}
            <button 
              onClick={() => handleNavigation('email')}
              className="cursor-pointer gpu-accelerated smooth-animation"
              disabled={isAnimating}
              style={{ 
                width: '600px', 
                height: '400px',
                border: 'none',
                background: 'none',
                outline: 'none',
                backgroundImage: 'url(/sunset_email.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                borderRadius: activeButton === 'email' ? '0' : '3rem',
                marginRight: '30px',
                opacity: activeButton === 'linkedin' ? 0 : (isLoaded ? 1 : 0),
                transform: activeButton === 'email' 
                  ? `scale(${scaleMultiplier}) translateZ(0)` 
                  : isLoaded ? 'scale(1) translateZ(0)' : 'scale(0.98) translateZ(0)',
                transformOrigin: 'center center',
                transition: isAnimating 
                  ? 'transform 600ms cubic-bezier(0.2, 0, 0, 1), opacity 300ms cubic-bezier(0.4, 0, 1, 1), border-radius 600ms cubic-bezier(0.2, 0, 0, 1)' // Apple-style decisive
                  : 'transform 800ms cubic-bezier(0.4, 0, 0.2, 1), opacity 800ms cubic-bezier(0.4, 0, 0.2, 1), border-radius 800ms cubic-bezier(0.4, 0, 0.2, 1)', // Normal
                zIndex: activeButton === 'email' ? 50 : 1,
                position: 'relative',
                willChange: 'transform, opacity, border-radius'
              }}
              aria-label="Email Module"
            />
            
            {/* Module Box 2 - Blue LinkedIn */}
            <button 
              onClick={() => handleNavigation('linkedin')}
              className="cursor-pointer gpu-accelerated smooth-animation"
              disabled={isAnimating}
              style={{ 
                width: '600px', 
                height: '400px',
                border: 'none',
                background: 'none',
                outline: 'none',
                backgroundImage: 'url(/blue_linkedin.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                borderRadius: activeButton === 'linkedin' ? '0' : '3rem',
                marginLeft: '30px',
                opacity: activeButton === 'email' ? 0 : (isLoaded ? 1 : 0),
                transform: activeButton === 'linkedin' 
                  ? `scale(${scaleMultiplier}) translateZ(0)` 
                  : isLoaded ? 'scale(1) translateZ(0)' : 'scale(0.98) translateZ(0)',
                transformOrigin: 'center center',
                transition: isAnimating 
                  ? 'transform 600ms cubic-bezier(0.2, 0, 0, 1), opacity 300ms cubic-bezier(0.4, 0, 1, 1), border-radius 600ms cubic-bezier(0.2, 0, 0, 1)' // Apple-style decisive
                  : 'transform 800ms cubic-bezier(0.4, 0, 0.2, 1), opacity 800ms cubic-bezier(0.4, 0, 0.2, 1), border-radius 800ms cubic-bezier(0.4, 0, 0.2, 1)', // Normal
                zIndex: activeButton === 'linkedin' ? 50 : 1,
                position: 'relative',
                willChange: 'transform, opacity, border-radius'
              }}
              aria-label="LinkedIn Module"
            />
          </div>
        </div>
      </main>
    </div>
  )
}

export default HomePage