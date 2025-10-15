interface InsightMetric {
  id: string
  label: string
  value: string
  helper?: string
  trend?: string
}

interface InsightCardsProps {
  metrics: InsightMetric[]
}

export function InsightCards({ metrics }: InsightCardsProps) {
  return (
    <section className='grid gap-4 md:grid-cols-2 xl:grid-cols-4'>
      {metrics.map(metric => (
        <div
          key={metric.id}
          className='rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-lg shadow-slate-950/10 backdrop-blur transition hover:border-slate-700'
        >
          <p className='text-xs uppercase tracking-[0.3em] text-slate-500'>
            {metric.label}
          </p>
          <p className='mt-3 font-headline text-3xl text-white'>
            {metric.value}
          </p>
          {metric.helper && (
            <p className='mt-1 text-xs text-slate-400'>{metric.helper}</p>
          )}
          {metric.trend && (
            <p className='mt-2 text-xs font-semibold text-emerald-300'>
              {metric.trend}
            </p>
          )}
        </div>
      ))}
    </section>
  )
}
