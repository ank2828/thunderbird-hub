import React, { memo } from 'react'

interface FlowingLinesProps {
  isAnimating?: boolean;
}

const FlowingLines: React.FC<FlowingLinesProps> = memo(({ isAnimating = false }) => {
  return (
    <div 
      className="gpu-accelerated"
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 1,
        pointerEvents: 'none',
        overflow: 'visible',
        opacity: isAnimating ? 0 : 0.9,
        transform: isAnimating ? 'translateY(-20px) translateZ(0)' : 'translateY(0) translateZ(0)',
        transition: isAnimating ? 'opacity 400ms cubic-bezier(0.4, 0, 0.2, 1), transform 400ms cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
        willChange: 'transform, opacity'
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{ 
          opacity: 1,
          transform: 'translateZ(0)',
          willChange: 'transform'
        }}
      >
        {/* Upper Group - Two lines above the text */}
        {/* Line 1: Top flowing line - above THUNDERBIRD LABS */}
        <path
          d="M-10,8 Q20,4 40,8 Q60,12 80,8 Q100,4 110,8"
          fill="none"
          stroke="white"
          strokeWidth="0.9"
          className="flowing-line-1"
        />
        
        {/* Line 2: Second upper line - just above text */}
        <path
          d="M-10,16 Q15,20 35,16 Q55,12 75,16 Q95,20 110,16"
          fill="none"
          stroke="white"
          strokeWidth="0.7"
          className="flowing-line-2"
        />
        
        {/* Lower Group - Two lines below the text - positioned halfway between recent positions */}
        {/* Line 3: First lower line - halfway between 38% and 58% = 48% */}
        <path
          d="M-10,48 Q25,44 50,48 Q75,52 110,48"
          fill="none"
          stroke="white"
          strokeWidth="0.9"
          className="flowing-line-3"
        />
        
        {/* Line 4: Bottom flowing line - halfway between 46% and 66% = 56% */}
        <path
          d="M-10,56 Q20,60 40,56 Q60,52 80,56 Q100,60 110,56"
          fill="none"
          stroke="white"
          strokeWidth="0.7"
          className="flowing-line-4"
        />
      </svg>
    </div>
  )
})

FlowingLines.displayName = 'FlowingLines'

export default FlowingLines
