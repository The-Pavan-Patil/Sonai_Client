import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../state/store";
import {
  fetchProjects,
  selectProjects,
  selectLoading,
} from "../state/portfolioSlice";
import {
  Award,
  Building2,
  CheckCircle2,
  DollarSign,
  Droplet,
  Filter,
  Quote,
  TrendingUp,
  Users,
  Wind,
  Zap,
} from "lucide-react";
import { PointerHighlight } from "../components/pointer-highlight";
import { Boxes } from "../components/background-boxes";
import { cn } from "../lib/utils";
import { LoaderOne } from "../components/loader";

export default function PortfolioPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const projects = useSelector(selectProjects);
  const loading = useSelector(selectLoading);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedProject, setSelectedProject] = useState<any>(null);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96 gap-4">
        <LoaderOne/>
      </div>
    );
  }
  const PortfolioStats = () => {
    const totalProjects = projects.length;
    const totalBudget = projects.reduce(
      (sum: number, project: any) => sum + (project.budget || 0),
      0
    );
    const uniqueClients = new Set(projects.map((p: any) => p.client)).size;
    const featuredProjects = projects.filter(
      (p: any) => p.status === "featured"
    ).length;

    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">
                Total Projects
              </p>
              <p className="text-3xl font-bold">{totalProjects}</p>
            </div>
            <Building2 className="w-8 h-8 text-blue-200" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">
                Project Value
              </p>
              <p className="text-3xl font-bold">
                ₹{(totalBudget / 10000000).toFixed(1)}Cr
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-green-200" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">
                Happy Clients
              </p>
              <p className="text-3xl font-bold">{uniqueClients}</p>
            </div>
            <Users className="w-8 h-8 text-purple-200" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">
                Featured Projects
              </p>
              <p className="text-3xl font-bold">{featuredProjects}</p>
            </div>
            <Award className="w-8 h-8 text-orange-200" />
          </div>
        </div>
      </div>
    );
  };

  const CategoryFilter = () => {
    const categories = [
      { id: "all", label: "All Projects", icon: Building2 },
      { id: "electrical", label: "Electrical", icon: Zap },
      { id: "plumbing", label: "Plumbing", icon: Droplet },
      { id: "hvac", label: "HVAC", icon: Wind },
      { id: "mixed", label: "Mixed Services", icon: TrendingUp },
    ];

    return (
      <div className="flex flex-wrap gap-3 mb-8 justify-center">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedCategory === category.id
                  ? "bg-blue-500 text-white shadow-lg"
                  : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              <Icon className="w-4 h-4" />
              {category.label}
            </button>
          );
        })}
      </div>
    );
  };
  // Client Testimonials Section
  const TestimonialsSection = () => {
    const testimonialsProjects = projects.filter((p: any) => p.testimonial);
    if (testimonialsProjects.length === 0) return null;

    return (
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Client Testimonials
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {testimonialsProjects.map((project: any) => (
            <div
              key={project._id}
              className="bg-white p-8 rounded-xl shadow-lg border border-gray-100"
            >
              <Quote className="w-8 h-8 text-blue-500 mb-4" />
              <p className="text-gray-700 mb-6 italic leading-relaxed">
                "{project.testimonial.text}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {project.testimonial.author.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    {project.testimonial.author}
                  </p>
                  <p className="text-sm text-gray-600">
                    {project.testimonial.position}
                  </p>
                  <p className="text-sm text-blue-600">{project.name}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  };
  // Filter projects based on selected category
  const filteredProjects =
    selectedCategory === "all"
      ? projects
      : projects.filter((p: any) => p.category === selectedCategory);

  

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      
      <div className="text-center pb-8">
        <h1 className="text-5xl font-bold font text-gray-900 mb-1">
          Sonai Engineering Services
        </h1>
      <div className="mx-auto max-w-lg font- py-20 text-2xl font-bold tracking-normal md:text-4xl">
        Building Comfort, Efficiency, and Sustainability,   
          <PointerHighlight
            rectangleClassName="bg-neutral-200 dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600 leading-loose"
            pointerClassName="text-yellow-500 h-3 w-3"
            containerClassName="inline-block mr-1"
          >
            <span className="relative z-10 p-5"> Together</span>
          </PointerHighlight>
         
        </div>
        
        <p className="text-lg text-gray-600 max-w-6xl mx-auto">
          Showcasing our expertise in Mechanical, Electrical, and Plumbing
          services across diverse projects. From commercial complexes to
          residential developments, we deliver excellence in every project.
        </p>
      </div>

      <PortfolioStats />
      <TestimonialsSection />

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Our Projects
        </h2>
        <CategoryFilter />
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
        {filteredProjects.map((project) => (
          <div
            key={project._id}
            className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group cursor-pointer"
            onClick={() => {}}
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
                  <span className="text-white font-medium">
                    No Images Available
                  </span>
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
                <Link
  to={`/projects/${project._id}`}
  className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors duration-200"
>
  View Details →
</Link>
              </div>
            </div>
          </div>
        ))}
      </div>


      
      
      {/* No Projects Message */}
      {filteredProjects.length === 0 && !loading && (
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <Filter className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-slate-700 mb-2">
            No Projects Found
          </h3>
          <p className="text-slate-500">
            Try selecting a different category to view more projects.
          </p>
        </div>
      )}
    </div>
  );
}
