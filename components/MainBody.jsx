import supabase from '@/utils/supabase'
import PostCard from '@/components/PostCard'

const MainBody = async () => {
  const {
    data: { session }
  } = await supabase.auth.getSession()

  const { data: posts } = await supabase
    .from('posts')
    .select()
    .order('created_at', { ascending: false })

  const { data: votedPostsData } = await supabase
    .from('voted_posts')
    .select()
    .eq('user_id', session?.user?.id)

  const votedPostsMap = votedPostsData?.reduce((acc, vote) => {
    acc[vote.post_id] = vote
    return acc
  }, {})

  return (
    <div className='lg:w-2/3 w-full'>
      <ul className='flex flex-col gap-2'>
        {posts?.map((post) => {
          // Check if there is a corresponding vote for the post.
          if (session) {
            const voteData = votedPostsMap[post.post_id]

            return (
              <PostCard
                version={post.version}
                key={post.post_id}
                session={session}
                downvotes={post.downvotes}
                upvotes={post.upvotes}
                postId={post.post_id}
                route={`/c/${post.community_name}/${post.post_id}`}
                title={post.title}
                image={post.image}
                username={post.author_name}
                community={post.community_name}
                date={post.created_at}
                body={post.body}
                authorId={post.author_id}
                voteData={voteData}
              />
            )
          } else {
            return (
              <PostCard
                version={post.version}
                key={post.post_id}
                session={session}
                downvotes={post.downvotes}
                upvotes={post.upvotes}
                postId={post.post_id}
                route={`/c/${post.community_name}/${post.post_id}`}
                title={post.title}
                image={post.image}
                username={post.author_name}
                community={post.community_name}
                date={post.created_at}
                body={post.body}
                authorId={post.author_id}
              />
            )
          }
        })}
      </ul>
    </div>
  )
}

export default MainBody
