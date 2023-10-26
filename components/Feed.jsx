'use client'
import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Link from 'next/link'
import moment from 'moment'

const Feed = () => {
  const [feedData, setFeedData] = useState()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchFeedData = async () => {
      try {
        const { data, error } = await supabase
          .from('posts')
          .select()
          .order('created_at', { ascending: false })
          .limit(5)
        if (error) {
          throw error
        }
        setFeedData(data)
      } catch (error) {
        console.error('Error fetching feed data:', error)
        return null // Or handle the error in a different way
      }
    }
    fetchFeedData()
  }, [])

  return (
    <div className='lg:flex border border-neutral-600 p-3 rounded-lg bg-neutral-900 hidden flex-col gap-3 w-1/3'>
      {feedData?.map((feed) => {
        const timeSince = moment(feed.created_at, 'YYYYMMDD').locale('en').fromNow()
        return (
          <div className='flex flex-col gap-2 border border-neutral-800 p-2 rounded-lg' key={feed.post_id}>
            <div className='flex justify-between'>
              <Link href={`/c/${feed?.community_name}/${feed.post_id}`} className='text-white text-sm truncate font-semibold w-3/4'>{feed.title}</Link>
              <p className='text-white text-xs'>{timeSince}</p>
            </div>
            <div className='flex gap-1 text-neutral-400 text-xs'>
              <p>
                {'Posted by '}<Link className='text-white font-bold' href={`/users/${feed.author_name}`}>{feed.author_name}</Link>{' on'}
              </p>
              <Link className='text-white font-bold' href={`/c/${feed.community_name}`}>{feed.community_name}</Link>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default Feed
