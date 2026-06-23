import { useEffect, useState } from 'react'
import ArtworkCard from '../components/ArtworkCard'
import EmptyState from '../components/EmptyState'
import Loader from '../components/Loader'
import { getAllArtworks } from '../services/artworkService'

function Gallery() {
  const [artworks, setArtworks] = useState([])
  const [filters, setFilters] = useState({ search: '', category: '', page: 1 })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getAllArtworks({
      search: filters.search || undefined,
      category: filters.category || undefined,
      page: filters.page,
      limit: 12,
    })
      .then((artworkList) => {
        setArtworks(artworkList)
        setError('')
      })
      .catch(() => {
        setArtworks([])
        setError('Artwork data will appear once the backend database is connected.')
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [filters])

  function handleFilterChange(event) {
    const { name, value } = event.target
    setFilters((currentFilters) => ({
      ...currentFilters,
      [name]: value,
      page: 1,
    }))
    setIsLoading(true)
  }

  if (isLoading) {
    return (
      <section className="gallery-page">
        <div className="page-heading">
          <p>Public gallery</p>
          <h1>Explore the collection</h1>
        </div>
        <Loader message="Loading artworks..." />
      </section>
    )
  }

  if (error) {
    return (
      <section className="gallery-page">
        <EmptyState title="Gallery unavailable" description={error} />
      </section>
    )
  }

  return (
    <section className="gallery-page">
      <div className="page-heading">
        <p>Public gallery</p>
        <h1>Explore the collection</h1>
        <span>Search museum-style rooms, contemporary studies, and saved inspirations.</span>
      </div>
      <div className="filter-bar">
        <label>
          Search
          <input
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
            placeholder="Search artworks, tags, or stories"
          />
        </label>
        <label>
          Category
          <input
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
            placeholder="Filter by category"
          />
        </label>
      </div>
      {artworks.length === 0 ? (
        <EmptyState title="No artworks found" description="Try a different search or publish the first artwork." />
      ) : null}
      <div className="artwork-grid">
        {artworks.map((artwork) => (
          <ArtworkCard key={artwork.id} artwork={artwork} />
        ))}
      </div>
      <div className="pagination-controls">
        <button
          type="button"
          className="button-secondary"
          disabled={filters.page === 1}
          onClick={() => setFilters((currentFilters) => ({ ...currentFilters, page: currentFilters.page - 1 }))}
        >
          Previous
        </button>
        <span>Page {filters.page}</span>
        <button
          type="button"
          className="button-secondary"
          disabled={artworks.length < 12}
          onClick={() => setFilters((currentFilters) => ({ ...currentFilters, page: currentFilters.page + 1 }))}
        >
          Next
        </button>
      </div>
    </section>
  )
}

export default Gallery
