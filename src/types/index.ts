export type Service = {
  id: string
  name: string
  description: string
  category: string
  image_url?: string | null
  created_at?: string
  updated_at?: string
}

export type PortfolioItem = {
  id: string
  title: string
  description: string | null
  image_url: string
  storage_path: string
  category: string | null
  created_at?: string
  updated_at?: string
}

export type InquiryStatus =
  | 'NEW'
  | 'CONTACTED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED'

export type Inquiry = {
  id: string
  name: string
  email: string | null
  phone: string | null
  message: string
  service_id: string | null
  preferred_contact: string | null
  reference_image_url: string | null
  status: InquiryStatus
  created_at?: string
  updated_at?: string
  services?: {
    name?: string | null
  } | null
}

export type BusinessSettings = {
  id?: string
  business_name: string
  description: string | null
  phone: string | null
  whatsapp: string | null
  email: string | null
  address: string | null
  opening_hours: string | null
  social_links?: Record<string, string> | null
  updated_at?: string
}

export type AboutContent = {
  id?: string
  heading: string
  content: string
  image_url?: string | null
  created_at?: string
  updated_at?: string
}
