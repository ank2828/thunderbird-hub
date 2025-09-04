import { useNavigate } from 'react-router-dom'
import { useState, useEffect, useCallback, useMemo } from 'react'
import FlowingLines from '../components/FlowingLines'

function HomePage() {
  const navigate = useNavigate()
  const [activeButton, setActiveButton] = useState<'email' | 'linkedin' | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [screenDimensions, setScreenDimensions] = useState({ width: 1920, height: 1080 })
  const [isLoaded, setIsLoaded] = useState(false)

  // Memoize scale calculation for better performance
  const scaleMultiplier = useMemo(() => 
    Math.max(screenDimensions.width / 1000, screenDimensions.height / 600) * 2.3,
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
    
    setIsAnimating(true)
    setActiveButton(destination)
    
    // Wait for animation to complete before navigating
    setTimeout(() => {
      const routePath = destination === 'email' ? '/email-dashboard' : '/linkedin-dashboard'
      navigate(routePath)
    }, 1200) // Match animation duration
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
            transition: 'opacity 800ms cubic-bezier(0.4, 0, 0.2, 1), transform 800ms cubic-bezier(0.4, 0, 0.2, 1)',
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
                  : isLoaded ? 'scale(1) translateZ(0)' : 'scale(0.95) translateZ(0)',
                transformOrigin: 'center center',
                transition: 'transform 1200ms cubic-bezier(0.23, 1, 0.32, 1), opacity 1200ms cubic-bezier(0.4, 0, 0.2, 1), border-radius 1200ms cubic-bezier(0.4, 0, 0.2, 1)',
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
                  : isLoaded ? 'scale(1) translateZ(0)' : 'scale(0.95) translateZ(0)',
                transformOrigin: 'center center',
                transition: 'transform 1200ms cubic-bezier(0.23, 1, 0.32, 1), opacity 1200ms cubic-bezier(0.4, 0, 0.2, 1), border-radius 1200ms cubic-bezier(0.4, 0, 0.2, 1)',
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