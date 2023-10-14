import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import PostCard from '@/components/PostCard'

const MainBody = async () => {
  const cookieStore = cookies()
  const supabase = createServerComponentClient({ cookies: () => cookieStore })

  const { data: posts } = await supabase.from("posts").select();
  
  return (
    <div className='col-span-6 md:col-span-4'>
      <ul className='flex flex-col gap-2'>
        {posts?.map((post) => (
         <PostCard key={post.post_id} post_id={post.post_id} title={post.title} image={post.image} user={post.author_name} community={post.community} />
        ))}
      </ul>
    </div>
  )
}

export default MainBody
