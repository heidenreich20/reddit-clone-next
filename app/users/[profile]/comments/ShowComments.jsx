'use client'
import Link from 'next/link'
import Comment from '@/components/Comment'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useEffect, useState } from 'react'
import { usePathname, useParams } from 'next/navigation'

const ShowComments = () => {
  const supabase = createClientComponentClient()
  const { profile } = useParams()
  const [comments, setComments] = useState()
  const decodedUsername = decodeURIComponent(profile)
  const pathname = usePathname()
  console.log(pathname)

  useEffect(() => {
    const fetchPosts = async () => {
      const { data: comments } = await supabase
        .from('comments')
        .select()
        .eq('comment_owner', decodedUsername)
      if (comments) {
        setComments(comments)
      }
    }
    fetchPosts()
  }, [])

  return (
    <div className='hidden w-full bg-neutral-700 p-4 box-border sm:flex flex-col gap-2'>
      <div className='flex gap-3 w-full bg-neutral-800 p-2 rounded-lg'>
        <Link className={`${pathname === `/users/${profile}/posts` ? 'bg-neutral-500 linkActive' : 'bg-neutral-600'} relative box-content text-center rounded-md px-2 w-32 py-1 font-semibold text-white`} href={`/users/${decodedUsername}/posts`}>Posts</Link>
        <Link className={`${pathname === `/users/${profile}/comments` ? 'bg-neutral-500 linkActive' : 'bg-neutral-600'} relative box-content text-center rounded-md px-2 w-32 py-1 font-semibold text-white`} href={`/users/${decodedUsername}/comments`}>Comments</Link>
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
