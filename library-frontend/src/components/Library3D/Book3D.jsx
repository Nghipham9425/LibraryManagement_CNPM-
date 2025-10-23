import { useRef, useState } from 'react'
import { useFrame, useLoader } from '@react-three/fiber'
import { TextureLoader } from 'three'
import * as THREE from 'three'

const Book3D = ({ book, position, onClick, isSelected }) => {
  const meshRef = useRef()
  const [hovered, setHovered] = useState(false)

  // Load texture for book cover
  const texture = book.imageUrl
    ? useLoader(TextureLoader, book.imageUrl, undefined, (error) => {
        console.error('Error loading texture:', error)
      })
    : null

  // Animate the book - gentle floating and rotation
  useFrame((state) => {
    if (meshRef.current) {
      // Gentle floating animation
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.1

      // Subtle rotation when not hovered
      if (!hovered && !isSelected) {
        meshRef.current.rotation.y += 0.005
      }

      // Scale effect on hover/select
      const targetScale = hovered || isSelected ? 1.2 : 1
      meshRef.current.scale.lerp(
        { x: targetScale, y: targetScale, z: targetScale },
        0.1
      )
    }
  })

  return (
    <mesh
      ref={meshRef}
      position={position}
      onClick={(e) => {
        e.stopPropagation()
        onClick(book)
      }}
      onPointerOver={(e) => {
        e.stopPropagation()
        setHovered(true)
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        setHovered(false)
        document.body.style.cursor = 'default'
      }}
    >
      {/* Book cover (front) */}
      <boxGeometry args={[0.8, 1.2, 0.1]} />
      <meshStandardMaterial
        map={texture}
        color={hovered || isSelected ? '#ffffff' : '#dddddd'}
        emissive={hovered || isSelected ? '#444444' : '#000000'}
        emissiveIntensity={hovered || isSelected ? 0.3 : 0}
      />

      {/* Add a glow effect when selected */}
      {isSelected && (
        <pointLight
          position={[0, 0, 0.5]}
          intensity={1}
          distance={3}
          color="#4fc3f7"
        />
      )}
    </mesh>
  )
}

export default Book3D