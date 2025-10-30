

import { useMemo } from 'react'
import { Stars, Text, FlyControls } from '@react-three/drei'
import Book3D from './Book3D'
import * as THREE from 'three'

const BooksScene = ({ books, onBookClick, selectedBook }) => {

  // Arrange books in a random 3D cloud (spam) style
  const bookPositions = useMemo(() => {
    const positions = [];
    const spread = 30; // how far books can be from center
    books.forEach((book, index) => {
      // Random position in a 3D box
      const x = (Math.random() - 0.5) * spread;
      const y = (Math.random() - 0.5) * spread * 0.7;
      const z = (Math.random() - 0.5) * spread;
      positions.push({
        book,
        position: [x, y, z],
      });
    });
    return positions;
  }, [books]);

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
      {/* Render all books with floating animation */}
      {bookPositions.map(({ book, position }, index) => (
        <Book3D
          key={book.id || index}
          book={book}
          position={position}
          onClick={onBookClick}
          isSelected={selectedBook?.id === book.id}
          floating
        />
      ))}

  {/* Fly controls for WASD/arrow key movement only (no free mouse look) */}
  <FlyControls movementSpeed={10} rollSpeed={0.5} dragToLook={true} />
    </>
  )
}

export default BooksScene
