
import { Archive, Clipboard, Layout, type LucideIcon, Menu, Settings, User } from "lucide-react";

interface SidebarLinksProps{
  icon : LucideIcon;
  label : string;
  href : string;
  isCollapsed : boolean;
}
  
const SidebarLinks = ({href, icon : Icon, label, isCollapsed}: SidebarLinksProps) => {

  const isActive = false;

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
  const isSidebarCollapesed = false;


  
  const sidebarClassnames = `fixed flex flex-col ${isSidebarCollapesed ? 'w-0 md:w-16' : 'w-72 md:w-64'} bg-white transition-all duration-300 overflow-hidden h-full shadow-md z-40 `;
  return (
    <div className= {sidebarClassnames} >
        {/* TOP */}
      <div className={`flex justify-between gap-3 md:justify-normal items-center pt-3 ${isSidebarCollapesed ? 'px-5' : 'px-8'}`}>
        <div>Logo</div>
        <h1 className={`${isSidebarCollapesed ? 'hidden' : 'block'} font-extrabold text-2xl `}>EdStack</h1>

        <button
          className="md:hidden px-3 py-3 bg-gray-100 rounded-full hover:bg-blue-100"
            onClick={ () => {}}
        >
          <Menu className="w-4 h-4" />
        </button>
      </div>

      {/* links */}
      <div className="flex-grow mt-8">
        
        <SidebarLinks href="/dashboard" icon={Layout} label="Dashboard" isCollapsed={isSidebarCollapesed} />
        <SidebarLinks href="/inventory" icon={Archive} label="Inventory" isCollapsed={isSidebarCollapesed} />
        <SidebarLinks href="/product" icon={Clipboard} label="Product" isCollapsed={isSidebarCollapesed} />
        <SidebarLinks href="/user" icon={User} label="User" isCollapsed={isSidebarCollapesed} />
        <SidebarLinks href="/settings" icon={Settings} label="Settings" isCollapsed={isSidebarCollapesed} />

      </div>
      {/* footer */}
      <div className={`${isSidebarCollapesed ? "hidden": 'block'} mb-10`}>
        <p className="text-gray-100 text-xs"> © 2024 Edstack</p>
      </div>
    </div>
  );
};

export default Sidebar;
