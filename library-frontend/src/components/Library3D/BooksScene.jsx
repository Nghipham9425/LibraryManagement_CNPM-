import { useMemo, useRef } from 'react'
import { OrbitControls, Stars, Text } from '@react-three/drei'
import Book3D from './Book3D'
import * as THREE from 'three'

const BooksScene = ({ books, onBookClick, selectedBook }) => {
  const controlsRef = useRef()

  // Arrange books in a 3D circular spiral pattern
  const bookPositions = useMemo(() => {
    const positions = []
    const radius = 8
    const heightSpacing = 2
    const booksPerLevel = 8

    books.forEach((book, index) => {
      const level = Math.floor(index / booksPerLevel)
      const angleStep = (Math.PI * 2) / booksPerLevel
      const angle = (index % booksPerLevel) * angleStep

      const x = Math.cos(angle) * (radius + level * 0.5)
      const y = level * heightSpacing - (books.length / booksPerLevel) * heightSpacing * 0.3
      const z = Math.sin(angle) * (radius + level * 0.5)

      positions.push({
        book,
        position: [x, y, z],
      })
    })

    return positions
  }, [books])

  return (
    <>
      {/* Ambient lighting */}
      <ambientLight intensity={0.5} />

      {/* Directional lighting */}
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <directionalLight position={[-10, -10, -5]} intensity={0.5} />

      {/* Point lights for atmosphere */}
      <pointLight position={[0, 10, 0]} intensity={0.5} color="#4fc3f7" />
      <pointLight position={[0, -10, 0]} intensity={0.3} color="#ff6b6b" />

      {/* Background stars */}
      <Stars
        radius={100}
        depth={50}
        count={5000}
        factor={4}
        saturation={0}
        fade
        speed={1}
      />

      {/* Center text */}
      <Text
        position={[0, 0, 0]}
        fontSize={1}
        color="#4fc3f7"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.1}
        outlineColor="#000000"
      >
        Thư Viện 3D
      </Text>

      {/* Render all books */}
      {bookPositions.map(({ book, position }, index) => (
        <Book3D
          key={book.id || index}
          book={book}
          position={position}
          onClick={onBookClick}
          isSelected={selectedBook?.id === book.id}
        />
      ))}

      {/* Camera controls */}
      <OrbitControls
        ref={controlsRef}
        enableDamping
        dampingFactor={0.05}
        minDistance={5}
        maxDistance={30}
        maxPolarAngle={Math.PI / 1.5}
        minPolarAngle={Math.PI / 6}
      />
    </>
  )
}

export default BooksScene
