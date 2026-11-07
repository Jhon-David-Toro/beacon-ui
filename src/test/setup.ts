import '@fontsource-variable/bricolage-grotesque'
import '@fontsource-variable/schibsted-grotesk'
import '../design-system/styles/tokens.scss'
import { afterEach } from 'vitest'

afterEach(() => {
  document.body.replaceChildren()
})
