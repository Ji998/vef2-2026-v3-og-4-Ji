type Props = {
    message?: string
  }
  
  export default function ErrorMessage({ message }: Props) {
    if (!message) return null
    return <p style={{ color: 'crimson' }}>{message}</p>
  }