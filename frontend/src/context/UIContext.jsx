import React, { createContext, useContext, useState } from 'react';

const UIContext = createContext();

export const UIProvider = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(prev => !prev);
  const openUpload = () => setIsUploadOpen(true);
  const closeUpload = () => setIsUploadOpen(false);

  return (
    <UIContext.Provider value={{ 
      sidebarOpen, 
      toggleSidebar, 
      isUploadOpen, 
      openUpload, 
      closeUpload 
    }}>
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => useContext(UIContext);
