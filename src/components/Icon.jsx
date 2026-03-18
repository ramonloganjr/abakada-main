import { getIconPath } from '../lib/icons'

export default function Icon({ name, collection = 'category', size = 24, className = '', ...props }) {
  const path = getIconPath(name, collection)
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
      dangerouslySetInnerHTML={{ __html: path }}
      {...props}
    />
  )
}
