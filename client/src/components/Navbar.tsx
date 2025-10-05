// components/Navbar.tsx
import React from 'react'
import { Menu } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../state/store';
import { setSidebar } from '../state/sidebarSlice';


const Navbar: React.FC = () => {
  
  const isCollapsed = useSelector((state : RootState) => state.sidebar.isCollapsed);
  const dispatch = useDispatch();
  const toggleSidebar = () => {
    dispatch(setSidebar(!isCollapsed));
  }
  return (
    <div className="flex w-full mb-7 justify-between items-center">
      {/* left side: toggle button */}
      <div className="flex">
        <button
          className="px-3 py-3 bg-gray-100 rounded-full hover:bg-blue-100"
          onClick={toggleSidebar}
        >
          <Menu className="w-4 h-4" />
        </button>
      </div>
      {/* center: title */}
      <div className="flex-1 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-1">
          Sonai Engineering Services
        </h1>
      </div>
      {/* right side: empty for now */}
      <div className="flex">
        {/* future icons like Bell, Sun, Settings can go here */}
      </div>
    </div>
  )
}

export default Navbar