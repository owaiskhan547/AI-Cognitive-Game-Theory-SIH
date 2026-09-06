import { isSupabaseConfigured, supabase } from '../client'
import type { Database } from '@/types/database.types'
import {
  createMemory as createPatientMemory,
  deleteMemory as deletePatientMemory,
  getCurrentPatient,
  getPatientMemories as listPatientMemories,
  resolveWritablePatientId,
} from '@/lib/services/patientService'

export type Memory = Database['public']['Tables']['memories']['Row']
export type MemoryInsert = Database['public']['Tables']['memories']['Insert']

/**
 * Service to manage patient memory album items & photo uploads.
 */
export const memoryService = {
  /**
   * Get or auto-create patient record for a given user profile ID or patient ID.
   */
  async getOrCreatePatientRecord(userId: string) {
    const id = await resolveWritablePatientId(userId)
    return { id }
  },

  /**
   * Get all memories for a specific patient.
   */
  async getPatientMemories(userId: string) {
    const patientRecord = await this.getOrCreatePatientRecord(userId)
    const targetId = patientRecord?.id || userId
    return (await listPatientMemories(targetId)) as Memory[]
  },

  /**
   * Create a new memory entry.
   */
  async createMemory(memory: MemoryInsert) {
    if (!memory.patient_id) {
      throw new Error('Patient ID is required to save a memory.')
    }

    return (await createPatientMemory(memory.patient_id, {
      title: memory.title,
      description: memory.description || undefined,
      media_url: memory.media_url,
    })) as Memory
  },

  /**
   * Delete a memory entry.
   */
  async deleteMemory(memoryId: string, patientId?: string) {
    if (!isSupabaseConfigured) {
      const current = await getCurrentPatient()
      const targetPatientId = patientId || current?.id
      if (!targetPatientId) throw new Error('Patient ID not found.')
      await deletePatientMemory(targetPatientId, memoryId)
      return
    }

    if (patientId) {
      await deletePatientMemory(patientId, memoryId)
      return
    }

    const { error } = await supabase
      .from('memories')
      .delete()
      .eq('id', memoryId)

    if (error) throw error
  },

  /**
   * Upload memory image to Supabase Storage bucket ('memories').
   * Falls back to a compressed data URL when storage is unavailable.
   */
  async uploadMemoryImage(file: File, patientId: string) {
    const compressed = await prepareMemoryMedia(file)

    if (!isSupabaseConfigured) {
      if (!compressed) {
        throw new Error('That file is too large to save in demo mode. Try a smaller photo.')
      }
      return compressed
    }

    const fileExt = file.name.split('.').pop() || (file.type.startsWith('video/') ? 'mp4' : 'jpg')
    const fileName = `${patientId}/${Date.now()}.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from('memories')
      .upload(fileName, file, { upsert: true })

    if (uploadError) {
      if (compressed) return compressed
      throw uploadError
    }

    const { data } = supabase.storage
      .from('memories')
      .getPublicUrl(fileName)

    return data.publicUrl
  }
}

const MAX_DATA_URL_CHARS = 350_000

async function prepareMemoryMedia(file: File): Promise<string | null> {
  if (file.type.startsWith('video/')) {
    if (file.size > 220_000) return null
    return readFileAsDataUrl(file)
  }

  if (!file.type.startsWith('image/')) {
    return readFileAsDataUrl(file)
  }

  try {
    return await compressImageFile(file)
  } catch {
    const raw = await readFileAsDataUrl(file)
    return raw.length > MAX_DATA_URL_CHARS ? null : raw
  }
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result as string)
    reader.onerror = () => reject(new Error('Could not read the selected file.'))
    reader.readAsDataURL(file)
  })
}

function compressImageFile(file: File, maxWidth = 1280, quality = 0.72): Promise<string> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    const objectUrl = URL.createObjectURL(file)
    image.onload = () => {
      const scale = Math.min(1, maxWidth / Math.max(1, image.width))
      const canvas = document.createElement('canvas')
      canvas.width = Math.max(1, Math.round(image.width * scale))
      canvas.height = Math.max(1, Math.round(image.height * scale))
      const context = canvas.getContext('2d')
      if (!context) {
        URL.revokeObjectURL(objectUrl)
        reject(new Error('Could not process the photo.'))
        return
      }
      context.drawImage(image, 0, 0, canvas.width, canvas.height)
      URL.revokeObjectURL(objectUrl)
      let dataUrl = canvas.toDataURL('image/jpeg', quality)
      if (dataUrl.length > MAX_DATA_URL_CHARS) {
        dataUrl = canvas.toDataURL('image/jpeg', 0.5)
      }
      resolve(dataUrl)
    }
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error('Could not read the selected photo.'))
    }
    image.src = objectUrl
  })
}
