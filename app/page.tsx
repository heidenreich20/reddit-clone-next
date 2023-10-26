import Dashboard from '@/components/Dashboard'
import MainBody from '@/components/MainBody'
import Feed from '@/components/Feed'

export default async function Home () {
  return (
    <main className='flex justify-center flex-col bg-neutral-800 p-6 gap-2'>
      <Dashboard />
      <section className='gap-6 flex'>
        <MainBody />
        <Feed />
      </section>
    </main>
  )
}
