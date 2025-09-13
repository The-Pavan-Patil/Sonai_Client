import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../state/store";
import { fetchProjects, selectProjects, selectLoading } from "../state/portfolioSlice";
import { Award, Building2, DollarSign, Users } from "lucide-react";

export default function PortfolioPage() {
  const dispatch = useDispatch<AppDispatch>();
  const projects = useSelector(selectProjects);
  const loading = useSelector(selectLoading);

  useEffect(() => {
    dispatch(fetchProjects());
    
    
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96 gap-4">
        <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
        <p className="text-gray-600 text-lg font-medium">Loading our portfolio...</p>
      </div>
    );
  }
  const PortfolioStats = () => {
  const totalProjects = projects.length;
  const totalBudget = projects.reduce((sum: number, project: any) => sum + (project.budget || 0), 0);
  const uniqueClients = new Set(projects.map((p: any) => p.client)).size;
  const featuredProjects = projects.filter((p: any) => p.status === 'featured').length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-xl text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100 text-sm font-medium">Total Projects</p>
            <p className="text-3xl font-bold">{totalProjects}</p>
          </div>
          <Building2 className="w-8 h-8 text-blue-200" />
        </div>
      </div>
      <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-xl text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-100 text-sm font-medium">Project Value</p>
            <p className="text-3xl font-bold">₹{(totalBudget / 10000000).toFixed(1)}Cr</p>
          </div>
          <DollarSign className="w-8 h-8 text-green-200" />
        </div>
      </div>
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-xl text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-purple-100 text-sm font-medium">Happy Clients</p>
            <p className="text-3xl font-bold">{uniqueClients}</p>
          </div>
          <Users className="w-8 h-8 text-purple-200" />
        </div>
      </div>
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-xl text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-orange-100 text-sm font-medium">Featured Projects</p>
            <p className="text-3xl font-bold">{featuredProjects}</p>
          </div>
          <Award className="w-8 h-8 text-orange-200" />
        </div>
      </div>
    </div>
  );
};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="text-center pb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Sonai Engineering Services</h1>
        <p className="text-lg text-gray-600 max-w-6xl mx-auto">
          Showcasing our expertise in Mechanical, Electrical, and Plumbing services across diverse projects. 
          From commercial complexes to residential developments, we deliver excellence in every project.
        </p>
      </div>


      <PortfolioStats />


      
      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
        {projects.map((project) => (
          <div
            key={project._id}
            className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group"
          >
            {/* Image Section */}
            <div className="relative h-60 overflow-hidden">
              {project.images && project.images.length > 0 ? (
                <div className="relative h-full">
                  <img
                    src={project.images[0]}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {project.images.length > 1 && (
                    <div className="absolute top-4 right-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm font-medium">
                      +{project.images.length - 1} more
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white font-medium">No Images Available</span>
                </div>
              )}
            </div>

            {/* Content Section */}
            <div className="p-5">
              <h2 className="text-sm font-semibold text-slate-800 mb-3 leading-tight">
                {project.name}
              </h2>
              
              <p className="text-slate-600 mb-6 leading-relaxed line-clamp-3">
                {project.description}
              </p>

              {/* Project Details */}
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <span className="font-semibold text-slate-700 text-sm min-w-16">
                    Client:
                  </span>
                  <span className="text-slate-600 text-sm">
                    {project.client}
                  </span>
                </div>
                
                <div className="flex items-start gap-2">
                  <span className="font-semibold text-slate-700 text-sm min-w-16">
                    Location:
                  </span>
                  <span className="text-slate-600 text-sm">
                    {project.location}
                  </span>
                </div>
              </div>

              {/* View More Button (Optional) */}
              <div className="mt-6 pt-4 border-t border-gray-100">
                <button className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors duration-200">
                  View Details →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* No Projects Message */}
      {projects.length === 0 && !loading && (
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-slate-700 mb-2">
            No Projects Available
          </h3>
          <p className="text-slate-500">
            Check back soon for our latest MEP projects and case studies.
          </p>
        </div>
      )}
    </div>
  );
}
