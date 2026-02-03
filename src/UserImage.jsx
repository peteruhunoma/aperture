import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import Header from './Header.jsx';
import {useHistory} from 'react-router-dom';
import { AuthContext } from './auth.jsx';

function UserImage() {
  const {currentuser} = useContext(AuthContext);
  const [profileImage, setProfileImage] = useState('https://lh3.googleusercontent.com/aida-public/AB6AXuAKTqdHIw3-HJvOnQPeyrRAHf5Zww8EWPa_7ZJC0Wt9IJz-4ZOy5nKgEK5hSefmEQWNnXzFwEQ5aP9sC5rQVxfoksNqUvs-DtkdcA6WHYLIZbsDnuPBTgiBWMUEjAVJYo7aE7_lvJ4XpiQ5l-ZcfFPUMyOA998Q7e3wq48KNZpG8_E02qoM2HY9F4ImBfoIgSHCQ1sYiJABixUZ0BLsZ3-DnMExT1xqPpOsuOOlZZ1Y02R7gb6kCh9k9zDC9lILoLHFMbWGK69ydrg');
  const [uploading, setUploading] = useState(false);
  const [uploadedFilename, setUploadedFilename] = useState(null);
  const fileInputRef = React.useRef(null);
  const history = useHistory();
  console.log(currentuser);
  useEffect(() => {
  if(!currentuser){
    history.push("/login");
  }
  }, [currentuser])
  

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload only JPG or PNG images.');
      return;
    }

    // Validate file size (5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      alert('File size must be less than 5MB.');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    setUploading(true);

    try {
      const response = await axios.post('http://localhost:3000/uploaduserimg', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const filename = response.data;
      setUploadedFilename(filename);
      const imageUrl = `/uploadeduser/${filename}`;
      setProfileImage(imageUrl);
      
      const user = await axios.put('http://localhost:3000/api/auth/uploadimg',{filename},{
        withCredentials:true
      })


      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return img();
    } catch (error) {
      console.error('Upload error:', error);
      if (error?.response?.status === 500){
        history.push("/login");
      }
    } finally {
      setUploading(false);
    }
  };

  const img = async () => {
    try{
    const res = await axios.get("http://localhost:3000/api/auth/img",{
      withCredentials:true
    });
    
    return res.data.userImage;
    }catch(err){
      console.log(err);
    }
    
  }

  const handleRemove = () => {
    setProfileImage('https://lh3.googleusercontent.com/aida-public/AB6AXuAKTqdHIw3-HJvOnQPeyrRAHf5Zww8EWPa_7ZJC0Wt9IJz-4ZOy5nKgEK5hSefmEQWNnXzFwEQ5aP9sC5rQVxfoksNqUvs-DtkdcA6WHYLIZbsDnuPBTgiBWMUEjAVJYo7aE7_lvJ4XpiQ5l-ZcfFPUMyOA998Q7e3wq48KNZpG8_E02qoM2HY9F4ImBfoIgSHCQ1sYiJABixUZ0BLsZ3-DnMExT1xqPpOsuOOlZZ1Y02R7gb6kCh9k9zDC9lILoLHFMbWGK69ydrg');
    setUploadedFilename(null);
  };

  const handleSaveProfile = () => {
    if (uploadedFilename) {
      console.log('Saving profile with image:', uploadedFilename);
      alert('Profile saved successfully!');
    } else {
      alert('Please upload an image first.');
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark font-display">
      <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
        <div className="layout-container flex h-full grow flex-col">
          {/* Top Navigation Bar */}
          <div className="flex flex-1 justify-center py-0">
            <div className="layout-content-container flex flex-col w-full flex-1">
              <Header reload={handleFileChange}/>
            </div>
          </div>

          {/* Main Content */}
          <main className="px-4 md:px-40 flex flex-1 justify-center py-10">
            <div className="layout-content-container flex flex-col max-w-[800px] flex-1">
              {/* Breadcrumbs */}
              <div className="flex flex-wrap gap-2 px-4 mb-4">
                <a className="text-slate-400 dark:text-slate-500 text-sm font-medium leading-normal hover:text-primary transition-colors" href="#">Account</a>
                <span className="text-slate-400 dark:text-slate-500 text-sm font-medium leading-normal">/</span>
                <a className="text-slate-400 dark:text-slate-500 text-sm font-medium leading-normal hover:text-primary transition-colors" href="#">Profile Settings</a>
                <span className="text-slate-400 dark:text-slate-500 text-sm font-medium leading-normal">/</span>
                <span className="text-slate-900 dark:text-white text-sm font-semibold leading-normal">Profile Picture</span>
              </div>

              {/* Centered Card Container */}
              <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 p-8 md:p-12">
                {/* Page Heading */}
                <div className="flex flex-col gap-2 mb-10 text-center">
                  <h1 className="text-slate-900 dark:text-white text-3xl font-black leading-tight tracking-[-0.033em]">Upload Profile Picture</h1>
                  <p className="text-slate-500 dark:text-slate-400 text-base font-normal leading-normal">Personalize your Aperture account with a profile photo.</p>
                </div>

                {/* Profile Header / Upload Area */}
                <div className="flex">
                  <div className="flex w-full flex-col gap-8 items-center">
                    <div className="flex gap-6 flex-col items-center">
                      {/* Avatar Placeholder with Overlay */}
                      <div className="relative group cursor-pointer" onClick={handleFileSelect}>
                        <div 
                          className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-48 w-48 border-4 border-slate-50 dark:border-slate-800 shadow-md transition-all group-hover:ring-4 group-hover:ring-primary/20" 
                          title="Main profile picture display area" 
                          style={{ backgroundImage: `url("${profileImage}")` }}
                        />
                        {/* Icon Overlay */}
                        <div className="absolute inset-0 bg-slate-900/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="flex flex-col items-center text-white">
                            <span className="material-symbols-outlined text-3xl">photo_camera</span>
                            <span className="text-xs font-bold mt-1">{uploading ? 'UPLOADING...' : 'UPDATE'}</span>
                          </div>
                        </div>
                        {/* Brand Badge */}
                        <div className="absolute bottom-2 right-2 bg-primary text-white p-1.5 rounded-full shadow-lg border-2 border-white dark:border-slate-900">
                          <span className="material-symbols-outlined text-sm block">verified</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-center justify-center">
                        <p className="text-slate-900 dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em] text-center">Current Photo</p>
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-normal leading-normal text-center mt-1">This photo is visible to the SoleStyle community.</p>
                      </div>
                    </div>
                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row w-full max-w-[400px] gap-4">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/jpeg,image/png,image/jpg"
                        className="hidden"
                      />
                      <button 
                        onClick={handleFileSelect}
                        disabled={uploading}
                        className="flex min-w-[140px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-full h-12 px-6 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] flex-1 shadow-md hover:bg-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="material-symbols-outlined text-[20px]">upload</span>
                        <span className="truncate">{uploading ? 'Uploading...' : 'Choose File'}</span>
                      </button>
                      <button 
                        onClick={handleRemove}
                        disabled={uploading}
                        className="flex min-w-[140px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-full h-12 px-6 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-bold leading-normal tracking-[0.015em] flex-1 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="material-symbols-outlined text-[20px]">delete</span>
                        <span className="truncate">Remove</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Meta Info / Footer Text */}
                <div className="mt-10 pt-8 border-t border-slate-100 dark:border-slate-800">
                  <p className="text-slate-400 dark:text-slate-500 text-xs font-medium leading-normal text-center uppercase tracking-widest">Upload Requirements</p>
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-normal leading-normal mt-2 text-center">
                    Supported formats: <span className="text-slate-700 dark:text-slate-300 font-semibold">JPG, PNG, WEBP</span>. <br />
                    Maximum file size: <span className="text-slate-700 dark:text-slate-300 font-semibold">5MB</span>.
                  </p>
                </div>
                <div className="mt-12 flex justify-center">
                  <button 
                    onClick={handleSaveProfile}
                    className="px-10 h-12 bg-slate-900 dark:bg-primary text-white rounded-full font-bold text-sm tracking-wide hover:opacity-90 transition-opacity"
                  >
                    Save Profile Changes
                  </button>
                </div>
              </div>

              {/* Help Section */}
              <div className="mt-8 flex justify-center gap-8">
                <div className="flex items-center gap-2 text-slate-400 hover:text-primary cursor-pointer transition-colors">
                  <span className="material-symbols-outlined text-sm">help</span>
                  <span className="text-xs font-semibold uppercase tracking-wider">Help Center</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400 hover:text-primary cursor-pointer transition-colors">
                  <span className="material-symbols-outlined text-sm">privacy_tip</span>
                  <span className="text-xs font-semibold uppercase tracking-wider">Privacy Policy</span>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default UserImage;