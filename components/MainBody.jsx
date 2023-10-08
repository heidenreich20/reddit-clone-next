import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import PostCard from '@/components/PostCard'

const MainBody = async () => {
  const cookieStore = cookies()
  const supabase = createServerComponentClient({ cookies: () => cookieStore })

  const { data: posts } = await supabase.from("posts").select();

  return (
    <div className='col-span-6 bg-neutral-800 border border-neutral-600 rounded-lg md:col-span-4'>
      <ul>
        {posts?.map((post) => (
         <PostCard title={post.title} image={post.image} user={post.author_name} />
        ))}
      </ul>
    </div>
  )
}

export default MainBody
