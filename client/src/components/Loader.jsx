function Loader({ message = 'Loading...' }) {
  return (
    <div className="loader" role="status" aria-live="polite">
      <span className="loader__spinner" aria-hidden="true" />
      {message ? <p>{message}</p> : null}
    </div>
  )
}

export default Loader
