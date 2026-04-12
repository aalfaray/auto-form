import type { UserConfig } from './types'
import { DEFAULT_CONFIG } from './constants'

const STORAGE_KEY = 'autoform_config'

export async function getConfig(): Promise<UserConfig> {
  return new Promise(resolve => {
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.sync.get(STORAGE_KEY, result => {
        const config = result[STORAGE_KEY] as UserConfig | undefined
        resolve(config ? { ...DEFAULT_CONFIG, ...config } : { ...DEFAULT_CONFIG })
      })
    } else {
      resolve({ ...DEFAULT_CONFIG })
    }
  })
}

export async function saveConfig(config: Partial<UserConfig>): Promise<UserConfig> {
  const current = await getConfig()
  const updated = { ...current, ...config }
  return new Promise(resolve => {
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.sync.set({ [STORAGE_KEY]: updated }, () => {
        resolve(updated)
      })
    } else {
      resolve(updated)
    }
  })
}

export async function resetConfig(): Promise<UserConfig> {
  return new Promise(resolve => {
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.sync.set({ [STORAGE_KEY]: DEFAULT_CONFIG }, () => {
        resolve({ ...DEFAULT_CONFIG })
      })
    } else {
      resolve({ ...DEFAULT_CONFIG })
    }
  })
}
