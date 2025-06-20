import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import assets from '../assets/assets';
import { AuthContext } from '../../context/AuthContext';

const ProfilePage = () => {
  const {authUser, updateProfile} = useContext(AuthContext)
  const navigate = useNavigate();

  const [selectedImg, setSelectedImg] = useState(null)
  const [name, setName] = useState(authUser?.fullName || '')
  const [bio, setBio] = useState(authUser?.bio || '')

  const HandleSubmit = async (e) => {
    e.preventDefault();
    
    if(!selectedImg){
      await updateProfile({fullName: name, bio});
      navigate('/');
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const base64Image = reader.result;
      await updateProfile({profilePic: base64Image, fullName: name, bio});
      navigate('/');
    }
    reader.readAsDataURL(selectedImg);
  }

  // Show loading if authUser is not available
  if (!authUser) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className='min-h-screen bg-cover bg-no-repeat flex items-center justify-center'>
      <div className='w-5/6 max-w-2xl backdrop-blur-2xl text-gray-300 border-2 border-gray-600 flex items-center justify-between max-sm:flex-col-reverse rounded-lg'>
        <form onSubmit={HandleSubmit} className='flex flex-col gap-5 p-10 flex-1'>
          <h3 className='text-lg'>Profile Details</h3>
          <label htmlFor='avatar' className='flex items-center gap-3 cursor-pointer'>
            <input 
              onChange={(e)=> setSelectedImg(e.target.files[0])} 
              type='file' 
              id='avatar' 
              accept='.png, .jpg, .jpeg' 
              hidden 
            />
            <img 
              src={selectedImg ? URL.createObjectURL(selectedImg) : authUser.profilePic || assets.avatar_icon} 
              alt=''  
              className={`w-12 h-12 object-cover ${(selectedImg || authUser.profilePic) ? 'rounded-full' : ''}`} 
            />
            upload profile image
          </label>
          <input 
            onChange={(e)=> setName(e.target.value)} 
            value={name} 
            type='text' 
            required 
            placeholder='Your name' 
            className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500'
          />
          <textarea 
            placeholder='Write your bio' 
            value={bio} 
            onChange={(e)=> setBio(e.target.value)} 
            className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500' 
            rows={4}
          />
          <button 
            type='submit' 
            className='bg-gradient-to-r from-purple-400 to-violet-600 text-white p-2 rounded-full text-lg cursor-pointer' 
          >
            Save
          </button>
        </form>
        <img 
          src={authUser?.profilePic || assets.logo_icon} 
          alt='' 
          className='max-w-44 aspect-square rounded-full mx-10 max-sm:mt-10' 
        />
      </div>
    </div>
  )
}

export default ProfilePage