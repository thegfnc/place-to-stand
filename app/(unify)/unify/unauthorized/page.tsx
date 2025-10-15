export default function UnauthorizedPage() {
  return (
    <div className='flex min-h-screen items-center justify-center bg-slate-950 px-6 py-12 text-slate-100'>
      <div className='w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900/70 p-10 text-center shadow-xl shadow-slate-950/40 backdrop-blur'>
        <h1 className='font-headline text-3xl text-white'>Access restricted</h1>
        <p className='mt-4 text-sm text-slate-400'>
          You do not have permission to view this area. If you believe this is a
          mistake, reach out to an administrator for assistance.
        </p>
      </div>
    </div>
  )
}
