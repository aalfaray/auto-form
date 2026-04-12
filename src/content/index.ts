import type { UserConfig } from '../shared/types'
import { getConfig } from '../shared/storage'
import { countFields } from './detector'
import { fillFields, clearAllFields } from './filler'
import { injectFloatingButton, removeFloatingButton } from './floating-button'

async function init() {
  const config = await getConfig()

  if (config.showFloatingButton) {
    injectFloatingButton()
  }

  chrome.runtime.sendMessage({
    type: 'FIELDS_DETECTED',
    payload: { count: countFields() },
  })
}

init()

let observer: MutationObserver | null = null

function startObserver() {
  if (observer) return

  let debounceTimer: ReturnType<typeof setTimeout>
  observer = new MutationObserver(() => {
    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => {
      chrome.runtime.sendMessage({
        type: 'FIELDS_DETECTED',
        payload: { count: countFields() },
      })
    }, 500)
  })

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  })
}

startObserver()

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === 'AUTOFILL_REQUEST') {
    ;(async () => {
      try {
        const config = await getConfig()
        const result = fillFields(config)
        sendResponse(result)
      } catch (error) {
        sendResponse({
          success: false,
          filled: 0,
          skipped: 0,
          errors: [
            {
              selector: 'unknown',
              reason: error instanceof Error ? error.message : 'Unknown error',
            },
          ],
        })
      }
    })()
    return true
  }

  if (message.type === 'CLEAR_FIELDS') {
    const count = clearAllFields()
    sendResponse({ cleared: count })
    return true
  }

  if (message.type === 'GET_FIELDS_COUNT') {
    sendResponse({ count: countFields() })
    return true
  }

  if (message.type === 'CONFIG_UPDATED') {
    ;(async () => {
      const config = message.payload as UserConfig
      if (config.showFloatingButton) {
        injectFloatingButton()
      } else {
        removeFloatingButton()
      }
      sendResponse({ ok: true })
    })()
    return true
  }

  return false
})
