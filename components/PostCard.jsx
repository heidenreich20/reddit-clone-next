'use client'
import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Image from 'next/image'
import Link from 'next/link'
import ConfirmPrompt from '@/components/ConfirmPrompt'
import { useRouter } from 'next/navigation'
import usePostDelection from '@/hooks/usePostDeletion'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import moment from 'moment'
require('moment/locale/es')

const PostCard = ({ title, image, authorId, session, body, voteData, version, upvotes, downvotes, route, username, community, date, postId }) => {
  const notFound = 'data:image/jpeg;base64,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'
  const [votes, setVotes] = useState(upvotes - downvotes)
  const [postToDelete, setPostToDelete] = useState(null)
  const [isOpen, setIsOpen] = useState(false)
  const [isDropOpen, setIsDropOpen] = useState(false)
  const [isUpvoted, setIsUpvoted] = useState(false)
  const [isDownvoted, setIsDownvoted] = useState(false)
  const [thumbnail, setThumbnail] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [commentCount, setCommentCount] = useState(false)
  const supabase = createClientComponentClient()
  const timeSince = moment(date, 'YYYYMMDD').fromNow()
  const router = useRouter()

  const { deletePost } = usePostDelection(supabase)

  const openConfirmPrompt = (postId) => {
    setIsOpen(true)
    setPostToDelete(postId) // Store the commentId in state
  }
  const closeConfirmPrompt = () => {
    setIsOpen(false)
  }

  // const optimisticLocking = async () => {
  //   const currentVersion = version
  //   const increaseUpvote = upvotes + 1
  //   const decreaseDownvote = downvotes - 1

  //   const newVersion = Date.now()

  //   // 4. Attempt to upvote the item
  //   const { error: updateError } = await supabase
  //     .from('posts')
  //     .update({
  //       downvotes: decreaseDownvote,
  //       upvotes: increaseUpvote,
  //       version: newVersion
  //     })
  //     .eq('post_id', postId)

  //   // 5. Handle conflicts
  //   const { versionCheck } = await supabase
  //     .from('posts')
  //     .select('version')
  //     .eq('post_id', postId)
  //   if (versionCheck !== currentVersion) {
  //     optimisticLocking()
  //   } else {
  //     console.error('Error upvoting the item:', updateError)
  //   }
  // }

  useEffect(() => {
    const getThumbnail = () => {
      const imageUrlRegex = /!\[image\]\((.*?)\)/
      const match = imageUrlRegex.exec(body)
      if (match) {
        const imageUrl = match[1]
        setThumbnail(imageUrl)
      }
    }
    getThumbnail()
  }, [])

  useEffect(() => {
    const checkVotes = () => {
      if (voteData?.post_id === postId && voteData?.vote_type === 'upvoted') {
        setIsUpvoted(true)
      } else if (voteData?.post_id === postId && voteData?.vote_type === 'downvoted') {
        setIsDownvoted(true)
      }
    }
    checkVotes()
  }, [])

  useEffect(() => {
    const fetchComments = async (postId) => {
      try {
        const { data, error } = await supabase
          .from('comments')
          .select()
          .eq('post_id', postId)
        if (error) {
          console.log(error)
        } else {
          setCommentCount(data.length)
        }
      } catch (error) {
        console.log(error)
      }
    }
    fetchComments(postId)
  }, [])

  const handleUpvote = async () => {
    if (session) {
      if (isDownvoted) {
        const reduceDownvote = downvotes - 1
        const increaseUpvote = upvotes + 1
        const { error: voteFetchError } = await supabase
          .from('posts')
          .update({
            downvotes: reduceDownvote,
            upvotes: increaseUpvote
          })
          .eq('post_id', postId)
        const { error } = await supabase
          .from('voted_posts')
          .update({
            vote_type: 'upvoted'
          })
          .eq('vote_id', session.user.id + postId)
        if (voteFetchError || error) {
          console.log(voteFetchError)
        }
        setVotes(votes + 2)
        setIsUpvoted(true)
        setIsDownvoted(false)
      } else if (!isUpvoted) {
        const newUpvote = upvotes + 1
        const { error: voteFetchError } = await supabase
          .from('posts')
          .update({
            upvotes: newUpvote
          })
          .eq('post_id', postId)
        const { error } = await supabase
          .from('voted_posts')
          .upsert({
            vote_type: 'upvoted',
            user_id: session.user.id,
            post_id: postId,
            vote_id: session.user.id + postId
          })
        if (voteFetchError || error) {
          console.log(voteFetchError)
        }
        setVotes(votes + 1)
        setIsUpvoted(true)
      } else if (isUpvoted) {
        const newUpvote = upvotes - 1
        const { error: voteFetchError } = await supabase
          .from('posts')
          .update({ upvotes: newUpvote })
          .eq('post_id', postId)
        const { error } = await supabase
          .from('voted_posts')
          .delete()
          .eq('vote_id', session.user.id + postId)
        if (voteFetchError || error) {
          console.log(voteFetchError)
        }
        setVotes(votes - 1)
        setIsUpvoted(false)
      }
    } else {
      // eslint-disable-next-line no-undef
      alert('You must be logged in to vote')
    }
  }

  const handleDownvote = async () => {
    if (session) {
      if (isUpvoted) {
        const increaseDownvote = downvotes + 1
        const decreaseUpvote = upvotes - 1
        const { error: voteFetchError } = await supabase
          .from('posts')
          .update({
            downvotes: increaseDownvote,
            upvotes: decreaseUpvote
          })
          .eq('post_id', postId)
        const { error } = await supabase
          .from('voted_posts')
          .update({
            vote_type: 'downvoted'
          })
          .eq('vote_id', session.user.id + postId)
        if (voteFetchError || error) {
          console.log(voteFetchError)
        }
        setVotes(votes - 2)
        setIsUpvoted(false)
        setIsDownvoted(true)
      } else if (!isDownvoted) {
        const increaseDownvote = downvotes + 1
        const { error: voteFetchError } = await supabase
          .from('posts')
          .update({
            downvotes: increaseDownvote
          })
          .eq('post_id', postId)
        const { error } = await supabase
          .from('voted_posts')
          .upsert({
            vote_type: 'downvoted',
            user_id: session.user.id,
            post_id: postId,
            vote_id: session.user.id + postId
          })
        if (voteFetchError || error) {
          console.log(voteFetchError)
        }
        setVotes(votes - 1)
        setIsDownvoted(true)
      } else if (isDownvoted) {
        const decreaseDownvote = downvotes - 1
        const { error: voteFetchError } = await supabase
          .from('posts')
          .update({ downvotes: decreaseDownvote })
          .eq('post_id', postId)
        const { error } = await supabase
          .from('voted_posts')
          .delete()
          .eq('vote_id', session.user.id + postId)
        if (voteFetchError || error) {
          console.log(voteFetchError)
        }
        setVotes(votes + 1)
        setIsDownvoted(false)
      }
    } else {
      // eslint-disable-next-line no-undef
      alert('You must be logged in to vote')
    }
  }

  const handleDelete = async (postId) => {
    try {
      await deletePost(postId)
      closeConfirmPrompt()
      router.refresh() // Close the ConfirmPrompt after deletion
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <li className='border p-2 border-neutral-600 bg-neutral-900 rounded-lg flex-col md:flex-row'>
      <ConfirmPrompt
        isOpen={isOpen}
        action='Delete'
        onConfirm={handleDelete}
        onClose={closeConfirmPrompt}
        itemId={postToDelete}
        message='You will permanently delete this comment'
      />
      <div className='grid grid-cols-8 gap-6 justify-items-end mx-2'>
        <div className='hidden xl:flex gap-2 col-span-3 xl:col-span-2 items-center'>
          <div className='md:flex flex-col'>
            <button aria-label='Upvote post' onClick={() => { handleUpvote() }}>
              <svg className={`${isUpvoted ? 'stroke-purple-600 fill-purple-500' : 'stroke-neutral-400 hover:stroke-purple-600'} hover:fill-purple-500  w-8 hover:bg-purple-600/[0.1] rounded-lg cursor-pointer`} viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/sv'>
                <path fillRule='evenodd' clipRule='evenodd' d='M12 7C12.2652 7 12.5196 7.10536 12.7071 7.29289L19.7071 14.2929C20.0976 14.6834 20.0976 15.3166 19.7071 15.7071C19.3166 16.0976 18.6834 16.0976 18.2929 15.7071L12 9.41421L5.70711 15.7071C5.31658 16.0976 4.68342 16.0976 4.29289 15.7071C3.90237 15.3166 3.90237 14.6834 4.29289 14.2929L11.2929 7.29289C11.4804 7.10536 11.7348 7 12 7Z' fill='inherit' />
              </svg>
            </button>
            <p className='flex text-sm cursor-default justify-center text-neutral-100'>{votes}</p>
            <button aria-label='Downvote post' onClick={() => { handleDownvote() }}>
              <svg className={`${isDownvoted ? 'stroke-red-500 fill-red-500' : 'stroke-neutral-400 hover:stroke-red-500'} hover:fill-red-500  w-8 hover:bg-red-500/[0.1] rounded-lg rotate-180 cursor-pointer`} viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <path fillRule='evenodd' clipRule='evenodd' d='M12 7C12.2652 7 12.5196 7.10536 12.7071 7.29289L19.7071 14.2929C20.0976 14.6834 20.0976 15.3166 19.7071 15.7071C19.3166 16.0976 18.6834 16.0976 18.2929 15.7071L12 9.41421L5.70711 15.7071C5.31658 16.0976 4.68342 16.0976 4.29289 15.7071C3.90237 15.3166 3.90237 14.6834 4.29289 14.2929L11.2929 7.29289C11.4804 7.10536 11.7348 7 12 7Z' fill='inherit' />
              </svg>
            </button>
          </div>
          <div>
            {!image && !thumbnail
              ? <svg className='w-full max-w-[200px] stroke-neutral-500 fill-none aspect-video bg-neutral-700 rounded-lg' viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg' fill='inherit'><g id='SVGRepo_bgCarrier' strokeWidth='0' /><g id='SVGRepo_tracerCarrier' strokeLinecap='round' strokeLinejoin='round' stroke='inherit' strokeWidth='0.192' /><g id='SVGRepo_iconCarrier'> <path stroke='inherit' strokeLinejoin='round' strokeWidth='1' d='M6 5a2 2 0 012-2h16a2 2 0 012 2v22a2 2 0 01-2 2H8a2 2 0 01-2-2V5z' /> <path stroke='inherit' strokeLinecap='round' strokeLinejoin='round' strokeWidth='1' d='M10 9h4M10 16h12M10 20h12M10 24h4' /> <circle cx='22' cy='9' r='1' fill='inherit' /> </g></svg>
              : <Image className='hidden object-cover md:flex aspect-video rounded-lg' width={200} height={200} src={image || thumbnail} alt='post image' />}
          </div>
        </div>
        <div className='text-white col-span-8 md:col-span-5 w-full flex flex-col gap-2'>
          <div className='flex gap-2 justify-between py-2 flex-col h-full'>
            <Link aria-label='Go to post' href={route || '/'} className='font-semibold font-impact md:text-base text-sm'>{title}</Link>
            <div className='flex md:flex-row flex-col gap-1 md:items-center'>
              <div className='flex items-center gap-1'>
                <p className='text-xs text-neutral-400 font-impact'>Publicado por <Link className='text-neutral-100 font-bold' href={`/users/${username}`}>{username}</Link> en</p>
                <Link aria-label='Go to community' href={`/c/${community}`} className='font-bold font-impact text-xs'>{`c/${community}`}</Link>
              </div>
              <p className='text-xs text-neutral-400 font-impact'>{timeSince}</p>
            </div>
            <div className='hidden xl:flex gap-1 items-center'>
              <svg className='w-4 stroke-neutral-400 fill-neutral-400 stroke-2' xmlns='http://www.w3.org/2000/svg' x='0px' y='0px' viewBox='0 0 50 50'>
                <path d='M 25 4.0625 C 12.414063 4.0625 2.0625 12.925781 2.0625 24 C 2.0625 30.425781 5.625 36.09375 11 39.71875 C 10.992188 39.933594 11 40.265625 10.71875 41.3125 C 10.371094 42.605469 9.683594 44.4375 8.25 46.46875 L 7.21875 47.90625 L 9 47.9375 C 15.175781 47.964844 18.753906 43.90625 19.3125 43.25 C 21.136719 43.65625 23.035156 43.9375 25 43.9375 C 37.582031 43.9375 47.9375 35.074219 47.9375 24 C 47.9375 12.925781 37.582031 4.0625 25 4.0625 Z M 25 5.9375 C 36.714844 5.9375 46.0625 14.089844 46.0625 24 C 46.0625 33.910156 36.714844 42.0625 25 42.0625 C 22.996094 42.0625 21.050781 41.820313 19.21875 41.375 L 18.65625 41.25 L 18.28125 41.71875 C 18.28125 41.71875 15.390625 44.976563 10.78125 45.75 C 11.613281 44.257813 12.246094 42.871094 12.53125 41.8125 C 12.929688 40.332031 12.9375 39.3125 12.9375 39.3125 L 12.9375 38.8125 L 12.5 38.53125 C 7.273438 35.21875 3.9375 29.941406 3.9375 24 C 3.9375 14.089844 13.28125 5.9375 25 5.9375 Z' />
              </svg>
              <Link aria-label='Go to comments' href={route || '/'} className='text-xs text-neutral-400 font-semibold font-impact'>{`comments ${commentCount || 0}`}</Link>
            </div>
          </div>
        </div>
        {session?.user?.id === authorId
          ? (
            <div className='lg:flex hidden h-fit w-fit relative col-start-8'>
              <button aria-label='Open post options' onClick={() => setIsDropOpen(!isDropOpen)} className='font-bold text-neutral-400 tracking-widest'>...</button>
              <div className={`absolute top-[100%] ${isDropOpen ? 'custom-show' : 'hidden'} transition-opacity duration-500 ease-linear`}>
                <button aria-label='Delete post' onClick={() => { openConfirmPrompt(postId) }} className='bg-neutral-700 px-2 py-1'>delete</button>
              </div>
            </div>)
          : null}
      </div>

      <div className='flex xl:hidden col-span-6 flex-col gap-2'>
        {image
          ? (<Image className={`mt-5 ${isExpanded ? 'h-full' : 'max-h-[200px]'} m-auto aspect-video object-cover rounded-lg`} width={500} height={380} src={image || notFound} alt='random image' />)
          : (<Markdown className={`markdown ${isExpanded ? 'h-full' : 'max-h-[200px]'} overflow-hidden text-sm`} remarkPlugins={[remarkGfm]}>{body}</Markdown>)}
        <div className='flex mx-2 items-center text-neutral-400 font-impact font-semibold gap-3 xl:hidden'>
          <div className='flex'>
            <button aria-label='Upvote post' onClick={() => { handleUpvote() }}>
              <svg className={`${isUpvoted ? 'stroke-purple-600 fill-purple-500' : 'stroke-neutral-400 hover:stroke-purple-600'} hover:fill-purple-500  w-8 hover:bg-purple-600/[0.1] rounded-lg cursor-pointer`} viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <path fillRule='evenodd' clipRule='evenodd' d='M12 7C12.2652 7 12.5196 7.10536 12.7071 7.29289L19.7071 14.2929C20.0976 14.6834 20.0976 15.3166 19.7071 15.7071C19.3166 16.0976 18.6834 16.0976 18.2929 15.7071L12 9.41421L5.70711 15.7071C5.31658 16.0976 4.68342 16.0976 4.29289 15.7071C3.90237 15.3166 3.90237 14.6834 4.29289 14.2929L11.2929 7.29289C11.4804 7.10536 11.7348 7 12 7Z' fill='inherit' />
              </svg>
            </button>
            <button aria-label='Downvote post' onClick={() => { handleDownvote() }}>
              <svg className={`${isDownvoted ? 'stroke-red-500 fill-red-500' : 'stroke-neutral-400 hover:stroke-red-500'} hover:fill-red-500  w-8 hover:bg-red-500/[0.1] rounded-lg rotate-180 cursor-pointer`} viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <path fillRule='evenodd' clipRule='evenodd' d='M12 7C12.2652 7 12.5196 7.10536 12.7071 7.29289L19.7071 14.2929C20.0976 14.6834 20.0976 15.3166 19.7071 15.7071C19.3166 16.0976 18.6834 16.0976 18.2929 15.7071L12 9.41421L5.70711 15.7071C5.31658 16.0976 4.68342 16.0976 4.29289 15.7071C3.90237 15.3166 3.90237 14.6834 4.29289 14.2929L11.2929 7.29289C11.4804 7.10536 11.7348 7 12 7Z' fill='inherit' />
              </svg>
            </button>
          </div>
          <div className='flex items-center gap-4'>
            <p className='text-sm flex gap-1 xl:hidden font-bold'>
              <svg className='w-4 stroke-neutral-400 fill-neutral-400 stroke-2' xmlns='http://www.w3.org/2000/svg' x='0px' y='0px' viewBox='0 0 50 50'>
                <path d='M 25 4.0625 C 12.414063 4.0625 2.0625 12.925781 2.0625 24 C 2.0625 30.425781 5.625 36.09375 11 39.71875 C 10.992188 39.933594 11 40.265625 10.71875 41.3125 C 10.371094 42.605469 9.683594 44.4375 8.25 46.46875 L 7.21875 47.90625 L 9 47.9375 C 15.175781 47.964844 18.753906 43.90625 19.3125 43.25 C 21.136719 43.65625 23.035156 43.9375 25 43.9375 C 37.582031 43.9375 47.9375 35.074219 47.9375 24 C 47.9375 12.925781 37.582031 4.0625 25 4.0625 Z M 25 5.9375 C 36.714844 5.9375 46.0625 14.089844 46.0625 24 C 46.0625 33.910156 36.714844 42.0625 25 42.0625 C 22.996094 42.0625 21.050781 41.820313 19.21875 41.375 L 18.65625 41.25 L 18.28125 41.71875 C 18.28125 41.71875 15.390625 44.976563 10.78125 45.75 C 11.613281 44.257813 12.246094 42.871094 12.53125 41.8125 C 12.929688 40.332031 12.9375 39.3125 12.9375 39.3125 L 12.9375 38.8125 L 12.5 38.53125 C 7.273438 35.21875 3.9375 29.941406 3.9375 24 C 3.9375 14.089844 13.28125 5.9375 25 5.9375 Z' />
              </svg>
              {`comments ${commentCount || 0}`}
            </p>
          </div>
          {session?.user?.id === authorId
            ? (
              <div className='flex lg:hidden h-fit w-fit relative col-start-8'>
                <button aria-label='Open post options' onClick={() => setIsDropOpen(!isDropOpen)} className='font-bold text-neutral-400 tracking-widest'>
                  <svg className='w-4 stroke-neutral-400 fill-neutral-400' fill='inherit' viewBox='0 0 32 32' version='1.1' xmlns='http://www.w3.org/2000/svg'><g id='SVGRepo_bgCarrier' strokeWidth='0' /><g id='SVGRepo_tracerCarrier' strokeLinecap='round' strokeLinejoin='round' /><g id='SVGRepo_iconCarrier'> <path d='M28.106 19.944h-0.85c-0.069-0.019-0.131-0.050-0.2-0.063-1.788-0.275-3.2-1.762-3.319-3.506-0.137-1.95 0.975-3.6 2.787-4.137 0.238-0.069 0.488-0.119 0.731-0.181h0.85c0.056 0.019 0.106 0.050 0.169 0.056 1.65 0.269 2.906 1.456 3.262 3.081 0.025 0.125 0.063 0.25 0.094 0.375v0.85c-0.019 0.056-0.050 0.113-0.056 0.169-0.262 1.625-1.419 2.863-3.025 3.238-0.156 0.038-0.3 0.081-0.444 0.119zM4.081 12.056l0.85 0c0.069 0.019 0.131 0.050 0.2 0.056 1.8 0.281 3.206 1.775 3.319 3.537 0.125 1.944-1 3.588-2.819 4.119-0.231 0.069-0.469 0.119-0.7 0.175h-0.85c-0.056-0.019-0.106-0.050-0.162-0.063-1.625-0.3-2.688-1.244-3.194-2.819-0.069-0.206-0.106-0.425-0.162-0.637v-0.85c0.019-0.056 0.050-0.113 0.056-0.169 0.269-1.631 1.419-2.863 3.025-3.238 0.15-0.037 0.294-0.075 0.437-0.113zM15.669 12.056h0.85c0.069 0.019 0.131 0.050 0.2 0.063 1.794 0.281 3.238 1.831 3.313 3.581 0.087 1.969-1.1 3.637-2.931 4.106-0.194 0.050-0.387 0.094-0.581 0.137h-0.85c-0.069-0.019-0.131-0.050-0.2-0.063-1.794-0.275-3.238-1.831-3.319-3.581-0.094-1.969 1.1-3.637 2.931-4.106 0.2-0.050 0.394-0.094 0.588-0.137z' /></g></svg>
                </button>
                <div className={`absolute top-[100%] ${isDropOpen ? 'custom-show' : 'hidden'} transition-opacity duration-500 ease-linear`}>
                  <button aria-label='Deleete post' onClick={() => { openConfirmPrompt(postId) }} className='bg-neutral-700 px-2 rounded-md py-1'>Delete</button>
                </div>
              </div>)
            : null}
          <button aria-label='Expand post' className='text-white ml-auto' onClick={() => setIsExpanded(!isExpanded)}>
            <svg className='h-4 stroke-neutral-400' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg' stroke='#ffffff'><g id='SVGRepo_bgCarrier' strokeWidth='0' /><g id='SVGRepo_tracerCarrier' strokeLinecap='round' strokeLinejoin='round' stroke='inherit' strokeWidth='0.048' /><g id='SVGRepo_iconCarrier'> <path d='M14 10L21 3M21 3H16.5M21 3V7.5M10 14L3 21M3 21H7.5M3 21L3 16.5' stroke='inherit' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' /></g></svg>
          </button>
        </div>
      </div>
    </li>
  )
}

export default PostCard
