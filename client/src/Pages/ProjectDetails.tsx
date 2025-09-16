// src/pages/ProjectDetailPage.tsx
import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../state/store";
import { fetchProjects, selectProjects, selectLoading } from "../state/portfolioSlice";
import { ArrowLeft, Award, Building2, Calendar, Clock, DollarSign, Users, Star } from "lucide-react";

export default function ProjectDetailPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const projects = useSelector(selectProjects);
  const loading = useSelector(selectLoading);

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
    <div className="">
      
    </div>
  );
}
