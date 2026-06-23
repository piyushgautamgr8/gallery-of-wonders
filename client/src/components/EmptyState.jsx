import { Link } from 'react-router-dom'

function EmptyState({ title, description, buttonText, navigationLink }) {
  return (
    <div className="empty-state">
      <div className="empty-state__mark" aria-hidden="true">
        ✦
      </div>
      <h1>{title}</h1>
      <p>{description}</p>
      {buttonText && navigationLink ? (
        <Link className="empty-state__button" to={navigationLink}>
          {buttonText}
        </Link>
      ) : null}
    </div>
  )
}

export default EmptyState
