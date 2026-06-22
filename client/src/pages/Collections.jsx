import { useEffect, useState } from 'react'
import EmptyState from '../components/EmptyState'
import Loader from '../components/Loader'
import { createCollection, getCollections } from '../services/collectionService'

function Collections() {
  const [collections, setCollections] = useState([])
  const [title, setTitle] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getCollections()
      .then((nextCollections) => {
        setCollections(nextCollections)
        setError('')
      })
      .catch(() => {
        setError('Collections will appear once the database is connected.')
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  async function handleCreateCollection(event) {
    event.preventDefault()

    if (!title.trim()) {
      return
    }

    const collection = await createCollection({ title: title.trim() })
    setCollections((currentCollections) => [collection, ...currentCollections])
    setTitle('')
  }

  if (isLoading) {
    return <Loader message="Curating collections..." />
  }

  return (
    <section className="collections-page">
      <div className="page-heading">
        <p>Collections</p>
        <h1>Curated rooms for favorite works</h1>
        <span>Build focused sets for moods, movements, exhibitions, and personal references.</span>
      </div>
      <form className="inline-form collection-create" onSubmit={handleCreateCollection}>
        <label>
          New collection
          <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Collection title" />
        </label>
        <button type="submit">Create</button>
      </form>
      {error ? <EmptyState title="Collections unavailable" description={error} /> : null}
      {!error && collections.length === 0 ? (
        <EmptyState title="No collections yet" description="Create your first collection to organize artworks." />
      ) : null}
      <div className="collection-grid">
        {collections.map((collection) => (
          <article className="collection-card" key={collection.id}>
            <div className="collection-card__cover" aria-hidden="true">
              <span>{collection.title?.charAt(0) || 'G'}</span>
            </div>
            <h2>{collection.title}</h2>
            <p>{collection.description || 'A carefully curated gallery room.'}</p>
            <span>{collection.artworks?.length || 0} artworks</span>
          </article>
        ))}
      </div>
    </section>
  )
}

export default Collections
