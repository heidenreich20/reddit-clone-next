// 'use client'
// import React, { useState } from 'react';

// const CreateUserForm = ({ user }) => {
//   const [userData, setUserData] = useState(user?.username || '');
//   const [isLoading, setIsLoading] = useState(false);

//   function handleChange(e) {
//     const value = e.target.value;
//     setUserData({
//       ...userData,
//       [e.target.name]: value
//     });
//   }

//   return (
//       <form
//         action="/auth/auth-created-user"
//         method="post"
//       >
//         <p>Welcome, {user?.username || 'Guest'}!</p>
//         <input
//           type="text"
//           name='username'
//           placeholder="Enter your username"
//           value={userData.username}
//           onChange={handleChange}
//         />
//         <input
//           type="text"
//           name='profile'
//           placeholder="Enter your profile pic link"
//           value={userData.profile}
//           onChange={handleChange}
//         />
//          <button
//           formAction="/auth/auth-created-user"
//           className="border border-gray-700 rounded px-4 py-2 text-black mb-2"
//         >
//           Sign Up
//         </button>
//       </form>
//   );
// };

// export default CreateUserForm;
