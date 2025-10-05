import Portfolio from './Pages/Portfolio';
import { Routes, Route } from 'react-router-dom';
import ProjectDetails from './Pages/ProjectDetails';
import AdminDashboard from './Pages/AdminDashboard';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Portfolio/>}/>
      <Route path="/admin" element={<AdminDashboard/>}/>
      <Route path="/projects/:projectId" element={<ProjectDetails/>} />
    </Routes>
  );
};

export default App;