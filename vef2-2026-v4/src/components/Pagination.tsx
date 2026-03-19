type Props = {
    offset: number
    limit: number
    total: number
    onPrev: () => void
    onNext: () => void
  }
  
  export default function Pagination({ offset, limit, total, onPrev, onNext }: Props) {
    const hasPrev = offset > 0
    const hasNext = offset + limit < total
  
    return (
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 12 }}>
        <button disabled={!hasPrev} onClick={onPrev}>
          prev
        </button>
        <button disabled={!hasNext} onClick={onNext}>
          next
        </button>
        <span>
          offset={offset} limit={limit} total={total}
        </span>
      </div>
    )
  }