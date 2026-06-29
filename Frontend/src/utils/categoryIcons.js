export const CATEGORY_ICON_MAP = {
  Smartphones: 'mobile-screen',
  Laptops: 'laptop',
  Tablets: 'tablet-screen-button',
  Headphones: 'headphones',
  'Smart Watches': 'clock',
  Cameras: 'camera',
  Gaming: 'gamepad',
  Monitors: 'desktop',
  Accessories: 'plug',
  Audio: 'volume-high',
}

export const CATEGORY_ICON_OPTIONS = [
  { icon: 'mobile-screen', label: 'Mobile' },
  { icon: 'laptop', label: 'Laptop' },
  { icon: 'tablet-screen-button', label: 'Tablet' },
  { icon: 'headphones', label: 'Headphones' },
  { icon: 'clock', label: 'Watch' },
  { icon: 'camera', label: 'Camera' },
  { icon: 'gamepad', label: 'Gaming' },
  { icon: 'desktop', label: 'Monitor' },
  { icon: 'plug', label: 'Accessories' },
  { icon: 'volume-high', label: 'Audio' },
  { icon: 'keyboard', label: 'Keyboard' },
  { icon: 'computer-mouse', label: 'Mouse' },
  { icon: 'print', label: 'Printer' },
  { icon: 'wifi', label: 'Networking' },
  { icon: 'battery-full', label: 'Power' },
  { icon: 'hard-drive', label: 'Storage' },
]

const isFaIconName = (value) => typeof value === 'string' && /^[a-z0-9-]+$/i.test(value)

export const getCategoryIcon = (category) => {
  const icon = typeof category === 'string' ? category : category?.icon
  const name = typeof category === 'string' ? category : category?.name

  if (isFaIconName(icon)) return icon
  if (name && CATEGORY_ICON_MAP[name]) return CATEGORY_ICON_MAP[name]
  return 'box'
}
