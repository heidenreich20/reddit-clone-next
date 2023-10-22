'use client'
import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useParams } from 'next/navigation'
import PostCard from '@/components/PostCard'
import ExtraInfo from '@/components/ExtraInfo'
import Image from 'next/image'

const CommunityPosts = ({ session }) => {
  const noImage = 'https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg'
  const supabase = createClientComponentClient()
  const { community } = useParams()
  const [communityData, setCommunityData] = useState()
  const [posts, setPosts] = useState([])

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data: posts, error } = await supabase
          .from('posts')
          .select()
          .eq('community_name', community)
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

  useEffect(() => {
    const fetchCommunity = async () => {
      try {
        const { data, error } = await supabase
          .from('communities')
          .select()
          .eq('community_name', community)
          .single()
        if (error) {
          console.error('Error fetching posts:', error)
        } else {
          setCommunityData(data)
        }
      } catch (error) {
        console.error('Error fetching posts:', error)
      }
    }
    fetchCommunity()
  }, [community])

  return (
    <div className='flex flex-col gap-6'>
      <div className='relative w-full h-56'>
        <Image className='w-full absolute object-cover' alt='community banner' fill src='https://media.istockphoto.com/id/1369150014/vector/breaking-news-with-world-map-background-vector.jpg?s=612x612&w=0&k=20&c=9pR2-nDBhb7cOvvZU_VdgkMmPJXrBQ4rB1AkTXxRIKM=' />
      </div>
      <div className='flex pl-6 gap-3 items-center'>
        <Image className='rounded-full aspect-square' alt='community icon' width={56} height={56} src={communityData?.community_icon || noImage} />
        <h1 className='text-3xl font-semibold text-white'>{`${communityData?.community_name} - ${communityData?.subtitle}`}</h1>
      </div>
      <div className='flex gap-6 px-6'>
        <ul className='flex flex-col gap-2'>
          {posts.map((post) => (
            <PostCard
              key={post.post_id}
              postId={post.post_id}
              title={post.title}
              image={post.image}
              username={post.author_name}
              community={post.community_name}
              date={post.created_at}
              upvotes={post.upvotes}
              downvotes={post.downvotes}
              session={session}
            />
          ))}
        </ul>
        <ExtraInfo session={session} params={community} supabase={supabase} />
      </div>
    </div>
  )
}

export default CommunityPosts
