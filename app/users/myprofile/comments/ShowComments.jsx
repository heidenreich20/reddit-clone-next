'use client'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Comment from '@/components/Comment'

const ShowComments = ({ comments }) => {
  const pathname = usePathname()

  return (
    <div className='hidden w-2/3 p-4 sm:flex flex-col gap-2'>
      <div className='flex gap-3 w-full bg-neutral-800 p-2 rounded-lg'>
        <Link className={`${pathname === '/users/myprofile/posts' ? 'bg-neutral-500 linkActive' : 'bg-neutral-600'} relative box-content text-center rounded-md px-2 w-32 py-1 font-semibold text-white`} href='/users/myprofile/posts'>Posts</Link>
        <Link className={`${pathname === '/users/myprofile/comments' ? 'bg-neutral-500 linkActive' : 'bg-neutral-600'} relative box-content text-center rounded-md px-2 w-32 py-1 font-semibold text-white`} href='/users/myprofile/comments'>Comments</Link>
      </div>
      <ul className=''>
        {comments?.map((comment) => (
          <Comment key={comment?.id} avatarUrl={comment?.avatar_url} username={comment?.comment_owner} body={comment?.body} createdAt={comment?.created_at} authorId={comment?.author_id} />
        ))}
      </ul>
    </div>
  )
}

export default ShowComments
