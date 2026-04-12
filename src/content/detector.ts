import type { DetectedField, UserConfig } from '../shared/types'
import { detectFields as runDetection, countFields } from '../shared/heuristics'

export { countFields }

export function detectFields(config: UserConfig): DetectedField[] {
  return runDetection(config)
}
