import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import EmptyState from '../components/EmptyState'
import Loader from '../components/Loader'
import { getDashboardStats } from '../services/dashboardService'

const statLabels = {
  artworks: 'Artworks',
  collections: 'Collections',
  comments: 'Comments',
  likes: 'Likes',
  bookmarks: 'Bookmarks',
}

function Dashboard() {
  const [stats, setStats] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getDashboardStats()
      .then((nextStats) => {
        setStats(nextStats)
        setError('')
      })
      .catch(() => {
        setError('Dashboard statistics will appear once the database is connected.')
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  if (isLoading) {
    return <Loader message="Preparing your studio dashboard..." />
  }

  if (error) {
    return <EmptyState title="Dashboard unavailable" description={error} />
  }

  return (
    <section className="dashboard-page">
      <div className="page-heading">
        <p>Creator dashboard</p>
        <h1>Your gallery at a glance</h1>
        <span>Monitor publishing momentum, audience signals, and collection growth.</span>
      </div>
      <div className="stat-grid">
        {Object.entries(statLabels).map(([key, label]) => (
          <article className="stat-card" key={key}>
            <span>{label}</span>
            <strong>{stats?.[key] ?? 0}</strong>
          </article>
        ))}
      </div>
      <div className="dashboard-layout">
        <section className="chart-panel">
          <div>
            <p>Engagement curve</p>
            <h2>{(stats?.likes ?? 0) + (stats?.bookmarks ?? 0)} total signals</h2>
          </div>
          <div className="chart-placeholder" aria-label="Engagement chart placeholder">
            <span style={{ height: `${Math.max(stats?.artworks || 1, 1) * 18}px` }} />
            <span style={{ height: `${Math.max(stats?.likes || 1, 1) * 12}px` }} />
            <span style={{ height: `${Math.max(stats?.bookmarks || 1, 1) * 12}px` }} />
            <span style={{ height: `${Math.max(stats?.comments || 1, 1) * 14}px` }} />
          </div>
        </section>
        <section className="quick-actions">
          <h2>Quick actions</h2>
          <Link to="/upload">Publish artwork</Link>
          <Link to="/collections">Create collection</Link>
          <Link to="/gallery">Review gallery</Link>
        </section>
      </div>
    </section>
  )
}

export default Dashboard
