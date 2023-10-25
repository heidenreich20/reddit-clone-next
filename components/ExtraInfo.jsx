'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const ExtraInfo = ({ supabase, session, params }) => {
  const { push } = useRouter()
  const [isSubbed, setIsSubbed] = useState(false)
  const [community, setCommunity] = useState(false)
  const [subCount, setSubCount] = useState('loading...')
  const user = session?.user

  const checkSubscription = (subbedCommunities, communityId) => {
    return subbedCommunities.some(sub => sub.community_id === communityId)
  }

  const fetchSubs = async (communityId, user, setIsSubbed) => {
    if (user) {
      try {
        const { data, error } = await supabase
          .from('subbed_communities')
          .select()
          .eq('user_id', user.id)
          .eq('community_id', communityId)
        if (error) {
          console.error('Error fetching subbed communities:', error)
          return
        }
        setIsSubbed((prevIsSubbed) => checkSubscription(data, communityId))
      } catch (error) {
        console.error('Unexpected error:', error)
      }
    }
  }

  useEffect(() => {
    const fetchCommunity = async () => {
      try {
        const { data, error } = await supabase
          .from('communities')
          .select()
          .eq('community_name', params)
          .single()

        if (error) {
          console.error('Error fetching community:', error)
          return
        }

        if (data) {
          setCommunity(data)
          setSubCount(data.sub_count)
          fetchSubs(data.id, user, setIsSubbed)
        }
      } catch (error) {
        console.error('Unexpected error:', error)
      }
    }
    fetchCommunity()
  }, [])

  const subCommunity = async () => {
    if (!isSubbed && user) {
      const { error: subError } = await supabase
        .from('subbed_communities')
        .upsert({
          community_id: community.id,
          community_name: community.community_name,
          user_id: user.id,
          community_icon: community.community_icon
        })
        .eq('community_id', community.id)
      if (subError) {
        console.log(subError)
      }
      setIsSubbed(true)
      setSubCount(subCount + 1)
    } else {
      push('/login')
    }
  }

  const unsubCommunity = async () => {
    if (isSubbed) {
      const { error: subError } = await supabase
        .from('subbed_communities')
        .delete()
        .eq('user_id', user.id)
      if (subError) {
        console.log(subError)
      }
      setIsSubbed(false)
      setSubCount(subCount - 1)
    }
  }

  return (
    <div className='bg-neutral-900 hidden lg:flex flex-col gap-3 text-white w-1/3 p-5 rounded-lg border border-neutral-600 h-full'>
      <strong className='text-xs text-neutral-500'>About this community</strong>
      <div className='flex xl:flex-row flex-col justify-between'>
        <h2>{community?.community_name}</h2>
        <p>{`We are ${subCount} ${community.sub_title}`}</p>
      </div>
      {isSubbed
        ? (<button onClick={unsubCommunity} className='bg-neutral-300 p-2 rounded-full font-bold text-xs text-black'>Leave community</button>)
        : (<button onClick={subCommunity} className='bg-neutral-300 p-2 rounded-full font-bold text-xs text-black'>Join community</button>)}
    </div>
  )
}

export default ExtraInfo
