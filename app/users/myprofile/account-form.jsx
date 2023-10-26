'use client'
import { usePathname } from 'next/navigation'

import PostCard from '@/components/PostCard'
import Link from 'next/link'

export default function AccountForm ({ session, posts }) {
  const pathname = usePathname()

  return (
    <div className='hidden sm:flex w-2/3 bg-neutral-700'>
      <div className=' gap-2 p-4 sm:flex flex-col lg:col-span-6 col-span-4'>
        <div className='flex gap-3 w-full bg-neutral-800 p-2 rounded-lg'>
          <Link className={`${pathname === '/users/myprofile/posts' ? 'bg-neutral-500 linkActive' : 'bg-neutral-600'} relative box-content text-center rounded-md px-2 w-32 py-1 font-semibold text-white`} href='/users/myprofile/posts'>Posts</Link>
          <Link className={`${pathname === '/users/myprofile/comments' ? 'bg-neutral-500 linkActive' : 'bg-neutral-600'} relative box-content text-center rounded-md px-2 w-32 py-1 font-semibold text-white`} href='/users/myprofile/comments'>Comments</Link>
        </div>
        <ul className='flex flex-col gap-2'>
          {posts?.map((post) => (
            <PostCard key={post.post_id} body={post.body} session={session} route={`/c/${post.community_name}/${post.post_id}`} postId={post.post_id} title={post.title} image={post.image} username={post.author_name} community={post.community_name} date={post.created_at} upvotes={post.upvotes} downvotes={post.downvotes} />
          ))}
        </ul>
      </div>
    </div>
  )
}
