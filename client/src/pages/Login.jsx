import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }))
  }

  function validateForm() {
    const nextErrors = {}

    if (!formData.email.trim()) {
      nextErrors.email = 'Email is required.'
    }

    if (!formData.password.trim()) {
      nextErrors.password = 'Password is required.'
    }

    return nextErrors
  }

  async function handleSubmit(event) {
    event.preventDefault()

    const validationErrors = validateForm()
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) {
      return
    }

    setIsSubmitting(true)

    try {
      await login({
        email: formData.email.trim(),
        password: formData.password,
      })
      navigate('/gallery')
    } catch (error) {
      setErrors({
        form: error.response?.data?.message || 'Unable to login. Please try again.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="auth-page">
      <div className="auth-card">
        <p className="auth-card__eyebrow">Welcome back</p>
        <h1>Login</h1>
        <p className="auth-card__intro">Sign in to continue exploring the gallery.</p>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {errors.form ? <p className="auth-form__error">{errors.form}</p> : null}

          <div className="auth-form__field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              aria-describedby={errors.email ? 'email-error' : undefined}
            />
            {errors.email ? (
              <p className="auth-form__error" id="email-error">
                {errors.email}
              </p>
            ) : null}
          </div>

          <div className="auth-form__field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              aria-describedby={errors.password ? 'password-error' : undefined}
            />
            {errors.password ? (
              <p className="auth-form__error" id="password-error">
                {errors.password}
              </p>
            ) : null}
          </div>

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="auth-card__footer">
          New to Gallery of Wonders? <Link to="/register">Create an account</Link>
        </p>
      </div>
    </section>
  )
}

export default Login
