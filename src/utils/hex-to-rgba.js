function hexToRgba (hex, alpha) {
  // Remove the '#' character from the hex string
  hex = hex.replace('#', '')

  // Split the hex string into red, green, and blue components
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)

  // Create the RGBA string using the red, green, blue, and alpha values
  const rgba = 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')'

  // Return the RGBA string
  return rgba
}

export { hexToRgba }
