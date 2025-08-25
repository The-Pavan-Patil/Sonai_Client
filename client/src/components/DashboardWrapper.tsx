import Sidebar from "./Sidebar"
import Navbar from "./Navbar"


const DashboardWrapper : React.FC<{children : React.ReactNode}> = ({children}) => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar></Sidebar>
      <Navbar></Navbar>
      <div className="flex-1 flex flex-col overflow-hidden">
      
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

export default DashboardWrapper