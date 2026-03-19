import { Link } from 'react-router-dom'

type Props = {
  manageLabel?: string
}

export default function NavBar({ manageLabel = 'Create' }: Props) {
  return (
    <nav style={{ display: 'flex', gap: 12 }}>
      <Link to="/">Home</Link>
      
      <Link to="/manage">{manageLabel}</Link>
    </nav>
  )
}