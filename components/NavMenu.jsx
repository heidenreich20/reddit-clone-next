import { useRef, useState } from 'react'
import SubSelector from '@/components/SubSelector'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useOnClickOutside } from 'usehooks-ts'
import Link from 'next/link'

const NavMenu = ({ session, getSubedCommunities, subedCommunities }) => {
  const supabase = createClientComponentClient()
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef(null)
  const user = session?.user

  const handleClickOutside = () => {
    setIsOpen(false)
  }

  const handleClickInside = () => {
    if (isOpen) {
      setIsOpen(false)
    } else if (!isOpen) {
      setIsOpen(true)
      getSubedCommunities()
    }
  }

  useOnClickOutside(ref, handleClickOutside)

  return (
    <div ref={ref} className={`${isOpen ? 'rounded-t-lg' : 'rounded-lg'} bg-neutral-800 relative flex w-48 sm:w-56 justify-between items-center`}>
      <div className='flex justify-between gap-3 w-full px-3 py-2'>
        <Link onClick={() => setIsOpen(false)} aria-label='Go to main page' className='' href='/'>
          <svg className='h-6 fill-neutral-100 icon flat-color' fill='inherit' viewBox='0 0 24 24' id='home-alt-3' data-name='Flat Color' xmlns='http://www.w3.org/2000/svg'><path id='primary' d='M21.71,11.29l-9-9a1,1,0,0,0-1.42,0l-9,9a1,1,0,0,0-.21,1.09A1,1,0,0,0,3,13H4v7.3A1.77,1.77,0,0,0,5.83,22H8.5a1,1,0,0,0,1-1V16.1a1,1,0,0,1,1-1h3a1,1,0,0,1,1,1V21a1,1,0,0,0,1,1h2.67A1.77,1.77,0,0,0,20,20.3V13h1a1,1,0,0,0,.92-.62A1,1,0,0,0,21.71,11.29Z' /></svg>
        </Link>
        <button aria-label='Open menu' onClick={handleClickInside} className={`${isOpen ? 'rounded-t-lg' : 'rounded-lg'} flex w-full items-center gap-3 justify-between text-white`}>
          <p className='font-semibold text-neutral-100'>Menu</p>
          <svg className={`${isOpen ? 'rotate-180' : 'rotate-0'} transition-transform duration-75 ease-linear w-6 stroke-neutral-100 fill-neutral-100`} viewBox='0 0 24 24' fill='inherit' xmlns='http://www.w3.org/2000/svg'><g id='SVGRepo_bgCarrier' strokeWidth='0' /><g id='SVGRepo_tracerCarrier' strokeLinecap='round' strokeLinejoin='round' /><g id='SVGRepo_iconCarrier'> <path fillRule='evenodd' clipRule='evenodd' d='M4.29289 8.29289C4.68342 7.90237 5.31658 7.90237 5.70711 8.29289L12 14.5858L18.2929 8.29289C18.6834 7.90237 19.3166 7.90237 19.7071 8.29289C20.0976 8.68342 20.0976 9.31658 19.7071 9.70711L12.7071 16.7071C12.3166 17.0976 11.6834 17.0976 11.2929 16.7071L4.29289 9.70711C3.90237 9.31658 3.90237 8.68342 4.29289 8.29289Z' fill='inherit' /> </g></svg>
        </button>
      </div>
      <div className={`${isOpen ? 'block' : 'hidden'} top-[100%] absolute rounded-b-lg border-neutral-500 border-t bg-neutral-800 w-full font-bold text-white`}>
        <div className='border-b border-neutral-500'>
          <p className='pl-3'>Favorites</p>
          {subedCommunities
            ?.filter((sub) => sub.is_favorite) // Filter only the elements with is_favorite true
            .map((sub) => (
              <SubSelector
                key={sub.community_id}
                isFavorite={sub.is_favorite}
                supabase={supabase}
                name={sub.community_name}
                url={`${sub.community_name}/${sub.community_icon}`}
                communityId={sub.community_id}
                user={user}
              />
            ))}
        </div>
        {subedCommunities?.map((sub) => (
          <SubSelector key={sub.community_id} communityId={sub.community_id} user={user} isFavorite={sub.is_favorite} supabase={supabase} name={sub.community_name} url={`${sub.community_name}/${sub.community_icon}`} />
        ))}
      </div>
    </div>
  )
}

export default NavMenu
