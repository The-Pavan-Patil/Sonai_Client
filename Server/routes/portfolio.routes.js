// routes/portfolio.routes.js
import express from 'express';
import { 
  getProjects, 
  getProjectById, 
  createProject, 
  updateProject, 
  deleteProject,
  getFeaturedProjects
} from '../controllers/portfolio.controller.js';

const router = express.Router();

// Public routes
router.get('/', getProjects);
router.get('/featured', getFeaturedProjects);
router.get('/:id', getProjectById);

// Protected routes
router.post('/',  createProject);
router.put('/:id',  updateProject);
router.delete('/:id',  deleteProject);

export default router;
