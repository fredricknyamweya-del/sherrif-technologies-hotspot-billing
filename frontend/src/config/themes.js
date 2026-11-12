export const DEFAULT_PRIMARY_COLOR = '#2E9E5B'

export const THEME_STORAGE_KEYS = {
  mode: 'sikazwe-theme',
  primary: 'sikazwe-primary-color',
}

export const PRIMARY_COLOR_SWATCHES = [
  { name: 'Sherrif Green', value: DEFAULT_PRIMARY_COLOR },
  { name: 'Ocean Blue', value: '#2878B8' },
  { name: 'Royal Purple', value: '#7952B3' },
  { name: 'Sunset Orange', value: '#D97736' },
  { name: 'Berry Red', value: '#C74D5A' },
  { name: 'Forest', value: '#397A50' },
]

export function isValidHexColor(value) {
  return /^#[\da-f]{6}$/i.test(value)
}