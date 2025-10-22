export const NAV_LINKS = [
  { hash: 'services', label: 'Services' },
  { hash: 'work', label: 'Work' },
  { hash: 'how-we-work', label: 'How We Work' },
  { hash: 'team', label: 'Team' },
  { hash: 'faq', label: 'FAQ' },
  { hash: 'contact', label: 'Contact' },
]

export const hashHref = (hash: string) => ({ pathname: '/', hash })
