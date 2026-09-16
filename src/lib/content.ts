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

export async function uploadFileToBucket(
  bucket: string,
  file: File,
  folder: string
): Promise<string> {
  const safeName = file.name.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9._-]/g, '')
  const storagePath = `${folder}/${Date.now()}-${safeName}`

  const { data, error } = await supabase.storage.from(bucket).upload(storagePath, file, {
    upsert: true,
    contentType: file.type || 'application/octet-stream',
  })

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
