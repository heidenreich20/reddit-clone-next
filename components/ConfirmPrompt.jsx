'use client'
import React from 'react'

const ConfirmPrompt = ({ message, action, isOpen, onClose, onConfirm, commentId }) => {
  return (
    <div className={`absolute z-20 ${isOpen ? 'flex' : 'hidden'} justify-around items-center flex-col w-96 h-fit gap-6 rounded-lg bg-neutral-600 shadow-lg shadow-neutral-800 left-[50%] top-[50%] -translate-x-[50%] -translate-y-[50%]`}>
      <p className='text-white py-5 font-semibold rounded-t-lg bg-neutral-700 border-b w-full flex justify-center border-neutral-200'>{message}</p>
      <div className='flex gap-12 pb-5'>
        <button onClick={onClose} className='px-3 py-1 rounded-full text-white font-semibold outline outline-2 hover:outline-neutral-400 hover:text-neutral-400 outline-white transition-all duration-75 ease-linear'>Cancel</button>
        <button onClick={() => onConfirm(commentId)} className='px-3 py-1 rounded-full bg-white font-semibold hover:bg-red-600 transition-colors duration-75 ease-linear'>{action}</button>
      </div>
    </div>
  )
}

export default ConfirmPrompt
