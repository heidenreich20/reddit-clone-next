'use client'
import React, { useState } from 'react'
import MDEditor from '@uiw/react-md-editor'
import rehypeSanitize from 'rehype-sanitize'

const CommentCMS = ({ newComment, onCommentChange, onSubmitComment }) => {
  const [value, setValue] = useState('')

  const bold = {
    name: 'bold',
    keyCommand: 'bold',
    buttonProps: { 'aria-label': 'Add bold text' },
    icon: (
      <svg role='img' width='12' height='12' viewBox='0 0 384 512'>
        <path fill='currentColor' d='M304.793 243.891c33.639-18.537 53.657-54.16 53.657-95.693 0-48.236-26.25-87.626-68.626-104.179C265.138 34.01 240.849 32 209.661 32H24c-8.837 0-16 7.163-16 16v33.049c0 8.837 7.163 16 16 16h33.113v318.53H24c-8.837 0-16 7.163-16 16V464c0 8.837 7.163 16 16 16h195.69c24.203 0 44.834-1.289 66.866-7.584C337.52 457.193 376 410.647 376 350.014c0-52.168-26.573-91.684-71.207-106.123zM142.217 100.809h67.444c16.294 0 27.536 2.019 37.525 6.717 15.828 8.479 24.906 26.502 24.906 49.446 0 35.029-20.32 56.79-53.029 56.79h-76.846V100.809zm112.642 305.475c-10.14 4.056-22.677 4.907-31.409 4.907h-81.233V281.943h84.367c39.645 0 63.057 25.38 63.057 63.057.001 28.425-13.66 52.483-34.782 61.284z' />
      </svg>
    ),
    execute: (state, api) => {
      let modifyText = `** ${state.selectedText} **`
      if (!state.selectedText) {
        modifyText = ''
      }
      api.replaceSelection(modifyText)
    }
  }

  const italic = {
    name: 'italic',
    keyCommand: 'italic',
    buttonProps: { 'aria-label': 'Add italic text' },
    icon: (
      <svg data-name='italic' width='12' height='12' role='img' viewBox='0 0 320 512'><path fill='currentColor' d='M204.758 416h-33.849l62.092-320h40.725a16 16 0 0 0 15.704-12.937l6.242-32C297.599 41.184 290.034 32 279.968 32H120.235a16 16 0 0 0-15.704 12.937l-6.242 32C96.362 86.816 103.927 96 113.993 96h33.846l-62.09 320H46.278a16 16 0 0 0-15.704 12.935l-6.245 32C22.402 470.815 29.967 480 40.034 480h158.479a16 16 0 0 0 15.704-12.935l6.245-32c1.927-9.88-5.638-19.065-15.704-19.065z' /></svg>
    ),
    execute: (state, api) => {
      let modifyText = `* ${state.selectedText} *`
      if (!state.selectedText) {
        modifyText = ''
      }
      api.replaceSelection(modifyText)
    }
  }

  const hyperlink = {
    name: 'hyperlink',
    keyCommand: 'hyperlink',
    buttonProps: { 'aria-label': 'Add hyperlink text' },
    icon: (
      <svg data-name='link' width='12' height='12' role='img' viewBox='0 0 520 520'><path fill='currentColor' d='M331.751196,182.121107 C392.438214,241.974735 391.605313,337.935283 332.11686,396.871226 C332.005129,396.991316 331.873084,397.121413 331.751196,397.241503 L263.493918,464.491645 C203.291404,523.80587 105.345257,523.797864 45.151885,464.491645 C-15.0506283,405.187427 -15.0506283,308.675467 45.151885,249.371249 L82.8416853,212.237562 C92.836501,202.39022 110.049118,208.9351 110.56511,222.851476 C111.223305,240.5867 114.451306,258.404985 120.407566,275.611815 C122.424812,281.438159 120.983487,287.882964 116.565047,292.23621 L103.272145,305.332975 C74.8052033,333.379887 73.9123737,379.047937 102.098973,407.369054 C130.563883,435.969378 177.350591,436.139505 206.033884,407.879434 L274.291163,340.6393 C302.9257,312.427264 302.805844,266.827265 274.291163,238.733318 C270.531934,235.036561 266.74528,232.16442 263.787465,230.157924 C259.544542,227.2873 256.928256,222.609848 256.731165,217.542518 C256.328935,206.967633 260.13184,196.070508 268.613213,187.714278 L289.998463,166.643567 C295.606326,161.118448 304.403592,160.439942 310.906317,164.911276 C318.353355,170.034591 325.328531,175.793397 331.751196,182.121107 Z M240.704978,55.4828366 L172.447607,122.733236 C172.325719,122.853326 172.193674,122.983423 172.081943,123.103513 C117.703294,179.334654 129.953294,261.569283 185.365841,328.828764 C191.044403,335.721376 198.762988,340.914712 206.209732,346.037661 C212.712465,350.509012 221.510759,349.829503 227.117615,344.305363 L248.502893,323.234572 C256.984277,314.87831 260.787188,303.981143 260.384957,293.406218 C260.187865,288.338869 257.571576,283.661398 253.328648,280.790763 C250.370829,278.78426 246.58417,275.912107 242.824936,272.215337 C214.310216,244.121282 206.209732,204.825874 229.906702,179.334654 L298.164073,112.094263 C326.847404,83.8340838 373.633159,84.0042113 402.099123,112.604645 C430.285761,140.92587 429.393946,186.594095 400.92595,214.641114 L387.63303,227.737929 C383.214584,232.091191 381.773257,238.536021 383.790506,244.362388 C389.746774,261.569283 392.974779,279.387637 393.632975,297.122928 C394.149984,311.039357 411.361608,317.584262 421.356437,307.736882 L459.046288,270.603053 C519.249898,211.29961 519.249898,114.787281 459.047304,55.4828366 C398.853851,-3.82360914 300.907572,-3.83161514 240.704978,55.4828366 Z' /></svg>
    ),
    execute: (state, api) => {
      let modifyText = `[${state.selectedText}](url)`
      if (!state.selectedText) {
        modifyText = '[link](url)'
      }
      api.replaceSelection(modifyText)
    }
  }

  const quote = {
    name: 'quote',
    keyCommand: 'quote',
    buttonProps: { 'aria-label': 'Add quote text' },
    icon: (
      <svg width='13' height='13' viewBox='0 0 20 20'><path fill='currentColor' d='M15 9c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm4-7H1c-.55 0-1 .45-1 1v14c0 .55.45 1 1 1h18c.55 0 1-.45 1-1V3c0-.55-.45-1-1-1zm-1 13l-6-5-2 2-4-5-4 8V4h16v11z' /></svg>
    ),
    execute: (state, api) => {
      let modifyText = `![image](${state.selectedText})`
      if (!state.selectedText) {
        modifyText = '![image](url)'
      }
      api.replaceSelection(modifyText)
    }
  }

  return (
    <div data-color-mode='dark' className='flex flex-col gap-2 mb-5'>
      <MDEditor
        visibleDragbar={false}
        value={value}
        onChange={setValue}
        preview='edit'
        previewOptions={{
          rehypePlugins: [[rehypeSanitize]]
        }}
        commands={[
          bold, italic, hyperlink, quote
        ]}
        components={{
          toolbar: (command, disabled, executeCommand) => {
            if (command.keyCommand === 'code') {
              return (
                <button
                  aria-label='Insert code'
                  disabled={disabled}
                  onClick={(evn) => {
                    evn.stopPropagation()
                    executeCommand(command, command.groupName)
                  }}
                >
                  Code
                </button>
              )
            }
          }
        }}
      />
      <button className='p-1 w-fit font-semibold text-sm rounded-full bg-neutral-300' onClick={() => { onSubmitComment(value) }}>
        Comment
      </button>
    </div>
  )
  // return (
  //   <div className='comment-cms flex mb-2 gap-2 flex-col'>
  //     <textarea
  //       className='w-full h-24 resize-none rounded-lg p-1'
  //       placeholder='Write a comment...'
  //       value={newComment}
  //       onChange={onCommentChange}
  //     />
  //     <button className='p-1 w-fit font-semibold text-sm rounded-full bg-neutral-300' onClick={onSubmitComment}>
  //       Comment
  //     </button>
  //   </div>
  // )
}

export default CommentCMS
