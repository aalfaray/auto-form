import type { DetectedField, UserConfig } from '../shared/types'
import { detectFields as runDetection, countFields } from '../shared/heuristics'

export { countFields }

/**
 * Detects all fillable form fields in the current document using the provided configuration.
 *
 * Delegates to the shared heuristics engine for field identification and classification.
 *
 * @param config - The user configuration controlling detection behavior
 * @returns An array of detected fields with their metadata and confidence scores
 */
export function detectFields(config: UserConfig): DetectedField[] {
  return runDetection(config)
}
