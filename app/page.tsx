import Dashboard from '@/components/Dashboard'
import MainBody from '@/components/MainBody'

export default async function Home () {
  return (
    <main className='flex flex-col bg-neutral-900 p-2 gap-2'>
      <section className='gap-4 grid grid-cols-6'>
        <Dashboard />
        <MainBody />
        <div className='bg-red-200'>hello world</div>
      </section>
    </main>
  )
}
