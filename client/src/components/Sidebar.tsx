
import { Archive, Clipboard, Layout, type LucideIcon, Menu, Settings, User } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../state/store";
import { setSidebar } from "../state/sidebarSlice";
import { Link, useLocation } from "react-router-dom";
import Logo from "../assets/Logo_full.png";
import half from "../assets/Logo_half.svg";


interface SidebarLinksProps{
  icon : LucideIcon;
  label : string;
  href : string;
  isCollapsed : boolean;
}
  
const SidebarLinks = ({href, icon : Icon, label, isCollapsed}: SidebarLinksProps) => {
  const location = useLocation();
  const isActive = location.pathname === href;

  return (
    <Link to={href}>
      <div className={`
        cursor-pointer flex items-center
        ${ isCollapsed ? 'justify-center py-4': 'justify-start py-4 px-8' } hover:text-blue-500 hover:bg-blue-100 gap-3 transition-colors
        ${isActive ? "bg-blue-200 text-white" : "" }`}>
          <Icon className="w-6 h-6 !text-gray-700"/>
          <span className={`${isCollapsed ? "hidden" : "block"} font-medium text-gray-700`}>{label}</span>
      </div>
    </Link>
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
      <div className={`flex justify-center gap-3 md:justify-normal pl-2 items-center pt-7 ${isCollapsed ? '' : 'px-8'}`}>
        {isCollapsed ? <div className="">
          <img src={half} className=""/>
        </div> : <div className="">
          <img src={Logo} className=""/>
        </div>}

        <div className="">
          <button
          className="md:hidden px-3 py-3 bg-gray-100 rounded-full hover:bg-blue-100"
            onClick={toggleSidebar}
        >
          <Menu className="w-4 h-4" />
        </button>
        </div>
      </div>

      {/* links */}
      <div className="flex-grow mt-8">
        
        <SidebarLinks href="/" icon={Layout} label="Portfolio" isCollapsed={isCollapsed} />
        <SidebarLinks href="/inventory" icon={Archive} label="Inventory" isCollapsed={isCollapsed} />
        <SidebarLinks href="/admin/projects" icon={Clipboard} label="Project" isCollapsed={isCollapsed} />
        <SidebarLinks href="/admin" icon={User} label="Admin" isCollapsed={isCollapsed} />
        <SidebarLinks href="/settings" icon={Settings} label="Settings" isCollapsed={isCollapsed} />

      </div>
      {/* footer */}
      <div className={`${isCollapsed ? "hidden": 'block'} mb-10`}>
        <p className="text-gray-100 text-xs"></p>
      </div>
    </div>
  );
};

export default Sidebar;
