// Pages/Portfolio.tsx - Enhanced with additional features
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
  DollarSign,
  Droplet,
  Filter,
  TrendingUp,
  Users,
  Wind,
  Zap,
  Star,
  MapPin,
  ArrowRight,
  CheckCircle,
  Phone,
  Mail,
  Clock,
  Target,
  Shield,
  Lightbulb,
} from "lucide-react";
import { PointerHighlight } from "../components/pointer-highlight";
import { LoaderOne } from "../components/loader";
import { InfiniteMovingCards } from "../components/infinite-moving-cards";

export default function PortfolioPage() {
  const dispatch = useDispatch<AppDispatch>();
  const projects = useSelector(selectProjects);
  const loading = useSelector(selectLoading);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  



  const PortfolioStats = () => {
    const totalProjects = projects.length;
    const totalBudget = projects.reduce(
      (sum: number, project) => sum + (project.projectValue || 0),
      0
    );
    const uniqueClients = new Set(projects.map((p) => p.client)).size;
    const featuredProjects = projects.filter((p) => p.isFeatured).length;

    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="bg-gradient-to-r from-gray-800 to-gray-950 p-6 rounded-xl text-gray-300 transform hover:scale-105 transition-transform duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white-300 text-sm font-medium">
                Total Projects
              </p>
              <p className="text-3xl font-bold">{totalProjects}</p>
              <p className="text-white-200 text-xs mt-1">
                Completed Successfully
              </p>
            </div>
            <Building2 className="w-8 h-8 text-white-200" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-gray-800 to-gray-950 p-6 rounded-xl text-gray-300 transform hover:scale-105 transition-transform duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className=" text-white-300 text-sm font-medium">
                Project Value
              </p>
              <p className="text-3xl font-bold text-white-300">
                ₹{(totalBudget / 10000000).toFixed(1)}Cr
              </p>
              <p className="text-white-200 text-xs mt-1">Total Investment</p>
            </div>
            <DollarSign className="w-8 h-8  text-white-300" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-gray-800 to-gray-950 p-6 rounded-xl text-gray-300 transform hover:scale-105 transition-transform duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white-100 text-sm font-medium">
                Happy Clients
              </p>
              <p className="text-3xl font-bold">{uniqueClients}</p>
              <p className="text-white text-xs mt-1">Trusted Partners</p>
            </div>
            <Users className="w-8 h-8 text-white-200" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-gray-800 to-gray-950 p-6 rounded-xl text-gray-300 transform hover:scale-105 transition-transform duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white text-sm font-medium">
                Featured Projects
              </p>
              <p className="text-3xl font-bold">{featuredProjects}</p>
              <p className="text-white text-xs mt-1">Premium Quality</p>
            </div>
            <Award className="w-8 h-8 text-white-200" />
          </div>
        </div>
      </div>
    );
  };

  // NEW: Company Services Section
  const ServicesSection = () => {
    const services = [
      {
        icon: Zap,
        title: "Electrical Systems",
        description:
          "Complete electrical installations, power distribution, and automation systems",
        features: [
          "Power Distribution",
          "Lighting Systems",
          "Automation",
          "Fire Safety",
        ],
      },
      {
        icon: Droplet,
        title: "Plumbing Services",
        description:
          "Advanced plumbing solutions for residential and commercial properties",
        features: [
          "Water Supply",
          "Drainage",
          "Fire Fighting",
          "Water Treatment",
        ],
      },
      {
        icon: Wind,
        title: "HVAC Solutions",
        description:
          "Energy-efficient heating, ventilation, and air conditioning systems",
        features: [
          "Central AC",
          "Ventilation",
          "Climate Control",
          "Energy Efficiency",
        ],
      },
      {
        icon: Shield,
        title: "Fire Safety",
        description:
          "Comprehensive fire protection and safety systems installation",
        features: [
          "Fire Alarms",
          "Sprinkler Systems",
          "Smoke Detection",
          "Emergency Systems",
        ],
      },
    ];

    return (
      <div className="bg-gray-50 py-16 mb-16 rounded-2xl">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Expertise
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Comprehensive MEP solutions tailored to your needs with
              cutting-edge technology and expert craftsmanship
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <div
                  key={index}
                  className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-gray" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {service.description}
                  </p>
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li
                        key={idx}
                        className="flex items-center text-xs text-gray-500"
                      >
                        <CheckCircle className="w-3 h-3 text-green-500 mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // NEW: Company Values Section
  const CompanyValues = () => {
    const values = [
      {
        icon: Target,
        title: "Precision",
        description:
          "Every project executed with meticulous attention to detail",
      },
      {
        icon: Clock,
        title: "Timely Delivery",
        description: "Committed to delivering projects on schedule",
      },
      {
        icon: Award,
        title: "Quality Excellence",
        description: "Uncompromising quality in every aspect of our work",
      },
      {
        icon: Lightbulb,
        title: "Innovation",
        description: "Leveraging latest technology for optimal solutions",
      },
    ];

    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
        {values.map((value, index) => {
          const Icon = value.icon;
          return (
            <div key={index} className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon className="w-8 h-8 text-gray" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {value.title}
              </h3>
              <p className="text-gray-600 text-sm">{value.description}</p>
            </div>
          );
        })}
      </div>
    );
  };

  // NEW: Client Testimonials Section
  const TestimonialsSection = () => {
    const testimonials = [
      {
        quote:
          "Sonai Engineering Services delivered exceptional quality in our commercial project. Their attention to detail and professional approach exceeded our expectations.",
        client: "Rajesh Kumar",
        company: "Real Estate Developer",
        rating: 5,
      },
      {
        quote:
          "The team's expertise in MEP systems is remarkable. They completed our industrial project on time and within budget.",
        client: "Priya Sharma",
        company: "Manufacturing Industry",
        rating: 5,
      },
      {
        quote:
          "Professional, reliable, and innovative. Sonai Engineering has been our trusted partner for multiple projects.",
        client: "Amit Patel",
        company: "Construction Company",
        rating: 5,
      },
    ];

    return (
      // <div className="bg-gray-100 py-16 mb-16 rounded-2xl">
      //   <div className="max-w-6xl mx-auto px-6">
      //     <div className="text-center mb-12">
      //       <h2 className="text-3xl font-bold text-gray-900 mb-4">
      //         What Our Clients Say
      //       </h2>
      //       <p className="text-gray-600">
      //         Trusted by leading companies across industries
      //       </p>
      //     </div>

      //     <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      //       {testimonials.map((testimonial, index) => (
      //         <div key={index} className="bg-white p-6 rounded-xl shadow-lg">
      //           <div className="flex mb-4">
      //             {[...Array(testimonial.rating)].map((_, i) => (
      //               <Star
      //                 key={i}
      //                 className="w-5 h-5 text-yellow-400 fill-current"
      //               />
      //             ))}
      //           </div>
      //           <Quote className="w-8 h-8 text-blue-300 mb-4" />
      //           <p className="text-gray-700 mb-4 italic">
      //             "{testimonial.quote}"
      //           </p>
      //           <div className="border-t pt-4">
      //             <p className="font-semibold text-gray-900">
      //               {testimonial.client}
      //             </p>
      //             <p className="text-sm text-gray-600">{testimonial.company}</p>
      //           </div>
      //         </div>
      //       ))}
      //     </div>
      //   </div>
      // </div>
       <div className="h-[40rem] rounded-md flex flex-col antialiased dark:bg-black dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden">
      <InfiniteMovingCards
        items={testimonials.map((t) => { return {quote: t.quote, name: t.client, title: t.company} })}
        direction="right"
        speed="slow"
        pauseOnHover={false}
      />
    </div>
    );
  };

  // NEW: Contact CTA Section
  const ContactCTA = () => {
    return (
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 rounded-2xl text-white text-center mb-16">
        <h2 className="text-3xl font-bold mb-4">
          Ready to Start Your Project?
        </h2>
        <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
          Get in touch with our expert team for a consultation. We'll help bring
          your vision to life with our comprehensive MEP solutions.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <div className="flex items-center gap-2 text-blue-100">
            <Phone className="w-5 h-5" />
            <span>+91 98765 43210</span>
          </div>
          <div className="flex items-center gap-2 text-blue-100">
            <Mail className="w-5 h-5" />
            <span>info@sonaiengg.com</span>
          </div>
          <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-200 flex items-center gap-2">
            Get Quote <ArrowRight className="w-4 h-4" />
          </button>
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
              className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedCategory === category.id
                  ? "bg-blue-500 text-white shadow-lg transform scale-105"
                  : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50 hover:border-blue-300"
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

  // Filter projects based on selected category
  const filteredProjects =
    selectedCategory === "all"
      ? projects
      : projects.filter((p) => p.projectType === selectedCategory);

  // NEW: Featured Projects Section
  const FeaturedProjects = () => {
    const featuredProjects = projects.filter((p) => p.isFeatured).slice(0, 3);

    if (featuredProjects.length === 0) return null;

    return (
      <div className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Featured Projects
          </h2>
          <p className="text-gray-600">
            Highlighting our most prestigious and impactful projects
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {featuredProjects.map((project) => (
            <div key={project.projectId} className="relative group">
              <div className="bg-white rounded-xl overflow-hidden shadow-xl border border-gray-200 transition-all duration-300 hover:shadow-2xl">
                <div className="relative h-64 overflow-hidden">
                  {project.images && project.images.length > 0 ? (
                    <img
                      src={project.images[0].url}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  ) : (
                    <div className="h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <Building2 className="w-16 h-16 text-white opacity-50" />
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <span className="bg-yellow-400 text-black px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      <Star className="w-3 h-3 fill-current" />
                      FEATURED
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {project.description}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {project.location}
                    </div>
                    {project.projectValue > 0 && (
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />₹
                        {(project.projectValue / 100000).toFixed(1)}L
                      </div>
                    )}
                  </div>

                  <Link
                    to={`/projects/${project.projectId}`}
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors duration-200 group-hover:gap-3"
                  >
                    View Project Details <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section - Enhanced */}
      <div className="text-center pb-12">
        <div className="pl-6 mx-auto py-8 text-2xl font-bold tracking-normal md:text-4xl">
          Building Comfort, Efficiency, and Sustainability,
          <PointerHighlight
            rectangleClassName="bg-neutral-200 dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600 leading-loose"
            pointerClassName="text-yellow-500 h-3 w-3"
            containerClassName="inline-block mr-1"
          >
            <span className="relative z-10 p-5"> Together</span>
          </PointerHighlight>
        </div>

        <p className="text-lg text-gray-600 max-w-6xl mx-auto mb-8">
          Showcasing our expertise in Mechanical, Electrical, and Plumbing
          services across diverse projects. From commercial complexes to
          residential developments, we deliver excellence in every project.
        </p>

        {/* NEW: Quick Stats */}
        <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span>ISO Certified</span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-blue-500" />
            <span>15+ Years Experience</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-500" />
            <span>Expert Team</span>
          </div>
        </div>
      </div>
      {/* Portfolio Stats Section */} 

      <PortfolioStats />

      {/* NEW SECTIONS */}
      <ServicesSection />
      <CompanyValues />
      <FeaturedProjects />
      <div className="mt-5">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-5 text-center">
          Testimonials
        </h2>
      </div>
      <TestimonialsSection />

      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          All Projects
        </h2>
        <CategoryFilter />
      </div>

      {/* Enhanced Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {filteredProjects.map((project) => (
          <div
            key={project.projectId}
            className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group cursor-pointer"
          >
            {/* Enhanced Image Section */}
            <div className="relative h-60 overflow-hidden">
              {project.images && project.images.length > 0 ? (
                <div className="relative h-full">
                  <img
                    src={project.images[0].url}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {project.images.length > 1 && (
                    <div className="absolute top-4 right-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm font-medium">
                      +{project.images.length - 1} more
                    </div>
                  )}
                  {project.isFeatured && (
                    <div className="absolute top-4 left-4">
                      <span className="bg-yellow-400 text-black px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                        <Star className="w-3 h-3 fill-current" />
                        FEATURED
                      </span>
                    </div>
                  )}
                  {/* Status Badge */}
                  <div className="absolute bottom-4 left-4">
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full ${
                        project.status === "completed"
                          ? "bg-green-500 text-white"
                          : project.status === "ongoing"
                          ? "bg-blue-500 text-white"
                          : "bg-yellow-500 text-black"
                      }`}
                    >
                      {project.status.charAt(0).toUpperCase() +
                        project.status.slice(1)}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white font-medium">
                    No Images Available
                  </span>
                </div>
              )}
            </div>

            {/* Enhanced Content Section */}
            <div className="p-5">
              <h2 className="text-lg font-semibold text-slate-800 mb-3 leading-tight line-clamp-2">
                {project.title}
              </h2>

              <p className="text-slate-600 mb-4 leading-relaxed line-clamp-2 text-sm">
                {project.description}
              </p>

              {/* Enhanced Project Details */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-semibold text-slate-700 min-w-16">
                    Client:
                  </span>
                  <span className="text-slate-600">{project.client}</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-slate-600">{project.location}</span>
                </div>

                {project.projectValue > 0 && (
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="w-4 h-4 text-gray-400" />
                    <span className="text-slate-600">
                      ₹{(project.projectValue / 100000).toFixed(1)}L
                    </span>
                  </div>
                )}

                {project.teamSize > 0 && (
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-slate-600">
                      {project.teamSize} team members
                    </span>
                  </div>
                )}
              </div>

              {/* Enhanced View More Button */}
              <div className="mt-6 pt-4 border-t border-gray-100">
                <Link
                  to={`/projects/${project.projectId}`}
                  className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-all duration-200 flex items-center gap-2 group-hover:gap-3"
                >
                  View Details <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Contact CTA */}
      

      {/* No Projects Message - Enhanced */}
      {filteredProjects.length === 0 && !loading && (
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <Filter className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-slate-700 mb-2">
            No Projects Found
          </h3>
          <p className="text-slate-500 mb-4">
            Try selecting a different category to view more projects.
          </p>
          <button
            onClick={() => setSelectedCategory("all")}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            View All Projects
          </button>
        </div>
      )}
      <ContactCTA/>
    </div>
  );
}
