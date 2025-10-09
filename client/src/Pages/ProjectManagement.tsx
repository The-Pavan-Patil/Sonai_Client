// Pages/ProjectManagement.tsx
import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Tag,
  Star,
  Image as ImageIcon,
  Save,
  X,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import API_CONFIG from '../config/api';

interface Project {
  _id: string;
  projectId: string;
  title: string;
  description: string;
  client: string;
  location: string;
  projectType: string;
  status: string;
  startDate: string;
  endDate?: string;
  projectValue: number;
  duration: string;
  scope: string[];
  features: string[];
  technologies: string[];
  images: Array<{
    url: string;
    caption: string;
    isPrimary: boolean;
  }>;
  teamSize: number;
  isFeatured: boolean;
  createdAt: string;
}

const ProjectManagement: React.FC = () => {
  // State management
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // View states
  const [activeView, setActiveView] = useState<'list' | 'create' | 'edit' | 'view'>('list');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    client: '',
    location: '',
    projectType: 'electrical',
    status: 'completed',
    startDate: '',
    endDate: '',
    projectValue: '',
    duration: '',
    scope: '',
    features: '',
    technologies: '',
    teamSize: '',
    isFeatured: false,
    images: [{ url: '', caption: '' }]
  });

  // Fetch projects
  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_CONFIG.baseURL}api/portfolio`, {
        credentials: 'include'
      });
      const data = await response.json();

      if (data.success) {
        setProjects(data.projects);
      } else {
        setError('Failed to fetch projects');
      }
    } catch (error) {
      setError('Network error while fetching projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Create project
  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      // Prepare data
      const projectData = {
        ...formData,
        projectValue: parseFloat(formData.projectValue) || 0,
        teamSize: parseInt(formData.teamSize) || 1,
        scope: formData.scope.split(',').map(item => item.trim()).filter(item => item),
        features: formData.features.split(',').map(item => item.trim()).filter(item => item),
        technologies: formData.technologies.split(',').map(item => item.trim()).filter(item => item),
        images: formData.images.filter(img => img.url)
      };

      const response = await fetch(`${API_CONFIG.baseURL}api/portfolio`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(projectData)
      });

      const data = await response.json();
      
      if (data.success) {
        setSuccess('Project created successfully!');
        setActiveView('list');
        resetForm();
        fetchProjects();
      } else {
        setError(data.message || 'Failed to create project');
      }
    } catch (error) {
      setError('Network error while creating project');
    } finally {
      setLoading(false);
    }
  };

  // Update project
  const handleUpdateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject) return;

    try {
      setLoading(true);
      
      const projectData = {
        ...formData,
        projectValue: parseFloat(formData.projectValue) || 0,
        teamSize: parseInt(formData.teamSize) || 1,
        scope: formData.scope.split(',').map(item => item.trim()).filter(item => item),
        features: formData.features.split(',').map(item => item.trim()).filter(item => item),
        technologies: formData.technologies.split(',').map(item => item.trim()).filter(item => item),
        images: formData.images.filter(img => img.url)
      };

      const response = await fetch(`${API_CONFIG.baseURL}api/portfolio/${selectedProject.projectId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(projectData)
      });

      const data = await response.json();
      
      if (data.success) {
        setSuccess('Project updated successfully!');
        setActiveView('list');
        resetForm();
        fetchProjects();
      } else {
        setError(data.message || 'Failed to update project');
      }
    } catch (error) {
      setError('Network error while updating project');
    } finally {
      setLoading(false);
    }
  };

  // Delete project
  const handleDeleteProject = async (project: Project) => {
    if (!window.confirm(`Are you sure you want to delete "${project.title}"?`)) {
      return;
    }

    try {
      const response = await fetch(`${API_CONFIG.baseURL}api/portfolio/${project.projectId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Project deleted successfully!');
        fetchProjects();
      } else {
        setError(data.message || 'Failed to delete project');
      }
    } catch (error) {
      setError('Network error while deleting project');
    }
  };

  // Form helpers
  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      client: '',
      location: '',
      projectType: 'electrical',
      status: 'completed',
      startDate: '',
      endDate: '',
      projectValue: '',
      duration: '',
      scope: '',
      features: '',
      technologies: '',
      teamSize: '',
      isFeatured: false,
      images: [{ url: '', caption: '' }]
    });
    setSelectedProject(null);
  };

  const loadProjectToForm = (project: Project) => {
    setFormData({
      title: project.title,
      description: project.description,
      client: project.client,
      location: project.location,
      projectType: project.projectType,
      status: project.status,
      startDate: project.startDate.split('T')[0],
      endDate: project.endDate ? project.endDate.split('T')[0] : '',
      projectValue: project.projectValue.toString(),
      duration: project.duration,
      scope: project.scope.join(', '),
      features: project.features.join(', '),
      technologies: project.technologies.join(', '),
      teamSize: project.teamSize.toString(),
      isFeatured: project.isFeatured,
      images: project.images.length > 0 ? project.images : [{ url: '', caption: '' }]
    });
    setSelectedProject(project);
  };

  // Add image field
  const addImageField = () => {
    setFormData({
      ...formData,
      images: [...formData.images, { url: '', caption: '' }]
    });
  };

  // Remove image field
  const removeImageField = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      images: newImages.length > 0 ? newImages : [{ url: '', caption: '' }]
    });
  };

  // Update image
  const updateImage = (index: number, field: 'url' | 'caption', value: string) => {
    const newImages = [...formData.images];
    newImages[index][field] = value;
    setFormData({
      ...formData,
      images: newImages
    });
  };

  // Filter projects
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    const matchesType = typeFilter === 'all' || project.projectType === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  // Clear alerts
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError('');
        setSuccess('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Project Management</h1>
              <p className="text-gray-600 mt-1">Manage portfolio projects and showcase your MEP expertise</p>
            </div>
            <button
              onClick={() => {
                resetForm();
                setActiveView('create');
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add New Project
            </button>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            <span>{success}</span>
          </div>
        )}

        {/* Main Content */}
        {activeView === 'list' && (
          <div className="bg-white rounded-xl shadow-sm border">
            {/* Filters */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search projects..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="upcoming">Upcoming</option>
                </select>

                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Types</option>
                  <option value="electrical">Electrical</option>
                  <option value="plumbing">Plumbing</option>
                  <option value="hvac">HVAC</option>
                  <option value="firefighting">Fire Fighting</option>
                  <option value="automation">Automation</option>
                  <option value="mixed">Mixed</option>
                </select>
              </div>
            </div>

            {/* Projects List */}
            <div className="p-6">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <span className="ml-3 text-gray-600">Loading projects...</span>
                </div>
              ) : filteredProjects.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ImageIcon className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
                  <p className="text-gray-600">Create your first project to showcase your MEP expertise</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredProjects.map((project) => (
                    <div key={project._id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                      {/* Project Image */}
                      <div className="aspect-video bg-gray-100 relative overflow-hidden">
                        {project.images.length > 0 && project.images[0].url ? (
                          <img
                            src={project.images[0].url}
                            alt={project.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon className="w-12 h-12 text-gray-400" />
                          </div>
                        )}
                        
                        {project.isFeatured && (
                          <div className="absolute top-3 right-3">
                            <Star className="w-5 h-5 text-yellow-500 fill-current" />
                          </div>
                        )}

                        {/* Status Badge */}
                        <div className="absolute top-3 left-3">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            project.status === 'completed' ? 'bg-green-100 text-green-800' :
                            project.status === 'ongoing' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                          </span>
                        </div>
                      </div>

                      {/* Project Info */}
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-gray-900 text-lg line-clamp-2">{project.title}</h3>
                        </div>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="w-4 h-4 mr-2" />
                            {project.location}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Tag className="w-4 h-4 mr-2" />
                            {project.projectType.charAt(0).toUpperCase() + project.projectType.slice(1)}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Users className="w-4 h-4 mr-2" />
                            {project.teamSize} team members
                          </div>
                          {project.projectValue > 0 && (
                            <div className="flex items-center text-sm text-gray-600">
                              <DollarSign className="w-4 h-4 mr-2" />
                              ₹{(project.projectValue / 100000).toFixed(1)}L
                            </div>
                          )}
                        </div>

                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{project.description}</p>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setSelectedProject(project);
                              setActiveView('view');
                            }}
                            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-md text-sm font-medium flex items-center justify-center gap-1 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </button>
                          <button
                            onClick={() => {
                              loadProjectToForm(project);
                              setActiveView('edit');
                            }}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-medium flex items-center justify-center gap-1 transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteProject(project)}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm font-medium flex items-center justify-center transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Create/Edit Form */}
        {(activeView === 'create' || activeView === 'edit') && (
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  {activeView === 'create' ? 'Add New Project' : 'Edit Project'}
                </h2>
                <button
                  onClick={() => setActiveView('list')}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <form onSubmit={activeView === 'create' ? handleCreateProject : handleUpdateProject} className="p-6">
              <div className="space-y-6">
                {/* Basic Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Project Title</label>
                      <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., Commercial Office Complex - Electrical Installation"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Client Name</label>
                      <input
                        type="text"
                        required
                        value={formData.client}
                        onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., ABC Developers"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                      <input
                        type="text"
                        required
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., Pune, Maharashtra"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Project Type</label>
                      <select
                        value={formData.projectType}
                        onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="electrical">Electrical</option>
                        <option value="plumbing">Plumbing</option>
                        <option value="hvac">HVAC</option>
                        <option value="firefighting">Fire Fighting</option>
                        <option value="automation">Automation</option>
                        <option value="mixed">Mixed</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="completed">Completed</option>
                        <option value="ongoing">Ongoing</option>
                        <option value="upcoming">Upcoming</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Team Size</label>
                      <input
                        type="number"
                        min="1"
                        value={formData.teamSize}
                        onChange={(e) => setFormData({ ...formData, teamSize: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., 12"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      required
                      rows={4}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Detailed description of the project..."
                    />
                  </div>
                </div>

                {/* Project Details */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                      <input
                        type="date"
                        required
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                      <input
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Project Value (₹)</label>
                      <input
                        type="number"
                        min="0"
                        value={formData.projectValue}
                        onChange={(e) => setFormData({ ...formData, projectValue: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., 2500000"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                      <input
                        type="text"
                        value={formData.duration}
                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., 6 months"
                      />
                    </div>
                  </div>
                </div>

                {/* Project Scope & Features */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Scope & Features</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Scope of Work</label>
                      <textarea
                        rows={3}
                        value={formData.scope}
                        onChange={(e) => setFormData({ ...formData, scope: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter scope items separated by commas, e.g., Main electrical panel installation, Power distribution systems, LED lighting installation"
                      />
                      <p className="text-xs text-gray-500 mt-1">Separate items with commas</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Key Features</label>
                      <textarea
                        rows={3}
                        value={formData.features}
                        onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter features separated by commas, e.g., Energy-efficient LED lighting, Smart building automation, Redundant power systems"
                      />
                      <p className="text-xs text-gray-500 mt-1">Separate items with commas</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Technologies Used</label>
                      <textarea
                        rows={3}
                        value={formData.technologies}
                        onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter technologies separated by commas, e.g., Schneider Electric panels, Philips LED fixtures, ABB contactors"
                      />
                      <p className="text-xs text-gray-500 mt-1">Separate items with commas</p>
                    </div>
                  </div>
                </div>

                {/* Project Images */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Images</h3>
                  <div className="space-y-4">
                    {formData.images.map((image, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium text-gray-900">Image {index + 1}</h4>
                          {formData.images.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeImageField(index)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Cloudinary Image URL
                            </label>
                            <input
                              type="url"
                              value={image.url}
                              onChange={(e) => updateImage(index, 'url', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="https://res.cloudinary.com/your-cloud-name/image/upload/..."
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Caption
                            </label>
                            <input
                              type="text"
                              value={image.caption}
                              onChange={(e) => updateImage(index, 'caption', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="e.g., Main electrical panel installation"
                            />
                          </div>

                          {image.url && (
                            <div className="mt-2">
                              <img
                                src={image.url}
                                alt={image.caption || `Image ${index + 1}`}
                                className="w-32 h-24 object-cover rounded-lg border border-gray-200"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    
                    <button
                      type="button"
                      onClick={addImageField}
                      className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-gray-600 hover:text-gray-800 hover:border-gray-400 transition-colors"
                    >
                      <Plus className="w-5 h-5 mx-auto mb-2" />
                      Add Another Image
                    </button>
                  </div>
                </div>

                {/* Featured Toggle */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="featured" className="text-sm font-medium text-gray-700">
                    Mark as featured project
                  </label>
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setActiveView('list')}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        {activeView === 'create' ? 'Creating...' : 'Updating...'}
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        {activeView === 'create' ? 'Create Project' : 'Update Project'}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* View Project */}
        {activeView === 'view' && selectedProject && (
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedProject.title}</h2>
                  <p className="text-gray-600">{selectedProject.projectId}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      loadProjectToForm(selectedProject);
                      setActiveView('edit');
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => setActiveView('list')}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Project Images */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Images</h3>
                  {selectedProject.images.length > 0 ? (
                    <div className="space-y-4">
                      {selectedProject.images.map((image, index) => (
                        <div key={index} className="space-y-2">
                          <img
                            src={image.url}
                            alt={image.caption}
                            className="w-full h-64 object-cover rounded-lg border border-gray-200"
                          />
                          {image.caption && (
                            <p className="text-sm text-gray-600">{image.caption}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                      <ImageIcon className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Project Details */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Information</h3>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                        <span className="text-gray-700">{selectedProject.location}</span>
                      </div>
                      <div className="flex items-center">
                        <Tag className="w-5 h-5 text-gray-400 mr-3" />
                        <span className="text-gray-700 capitalize">{selectedProject.projectType}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                        <span className="text-gray-700">{selectedProject.duration}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="w-5 h-5 text-gray-400 mr-3" />
                        <span className="text-gray-700">{selectedProject.teamSize} team members</span>
                      </div>
                      {selectedProject.projectValue > 0 && (
                        <div className="flex items-center">
                          <DollarSign className="w-5 h-5 text-gray-400 mr-3" />
                          <span className="text-gray-700">₹{(selectedProject.projectValue / 100000).toFixed(1)}L</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                    <p className="text-gray-700">{selectedProject.description}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Client</h4>
                    <p className="text-gray-700">{selectedProject.client}</p>
                  </div>

                  {selectedProject.scope.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Scope of Work</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {selectedProject.scope.map((item, index) => (
                          <li key={index} className="text-gray-700 text-sm">{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {selectedProject.features.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Key Features</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {selectedProject.features.map((item, index) => (
                          <li key={index} className="text-gray-700 text-sm">{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {selectedProject.technologies.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Technologies Used</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedProject.technologies.map((tech, index) => (
                          <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectManagement;
