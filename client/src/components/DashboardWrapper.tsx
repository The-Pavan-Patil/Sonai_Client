import Sidebar from "./Sidebar"
import Navbar from "./Navbar"
import { useSelector } from "react-redux";
import type { RootState } from "../state/store";


const DashboardLayout : React.FC<{children : React.ReactNode}> = ({children}) => {
  const isCollapsed = useSelector((state : RootState) => state.sidebar.isCollapsed);
  return (
    <div className={` flex bg-gray-50 text-gray-900 w-full min-h-screen`}>
    <Sidebar/>
    <main className={`flex flex-col w-full h-full py-7 px-9 bg-gray-50 ${
          isCollapsed ? "md:pl-24" : "md:pl-72"
        }`}>
      <Navbar></Navbar>
      {children}</main>
    </div>
  )
}

const DashboardWrapper = ({children} : {children : React.ReactNode }) => {
  return (
      <DashboardLayout>{children}</DashboardLayout>
  )
}

export default DashboardWrapper