// src/Pages/ProjectDetailPage.tsx - Enhanced and Error-Free
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../state/store";
import { 
  fetchProjects, 
  selectProjects, 
  selectLoading 
} from "../state/portfolioSlice";
import {
  ArrowLeft,
  Building2,
  Calendar,
  Clock,
  DollarSign,
  Users,
  MapPin,
  Star,
  CheckCircle,
  Award,
  Zap,
  Shield,
  Phone,
  Mail,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  X,
  ExternalLink,
  TreePalm,
} from "lucide-react";
import { LoaderOne } from "../components/loader";

// interface Project {
//   _id: string;
//   projectId: string;
//   title: string;
//   description: string;
//   client: string;
//   location: string;
//   projectType: string;
//   status: string;
//   startDate: string;
//   endDate?: string;
//   projectValue: number;
//   duration: string;
//   scope: string[];
//   features: string[];
//   technologies: string[];
//   images: Array<{
//     url: string;
//     caption: string;
//     isPrimary: boolean;
//   }>;
//   teamSize: number;
//   isFeatured: boolean;
//   createdAt: string;
// }

export default function ProjectDetailPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const projects = useSelector(selectProjects);
  const loading = useSelector(selectLoading);
  
  // Image gallery state
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  
  useEffect(() => {
    if (!projects.length) {
      dispatch(fetchProjects());
    }
  }, [dispatch, projects.length]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoaderOne />
      </div>
    );
  }

  const project = projects.find((p) => p.projectId === projectId);

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Building2 className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Project Not Found</h2>
          <p className="text-gray-600 mb-6">
            We couldn't find the project you're looking for. It may have been moved or doesn't exist.
          </p>
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Portfolio
          </Link>
        </div>
      </div>
    );
  }

  // Helper function to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Helper function to get project status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'ongoing':
        return 'bg-blue-100 text-blue-800';
      case 'upcoming':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Helper function to get project type icon
  const getProjectTypeIcon = (type: string) => {
    switch (type) {
      case 'electrical':
        return <Zap className="w-5 h-5" />;
      case 'plumbing':
        return <TreePalm className="w-5 h-5" />;
      case 'hvac':
        return <Shield className="w-5 h-5" />;
      default:
        return <Building2 className="w-5 h-5" />;
    }
  };

  const nextImage = () => {
    if (project.images && project.images.length > 0) {
      setSelectedImageIndex((prev) => 
        prev === project.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (project.images && project.images.length > 0) {
      setSelectedImageIndex((prev) => 
        prev === 0 ? project.images.length - 1 : prev - 1
      );
    }
  };

  return (
    <div className="min-h-screen  bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white  rounded-xl border- border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Navigation */}
          <div className="mb-6">
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Projects
            </Link>
          </div>

          {/* Project Header */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}>
                  {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                </span>
                {project.isFeatured && (
                  <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current" />
                    Featured
                  </span>
                )}
                <div className="flex items-center gap-1 text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                  {getProjectTypeIcon(project.projectType)}
                  <span className="text-sm font-medium capitalize">{project.projectType}</span>
                </div>
              </div>
              
              <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
                {project.title}
              </h1>
              
              <p className="text-lg text-gray-600 leading-relaxed max-w-3xl">
                {project.description}
              </p>
            </div>

            {/* Quick Stats */}
            <div className="bg-gray-50 rounded-xl p-6 lg:w-80">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Overview</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Project Value</span>
                  <span className="font-semibold text-gray-900">
                    ₹{(project.projectValue / 100000).toFixed(1)}L
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Team Size</span>
                  <span className="font-semibold text-gray-900">{project.teamSize} experts</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-semibold text-gray-900">{project.duration}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Completion</span>
                  <span className="font-semibold text-gray-900">
                    {project.endDate ? formatDate(project.endDate) : 'Ongoing'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Image Gallery */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Project Gallery</h2>
          
          {project.images && project.images.length > 0 ? (
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative">
                <div 
                  className="aspect-video w-full rounded-xl overflow-hidden cursor-pointer shadow-lg"
                  onClick={() => setShowImageModal(true)}
                >
                  <img
                    src={project.images[selectedImageIndex]?.url}
                    alt={project.images[selectedImageIndex]?.caption || project.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-colors duration-300 flex items-center justify-center">
                    <ExternalLink className="w-8 h-8 text-white opacity-0 hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>
                
                {/* Image Navigation */}
                {project.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-colors"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-colors"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                      {selectedImageIndex + 1} / {project.images.length}
                    </div>
                  </>
                )}
              </div>

              {/* Image Caption */}
              {project.images[selectedImageIndex]?.caption && (
                <p className="text-gray-600 text-center italic">
                  {project.images[selectedImageIndex].caption}
                </p>
              )}

              {/* Thumbnail Gallery */}
              {project.images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {project.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                        selectedImageIndex === index 
                          ? 'border-blue-500' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={image.url}
                        alt={image.caption || `Project image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="aspect-video w-full bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white">
              <div className="text-center">
                <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-xl font-medium">No Images Available</p>
              </div>
            </div>
          )}
        </div>

        {/* Project Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Project Information */}
          <div className="lg:col-span-2 space-y-8">
            {/* Client & Location */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Project Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Building2 className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Client</p>
                      <p className="text-gray-600">{project.client}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Location</p>
                      <p className="text-gray-600">{project.location}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Start Date</p>
                      <p className="text-gray-600">{formatDate(project.startDate)}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Duration</p>
                      <p className="text-gray-600">{project.duration}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Scope of Work */}
            {project.scope && project.scope.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Scope of Work</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {project.scope.map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Key Features */}
            {project.features && project.features.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Key Features & Highlights</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {project.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <Award className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Technologies Used */}
            {project.technologies && project.technologies.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Technologies & Equipment</h3>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, index) => (
                    <span 
                      key={index}
                      className="px-3 py-2 bg-blue-50 text-blue-800 rounded-lg text-sm font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Project Stats */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Project Statistics</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-blue-900">Investment</span>
                  </div>
                  <span className="text-lg font-bold text-blue-600">
                    ₹{(project.projectValue / 100000).toFixed(1)}L
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-green-900">Team Size</span>
                  </div>
                  <span className="text-lg font-bold text-green-600">
                    {project.teamSize}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-purple-600" />
                    <span className="font-medium text-purple-900">Duration</span>
                  </div>
                  <span className="text-lg font-bold text-purple-600">
                    {project.duration}
                  </span>
                </div>
              </div>
            </div>

            {/* Contact CTA */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl p-6 text-white">
              <h3 className="text-lg font-bold mb-2">Interested in Similar Work?</h3>
              <p className="text-blue-100 mb-4 text-sm">
                Get in touch with our expert team for your MEP project requirements.
              </p>
              <div className="space-y-2">
                <a 
                  href="tel:+919876543210" 
                  className="flex items-center gap-2 text-blue-100 hover:text-white transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span className="text-sm">+91 98765 43210</span>
                </a>
                <a 
                  href="mailto:info@sonaiengg.com" 
                  className="flex items-center gap-2 text-blue-100 hover:text-white transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">info@sonaiengg.com</span>
                </a>
              </div>
            </div>

            {/* Related Projects */}
            {/* <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Related Projects</h3>
              <div className="space-y-3">
                {projects
                  .filter((p: Project) => 
                    p.projectType === project.projectType && 
                    p.projectId !== project.projectId
                  )
                  .slice(0, 3)
                  .map((relatedProject: Project) => (
                    <Link
                      key={relatedProject.projectId}
                      to={`/projects/${relatedProject.projectId}`}
                      className="block p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                    >
                      <h4 className="font-medium text-gray-900 text-sm line-clamp-2 mb-1">
                        {relatedProject.title}
                      </h4>
                      <p className="text-xs text-gray-600">{relatedProject.client}</p>
                    </Link>
                  ))}
              </div>
            </div> */}
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Start Your MEP Project?
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Our expert team is ready to bring your vision to life with professional MEP solutions. 
            Contact us today for a consultation and detailed project proposal.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+919876543210"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <Phone className="w-4 h-4" />
              Call Now
            </a>
            <a
              href="mailto:info@sonaiengg.com"
              className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-900 px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <Mail className="w-4 h-4" />
              Email Us
            </a>
            <Link
              to="/"
              className="inline-flex items-center gap-2 border border-gray-300 hover:border-gray-400 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors"
            >
              View More Projects
            </Link>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {showImageModal && project.images && project.images.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
          <div className="relative max-w-4xl max-h-full p-4">
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <X className="w-8 h-8" />
            </button>
            <img
              src={project.images[selectedImageIndex]?.url}
              alt={project.images[selectedImageIndex]?.caption || project.title}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            {project.images[selectedImageIndex]?.caption && (
              <p className="text-white text-center mt-4 text-lg">
                {project.images[selectedImageIndex].caption}
              </p>
            )}
            {project.images.length > 1 && (
              <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-4">
                <button
                  onClick={prevImage}
                  className="bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-3 rounded-full transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-3 rounded-full transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
