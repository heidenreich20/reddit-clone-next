'use client'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useEffect, useState } from 'react'
import { usePathname, useParams } from 'next/navigation'

import PostCard from '@/components/PostCard'
import Link from 'next/link'

export default function ShowPosts ({ session }) {
  const supabase = createClientComponentClient()
  const { profile } = useParams()
  const [fetchedPosts, setFetchedPosts] = useState()
  const decodedUsername = decodeURIComponent(profile)
  const pathname = usePathname()
  console.log(pathname)

  useEffect(() => {
    const fetchPosts = async () => {
      const { data: posts } = await supabase
        .from('posts')
        .select()
        .eq('author_name', decodedUsername)
      if (posts) {
        setFetchedPosts(posts)
      }
    }
    fetchPosts()
  }, [])

  return (
    <div className='hidden sm:flex w-full p-4 bg-neutral-700'>
      <div className=' gap-2 sm:flex flex-col w-full'>
        <div className='flex gap-3 w-full bg-neutral-800 p-2 rounded-lg'>
          <Link className={`${pathname === `/users/${profile}/posts` ? 'bg-neutral-500 linkActive' : 'bg-neutral-600'} relative box-content text-center rounded-md px-2 w-32 py-1 font-semibold text-white`} href={`/users/${decodedUsername}/posts`}>Posts</Link>
          <Link className={`${pathname === `/users/${profile}/comments` ? 'bg-neutral-500 linkActive' : 'bg-neutral-600'} relative box-content text-center rounded-md px-2 w-32 py-1 font-semibold text-white`} href={`/users/${decodedUsername}/comments`}>Comments</Link>
        </div>
        <ul className='flex flex-col gap-2'>
          {fetchedPosts?.map((post) => (
            <PostCard key={post.post_id} session={session} body={post.body} route={`/c/${post.community_name}/${post.post_id}`} postId={post.post_id} title={post.title} image={post.image} username={post.author_name} community={post.community_name} date={post.created_at} upvotes={post.upvotes} downvotes={post.downvotes} />
          ))}
        </ul>
      </div>
    </div>
  )
}
