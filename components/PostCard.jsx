import Image from 'next/image'
const notFound = 'data:image/jpeg;base64,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'

const PostCard = ({ title, image, comments, votes, user }) => {
  return (
    <div className='flex border-b p-2 border-neutral-600 flex-col md:flex-row'>
      <div className='flex gap-0 md:gap-6'>
        <div className='flex gap-2 items-center'>
          <div className='hidden md:block'>
            <svg className='stroke-neutral-400 w-8 cursor-pointer' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
              <path fillRule='evenodd' clipRule='evenodd' d='M12 7C12.2652 7 12.5196 7.10536 12.7071 7.29289L19.7071 14.2929C20.0976 14.6834 20.0976 15.3166 19.7071 15.7071C19.3166 16.0976 18.6834 16.0976 18.2929 15.7071L12 9.41421L5.70711 15.7071C5.31658 16.0976 4.68342 16.0976 4.29289 15.7071C3.90237 15.3166 3.90237 14.6834 4.29289 14.2929L11.2929 7.29289C11.4804 7.10536 11.7348 7 12 7Z' fill='#000000' />
            </svg>
            <p className='flex justify-center text-neutral-100'>{votes || 0}</p>
            <svg className='stroke-neutral-400 w-8 rotate-180 cursor-pointer' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
              <path fillRule='evenodd' clipRule='evenodd' d='M12 7C12.2652 7 12.5196 7.10536 12.7071 7.29289L19.7071 14.2929C20.0976 14.6834 20.0976 15.3166 19.7071 15.7071C19.3166 16.0976 18.6834 16.0976 18.2929 15.7071L12 9.41421L5.70711 15.7071C5.31658 16.0976 4.68342 16.0976 4.29289 15.7071C3.90237 15.3166 3.90237 14.6834 4.29289 14.2929L11.2929 7.29289C11.4804 7.10536 11.7348 7 12 7Z' fill='#000000' />
            </svg>
          </div>
          <div>
            <Image className='hidden md:block aspect-video object-cover rounded-lg' width={220} height={220} src={image || notFound} alt='random image' />
          </div>
        </div>
        <div className='text-white w-full flex flex-col gap-2'>
          <div className='flex gap-2 flex-col'>
            <h2 className='font-semibold font-impact'>{title}</h2>
            <div className='flex gap-1 md:items-center'>
              <div className='flex items-center gap-1'>
                <p className='font-bold font-impact text-xs'>r/pcgaming &#8226;</p>
              </div>
              <p className='text-xs text-neutral-400 font-impact'>Publicado por <a href={`users/${user}`}>{user}</a></p> 
              <p className='text-xs text-neutral-400 font-impact'>hace 8 horas</p>
            </div>
            <div className='flex gap-1 items-center'>
              <svg className='w-4 stroke-neutral-400 fill-neutral-400 stroke-2' xmlns='http://www.w3.org/2000/svg' x='0px' y='0px' viewBox='0 0 50 50'>
                <path d='M 25 4.0625 C 12.414063 4.0625 2.0625 12.925781 2.0625 24 C 2.0625 30.425781 5.625 36.09375 11 39.71875 C 10.992188 39.933594 11 40.265625 10.71875 41.3125 C 10.371094 42.605469 9.683594 44.4375 8.25 46.46875 L 7.21875 47.90625 L 9 47.9375 C 15.175781 47.964844 18.753906 43.90625 19.3125 43.25 C 21.136719 43.65625 23.035156 43.9375 25 43.9375 C 37.582031 43.9375 47.9375 35.074219 47.9375 24 C 47.9375 12.925781 37.582031 4.0625 25 4.0625 Z M 25 5.9375 C 36.714844 5.9375 46.0625 14.089844 46.0625 24 C 46.0625 33.910156 36.714844 42.0625 25 42.0625 C 22.996094 42.0625 21.050781 41.820313 19.21875 41.375 L 18.65625 41.25 L 18.28125 41.71875 C 18.28125 41.71875 15.390625 44.976563 10.78125 45.75 C 11.613281 44.257813 12.246094 42.871094 12.53125 41.8125 C 12.929688 40.332031 12.9375 39.3125 12.9375 39.3125 L 12.9375 38.8125 L 12.5 38.53125 C 7.273438 35.21875 3.9375 29.941406 3.9375 24 C 3.9375 14.089844 13.28125 5.9375 25 5.9375 Z' />
              </svg>
              <p className='text-xs text-neutral-400 font-semibold hidden md:block font-impact'>{`comments ${comments || 0}`}</p>
            </div>
          </div>
        </div>
      </div>
      <div className='flex flex-col gap-2'>
        <Image className='mt-5 md:hidden aspect-video object-cover rounded-lg' width={500} height={380} src={image || notFound} alt='random image' />
        <div className='flex items-center text-neutral-400 font-impact font-semibold gap-3 md:hidden'>
          <div className='flex'>
            <svg className='stroke-neutral-400 w-8 cursor-pointer' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
              <path fillRule='evenodd' clipRule='evenodd' d='M12 7C12.2652 7 12.5196 7.10536 12.7071 7.29289L19.7071 14.2929C20.0976 14.6834 20.0976 15.3166 19.7071 15.7071C19.3166 16.0976 18.6834 16.0976 18.2929 15.7071L12 9.41421L5.70711 15.7071C5.31658 16.0976 4.68342 16.0976 4.29289 15.7071C3.90237 15.3166 3.90237 14.6834 4.29289 14.2929L11.2929 7.29289C11.4804 7.10536 11.7348 7 12 7Z' fill='#000000' />
            </svg>
            <svg className='stroke-neutral-400 w-8 rotate-180 cursor-pointer' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
              <path fillRule='evenodd' clipRule='evenodd' d='M12 7C12.2652 7 12.5196 7.10536 12.7071 7.29289L19.7071 14.2929C20.0976 14.6834 20.0976 15.3166 19.7071 15.7071C19.3166 16.0976 18.6834 16.0976 18.2929 15.7071L12 9.41421L5.70711 15.7071C5.31658 16.0976 4.68342 16.0976 4.29289 15.7071C3.90237 15.3166 3.90237 14.6834 4.29289 14.2929L11.2929 7.29289C11.4804 7.10536 11.7348 7 12 7Z' fill='#000000' />
            </svg>
          </div>
          <div className='flex gap-2'>
            <svg className='w-4 stroke-neutral-400 fill-neutral-400 stroke-2' xmlns='http://www.w3.org/2000/svg' x='0px' y='0px' viewBox='0 0 50 50'>
              <path d='M 25 4.0625 C 12.414063 4.0625 2.0625 12.925781 2.0625 24 C 2.0625 30.425781 5.625 36.09375 11 39.71875 C 10.992188 39.933594 11 40.265625 10.71875 41.3125 C 10.371094 42.605469 9.683594 44.4375 8.25 46.46875 L 7.21875 47.90625 L 9 47.9375 C 15.175781 47.964844 18.753906 43.90625 19.3125 43.25 C 21.136719 43.65625 23.035156 43.9375 25 43.9375 C 37.582031 43.9375 47.9375 35.074219 47.9375 24 C 47.9375 12.925781 37.582031 4.0625 25 4.0625 Z M 25 5.9375 C 36.714844 5.9375 46.0625 14.089844 46.0625 24 C 46.0625 33.910156 36.714844 42.0625 25 42.0625 C 22.996094 42.0625 21.050781 41.820313 19.21875 41.375 L 18.65625 41.25 L 18.28125 41.71875 C 18.28125 41.71875 15.390625 44.976563 10.78125 45.75 C 11.613281 44.257813 12.246094 42.871094 12.53125 41.8125 C 12.929688 40.332031 12.9375 39.3125 12.9375 39.3125 L 12.9375 38.8125 L 12.5 38.53125 C 7.273438 35.21875 3.9375 29.941406 3.9375 24 C 3.9375 14.089844 13.28125 5.9375 25 5.9375 Z' />
            </svg>
            <p className='text-sm block md:hidden font-impact'>{`comments ${comments || 0}`}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostCard
