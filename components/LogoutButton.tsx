export default function LogoutButton () {
  return (
    <form action='/auth/sign-out' method='post'>
      <button className='py-2 sm:block hidden px-4 rounded-md no-underline bg-red-500 hover:bg-btn-background-hover'>
        Logout
      </button>
    </form>
  )
}
