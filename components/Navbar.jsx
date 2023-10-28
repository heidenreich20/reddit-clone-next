'use client'
import { useCallback, useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import NavMenu from '@/components/NavMenu'
import { useOnClickOutside } from 'usehooks-ts'

const Navbar = ({ session }) => {
  const ref = useRef()
  const supabase = createClientComponentClient()
  const noImage = 'https://precisionpharmacy.net/wp-content/themes/apexclinic/images/no-image/No-Image-Found-400x264.png'
  const [loading, setLoading] = useState(true)
  const [subedCommunities, setSubbedCommunities] = useState(null)
  const [avatarUrl, setAvatarUrl] = useState(null)
  const [isProfileOpen, setIsProfileOpen] = useState(null)
  const [avatar, setAvatar] = useState(null)
  const [username, setUsername] = useState(null)
  const user = session?.user

  const getSubedCommunities = async () => {
    if (session) {
      try {
        const { data, error, status } = await supabase
          .from('subbed_communities')
          .select()
          .eq('user_id', user?.id)

        if (error && status !== 406) {
          throw error
        }

        if (data) {
          setSubbedCommunities(data)
        }
      } catch (error) {
        console.log(error?.message)
      }
    }
  }

  const getProfile = useCallback(async () => {
    if (session) {
      try {
        setLoading(true)

        const { data, error, status } = await supabase
          .from('profiles')
          .select('username, avatar_url')
          .eq('id', user?.id)
          .single()

        if (error && status !== 406) {
          throw error
        }

        if (data) {
          setUsername(data.username)
          setAvatarUrl(data.avatar_url)
        }
      } catch (error) {
        console.log(error.message)
      } finally {
        setLoading(false)
      }
    }
  }, [user, supabase])

  useEffect(() => {
    getProfile()
  }, [user, getProfile, supabase])

  useEffect(() => {
    async function downloadImage (path) {
      try {
        const { data, error } = await supabase.storage.from('avatars').download(path)
        if (error) {
          throw error
        }
        const url = URL.createObjectURL(data)
        setAvatar(url)
      } catch (error) {
        console.log('Error downloading image: ', error)
      }
    }

    if (avatarUrl) downloadImage(avatarUrl)
  }, [avatarUrl, supabase])

  const handleClickOutside = () => {
    setIsProfileOpen(false)
  }

  const handleClickInside = () => {
    setIsProfileOpen(!isProfileOpen)
  }

  useOnClickOutside(ref, handleClickOutside)

  return (
    <nav className='flex top-0 sticky z-20 m-auto items-center md:justify-between justify-between md:gap-24 gap-3 py-2 px-4 sm:px-8 bg-neutral-900'>
      <div className='flex gap-12'>
        <section className='flex items-center gap-4'>
          <div className='rounded-full w-fit p-1.5 bg-purple-700'>
            <svg className='w-6 stroke-white fill-white' viewBox='0 0 24 24' fill='inherit' xmlns='http://www.w3.org/2000/svg'><g id='SVGRepo_bgCarrier' strokeWidth='0' /><g id='SVGRepo_tracerCarrier' strokeLinecap='round' strokeLinejoin='round' /><g id='SVGRepo_iconCarrier'> <path d='M9 15C8.44771 15 8 15.4477 8 16C8 16.5523 8.44771 17 9 17C9.55229 17 10 16.5523 10 16C10 15.4477 9.55229 15 9 15Z' fill='inherit' /><path d='M14 16C14 15.4477 14.4477 15 15 15C15.5523 15 16 15.4477 16 16C16 16.5523 15.5523 17 15 17C14.4477 17 14 16.5523 14 16Z' fill='inherit' /> <path fillRule='evenodd' clipRule='evenodd' d='M12 1C10.8954 1 10 1.89543 10 3C10 3.74028 10.4022 4.38663 11 4.73244V7H6C4.34315 7 3 8.34315 3 10V20C3 21.6569 4.34315 23 6 23H18C19.6569 23 21 21.6569 21 20V10C21 8.34315 19.6569 7 18 7H13V4.73244C13.5978 4.38663 14 3.74028 14 3C14 1.89543 13.1046 1 12 1ZM5 10C5 9.44772 5.44772 9 6 9H7.38197L8.82918 11.8944C9.16796 12.572 9.86049 13 10.618 13H13.382C14.1395 13 14.832 12.572 15.1708 11.8944L16.618 9H18C18.5523 9 19 9.44772 19 10V20C19 20.5523 18.5523 21 18 21H6C5.44772 21 5 20.5523 5 20V10ZM13.382 11L14.382 9H9.61803L10.618 11H13.382Z' fill='inherit' /><path d='M1 14C0.447715 14 0 14.4477 0 15V17C0 17.5523 0.447715 18 1 18C1.55228 18 2 17.5523 2 17V15C2 14.4477 1.55228 14 1 14Z' fill='inherit' /><path d='M22 15C22 14.4477 22.4477 14 23 14C23.5523 14 24 14.4477 24 15V17C24 17.5523 23.5523 18 23 18C22.4477 18 22 17.5523 22 17V15Z' fill='inherit' /></g></svg>
          </div>
          <NavMenu subedCommunities={subedCommunities} getSubedCommunities={getSubedCommunities} session={session} />
        </section>

      </div>
      {user && !loading
        ? (
          <div className='flex text-white items-center gap-2'>
            <Link className='sm:block hidden' aria-label='Go to your profile' href={`/users/${username}`}>{username || 'Guest'}</Link>
            <div ref={ref} onClick={handleClickInside} aria-label='Open profile menu' className='cursor-pointer relative'>
              <Image alt='avatar' className='object-cover border-2 border-purple-700 w-10 h-10 aspect-square rounded-full' width={36} height={36} src={avatar || noImage} />
              <ul ref={ref} className={`${isProfileOpen ? 'custom-show' : 'hidden'} p-2 flex flex-col gap-2 absolute right-0 bg-neutral-600 rounded-lg mt-2`}>
                <li className='break-keep w-24 text-xs font-semibold p-1 rounded transition-colors ease-linear duration-100 hover:bg-neutral-700/[0.5]'>
                  <Link href='/users/myprofile'>My profile</Link>
                </li>
                <li className='break-keep hover:bg-neutral-700 hover:outline-red-700 hover:text-red-600 transition-colors duration-150 ease-out w-24 text-xs outline outline-1 p-1 rounded-md font-semibold text-red-500 outline-red-600'>
                  <form className='text-center' action='/auth/sign-out' method='post'>
                    <button>Logout</button>
                  </form>
                </li>
              </ul>
            </div>
          </div>
          )
        : (<Link aria-label='Login' href='/login' className='py-2 px-3 bg-purple-700 font-semibold text-white flex rounded-md no-underline bg-btn-background hover:bg-btn-background-hover'>Login</Link>
          )}
    </nav>
  )
}

export default Navbar
