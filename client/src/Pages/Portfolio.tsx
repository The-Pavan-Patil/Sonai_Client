import React, { useState } from 'react';
import {
  Building2,
  MapPin,
  Calendar,
  DollarSign,
  Users,
  Award,
  Filter,
  Search,
  Grid3X3,
  List,
  Eye,
  ExternalLink,
  Download,
  Star,
  Zap,
  Droplets,
  Wind,
  ChevronDown,
  Play
} from 'lucide-react';

// Types
interface Project {
  id: string;
  title: string;
  client: string;
  category: 'electrical' | 'plumbing' | 'hvac' | 'mixed';
  location: string;
  completedDate: string;
  duration: string;
  budget: number;
  teamSize: number;
  status: 'completed' | 'featured';
  description: string;
  images: string[];
  videoUrl?: string;
  services: string[];
  awards?: string[];
  testimonial?: {
    text: string;
    author: string;
    position: string;
  };
  features: string[];
  stats: {
    area: string;
    systems: number;
    efficiency: string;
  };
}

// Mock data
const portfolioProjects: Project[] = [
  {
    id: '1',
    title: 'Modern Office Complex - Complete MEP Installation',
    client: 'TechCorp Solutions',
    category: 'mixed',
    location: 'Pune, Maharashtra',
    completedDate: '2024-01-15',
    duration: '8 months',
    budget: 2500000,
    teamSize: 15,
    status: 'featured',
    description: 'Complete MEP installation for a 10-story modern office complex including smart building automation, energy-efficient HVAC systems, and advanced electrical infrastructure.',
    images: ['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800', 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800'],
    videoUrl: 'https://example.com/project-video',
    services: ['Electrical Installation', 'HVAC Systems', 'Plumbing', 'Fire Safety', 'Building Automation'],
    awards: ['Best MEP Project 2024', 'Green Building Excellence'],
    testimonial: {
      text: 'Outstanding work quality and professional approach. The project was completed on time with exceptional attention to detail.',
      author: 'Rajesh Kumar',
      position: 'Project Director, TechCorp Solutions'
    },
    features: ['Smart Building Controls', 'Energy Recovery Ventilation', 'LED Lighting Systems', 'Water Conservation'],
    stats: {
      area: '50,000 sq ft',
      systems: 25,
      efficiency: '30% Energy Savings'
    }
  },
  {
    id: '2',
    title: 'Luxury Residential Complex - HVAC & Electrical',
    client: 'Prestige Developers',
    category: 'hvac',
    location: 'Mumbai, Maharashtra',
    completedDate: '2023-11-20',
    duration: '6 months',
    budget: 1800000,
    teamSize: 12,
    status: 'completed',
    description: 'Premium HVAC and electrical systems for a luxury residential complex with 100 apartments, featuring individual climate control and smart home integration.',
    images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800', 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'],
    services: ['Central Air Conditioning', 'Electrical Distribution', 'Home Automation', 'Security Systems'],
    features: ['Individual Zone Control', 'Smart Thermostats', 'Energy Monitoring', 'Backup Power Systems'],
    stats: {
      area: '75,000 sq ft',
      systems: 18,
      efficiency: '25% Cost Reduction'
    }
  },
  {
    id: '3',
    title: 'Hospital Water Treatment & Plumbing Systems',
    client: 'City General Hospital',
    category: 'plumbing',
    location: 'Nagpur, Maharashtra',
    completedDate: '2023-09-10',
    duration: '4 months',
    budget: 1200000,
    teamSize: 8,
    status: 'completed',
    description: 'Comprehensive plumbing and water treatment systems for a 200-bed hospital including medical gas systems, water purification, and waste management.',
    images: ['https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800', 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800'],
    services: ['Medical Plumbing', 'Water Treatment', 'Waste Management', 'Medical Gas Systems'],
    testimonial: {
      text: 'Critical healthcare infrastructure delivered with precision and reliability. Excellent project management.',
      author: 'Dr. Priya Sharma',
      position: 'Chief Administrator'
    },
    features: ['Medical Grade Piping', 'Water Purification', 'Emergency Shutoffs', 'Infection Control'],
    stats: {
      area: '30,000 sq ft',
      systems: 12,
      efficiency: '99.9% Reliability'
    }
  },
  {
    id: '4',
    title: 'Shopping Mall Electrical Infrastructure',
    client: 'Metro Mall Group',
    category: 'electrical',
    location: 'Bangalore, Karnataka',
    completedDate: '2023-07-25',
    duration: '10 months',
    budget: 3200000,
    teamSize: 20,
    status: 'featured',
    description: 'Complete electrical infrastructure for a large shopping mall including power distribution, lighting systems, emergency backup, and retail electrical services.',
    images: ['https://images.unsplash.com/photo-1555529771-835f59fc5efe?w=800', 'https://images.unsplash.com/photo-1472224371017-08207f84aaae?w=800'],
    services: ['Power Distribution', 'Commercial Lighting', 'Emergency Systems', 'Retail Electrical'],
    awards: ['Commercial Excellence Award 2023'],
    features: ['Smart Lighting Controls', 'Emergency Backup', 'Retail Power Solutions', 'Energy Management'],
    stats: {
      area: '120,000 sq ft',
      systems: 35,
      efficiency: '40% Energy Savings'
    }
  }
];

const categories = [
  { value: 'all', label: 'All Projects', icon: Building2 },
  { value: 'electrical', label: 'Electrical', icon: Zap },
  { value: 'plumbing', label: 'Plumbing', icon: Droplets },
  { value: 'hvac', label: 'HVAC', icon: Wind },
  { value: 'mixed', label: 'Mixed MEP', icon: Building2 }
];

const sortOptions = [
  { value: 'date', label: 'Completion Date' },
  { value: 'budget', label: 'Project Value' },
  { value: 'client', label: 'Client Name' },
  { value: 'category', label: 'Category' }
];

// Portfolio Stats Component
const PortfolioStats: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
    <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-xl text-white">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-blue-100 text-sm font-medium">Total Projects</p>
          <p className="text-3xl font-bold">150+</p>
        </div>
        <Building2 className="w-8 h-8 text-blue-200" />
      </div>
    </div>
    <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-xl text-white">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-green-100 text-sm font-medium">Project Value</p>
          <p className="text-3xl font-bold">₹50Cr+</p>
        </div>
        <DollarSign className="w-8 h-8 text-green-200" />
      </div>
    </div>
    <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-xl text-white">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-purple-100 text-sm font-medium">Happy Clients</p>
          <p className="text-3xl font-bold">85+</p>
        </div>
        <Users className="w-8 h-8 text-purple-200" />
      </div>
    </div>
    <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-xl text-white">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-orange-100 text-sm font-medium">Awards Won</p>
          <p className="text-3xl font-bold">12</p>
        </div>
        <Award className="w-8 h-8 text-orange-200" />
      </div>
    </div>
  </div>
);

// Project Card Component
const ProjectCard: React.FC<{ project: Project; viewMode: 'grid' | 'list' }> = ({ project, viewMode }) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'electrical': return <Zap className="w-4 h-4" />;
      case 'plumbing': return <Droplets className="w-4 h-4" />;
      case 'hvac': return <Wind className="w-4 h-4" />;
      default: return <Building2 className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'electrical': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'plumbing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'hvac': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-purple-100 text-purple-800 border-purple-200';
    }
  };

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 p-6">
        <div className="flex items-start space-x-6">
          <div className="relative w-48 h-32 rounded-lg overflow-hidden flex-shrink-0">
            <img src={project.images[0]} alt={project.title} className="w-full h-full object-cover" />
            {project.status === 'featured' && (
              <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
                <Star className="w-3 h-3 mr-1" />
                Featured
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{project.title}</h3>
                <p className="text-gray-600 mb-2">{project.client}</p>
              </div>
              <div className="flex space-x-2">
                <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  <Eye className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-4 mb-3">
              <span className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center space-x-1 ${getCategoryColor(project.category)}`}>
                {getCategoryIcon(project.category)}
                <span className="capitalize">{project.category}</span>
              </span>
              <div className="flex items-center text-sm text-gray-500">
                <MapPin className="w-4 h-4 mr-1" />
                {project.location}
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="w-4 h-4 mr-1" />
                {new Date(project.completedDate).toLocaleDateString()}
              </div>
            </div>

            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{project.description}</p>

            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Budget:</span>
                <span className="font-semibold text-gray-900 ml-1">₹{(project.budget / 100000).toFixed(1)}L</span>
              </div>
              <div>
                <span className="text-gray-500">Duration:</span>
                <span className="font-semibold text-gray-900 ml-1">{project.duration}</span>
              </div>
              <div>
                <span className="text-gray-500">Team Size:</span>
                <span className="font-semibold text-gray-900 ml-1">{project.teamSize}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-xl transition-all duration-300 group overflow-hidden">
      <div className="relative">
        <div className="aspect-[4/3] overflow-hidden">
          <img 
            src={project.images[0]} 
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        
        {project.status === 'featured' && (
          <div className="absolute top-3 left-3 bg-orange-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
            <Star className="w-3 h-3 mr-1" />
            Featured
          </div>
        )}
        
        {project.videoUrl && (
          <div className="absolute top-3 right-3 bg-black bg-opacity-50 text-white p-2 rounded-full">
            <Play className="w-4 h-4" />
          </div>
        )}

        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex space-x-2">
            <button className="bg-white text-gray-900 p-2 rounded-full hover:bg-gray-100 transition-colors">
              <Eye className="w-4 h-4" />
            </button>
            <button className="bg-white text-gray-900 p-2 rounded-full hover:bg-gray-100 transition-colors">
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <span className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center space-x-1 ${getCategoryColor(project.category)}`}>
            {getCategoryIcon(project.category)}
            <span className="capitalize">{project.category}</span>
          </span>
          {project.awards && project.awards.length > 0 && (
            <Award className="w-4 h-4 text-orange-500" />
          )}
        </div>

        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{project.title}</h3>
        <p className="text-gray-600 text-sm mb-3">{project.client}</p>

        <div className="flex items-center space-x-4 mb-4 text-xs text-gray-500">
          <div className="flex items-center">
            <MapPin className="w-3 h-3 mr-1" />
            {project.location}
          </div>
          <div className="flex items-center">
            <Calendar className="w-3 h-3 mr-1" />
            {new Date(project.completedDate).toLocaleDateString()}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="font-semibold text-gray-900">₹{(project.budget / 100000).toFixed(1)}L</p>
            <p className="text-gray-500 text-xs">Budget</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="font-semibold text-gray-900">{project.duration}</p>
            <p className="text-gray-500 text-xs">Duration</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mb-4">
          {project.services.slice(0, 3).map((service, index) => (
            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
              {service}
            </span>
          ))}
          {project.services.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
              +{project.services.length - 3} more
            </span>
          )}
        </div>

        {project.testimonial && (
          <div className="border-t pt-4">
            <p className="text-xs text-gray-600 italic mb-2">"{project.testimonial.text}"</p>
            <p className="text-xs font-medium text-gray-800">- {project.testimonial.author}</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Main Portfolio Component
const Portfolio: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  const filteredProjects = portfolioProjects
    .filter(project => {
      const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           project.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           project.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.completedDate).getTime() - new Date(a.completedDate).getTime();
        case 'budget':
          return b.budget - a.budget;
        case 'client':
          return a.client.localeCompare(b.client);
        case 'category':
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Our Project Portfolio</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Showcasing our expertise in Mechanical, Electrical, and Plumbing services across diverse projects. 
          From commercial complexes to residential developments, we deliver excellence in every project.
        </p>
      </div>

      {/* Portfolio Stats */}
      <PortfolioStats />

      {/* Filters and Search */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-80"
              />
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">View:</span>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
            
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Download className="w-4 h-4" />
              <span>Export Portfolio</span>
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => {
                    const IconComponent = category.icon;
                    return (
                      <button
                        key={category.value}
                        onClick={() => setSelectedCategory(category.value)}
                        className={`flex items-center space-x-2 px-3 py-2 rounded-lg border text-sm transition-colors ${
                          selectedCategory === category.value
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <IconComponent className="w-4 h-4" />
                        <span>{category.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600">
          Showing {filteredProjects.length} of {portfolioProjects.length} projects
        </p>
      </div>

      {/* Projects Grid/List */}
      <div className={viewMode === 'grid' 
        ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
        : 'space-y-6'
      }>
        {filteredProjects.map((project) => (
          <ProjectCard key={project.id} project={project} viewMode={viewMode} />
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </div>
  );
};

export default Portfolio;