
import { Archive, Clipboard, Layout, type LucideIcon, Menu, Settings, User } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../state/store";
import { setSidebar } from "../state/sidebarSlice";

interface SidebarLinksProps{
  icon : LucideIcon;
  label : string;
  href : string;
  isCollapsed : boolean;
}
  
const SidebarLinks = ({href, icon : Icon, label, isCollapsed}: SidebarLinksProps) => {

  const isActive = window.location.pathname === href;

  return (
     
        <div className={`
          cursor-pointer flex items-center 
          ${ isCollapsed ? 'justify-center py-4': 'justify-start py-4 px-8' } hover:text-blue-500 hover:bg-blue-100 gap-3 transition-colors
          ${isActive ? "bg-blue-200 text-white" : "" }`}>
            <Icon className="w-6 h-6 !text-gray-700"/>
            <span className={`${isCollapsed ? "hidden" : "block"} font-medium text-gray-700`}>{label}</span>

          </div>
      
  )
}



const Sidebar = () => {
    const isCollapsed = useSelector((state : RootState) => state.sidebar.isCollapsed);
    const dispatch = useDispatch();
    const toggleSidebar = () => {
    dispatch(setSidebar(!isCollapsed));
  }
  
  const sidebarClassnames = `fixed flex flex-col ${isCollapsed ? 'w-0 md:w-16' : 'w-72 md:w-64'} bg-white transition-all duration-300 overflow-hidden h-full shadow-md z-40 `;
  return (
    <div className= {sidebarClassnames} >
        {/* TOP */}
      <div className={`flex justify-between gap-3 md:justify-normal items-center pt-3 ${isCollapsed ? 'px-5' : 'px-8'}`}>
        <div>Logo</div>
        <h1 className={`${isCollapsed ? 'hidden' : 'block'} font-extrabold text-2xl `}>EdStack</h1>

        <button
          className="md:hidden px-3 py-3 bg-gray-100 rounded-full hover:bg-blue-100"
            onClick={toggleSidebar}
        >
          <Menu className="w-4 h-4" />
        </button>
      </div>

      {/* links */}
      <div className="flex-grow mt-8">
        
        <SidebarLinks href="/dashboard" icon={Layout} label="Dashboard" isCollapsed={isCollapsed} />
        <SidebarLinks href="/inventory" icon={Archive} label="Inventory" isCollapsed={isCollapsed} />
        <SidebarLinks href="/product" icon={Clipboard} label="Product" isCollapsed={isCollapsed} />
        <SidebarLinks href="/user" icon={User} label="User" isCollapsed={isCollapsed} />
        <SidebarLinks href="/settings" icon={Settings} label="Settings" isCollapsed={isCollapsed} />

      </div>
      {/* footer */}
      <div className={`${isCollapsed ? "hidden": 'block'} mb-10`}>
        <p className="text-gray-100 text-xs"> © 2024 Edstack</p>
      </div>
    </div>
  );
};

export default Sidebar;
