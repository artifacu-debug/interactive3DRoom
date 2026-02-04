import React, { useRef, useState, Suspense, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, useGLTF, Environment, ContactShadows } from '@react-three/drei'
import gsap from 'gsap'

// 1. STYLING: This handles the "smallness" issue by making the canvas fill the screen
const styles = {
  container: {
    width: '100vw',
    height: '100vh',
    margin: 0,
    padding: 0,
    background: '#f0f0f0', // Light grey background like your screenshot
  }
}

// 2. The Zoom Logic Component (Fixed for smoother movement)
function CameraRig({ targetPos }) {
  const { camera, controls } = useThree()
  
  useEffect(() => {
    if (targetPos && controls) {
      // Smoothly move camera position
      gsap.to(camera.position, {
        x: targetPos.x,
        y: targetPos.y,
        z: targetPos.z,
        duration: 1.5,
        ease: 'power3.inOut'
      })
      // Adjust the OrbitControls target to look directly at the object
      gsap.to(controls.target, {
        x: targetPos.lookX,
        y: targetPos.lookY,
        z: targetPos.lookZ,
        duration: 1.5,
        ease: 'power3.inOut',
        onUpdate: () => controls.update() // Updates the scene while moving
      })
    }
  }, [targetPos, camera, controls])

  return null
}

export default function App() {
  const [target, setTarget] = useState(null)

  return (
    <div style={styles.container}>
      <Canvas shadows>
        {/* Adjusted starting position to be further back so the room isn't tiny */}
        <PerspectiveCamera makeDefault position={[3, 3, 3]} fov={50} />
        
        <OrbitControls 
          makeDefault 
          minPolarAngle={0} 
          maxPolarAngle={Math.PI / 1.75} 
        />
        
        <ambientLight intensity={0.7} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        
        <Suspense fallback={null}>
          {/* THE SIXTH FLOOR */}
          <primitive 
            object={useGLTF("/sixthfloor.glb").scene} 
            position={[0, 0, 0]} 
            scale={[1, 1, 1]} 
          />

          {/* MOTORCYCLE */}
          <primitive 
            object={useGLTF("/motorcycle.glb").scene} 
            position={[-0.1023, -1.80999, -0.45]} 
            scale={[1.2, 1.2, 1.2]} 
            onClick={(e) => {
              e.stopPropagation() // Prevents clicking the room at the same time
              setTarget({
              // The "Tripod" (Camera Position)
      x: -3.32653,   
      y: 4,    
      z: 3.3205,    
      // The "Focus" (Motorcycle Position)
      lookX: 0.1023, 
      lookY: -1.80999, 
      lookZ: -0.45
              })
            }}
          />

          <CameraRig targetPos={target} />
        </Suspense>
        
        <Environment preset="city" />
        <ContactShadows opacity={0.4} scale={10} blur={2} far={4.5} />
      </Canvas>
    </div>
  )
}

