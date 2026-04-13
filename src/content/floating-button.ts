const BUTTON_ID = 'autoform-floating-btn'
const STYLE_ID = 'autoform-floating-style'

/**
 * Injects a floating action button into the current page for quick form autofill.
 *
 * Creates a fixed-position circular button in the bottom-right corner with the
 * Auto-Form brand color (#4285F4). Clicking the button sends an `AUTOFILL_REQUEST`
 * message to the background service worker. Includes hover and active animations.
 *
 * If the button already exists in the DOM, the function exits early without duplication.
 */
export function injectFloatingButton(): void {
  if (document.getElementById(BUTTON_ID)) return

  const style = document.createElement('style')
  style.id = STYLE_ID
  style.textContent = `
    #${BUTTON_ID} {
      position: fixed;
      bottom: 24px;
      right: 24px;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background-color: #4285F4;
      color: white;
      border: none;
      cursor: pointer;
      z-index: 2147483647;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(66, 133, 244, 0.4);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      font-size: 20px;
      line-height: 1;
      padding: 0;
    }
    #${BUTTON_ID}:hover {
      transform: scale(1.1);
      box-shadow: 0 6px 16px rgba(66, 133, 244, 0.6);
    }
    #${BUTTON_ID}:active {
      transform: scale(0.95);
    }
    #${BUTTON_ID} svg {
      width: 24px;
      height: 24px;
      fill: white;
    }
  `
  document.head.appendChild(style)

  const btn = document.createElement('button')
  btn.id = BUTTON_ID
  btn.title = 'Auto-Form: Autocompletar formulario'
  btn.innerHTML = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 2l5 5h-5V4zM8 17h8v-2H8v2zm0-4h8v-2H8v2z"/></svg>`

  btn.addEventListener('click', e => {
    e.preventDefault()
    e.stopPropagation()
    chrome.runtime.sendMessage({ type: 'AUTOFILL_REQUEST' })
  })

  document.body.appendChild(btn)
}

/**
 * Removes the floating button and its associated styles from the current page.
 *
 * Safely handles the case where the button or styles have already been removed.
 */
export function removeFloatingButton(): void {
  const btn = document.getElementById(BUTTON_ID)
  const style = document.getElementById(STYLE_ID)
  if (btn) btn.remove()
  if (style) style.remove()
}
