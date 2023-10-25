import React from 'react'

const SignUpForm = () => {
  return (
    <div className='flex flex-col gap-2'>
      <label className='text-md' htmlFor='username'>
        Username
      </label>
      <input
        className='rounded-md w-full px-4 py-2 bg-inherit border mb-6'
        type='text'
        name='username'
        placeholder='Enter your username'
      // value={userData.username}
      // onChange={handleChange}
      />
      <label className='text-md' htmlFor='profile'>
        Profile picture
      </label>
      <input
        className='rounded-md w-full px-4 py-2 bg-inherit border mb-6'
        type='text'
        name='profile'
        placeholder='Enter your profile pic link'
      // value={userData.profile}
      // onChange={handleChange}
      />
    </div>
  )
}

export default SignUpForm
