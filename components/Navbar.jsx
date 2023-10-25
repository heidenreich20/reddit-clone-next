'use client'
import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import LogoutButton from './LogoutButton'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import SubSelector from '@/components/SubSelector'

const Navbar = ({ session }) => {
  const supabase = createClientComponentClient()
  const noImage = 'https://precisionpharmacy.net/wp-content/themes/apexclinic/images/no-image/No-Image-Found-400x264.png'
  const [loading, setLoading] = useState(true)
  const [avatarUrl, setAvatarUrl] = useState(null)
  const [avatar, setAvatar] = useState(null)
  const [subbedCommunities, setSubbedCommunities] = useState(null)
  const [username, setUsername] = useState(null)
  const [isOpen, setIsOpen] = useState(false)
  const user = session?.user

  const handleOpen = () => {
    if (isOpen) {
      setIsOpen(false)
    }
    if (!isOpen && subbedCommunities === null) {
      setIsOpen(true)
      getSubedCommunities()
    }
    if (!isOpen && subbedCommunities?.length > 0) {
      setIsOpen(true)
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

  const getSubedCommunities = async () => {
    if (session) {
      try {
        setLoading(true)
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
      } finally {
        setLoading(false)
      }
    }
  }

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

  return (
    <nav className='flex top-0 sticky z-20 m-auto items-center md:justify-between justify-between md:gap-24 gap-3 py-2 px-8 bg-neutral-900'>
      <div className='flex gap-12'>
        <section className='flex items-center gap-4'>
          <div className='rounded-full w-fit p-1.5 bg-purple-500'>
            <svg className='fill-white md:w-5 w-8 -translate-y-0.5' viewBox='0 0 24 24' fill='inherit' xmlns='http://www.w3.org/2000/svg'>
              <path d='M9 15C8.44771 15 8 15.4477 8 16C8 16.5523 8.44771 17 9 17C9.55229 17 10 16.5523 10 16C10 15.4477 9.55229 15 9 15Z' fill='inherit' />
              <path d='M14 16C14 15.4477 14.4477 15 15 15C15.5523 15 16 15.4477 16 16C16 16.5523 15.5523 17 15 17C14.4477 17 14 16.5523 14 16Z' fill='inherit' />
              <path fillRule='evenodd' clipRule='evenodd' d='M12 1C10.8954 1 10 1.89543 10 3C10 3.74028 10.4022 4.38663 11 4.73244V7H6C4.34315 7 3 8.34315 3 10V20C3 21.6569 4.34315 23 6 23H18C19.6569 23 21 21.6569 21 20V10C21 8.34315 19.6569 7 18 7H13V4.73244C13.5978 4.38663 14 3.74028 14 3C14 1.89543 13.1046 1 12 1ZM5 10C5 9.44772 5.44772 9 6 9H7.38197L8.82918 11.8944C9.16796 12.572 9.86049 13 10.618 13H13.382C14.1395 13 14.832 12.572 15.1708 11.8944L16.618 9H18C18.5523 9 19 9.44772 19 10V20C19 20.5523 18.5523 21 18 21H6C5.44772 21 5 20.5523 5 20V10ZM13.382 11L14.382 9H9.61803L10.618 11H13.382Z' fill='inherit' />
              <path d='M1 14C0.447715 14 0 14.4477 0 15V17C0 17.5523 0.447715 18 1 18C1.55228 18 2 17.5523 2 17V15C2 14.4477 1.55228 14 1 14Z' fill='inherit' />
              <path d='M22 15C22 14.4477 22.4477 14 23 14C23.5523 14 24 14.4477 24 15V17C24 17.5523 23.5523 18 23 18C22.4477 18 22 17.5523 22 17V15Z' fill='inherit' />
            </svg>
          </div>
          <div className={`${isOpen ? 'rounded-t-lg' : 'rounded-lg'} bg-neutral-800 relative flex w-56 justify-between items-center`}>
            <div className='flex justify-between w-full px-3 py-2'>
              <Link className='' href='/'>
                <svg className='h-6 fill-white icon flat-color' fill='inherit' viewBox='0 0 24 24' id='home-alt-3' data-name='Flat Color' xmlns='http://www.w3.org/2000/svg'><path id='primary' d='M21.71,11.29l-9-9a1,1,0,0,0-1.42,0l-9,9a1,1,0,0,0-.21,1.09A1,1,0,0,0,3,13H4v7.3A1.77,1.77,0,0,0,5.83,22H8.5a1,1,0,0,0,1-1V16.1a1,1,0,0,1,1-1h3a1,1,0,0,1,1,1V21a1,1,0,0,0,1,1h2.67A1.77,1.77,0,0,0,20,20.3V13h1a1,1,0,0,0,.92-.62A1,1,0,0,0,21.71,11.29Z' /></svg>
              </Link>
              <button onClick={handleOpen} className={`${isOpen ? 'rounded-t-lg' : 'rounded-lg'} text-white`}>Principal </button>
              <button onClick={handleOpen} className='text-white font-bold right-0 rotate-90'>&#62;</button>
            </div>
            <div className={`${isOpen ? 'block' : 'hidden'} top-[100%] absolute rounded-b-lg border-neutral-500 border-t bg-neutral-800 w-full font-bold text-white`}>
              <div className='border-b border-neutral-500'>
                <p className='pl-3'>Favorites</p>
                {subbedCommunities
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
              {subbedCommunities?.map((sub) => (
                <SubSelector key={sub.community_id} communityId={sub.community_id} user={user} isFavorite={sub.is_favorite} supabase={supabase} name={sub.community_name} url={`${sub.community_name}/${sub.community_icon}`} />
              ))}
            </div>
          </div>
        </section>

      </div>
      {user && !loading
        ? (
          <div className='flex text-white items-center gap-2'>
            <Link href={`/users/${username}`}>{username || 'Guest'}</Link>
            <Image alt='avatar' className='object-cover aspect-square rounded-full' width={36} height={36} src={avatar || noImage} />
            <LogoutButton />
          </div>
          )
        : (<Link href='/login' className='py-2 px-3 bg-purple-500 font-semibold text-white flex rounded-md no-underline bg-btn-background hover:bg-btn-background-hover'>Login</Link>
          )}
    </nav>
  )
}

export default Navbar
