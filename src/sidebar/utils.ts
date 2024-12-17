// src/sidebar/utils.ts
export const formatDate = (date: Date): string => {
  return date.toISOString().slice(0, 10)
}

export function toggleVisibility(elementId: string, isVisible: boolean) {
  const element = document.querySelector(`#${elementId}`)
  if (element) {
    element.classList.toggle('hidden', !isVisible)
  }
}
