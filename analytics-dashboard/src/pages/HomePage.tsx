import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import FlowingLines from '../components/FlowingLines'

function HomePage() {
  const navigate = useNavigate()
  const [isAnimating, setIsAnimating] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const handleNavigation = (destination: 'email' | 'linkedin') => {
    if (isAnimating) return
    
    // Elegant fade-out transition - no zoom, pure class
    setIsAnimating(true)
    
    // Phase 1: Immediate graceful fade begins (0ms)
    requestAnimationFrame(() => {
      // Phase 2: Navigate after elegant fade completes (600ms)
      setTimeout(() => {
        const routePath = destination === 'email' ? '/email-campaigns' : '/linkedin-dashboard'
        navigate(routePath)
      }, 600)
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
      <FlowingLines isAnimating={isAnimating} />
      
      <main className="min-h-screen flex flex-col px-8 py-12 relative z-10 gpu-accelerated">
        {/* Hero Text */}
        <div 
          className="text-center mb-8 relative gpu-accelerated" 
          style={{ 
            paddingTop: '120px',
            opacity: isAnimating ? 0 : (isLoaded ? 1 : 0),
            transform: isAnimating 
              ? 'translateY(-40px) translateZ(0)' // Elegant rise and fade
              : isLoaded ? 'translateY(0) translateZ(0)' : 'translateY(20px) translateZ(0)',
            transition: isAnimating 
              ? 'opacity 500ms cubic-bezier(0.4, 0, 0.2, 1), transform 500ms cubic-bezier(0.4, 0, 0.2, 1)' // Elegant fade
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
                borderRadius: '3rem', // Always maintain rounded corners
                marginRight: '30px',
                opacity: isAnimating ? 0 : (isLoaded ? 1 : 0),
                transform: isAnimating 
                  ? 'translateY(-30px) scale(0.95) translateZ(0)' // Gentle rise and slight scale
                  : isLoaded ? 'scale(1) translateZ(0)' : 'scale(0.98) translateZ(0)',
                transformOrigin: 'center center',
                transition: isAnimating 
                  ? 'transform 500ms cubic-bezier(0.4, 0, 0.2, 1), opacity 500ms cubic-bezier(0.4, 0, 0.2, 1)' // Elegant fade
                  : 'transform 800ms cubic-bezier(0.4, 0, 0.2, 1), opacity 800ms cubic-bezier(0.4, 0, 0.2, 1)', // Normal hover
                zIndex: 1,
                position: 'relative',
                willChange: 'transform, opacity, border-radius'
              }}
              aria-label="Email Module"
            >
              {/* Email Hub Logo */}
              <div
                className="absolute inset-0 flex items-center justify-center"
              >
                <div
                  className="bg-white bg-opacity-95 backdrop-blur-lg border border-white border-opacity-30 rounded-2xl px-6 py-3 shadow-lg"
                  style={{
                    fontFamily: 'Inter, system-ui, sans-serif',
                    fontSize: '18px',
                    fontWeight: '700',
                    color: '#1f2937',
                    letterSpacing: '0.05em',
                    textShadow: 'none',
                    textTransform: 'uppercase'
                  }}
                >
                  Email Hub
                </div>
              </div>
            </button>
            
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
                borderRadius: '3rem', // Always maintain rounded corners
                marginLeft: '30px',
                opacity: isAnimating ? 0 : (isLoaded ? 1 : 0),
                transform: isAnimating 
                  ? 'translateY(-30px) scale(0.95) translateZ(0)' // Gentle rise and slight scale
                  : isLoaded ? 'scale(1) translateZ(0)' : 'scale(0.98) translateZ(0)',
                transformOrigin: 'center center',
                transition: isAnimating 
                  ? 'transform 500ms cubic-bezier(0.4, 0, 0.2, 1), opacity 500ms cubic-bezier(0.4, 0, 0.2, 1)' // Elegant fade
                  : 'transform 800ms cubic-bezier(0.4, 0, 0.2, 1), opacity 800ms cubic-bezier(0.4, 0, 0.2, 1)', // Normal hover
                zIndex: 1,
                position: 'relative',
                willChange: 'transform, opacity, border-radius'
              }}
              aria-label="LinkedIn Module"
            >
              {/* LinkedIn Hub Logo */}
              <div
                className="absolute inset-0 flex items-center justify-center"
              >
                <div
                  className="bg-white bg-opacity-95 backdrop-blur-lg border border-white border-opacity-30 rounded-2xl px-6 py-3 shadow-lg"
                  style={{
                    fontFamily: 'Inter, system-ui, sans-serif',
                    fontSize: '18px',
                    fontWeight: '700',
                    color: '#1f2937',
                    letterSpacing: '0.05em',
                    textShadow: 'none',
                    textTransform: 'uppercase'
                  }}
                >
                  LinkedIn Hub
                </div>
              </div>
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default HomePage