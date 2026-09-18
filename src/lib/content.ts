import { supabase } from './supabase'

export function normalizeSocialLinks(value: unknown): Record<string, string> {
  if (!value || typeof value !== 'object') {
    return {}
  }

  const normalized = value as Record<string, unknown>

  return Object.fromEntries(
    Object.entries(normalized)
      .filter(([, entryValue]) => typeof entryValue === 'string')
      .map(([key, entryValue]) => [key, String(entryValue)])
  )
}

export function buildImageAlt(title: string, description?: string | null): string {
  const details = description?.trim()
  return details ? `${title} - ${details}` : title
}

export function getStoragePathFromUrl(value: string | null | undefined): string | null {
  if (!value) {
    return null
  }

  if (value.startsWith('http')) {
    const match = value.match(/\/object\/public\/[^/]+\/(.+)$/)
    if (match) {
      return decodeURIComponent(match[1])
    }

    return value
  }

  return value
}

async function optimizeImage(file: File): Promise<File> {
  if (!file.type.startsWith('image/')) {
    return file
  }

  const image = new Image()
  const objectUrl = URL.createObjectURL(file)

  try {
    image.src = objectUrl

    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve()
      image.onerror = () => reject(new Error('Unable to read the image.'))
    })

    const maxWidth = 1600
    const maxHeight = 1600

    let width = image.naturalWidth
    let height = image.naturalHeight

    if (width > maxWidth || height > maxHeight) {
      const scale = Math.min(maxWidth / width, maxHeight / height)

      width = Math.round(width * scale)
      height = Math.round(height * scale)
    }

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height

    const context = canvas.getContext('2d')

    if (!context) {
      throw new Error('Unable to process the image.')
    }

    context.drawImage(image, 0, 0, width, height)

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, 'image/webp', 0.82)
    })

    if (!blob) {
      throw new Error('Unable to compress the image.')
    }

    const originalName = file.name.replace(/\.[^/.]+$/, '')

    return new File([blob], `${originalName}.webp`, {
      type: 'image/webp',
    })
  } finally {
    URL.revokeObjectURL(objectUrl)
  }
}

export async function uploadFileToBucket(
  bucket: string,
  file: File,
  folder: string
): Promise<string> {
  const optimizedFile = await optimizeImage(file)

  const safeName = optimizedFile.name
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9._-]/g, '')

  const storagePath = `${folder}/${Date.now()}-${safeName}`

  const { data, error } = await supabase.storage.from(bucket).upload(
    storagePath,
    optimizedFile,
    {
      upsert: true,
      contentType: 'image/webp',
    }
  )

  if (error) {
    throw new Error(error.message)
  }

  return data?.path ?? storagePath
}

export async function deleteFileFromBucket(
  bucket: string,
  pathOrUrl: string | null | undefined
): Promise<void> {
  const storagePath = getStoragePathFromUrl(pathOrUrl)

  if (!storagePath) {
    return
  }

  const { error } = await supabase.storage.from(bucket).remove([storagePath])

  if (error) {
    throw new Error(error.message)
  }
}

export function resolvePublicUrl(bucket: string, path: string | null | undefined): string {
  if (!path) {
    return ''
  }

  if (path.startsWith('http')) {
    return path
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(path)

  return data.publicUrl || ''
}
