'use client'
import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useParams } from 'next/navigation'
import PostCard from '@/components/PostCard'
import ExtraInfo from '@/components/ExtraInfo'
import CommunityIcon from '@/components/CommunityIcon'
import CommunityBanner from '@/components/CommunityBanner'
import CommunityDashboard from '@/components/CommunityDashboard'

const CommunityPosts = ({ session }) => {
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
    <div className='flex flex-col gap-2 pb-5'>
      {communityData
        ? (
          <>
            <CommunityBanner supabase={supabase} title={communityData?.community_name} banner={`${communityData?.community_name}/${communityData?.community_banner}`} />
            <div className='mx-6'>
              <CommunityIcon supabase={supabase} title={communityData?.community_name} subtitle={communityData?.subtitle} url={`${communityData?.community_name}/${communityData?.community_icon}`} />
            </div>
          </>
          )
        : (<div className='w-full h-56 bg-neutral-700 animate-pulse' />)}
      <CommunityDashboard communityToPost={community} />
      <div className='flex justify-between gap-6 px-6'>
        {posts.length > 0
          ? (
            <ul className='flex w-full flex-col gap-2'>
              {posts.map((post) => (
                <PostCard
                  key={post.post_id}
                  postId={post.post_id}
                  title={post.title}
                  image={post.image}
                  body={post.body}
                  route={`/c/${post.community_name}/${post.post_id}`}
                  username={post.author_name}
                  community={post.community_name}
                  date={post.created_at}
                  upvotes={post.upvotes}
                  downvotes={post.downvotes}
                  authorId={post.author_id}
                  session={session}
                />
              ))}
            </ul>
            )
          : (<div className='flex justify-center items-center w-full text-white bg-neutral-900 rounded-lg border border-neutral-600'>No posts found</div>)}
        <ExtraInfo session={session} params={community} supabase={supabase} />
      </div>
    </div>
  )
}

export default CommunityPosts
