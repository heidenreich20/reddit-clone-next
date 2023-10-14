'use client'
import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useParams } from 'next/navigation'
import PostCard from '@/components/PostCard'

const Page = () => {
  const supabase = createClientComponentClient()
  const { community } = useParams()
  const [posts, setPosts] = useState([])

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data: posts, error } = await supabase
          .from('posts')
          .select()
          .eq('community', community)

        if (error) {
          console.error('Error fetching posts:', error)
        } else {
          setPosts(posts)
        }
      } catch (error) {
        console.error('Error fetching posts:', error)
      }
    }

    fetchPosts()
  }, [community])

  return (
    <div className='flex flex-col bg-neutral-900 p-2 gap-2'>
      <div className='gap-12 grid grid-cols-6'>
        <div className='col-span-6 md:col-span-4'>
          <ul className='flex flex-col gap-2'>
            {posts.map((post) => (
              <PostCard
                key={post.post_id}
                post_id={post.post_id}
                title={post.title}
                image={post.image}
                user={post.author_name}
                community={post.community}
              />
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Page
