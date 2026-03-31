export interface Lead {
  id: number
  name: string
  phone: string
  city: string
  propertyType: string
  message?: string | null
  photos: string[]
  status: string
  notes?: string | null
  createdAt: Date
  updatedAt: Date
  extraFields?: Record<string, string> | null
}

export interface Service {
  id: number
  titleFr: string
  titleEn: string
  descFr: string
  descEn: string
  icon: string
  image?: string | null
  order: number
  active: boolean
}

export interface Testimonial {
  id: number
  name: string
  location: string
  textFr: string
  textEn: string
  rating: number
  avatar?: string | null
  order: number
  active: boolean
}

export interface FAQ {
  id: number
  questionFr: string
  questionEn: string
  answerFr: string
  answerEn: string
  category: string
  order: number
  active: boolean
}

export interface FormField {
  id: number
  name: string
  labelFr: string
  labelEn: string
  type: string
  required: boolean
  options?: string | null
  order: number
  active: boolean
  placeholder_fr?: string | null
  placeholder_en?: string | null
  conditionalOn?: string | null
  conditionalValue?: string | null
}

export interface SiteSettings {
  id: number
  key: string
  value: string
  category: string
}
