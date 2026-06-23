import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createArtwork, uploadArtworkImage } from '../services/artworkService'

const initialFormData = {
  title: '',
  description: '',
  category: '',
  tags: '',
}

const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
const maxImageSize = 10 * 1024 * 1024

function UploadArtwork() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState(initialFormData)
  const [selectedImage, setSelectedImage] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadMessage, setUploadMessage] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  function handleChange(event) {
    const { name, value } = event.target
    setFormData((currentData) => ({ ...currentData, [name]: value }))
  }

  function validateImage(file) {
    if (!file) {
      return 'Choose an image before publishing.'
    }

    if (!allowedImageTypes.includes(file.type)) {
      return 'Please choose a JPG, PNG, or WebP image.'
    }

    if (file.size > maxImageSize) {
      return 'Image must be 10MB or smaller.'
    }

    return ''
  }

  function handleImageSelection(file) {
    const validationError = validateImage(file)

    if (validationError) {
      setError(validationError)
      setSelectedImage(null)
      setPreviewUrl('')
      setUploadProgress(0)
      setUploadMessage('')
      return
    }

    setError('')
    setUploadProgress(0)
    setUploadMessage('Ready to upload')
    setSelectedImage(file)
    setPreviewUrl((currentPreviewUrl) => {
      if (currentPreviewUrl) {
        URL.revokeObjectURL(currentPreviewUrl)
      }

      return URL.createObjectURL(file)
    })
  }

  function handleFileChange(event) {
    handleImageSelection(event.target.files?.[0])
  }

  function handleDrop(event) {
    event.preventDefault()
    handleImageSelection(event.dataTransfer.files?.[0])
  }

  function handleDragOver(event) {
    event.preventDefault()
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setUploadMessage('')

    const validationError = validateImage(selectedImage)

    if (validationError) {
      setError(validationError)
      return
    }

    setIsSubmitting(true)

    try {
      setUploadMessage('Uploading image...')
      const uploadResult = await uploadArtworkImage(selectedImage, (progressEvent) => {
        if (!progressEvent.total) {
          return
        }

        setUploadProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total))
      })
      const uploadedImageUrl = uploadResult.imageUrl || uploadResult.image

      if (!uploadedImageUrl) {
        throw new Error('Upload completed without an image URL.')
      }

      setUploadMessage('Image uploaded successfully. Publishing artwork...')

      const artwork = await createArtwork({
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category.trim(),
        image: uploadedImageUrl,
        tags: formData.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean),
      })

      navigate(`/gallery/${artwork.id}`)
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.message || 'Unable to publish artwork right now.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="form-page">
      <div className="page-heading">
        <p>Upload artwork</p>
        <h1>Publish a new wonder</h1>
        <span>Choose an artwork image from your device and publish it into your collection.</span>
      </div>
      <div className="upload-layout">
        <div className="upload-preview">
          {previewUrl ? (
            <img src={previewUrl} alt="Artwork preview" />
          ) : (
            <label className="upload-dropzone" htmlFor="artwork-image" onDrop={handleDrop} onDragOver={handleDragOver}>
              <span>Drop artwork image</span>
              <p>Drag an image here or choose a JPG, PNG, or WebP file up to 10MB.</p>
              <strong>Choose Image</strong>
              <input
                id="artwork-image"
                type="file"
                accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                disabled={isSubmitting}
              />
            </label>
          )}
        </div>
        <form className="studio-form" onSubmit={handleSubmit}>
          {error ? <p className="auth-form__error">{error}</p> : null}
          {previewUrl ? (
            <label className="upload-inline-picker" onDrop={handleDrop} onDragOver={handleDragOver}>
              <span>{selectedImage?.name || 'Selected image'}</span>
              <strong>Change Image</strong>
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                disabled={isSubmitting}
              />
            </label>
          ) : null}
          {uploadProgress > 0 || uploadMessage ? (
            <div className="upload-status" aria-live="polite">
              <div className="upload-progress" aria-label={`Upload progress ${uploadProgress}%`}>
                <span style={{ width: `${uploadProgress}%` }} />
              </div>
              <p>{uploadMessage || `${uploadProgress}% uploaded`}</p>
            </div>
          ) : null}
          <label>
            Title
            <input name="title" value={formData.title} onChange={handleChange} required />
          </label>
          <label>
            Description
            <textarea name="description" value={formData.description} onChange={handleChange} required />
          </label>
          <label>
            Category
            <input name="category" value={formData.category} onChange={handleChange} required />
          </label>
          <label>
            Tags
            <input name="tags" value={formData.tags} onChange={handleChange} placeholder="oil, surreal, night" />
          </label>
          <div className="publish-bar">
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Publishing...' : 'Publish artwork'}
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}

export default UploadArtwork
