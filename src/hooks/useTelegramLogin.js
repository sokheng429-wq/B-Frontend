import { useEffect, useRef } from 'react'

// The bot username from @BotFather (t.me/BGroceriesbot — no "@").
const TELEGRAM_BOT_USERNAME = 'BGroceriesbot'

const WIDGET_URL = 'https://telegram.org/js/telegram-widget.js?22'

/**
 * Real Telegram sign-in for the styled "Continue with Telegram" button.
 *
 * Same pattern as the Google button: Telegram's OFFICIAL widget button (an iframe)
 * is rendered into the invisible overlay container the page attaches via
 * `telegramButtonRef`, on top of our styled pill. The user's real click lands on
 * Telegram's own button → the login popup opens.
 *
 * IMPORTANT: the widget library only scans for its `data-telegram-login` script
 * AT THE MOMENT THE LIBRARY LOADS. So we must append ONE script that carries both
 * the library URL and the data attributes (exactly as Telegram's docs show) —
 * loading the library separately first and then appending the data script would
 * never render the iframe.
 *
 * On success the widget calls the global `onTelegramAuth` with the signed auth
 * object, which we hand to `onAuth`. The backend re-verifies the HMAC-SHA256
 * signature before creating/logging in the user.
 *
 * NOTE: Telegram only renders the button for origins registered via /setdomain in
 * @BotFather (bare domain, no https://, no path). localhost is never accepted.
 *
 * @param {object} options
 * @param {(telegramUser: object) => void} options.onAuth  signed widget auth object
 * @param {(error: Error) => void} [options.onError]
 */
export function useTelegramLogin({ onAuth, onError }) {
  const handlersRef = useRef({ onAuth, onError })
  const containerRef = useRef(null)

  useEffect(() => {
    handlersRef.current = { onAuth, onError }
  })

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    window.onTelegramAuth = (user) => {
      console.log('[useTelegramLogin] auth result:', user)
      if (user?.id && user?.hash) {
        handlersRef.current.onAuth(user)
      } else {
        handlersRef.current.onError?.(new Error('Telegram login was cancelled'))
      }
    }

    // StrictMode double-invokes effects in dev — clear any previous widget first.
    container.innerHTML = ''
    console.log('[useTelegramLogin] appending widget script into overlay', location.origin)
    const script = document.createElement('script')
    script.src = WIDGET_URL
    script.setAttribute('data-telegram-login', TELEGRAM_BOT_USERNAME)
    script.setAttribute('data-size', 'large')
    script.setAttribute('data-onauth', 'onTelegramAuth(user)')
    script.setAttribute('data-request-access', 'write')
    script.async = true
    container.appendChild(script)

    // After the widget has had a chance to render, report whether its iframe
    // actually appeared — this tells us if the origin is registered via /setdomain.
    const checkRender = setTimeout(() => {
      const iframe = container.querySelector('iframe')
      console.log(
        '[useTelegramLogin] widget iframe rendered:',
        iframe ? 'YES (' + iframe.getAttribute('src') + ')' : 'NO — origin not registered via /setdomain?'
      )
    }, 2500)

    return () => {
      clearTimeout(checkRender)
      delete window.onTelegramAuth
      container.innerHTML = ''
    }
  }, [])

  return { telegramButtonRef: containerRef }
}
