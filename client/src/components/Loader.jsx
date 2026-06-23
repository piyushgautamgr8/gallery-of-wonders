function Loader({ message = 'Loading...' }) {
  return (
    <div className="loader" role="status" aria-live="polite">
      <div className="loader__skeleton" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      {message ? <p>{message}</p> : null}
    </div>
  )
}

export default Loader
