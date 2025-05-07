import styled from '@emotion/styled';
import { useState, useEffect } from 'react';
import React from 'react';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  color: white;
  font-family: 'Arial', sans-serif;
  perspective: 1000px;
  overflow: hidden;
  position: relative;
`;

const getRandomPosition = (index: number) => {
  const maxDistance = 50 + (index * 30);
  // Generate random direction (up, down, left, right, or diagonals)
  const directions = [
    { x: 1, y: -1 },   // up-right
    { x: 1, y: 1 },    // down-right
    { x: -1, y: -1 },  // up-left
    { x: -1, y: 1 },   // down-left
    { x: 0, y: -1 },   // up
    { x: 0, y: 1 },    // down
    { x: 1, y: 0 },    // right
    { x: -1, y: 0 }    // left
  ];
  
  const direction = directions[Math.floor(Math.random() * directions.length)];
  const distance = maxDistance;
  
  return {
    x: direction.x * distance,
    y: direction.y * distance
  };
};

const getRandomRotation = () => {
  return {
    x: (Math.random() - 0.5) * 30,
    y: (Math.random() - 0.5) * 30,
    z: (Math.random() - 0.5) * 360,
  };
};

const getColorForJump = (jumpState: number) => {
  const colors = [
    '#FFFFFF', // White
    '#FFB6C1', // Light pink
    '#FF69B4', // Hot pink
    '#FF1493', // Deep pink
    '#FF0000'  // Red
  ];
  
  const progress = jumpState / 7;
  const colorIndex = Math.min(Math.floor(progress * (colors.length - 1)), colors.length - 2);
  const nextColorIndex = Math.min(colorIndex + 1, colors.length - 1);
  const localProgress = (progress * (colors.length - 1)) % 1;
  
  // If we're at the last jump, force the final red color
  if (jumpState === 7) {
    return colors[colors.length - 1];
  }
  
  // Convert hex to RGB
  const currentColor = colors[colorIndex];
  const nextColor = colors[nextColorIndex];
  
  const currentR = parseInt(currentColor.slice(1, 3), 16);
  const currentG = parseInt(currentColor.slice(3, 5), 16);
  const currentB = parseInt(currentColor.slice(5, 7), 16);
  const nextR = parseInt(nextColor.slice(1, 3), 16);
  const nextG = parseInt(nextColor.slice(3, 5), 16);
  const nextB = parseInt(nextColor.slice(5, 7), 16);
  
  // Interpolate
  const r = Math.round(currentR + (nextR - currentR) * localProgress);
  const g = Math.round(currentG + (nextG - currentG) * localProgress);
  const b = Math.round(currentB + (nextB - currentB) * localProgress);
  
  return `rgb(${r}, ${g}, ${b})`;
};

const getShadowColorForJump = (jumpState: number) => {
  const colors = [
    '#CCCCCC', // Light gray (for white)
    '#FFB6C1', // Light pink
    '#FF69B4', // Hot pink
    '#FF1493', // Deep pink
    '#CC0000'  // Dark red
  ];
  
  const progress = jumpState / 7;
  const colorIndex = Math.min(Math.floor(progress * (colors.length - 1)), colors.length - 2);
  const nextColorIndex = Math.min(colorIndex + 1, colors.length - 1);
  const localProgress = (progress * (colors.length - 1)) % 1;
  
  // If we're at the last jump, force the final dark red color
  if (jumpState === 7) {
    return colors[colors.length - 1];
  }
  
  // Convert hex to RGB
  const currentColor = colors[colorIndex];
  const nextColor = colors[nextColorIndex];
  
  const currentR = parseInt(currentColor.slice(1, 3), 16);
  const currentG = parseInt(currentColor.slice(3, 5), 16);
  const currentB = parseInt(currentColor.slice(5, 7), 16);
  const nextR = parseInt(nextColor.slice(1, 3), 16);
  const nextG = parseInt(nextColor.slice(3, 5), 16);
  const nextB = parseInt(nextColor.slice(5, 7), 16);
  
  // Interpolate
  const r = Math.round(currentR + (nextR - currentR) * localProgress);
  const g = Math.round(currentG + (nextG - currentG) * localProgress);
  const b = Math.round(currentB + (nextB - currentB) * localProgress);
  
  return `rgb(${r}, ${g}, ${b})`;
};

const Name = styled.h1<{ jumpState: number; isVisible: boolean; positions: Array<{x: number, y: number}>, rotations: Array<{x: number, y: number, z: number}>, isHoveringTony: boolean }>`
  font-size: 8rem;
  font-weight: 900;
  margin: 0;
  position: relative;
  transform-style: preserve-3d;
  opacity: ${props => props.isVisible ? 1 : 0};
  transform: ${props => {
    const baseTransform = 'rotateX(10deg)';
    const scales = [1.1, 1.15, 1.2, 1.25, 1.3, 1.35, 1.4, 1.45, 1.5, 1.55, 1.6, 1.65, 1.7, 1.75, 1.8, 1.85];

    if (props.jumpState === 0) {
      return `${baseTransform} rotateZ(0deg) translate(0, 0) scale(1)`;
    }
    if (props.jumpState === 8) {
      return `${baseTransform} rotateZ(0deg) translate(0, -1000px) scale(2)`;
    }

    const pos = props.positions[props.jumpState - 1];
    const rot = props.rotations[props.jumpState - 1];
    
    if (props.jumpState >= 6) {
      const jumpIndex = props.jumpState - 6;
      const scale = 2 + (jumpIndex * 0.5);
      const rotationX = jumpIndex * 120;
      const rotationY = jumpIndex * 180;
      const rotationZ = jumpIndex * 240;
      
      return `${baseTransform} 
        rotateX(${rotationX}deg) 
        rotateY(${rotationY}deg) 
        rotateZ(${rotationZ}deg) 
        translate(${pos.x}px, ${pos.y}px) 
        scale(${scale})`;
    }

    return `${baseTransform} 
      rotateX(${rot.x}deg) 
      rotateY(${rot.y}deg) 
      rotateZ(${rot.z}deg) 
      translate(${pos.x}px, ${pos.y}px) 
      scale(${scales[props.jumpState - 1]})`;
  }};
  letter-spacing: -2px;
  color: ${props => getColorForJump(props.jumpState)};
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);

  &:hover {
    transform: ${props => {
      const baseTransform = 'rotateX(10deg)';
      const scales = [1.1, 1.15, 1.2, 1.25, 1.3, 1.35, 1.4, 1.45, 1.5, 1.55, 1.6, 1.65, 1.7, 1.75, 1.8, 1.85];

      if (props.jumpState === 0) {
        return `${baseTransform} rotateZ(0deg) translate(0, -10px) scale(0.95)`;
      }
      if (props.jumpState === 8) {
        return `${baseTransform} rotateZ(0deg) translate(0, -1000px) scale(2)`;
      }

      const pos = props.positions[props.jumpState - 1];
      const rot = props.rotations[props.jumpState - 1];
      
      if (props.jumpState >= 6) {
        const jumpIndex = props.jumpState - 6;
        const scale = 2 + (jumpIndex * 0.5);
        const rotationX = jumpIndex * 120;
        const rotationY = jumpIndex * 180;
        const rotationZ = jumpIndex * 240;
        
        return `${baseTransform} 
          rotateX(${rotationX}deg) 
          rotateY(${rotationY}deg) 
          rotateZ(${rotationZ}deg) 
          translate(${pos.x}px, ${pos.y - 10}px) 
          scale(${scale * 0.95})`;
      }

      return `${baseTransform} 
        rotateX(${rot.x}deg) 
        rotateY(${rot.y}deg) 
        rotateZ(${rot.z}deg) 
        translate(${pos.x}px, ${pos.y - 10}px) 
        scale(${scales[props.jumpState - 1] * 0.95})`;
    }};
  }

  text-shadow: 
    /* First layer */
    2px 2px 0 ${props => getShadowColorForJump(props.jumpState)},
    4px 4px 0 ${props => getShadowColorForJump(props.jumpState)},
    /* Second layer */
    6px 6px 0 ${props => getShadowColorForJump(props.jumpState)},
    8px 8px 0 ${props => getShadowColorForJump(props.jumpState)},
    /* Third layer */
    10px 10px 0 ${props => getShadowColorForJump(props.jumpState)},
    12px 12px 0 ${props => getShadowColorForJump(props.jumpState)},
    /* Highlight */
    -1px -1px 0 ${props => getColorForJump(props.jumpState)},
    /* Edge shadows */
    0 0 20px rgba(0,0,0,0.5);
`;

// Box-Muller transform to generate normally distributed random numbers
const getNormalRandom = (mean: number, variance: number) => {
  const u1 = Math.random();
  const u2 = Math.random();
  const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
  return z0 * Math.sqrt(variance) + mean;
};

const SocialLinks = styled.div`
  margin-top: 2rem;
  display: flex;
  gap: 2rem;
  position: relative;
  width: 100%;
  justify-content: center;
`;

const SocialLink = styled.a<{ position: { x: number; y: number } }>`
  color: white;
  text-decoration: none;
  font-size: 1.2rem;
  padding: 0.5rem 1rem;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  position: relative;
  z-index: 1;
  transform: translate3d(${props => props.position.x}px, ${props => props.position.y}px, 0);
  transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  display: inline-block;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translate3d(${props => props.position.x}px, ${props => props.position.y - 2}px, 0);
  }
`;

function App() {
  const [jumpState, setJumpState] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [positions, setPositions] = useState<Array<{x: number, y: number}>>([]);
  const [rotations, setRotations] = useState<Array<{x: number, y: number, z: number}>>([]);
  const [buttonPositions, setButtonPositions] = useState([
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 }
  ]);
  const [isHoveringButton, setIsHoveringButton] = useState(false);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [rotationAxis, setRotationAxis] = useState<'x' | 'y' | 'x-reverse'>('x');
  const [isReturning, setIsReturning] = useState(false);
  const [isHoveringTony, setIsHoveringTony] = useState(false);
  const [isInCooldown, setIsInCooldown] = useState(false);

  // Add effect for continuous rotation
  useEffect(() => {
    let animationFrameId: number;
    
    const rotate = () => {
      if (isHoveringButton) {
        setRotationAngle(prev => (prev + 5) % 360);
        animationFrameId = requestAnimationFrame(rotate);
      } else if (isReturning) {
        // Calculate the shortest path back to 0
        const currentAngle = rotationAngle % 360;
        const shortestPath = currentAngle > 180 ? 360 - currentAngle : -currentAngle;
        const step = Math.sign(shortestPath) * 10; // Faster return speed
        
        setRotationAngle(prev => {
          const newAngle = prev + step;
          if (Math.abs(newAngle) < 10) { // If we're close enough to 0
            setIsReturning(false);
            return 0;
          }
          return newAngle;
        });
        
        animationFrameId = requestAnimationFrame(rotate);
      }
    };

    if (isHoveringButton || isReturning) {
      animationFrameId = requestAnimationFrame(rotate);
    }

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isHoveringButton, isReturning, rotationAngle]);

  const handleClick = () => {
    if (jumpState < 8) {
      const newPositions = [...positions, getRandomPosition(jumpState)];
      const newRotations = [...rotations, getRandomRotation()];
      setPositions(newPositions);
      setRotations(newRotations);
      setJumpState(prev => prev + 1);
      
      // Generate new random positions for buttons using normal distribution with bounds
      const newButtonPositions = buttonPositions.map(() => {
        const x = getNormalRandom(0, 500000);
        const y = getNormalRandom(0, 500000);
        
        const maxX = 800;
        const maxY = 400;
        
        return {
          x: Math.max(Math.min(x, maxX), -maxX),
          y: Math.max(Math.min(y, maxY), -maxY)
        };
      });
      setButtonPositions(newButtonPositions);

      // Start cooldown
      setIsInCooldown(true);
      setTimeout(() => {
        setIsInCooldown(false);
      }, 2000);
    }
    
    if (jumpState === 7) {
      setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => {
          setJumpState(0);
          setPositions([]);
          setRotations([]);
          setButtonPositions([{ x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }]);
          setIsVisible(true);
        }, 500);
      }, 500);
    }
  };

  const handleMouseEnter = () => {
    if (!isInCooldown) {
      setIsHoveringTony(true);
    }
  };

  const handleMouseLeave = () => {
    setIsHoveringTony(false);
    setIsHoveringButton(false);
    setIsReturning(true);
  };

  const getCurrentTransform = () => {
    const baseTransform = 'rotateX(10deg)';
    const scales = [1.1, 1.15, 1.2, 1.25, 1.3, 1.35, 1.4, 1.45, 1.5, 1.55, 1.6, 1.65, 1.7, 1.75, 1.8, 1.85];

    if (jumpState === 0) {
      return `${baseTransform} rotateZ(0deg) translate(0, 0) scale(1)`;
    }
    if (jumpState === 8) {
      return `${baseTransform} rotateZ(0deg) translate(0, -1000px) scale(2)`;
    }

    const pos = positions[jumpState - 1];
    const rot = rotations[jumpState - 1];
    
    // Special handling for last 3 jumps
    if (jumpState >= 6) {
      const jumpIndex = jumpState - 6;
      const scale = 2 + (jumpIndex * 0.5);
      const rotationX = jumpIndex * 120;
      const rotationY = jumpIndex * 180;
      const rotationZ = jumpIndex * 240;
      
      return `${baseTransform} 
        rotateX(${rotationX}deg) 
        rotateY(${rotationY}deg) 
        rotateZ(${rotationZ}deg) 
        translate(${pos.x}px, ${pos.y}px) 
        scale(${scale})`;
    }

    return `${baseTransform} 
      rotateX(${rot.x}deg) 
      rotateY(${rot.y}deg) 
      rotateZ(${rot.z}deg) 
      translate(${pos.x}px, ${pos.y}px) 
      scale(${scales[jumpState - 1]})`;
  };

  const getRotationTransform = () => {
    if (!isHoveringButton && !isReturning) return '';
    
    switch (rotationAxis) {
      case 'x':
        return `rotateX(${rotationAngle}deg)`;
      case 'y':
        return `rotateY(${rotationAngle}deg)`;
      case 'x-reverse':
        return `rotateX(${-rotationAngle}deg)`;
      default:
        return '';
    }
  };

  return (
    <Container>
      <Name 
        jumpState={jumpState} 
        isVisible={isVisible} 
        positions={positions}
        rotations={rotations}
        isHoveringTony={isHoveringTony}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: isHoveringButton
            ? `${getCurrentTransform()} ${getRotationTransform()}` 
            : getCurrentTransform(),
          transition: isHoveringButton ? 'none' : 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
          transformStyle: 'preserve-3d',
          perspective: '1000px'
        }}
      >
        TONY
      </Name>
      <SocialLinks>
        <SocialLink 
          href="https://linkedin.com/in/your-profile" 
          target="_blank" 
          rel="noopener noreferrer"
          position={buttonPositions[0]}
          onMouseEnter={() => {
            setIsHoveringButton(true);
            setRotationAxis('y');
          }}
          onMouseLeave={handleMouseLeave}
        >
          LinkedIn
        </SocialLink>
        <SocialLink 
          href="https://github.com/your-username" 
          target="_blank" 
          rel="noopener noreferrer"
          position={buttonPositions[1]}
          onMouseEnter={() => {
            setIsHoveringButton(true);
            setRotationAxis('x-reverse');
          }}
          onMouseLeave={handleMouseLeave}
        >
          GitHub
        </SocialLink>
        <SocialLink 
          href="https://instagram.com/your-handle" 
          target="_blank" 
          rel="noopener noreferrer"
          position={buttonPositions[2]}
          onMouseEnter={() => {
            setIsHoveringButton(true);
            setRotationAxis('x');
          }}
          onMouseLeave={handleMouseLeave}
        >
          Instagram
        </SocialLink>
      </SocialLinks>
    </Container>
  );
}

export default App;
