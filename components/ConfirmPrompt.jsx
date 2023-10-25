'use client'
import React from 'react'

const ConfirmPrompt = ({ message, action, isOpen, onClose, onConfirm, itemId }) => {
  return (
    <div className={`fixed z-20 left-0 top-0 bg-neutral-800/[0.5] w-full h-full justify-center items-center ${isOpen ? 'flex' : 'hidden'}`}>
      <div className='justify-around flex items-center flex-col w-96 h-fit gap-6 rounded-lg bg-neutral-600 shadow-lg shadow-neutral-800'>
        <p className='text-white py-5 font-semibold rounded-t-lg bg-neutral-700 border-b w-full flex justify-center border-neutral-200'>{message}</p>
        <div className='flex gap-12 pb-5'>
          <button aria-label='Cancel delete post' onClick={onClose} className='px-3 py-1 rounded-full text-white font-semibold outline outline-2 hover:outline-neutral-400 hover:text-neutral-400 outline-white transition-all duration-75 ease-linear'>Cancel</button>
          <button aria-label='Confirm delete post' onClick={() => onConfirm(itemId)} className='px-3 py-1 rounded-full bg-white font-semibold hover:bg-red-600 transition-colors duration-75 ease-linear'>{action}</button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmPrompt
