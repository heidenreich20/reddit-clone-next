import Image from 'next/image'
const Navbar = () => {
  return (
    <nav className='flex sticky items-center md:justify-start justify-between md:gap-24 gap-3 py-2 px-8 bg-neutral-800'>
      <section className='flex items-center gap-4'>
        <div className='rounded-full w-fit p-1.5 bg-purple-500'>
          <svg className='fill-white md:w-5 w-8 -translate-y-0.5' viewBox='0 0 24 24' fill='inherit' xmlns='http://www.w3.org/2000/svg'>
            <path d='M9 15C8.44771 15 8 15.4477 8 16C8 16.5523 8.44771 17 9 17C9.55229 17 10 16.5523 10 16C10 15.4477 9.55229 15 9 15Z' fill='inherit' />
            <path d='M14 16C14 15.4477 14.4477 15 15 15C15.5523 15 16 15.4477 16 16C16 16.5523 15.5523 17 15 17C14.4477 17 14 16.5523 14 16Z' fill='inherit' />
            <path fillRule='evenodd' clipRule='evenodd' d='M12 1C10.8954 1 10 1.89543 10 3C10 3.74028 10.4022 4.38663 11 4.73244V7H6C4.34315 7 3 8.34315 3 10V20C3 21.6569 4.34315 23 6 23H18C19.6569 23 21 21.6569 21 20V10C21 8.34315 19.6569 7 18 7H13V4.73244C13.5978 4.38663 14 3.74028 14 3C14 1.89543 13.1046 1 12 1ZM5 10C5 9.44772 5.44772 9 6 9H7.38197L8.82918 11.8944C9.16796 12.572 9.86049 13 10.618 13H13.382C14.1395 13 14.832 12.572 15.1708 11.8944L16.618 9H18C18.5523 9 19 9.44772 19 10V20C19 20.5523 18.5523 21 18 21H6C5.44772 21 5 20.5523 5 20V10ZM13.382 11L14.382 9H9.61803L10.618 11H13.382Z' fill='inherit' />
            <path d='M1 14C0.447715 14 0 14.4477 0 15V17C0 17.5523 0.447715 18 1 18C1.55228 18 2 17.5523 2 17V15C2 14.4477 1.55228 14 1 14Z' fill='inherit' />
            <path d='M22 15C22 14.4477 22.4477 14 23 14C23.5523 14 24 14.4477 24 15V17C24 17.5523 23.5523 18 23 18C22.4477 18 22 17.5523 22 17V15Z' fill='inherit' />
          </svg>
        </div>
        <svg className='fill-white md:w-6 w-8 icon flat-color' fill='inherit' viewBox='0 0 24 24' id='home-alt-3' data-name='Flat Color' xmlns='http://www.w3.org/2000/svg'><path id='primary' d='M21.71,11.29l-9-9a1,1,0,0,0-1.42,0l-9,9a1,1,0,0,0-.21,1.09A1,1,0,0,0,3,13H4v7.3A1.77,1.77,0,0,0,5.83,22H8.5a1,1,0,0,0,1-1V16.1a1,1,0,0,1,1-1h3a1,1,0,0,1,1,1V21a1,1,0,0,0,1,1h2.67A1.77,1.77,0,0,0,20,20.3V13h1a1,1,0,0,0,.92-.62A1,1,0,0,0,21.71,11.29Z' /></svg>
      </section>
      <div className='flex relative items-center justify-start'>
        <input className='h-9 md:h-8 w-44 md:w-full rounded-full bg-neutral-700 text-white pl-9 pr-4' type='search' />
        <Image width={24} height={24} className='absolute w-6 ml-2' src='/search.svg' alt='search icon' />
      </div>
    </nav>
  )
}

export default Navbar
