// controllers/portfolio.controller.js
import Project from '../models/Project.js';

// Get all projects
export const getProjects = async (req, res) => {
  try {
    const { status, projectType, featured } = req.query;
    
    const filter = { isActive: true };
    
    if (status && status !== 'all') filter.status = status;
    if (projectType && projectType !== 'all') filter.projectType = projectType;
    if (featured === 'true') filter.isFeatured = true;

    const projects = await Project.find(filter)
      .sort({ createdAt: -1 })
      .select('-__v');

    res.json({
      success: true,
      count: projects.length,
      projects
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching projects',
      error: error.message
    });
  }
};

// Get single project
export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findOne({ 
      projectId: req.params.id,
      isActive: true 
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.json({
      success: true,
      project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching project',
      error: error.message
    });
  }
};

// Create project with Cloudinary URLs
export const createProject = async (req, res) => {
  try {
    // Generate Project ID
    const count = await Project.countDocuments();
    const projectId = `PROJ${String(count + 1).padStart(4, '0')}`;

    // Process images - set first image as primary
    let images = [];
    if (req.body.images && Array.isArray(req.body.images)) {
      images = req.body.images.map((img, index) => ({
        url: img.url,
        caption: img.caption || '',
        isPrimary: index === 0
      }));
    }

    // Process arrays from strings if needed
    const processArray = (field) => {
      if (Array.isArray(field)) return field;
      if (typeof field === 'string') return field.split(',').map(item => item.trim()).filter(item => item);
      return [];
    };

    const projectData = {
      projectId,
      title: req.body.title,
      description: req.body.description,
      client: req.body.client,
      location: req.body.location,
      projectType: req.body.projectType,
      status: req.body.status || 'completed',
      startDate: req.body.startDate,
      endDate: req.body.endDate || null,
      projectValue: req.body.projectValue || 0,
      duration: req.body.duration || '',
      scope: processArray(req.body.scope),
      features: processArray(req.body.features),
      technologies: processArray(req.body.technologies),
      images,
      teamSize: req.body.teamSize || 1,
      isFeatured: req.body.isFeatured || false
    };

    const project = new Project(projectData);
    await project.save();

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      project
    });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating project',
      error: error.message
    });
  }
};

// Update project
export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;

    // Process arrays from strings if needed
    const processArray = (field) => {
      if (Array.isArray(field)) return field;
      if (typeof field === 'string') return field.split(',').map(item => item.trim()).filter(item => item);
      return [];
    };

    const updates = { ...req.body };

    // Process array fields
    if (updates.scope) updates.scope = processArray(updates.scope);
    if (updates.features) updates.features = processArray(updates.features);
    if (updates.technologies) updates.technologies = processArray(updates.technologies);

    // Process images
    if (updates.images && Array.isArray(updates.images)) {
      updates.images = updates.images.map((img, index) => ({
        url: img.url,
        caption: img.caption || '',
        isPrimary: index === 0
      }));
    }

    const project = await Project.findOneAndUpdate(
      { projectId: id },
      updates,
      { new: true, runValidators: true }
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.json({
      success: true,
      message: 'Project updated successfully',
      project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating project',
      error: error.message
    });
  }
};

// Delete project
export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    
    const project = await Project.findOneAndDelete({ projectId: id });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting project',
      error: error.message
    });
  }
};

// Get featured projects
export const getFeaturedProjects = async (req, res) => {
  try {
    const projects = await Project.find({ 
      isFeatured: true, 
      isActive: true 
    })
    .sort({ createdAt: -1 })
    .limit(6)
    .select('-__v');

    res.json({
      success: true,
      count: projects.length,
      projects
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching featured projects',
      error: error.message
    });
  }
};
