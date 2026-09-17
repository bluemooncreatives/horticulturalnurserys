// Same-page "#id" links only scroll natively when the URL hash actually
// changes. Click one, scroll away, click it again (hash is already set) and
// the browser does nothing - which is exactly the "second click is dead"
// bug this fixes. We drive the scroll ourselves instead of relying on the
// browser/Next.js hash-change behaviour, so every click scrolls regardless
// of the current hash.
export function handleAnchorClick(event, href) {
  if (!href?.startsWith('#') || href.length < 2) return

  const target = document.getElementById(href.slice(1))
  if (!target) return

  event.preventDefault()
  target.scrollIntoView({ behavior: 'smooth', block: 'start' })

  if (window.location.hash !== href) {
    window.history.pushState(null, '', href)
  }
}
