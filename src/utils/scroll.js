const HEADER_OFFSET = 80

export const scrollElementIntoView = (elementId, threshold = 0, topOffset = HEADER_OFFSET) => {
  if (!document || !window) { return }

  const shouldScroll = document.querySelector('html').scrollTop > threshold
  if (!shouldScroll) { return }

  const targetElement = document.getElementById(elementId)
  if (!targetElement) { return }

  const elementPosition = targetElement.getBoundingClientRect().top
  const offsetPosition = elementPosition + window.pageYOffset - topOffset

  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth'
  })
}
