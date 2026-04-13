import type { UserConfig } from './types'
import { DEFAULT_CONFIG } from './constants'

const STORAGE_KEY = 'autoform_config'

/**
 * Loads the user configuration from Chrome's sync storage.
 *
 * Merges the stored configuration with {@link DEFAULT_CONFIG} to ensure all fields
 * are present even if the stored config is partial. Falls back to defaults when
 * running outside the Chrome extension environment.
 *
 * @returns A promise resolving to the complete {@link UserConfig} object
 *
 * @example
 * const config = await getConfig()
 * console.log(config.locale) // => 'es'
 */
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

/**
 * Persists a partial configuration update by merging it with the current stored config.
 *
 * Uses a shallow merge strategy: top-level keys in `config` override existing values.
 * The merged result is saved to Chrome's sync storage.
 *
 * @param config - A partial {@link UserConfig} with only the fields to update
 * @returns A promise resolving to the fully merged and saved {@link UserConfig}
 *
 * @example
 * const updated = await saveConfig({ locale: 'en', strictValidation: false })
 */
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

/**
 * Resets the user configuration back to factory defaults.
 *
 * Overwrites the stored configuration with {@link DEFAULT_CONFIG}.
 *
 * @returns A promise resolving to the fresh {@link DEFAULT_CONFIG}
 */
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
