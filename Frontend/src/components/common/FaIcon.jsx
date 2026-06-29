const FaIcon = ({
  icon,
  className = '',
  size,
  style,
  solid = true,
  regular = false,
  ...props
}) => {
  const prefix = regular ? 'fa-regular' : solid ? 'fa-solid' : 'fa-regular'
  const iconName = icon?.startsWith('fa-') ? icon : `fa-${icon}`
  const sizeStyle =
    size != null
      ? { fontSize: typeof size === 'number' ? `${size}px` : size }
      : {}

  return (
    <i
      className={`${prefix} ${iconName} inline-flex items-center justify-center leading-none ${className}`.trim()}
      style={{ ...sizeStyle, ...style }}
      aria-hidden="true"
      {...props}
    />
  )
}

export default FaIcon
