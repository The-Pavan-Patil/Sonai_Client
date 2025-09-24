// src/pages/ProjectDetailPage.tsx
import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../state/store";
import { fetchProjects, selectProjects, selectLoading } from "../state/portfolioSlice";
import { ArrowLeft, Award, Building2, Calendar, Clock, DollarSign, Users, Star, Zap, Droplets, Wrench, Thermometer, Shield, CheckCircle } from "lucide-react";

export default function ProjectDetailPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const projects = useSelector(selectProjects);
  const loading = useSelector(selectLoading);


   const getServiceIcon = (service: string) => {
    const serviceLower = service.toLowerCase();
    if (serviceLower.includes('electrical')) return <Zap className="w-5 h-5 text-yellow-500" />;
    if (serviceLower.includes('plumbing')) return <Droplets className="w-5 h-5 text-blue-500" />;
    if (serviceLower.includes('hvac') || serviceLower.includes('air')) return <Thermometer className="w-5 h-5 text-green-500" />;
    if (serviceLower.includes('maintenance')) return <Wrench className="w-5 h-5 text-gray-500" />;
    if (serviceLower.includes('safety') || serviceLower.includes('security')) return <Shield className="w-5 h-5 text-red-500" />;
    return <CheckCircle className="w-5 h-5 text-purple-500" />;
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'electrical': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'plumbing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'hvac': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-purple-100 text-purple-800 border-purple-200';
    }
  };

  useEffect(() => {
    if (!projects.length) {
      dispatch(fetchProjects());
    }
  }, [dispatch, projects.length]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96 gap-4">
        <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
        <p className="text-gray-600 text-lg font-medium">Loading project details...</p>
      </div>
    );
  }

  const project = projects.find((p) => p._id === projectId);

  if (!project) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Project Not Found</h2>
        <p className="text-gray-600 mb-6">We couldn’t find the project you’re looking for.</p>
        <Link to="/" className="text-blue-600 hover:text-blue-800 font-medium">
          ← Back to Portfolio
        </Link>
      </div>
    );
  }

  return (
     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Back button */}
      <div className="mb-6 flex items-center justify-center">
        <Link to="/" className="flex gap-2 text-blue-600 hover:text-blue-800">
          <ArrowLeft className="w-4 h-4"/>
          Back to Projects
        </Link>
      </div>
    {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl text-center font-bold text-gray-900">
          {project.name}
        </h1>
      </div>
    {/* Image Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {project.images?.length > 0 ? (
          project.images.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={project.name}
              className="w-full h-80 object-cover rounded-lg shadow-sm"
            />
          ))
        ) : (
          <div className="h-80 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center rounded-lg text-white font-semibold">
            No Images Available
          </div>
        )}
      </div>
      
      {/* Project Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        {/* Overview */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Overview</h2>
          <p className="text-gray-600 leading-relaxed">{project.description}</p>
        </div>

        {/* Key Details */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Project Details</h3>
          <ul className="space-y-3 text-gray-700 text-sm">
            <li className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-500" /> <strong>Client:</strong> {project.client}
            </li>
            <li className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-gray-500" /> <strong>Location:</strong> {project.location}
            </li>
            <li className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" /> <strong>Completed:</strong> {project.completedDate}
            </li>
            <li className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-500" /> <strong>Duration:</strong> {project.duration}
            </li>
            <li className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-gray-500" /> <strong>Budget:</strong> ₹{project.budget.toLocaleString()}
            </li>
            <li className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-500" /> <strong>Team Size:</strong> {project.teamSize} experts
            </li>
          </ul>
        </div>
      </div>
      
        {/* Services & Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-3">Services Provided</h3>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            {project.services.map((service, idx) => (
              <li key={idx}>{service}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-3">Key Features</h3>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            {project.features?.map((feature, idx) => (
              <li key={idx}>{feature}</li>
            ))}
          </ul>
        </div>
      </div>


    </div>
  );
}
