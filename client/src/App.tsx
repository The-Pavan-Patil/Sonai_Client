import Portfolio from './Pages/Portfolio';
import { Routes, Route } from 'react-router-dom';
import ProjectDetails from './Pages/ProjectDetails';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Portfolio/>}/>
      <Route path="/projects/:projectId" element={<ProjectDetails/>} />
    </Routes>
  );
};

export default App;