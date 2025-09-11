import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../state/store";
import { fetchProjects, selectProjects, selectLoading } from "../state/portfolioSlice";

export default function PortfolioPage() {
  const dispatch = useDispatch<AppDispatch>();
  const projects = useSelector(selectProjects);
  const loading = useSelector(selectLoading);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  if (loading) return <p>Loading projects...</p>;

  return (
    <div>
      <h1>Our Projects</h1>
      {projects.map((project) => (
        <div key={project._id} style={{ border: "1px solid #ddd", margin: "10px", padding: "10px" }}>
          <h2>{project.title}</h2>
          <p>{project.description}</p>
          <p><strong>Client:</strong> {project.client}</p>
          <p><strong>Location:</strong> {project.location}</p>
          {project.images?.map((img, i) => (
            <img key={i} src={img} alt={project.title} width="200" />
          ))}
        </div>
      ))}
    </div>
  );
}
