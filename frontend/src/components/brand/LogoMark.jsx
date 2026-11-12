export default function LogoMark({ size = 40, className = '' }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="48" height="48" rx="15" fill="var(--color-primary)" />
      <path
        d="M12 17.5C18.6 11.6 29.4 11.6 36 17.5M16.5 22C20.8 18.2 27.2 18.2 31.5 22M21 26.5C22.7 25 25.3 25 27 26.5"
        stroke="white"
        strokeWidth="2.8"
        strokeLinecap="round"
      />
      <path
        d="M15.5 34.5L20.2 29.9C21.5 28.6 23.6 28.6 24.9 29.9L27.4 32.4C28.7 33.7 30.8 33.7 32.1 32.4L34 30.5"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="24" cy="27.5" r="1.5" fill="white" />
    </svg>
  )
}