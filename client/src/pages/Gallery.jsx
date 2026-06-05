import ArtworkCard from '../components/ArtworkCard'

const artworks = [
  {
    id: '1',
    title: 'Starry Night',
    artist: 'Vincent van Gogh',
    category: 'Post-Impressionism',
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5',
  },
  {
    id: '2',
    title: 'Mona Lisa',
    artist: 'Leonardo da Vinci',
    category: 'Renaissance',
    image: 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968',
  },
  {
    id: '3',
    title: 'The Great Wave',
    artist: 'Katsushika Hokusai',
    category: 'Ukiyo-e',
    image: 'https://images.unsplash.com/photo-1578301978018-3005759f48f7',
  },
  {
    id: '4',
    title: 'Girl with a Pearl Earring',
    artist: 'Johannes Vermeer',
    category: 'Baroque',
    image: 'https://images.unsplash.com/photo-1580136579312-94651dfd596d',
  },
]

function Gallery() {
  return (
    <section className="gallery-page">
      <h1>Gallery</h1>
      <div className="artwork-grid">
        {artworks.map((artwork) => (
          <ArtworkCard key={artwork.id} artwork={artwork} />
        ))}
      </div>
    </section>
  )
}

export default Gallery
