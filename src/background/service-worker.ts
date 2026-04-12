chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'autoform-fill',
    title: 'Autocompletar formulario',
    contexts: ['page', 'frame', 'editable'],
  })

  chrome.contextMenus.create({
    id: 'autoform-clear',
    title: 'Limpiar campos del formulario',
    contexts: ['page', 'frame'],
  })
})

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (!tab?.id) return

  if (info.menuItemId === 'autoform-fill') {
    chrome.tabs.sendMessage(tab.id, { type: 'AUTOFILL_REQUEST' }, _response => {
      if (chrome.runtime.lastError) {
        console.warn('Auto-Form: Error sending fill request:', chrome.runtime.lastError.message)
      }
    })
  }

  if (info.menuItemId === 'autoform-clear') {
    chrome.tabs.sendMessage(tab.id, { type: 'CLEAR_FIELDS' }, _response => {
      if (chrome.runtime.lastError) {
        console.warn('Auto-Form: Error sending clear request:', chrome.runtime.lastError.message)
      }
    })
  }
})

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'FIELDS_DETECTED') {
    chrome.runtime.sendMessage(message).catch(() => {})
    sendResponse({ ok: true })
    return true
  }

  if (message.type === 'AUTOFILL_REQUEST') {
    if (sender.tab?.id) {
      chrome.tabs.sendMessage(sender.tab.id, { type: 'AUTOFILL_REQUEST' }, response => {
        if (chrome.runtime.lastError) {
          sendResponse({
            success: false,
            filled: 0,
            skipped: 0,
            errors: [
              {
                selector: 'unknown',
                reason: chrome.runtime.lastError.message || 'Content script not available',
              },
            ],
          })
        } else {
          sendResponse(response)
        }
      })
      return true
    }
  }

  return false
})

chrome.action.onClicked.addListener(tab => {
  if (!tab.id) return
  chrome.tabs.sendMessage(tab.id, { type: 'GET_FIELDS_COUNT' })
})
