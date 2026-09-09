import { useParams, Link } from 'react-router-dom';
import { FiGithub, FiExternalLink, FiArrowLeft } from 'react-icons/fi';
import useContent from '../hooks/useContent';
import { getProjectBySlug } from '../services/content';
import AsyncState from '../components/AsyncState';
import './ProjectDetail.css';

const ProjectDetail = () => {
  const { slug } = useParams();
  const { data, loading, error } = useContent(() => getProjectBySlug(slug), [slug]);
  const project = data?.project;

  return (
    <section className="project-detail">
      <div className="container">
        <Link to="/#projects" className="project-detail__back"><FiArrowLeft /> Back to projects</Link>

        <AsyncState loading={loading} error={error} isEmpty={!loading && !error && !project} emptyMessage="Project not found.">
          {project && (
            <>
              <header className="project-detail__header">
                <span className="section-kicker">{project.category}</span>
                <h1>{project.title}</h1>
                <p className="project-detail__short">{project.shortDescription}</p>

                <div className="project-detail__links">
                  {project.liveUrl && (
                    <a href={project.liveUrl} target="_blank" rel="noreferrer" className="btn btn-primary">
                      <FiExternalLink /> Live Demo
                    </a>
                  )}
                  {project.githubUrl && (
                    <a href={project.githubUrl} target="_blank" rel="noreferrer" className="btn btn-outline">
                      <FiGithub /> View Code
                    </a>
                  )}
                </div>
              </header>

              {project.thumbnail?.url && (
                <img className="project-detail__hero-image" src={project.thumbnail.url} alt={project.title} />
              )}

              <div className="project-detail__grid">
                <div>
                  {project.detailedDescription && (
                    <>
                      <h2>Overview</h2>
                      <p>{project.detailedDescription}</p>
                    </>
                  )}

                  {project.problem && (
                    <>
                      <h2>Problem</h2>
                      <p>{project.problem}</p>
                    </>
                  )}

                  {project.solution && (
                    <>
                      <h2>Solution</h2>
                      <p>{project.solution}</p>
                    </>
                  )}

                  {project.features?.length > 0 && (
                    <>
                      <h2>Key features</h2>
                      <ul className="project-detail__features">
                        {project.features.map((f) => <li key={f}>{f}</li>)}
                      </ul>
                    </>
                  )}

                  {project.images?.length > 0 && (
                    <>
                      <h2>Screenshots</h2>
                      <div className="project-detail__screens">
                        {project.images.map((img) => (
                          <img key={img.publicId} src={img.url} alt={img.caption || project.title} loading="lazy" />
                        ))}
                      </div>
                    </>
                  )}
                </div>

                <aside className="project-detail__sidebar">
                  <h3>Tech stack</h3>
                  <div className="project-detail__tags">
                    {project.technologies?.map((t) => <span className="tag" key={t}>{t}</span>)}
                  </div>
                </aside>
              </div>
            </>
          )}
        </AsyncState>
      </div>
    </section>
  );
};

export default ProjectDetail;
