import type { CSSProperties } from 'react'

const LOGOS: Record<string, string> = {
  Google: '/company-logos/google.svg',
  Meta: '/company-logos/meta.svg',
  Amazon: '/company-logos/amazon.svg',
  Apple: '/company-logos/apple.svg',
  Microsoft: '/company-logos/microsoft.svg',
  Goldman: '/company-logos/goldman-sachs.svg',
  'Goldman Sachs': '/company-logos/goldman-sachs.svg',
}

const MARKS: Record<string, string> = {
  Infosys: 'i', Bloomberg: 'B', TCS: 'T', Wipro: 'W', Intuit: 'in',
}

interface Props {
  company: string
  showName?: boolean
  className?: string
  style?: CSSProperties
}

export default function CompanyLogo({ company, showName = true, className = '', style }: Props) {
  const source = LOGOS[company]
  return (
    <span className={`company-logo ${className}`} title={company} style={style}>
      {source ? <img src={source} alt={`${company} logo`} /> : <span className="company-logo-fallback">{MARKS[company] || company.slice(0, 2).toUpperCase()}</span>}
      {showName && <span>{company}</span>}
    </span>
  )
}
