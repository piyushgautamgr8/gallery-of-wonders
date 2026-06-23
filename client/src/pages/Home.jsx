import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ArtworkCard from '../components/ArtworkCard'
import artworkService from '../services/artworkService'

const aboutItems = [
  {
    title: 'Discover Art',
    description: 'Browse a curated collection of celebrated works from different eras and movements.',
  },
  {
    title: 'Learn History',
    description: 'Understand the artists, cultural moments, and stories behind each masterpiece.',
  },
  {
    title: 'Explore Creativity',
    description: 'Find inspiration in the techniques, ideas, and visual language that shaped art.',
  },
]

const categories = ['Digital Art', 'Photography', 'Illustration', 'Painting', 'Sculpture', 'Poetry']

const stats = [
  { label: 'Curated rooms', value: '12+' },
  { label: 'Creative categories', value: '24' },
  { label: 'Member collections', value: '1k+' },
]

function Home() {
  const [featuredArtworks, setFeaturedArtworks] = useState([])

  useEffect(() => {
    artworkService
      .getAllArtworks({ limit: 3 })
      .then((artworks) => {
        setFeaturedArtworks(artworks.slice(0, 3))
      })
      .catch(() => {
        setFeaturedArtworks([])
      })
  }, [])

  return (
    <div className="home-page">
      <section className="home-hero">
        <div className="home-hero__content">
          <p className="home-hero__eyebrow">Gallery of Wonders</p>
          <h1>Discover the World's Greatest Artworks</h1>
          <p className="home-hero__description">
            Step into a curated digital gallery where timeless masterpieces, rich histories, and
            creative inspiration come together in one elegant experience.
          </p>
          <div className="home-hero__actions">
            <Link className="home-button home-button--primary" to="/gallery">
              Explore Gallery
            </Link>
            <Link className="home-button home-button--secondary" to="/register">
              Join Community
            </Link>
          </div>
          <div className="home-hero__stats">
            {stats.map((stat) => (
              <span key={stat.label}>
                <strong>{stat.value}</strong>
                {stat.label}
              </span>
            ))}
          </div>
        </div>
        <div className="home-hero__panel" aria-label="Curated artwork highlights">
          <img
            src="https://images.unsplash.com/photo-1545987796-200677ee1011"
            alt="Visitors viewing framed artworks in a gallery"
            className="home-hero__image"
          />
        </div>
      </section>

      <section className="home-section" aria-labelledby="categories-heading">
        <div className="home-section__header">
          <p className="home-section__eyebrow">Browse by mood</p>
          <h2 id="categories-heading">Category rooms made for focused discovery</h2>
        </div>
        <div className="category-grid">
          {categories.map((category) => (
            <Link className="category-card" key={category} to="/gallery">
              <span>{category}</span>
              <small>Explore collection</small>
            </Link>
          ))}
        </div>
      </section>

      <section className="home-section" aria-labelledby="featured-artworks-heading">
        <div className="home-section__header">
          <p className="home-section__eyebrow">Featured Artworks</p>
          <h2 id="featured-artworks-heading">Start with these iconic pieces</h2>
        </div>
        <div className="artwork-grid">
          {featuredArtworks.map((artwork) => (
            <ArtworkCard key={artwork.id} artwork={artwork} />
          ))}
        </div>
      </section>

      <section className="home-section" aria-labelledby="about-gallery-heading">
        <div className="home-section__header">
          <p className="home-section__eyebrow">About</p>
          <h2 id="about-gallery-heading">A thoughtful way to experience art</h2>
        </div>
        <div className="home-about-grid">
          {aboutItems.map((item) => (
            <article className="home-about-card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="home-cta" aria-labelledby="home-cta-heading">
        <p className="home-section__eyebrow">Begin your collection</p>
        <h2 id="home-cta-heading">Build a gallery that feels personal, intentional, and alive.</h2>
        <Link className="home-button home-button--primary" to="/upload">
          Upload Artwork
        </Link>
      </section>
    </div>
  )
}

export default Home
