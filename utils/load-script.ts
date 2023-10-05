function createTag(src: string) {
  const script = document.createElement('script')
  script.type = 'text/javascript'
  // script.async = true
  script.src = src
  return script
}

function waitingLoaded(script: HTMLScriptElement) {
  return new Promise((resolve, reject) => {
    script.addEventListener('error', reject)
    script.addEventListener('abort', reject)
    script.addEventListener('load', function loadScriptHandler() {
      script.setAttribute('data-loaded', '')
      resolve(() => removeScript(script))
    })
  })
}

export function removeScript(
  scriptOrSrc: HTMLScriptElement | string,
  e?: HTMLElement
) {
  let script

  if (typeof scriptOrSrc === 'string') {
    script = e
      ? e.querySelector(`script[src="${scriptOrSrc}"]`)
      : document.querySelector(`script[src="${scriptOrSrc}"]`)
  } else {
    script = scriptOrSrc
  }
  if (script && script.parentElement) script.parentElement.removeChild(script)
}

export async function loadScript(src: string, e?: HTMLElement) {
  let script = document.querySelector(
    `script[src="${src}"]`
  ) as HTMLScriptElement | null
  if (script && script.hasAttribute('data-loaded')) {
    return () => removeScript(script!)
  }

  script = createTag(src)
  e ? e.appendChild(script) : document.head.appendChild(script)
  const fn = await waitingLoaded(script)
  return fn
}
