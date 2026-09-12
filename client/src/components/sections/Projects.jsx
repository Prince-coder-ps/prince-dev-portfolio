import { Link } from 'react-router-dom';
import { FiGithub, FiExternalLink, FiFolder } from 'react-icons/fi';
import useContent from '../../hooks/useContent';
import { getProjects } from '../../services/content';
import AsyncState from '../AsyncState';
import './Projects.css';

const CATEGORY_COLORS = {
  'MERN Stack': 'var(--color-accent)',
  'Full Stack': 'var(--color-accent-2)',
  'Frontend': 'var(--color-amber)',
};

const Projects = () => {
  const { data, loading, error } = useContent(getProjects);
  const projects = data?.projects || [];

  return (
    <section id="projects" className="projects">
      <div className="container">
        <span className="section-kicker"><FiFolder /> Projects</span>
        <h2 className="section-heading">Things I've built</h2>

        <AsyncState
          loading={loading}
          error={error}
          isEmpty={!loading && !error && projects.length === 0}
          emptyMessage="Projects are being added — check back soon."
        >
          <div className="projects__grid">
            {projects.map((p) => (
              <article
                key={p._id}
                className="project-card"
                style={{ '--accent': CATEGORY_COLORS[p.category] || 'var(--color-accent)' }}
              >
                {p.thumbnail?.url && (
                  <Link to={`/projects/${p.slug}`} className="project-card__image">
                    <img src={p.thumbnail.url} alt={p.title} loading="lazy" />
                  </Link>
                )}
                <div className="project-card__body">
                  <div className="project-card__meta">
                    <span>{p.category}</span>
                    {p.year && <span>{p.year}</span>}
                  </div>
                  <h3>
                    <Link to={`/projects/${p.slug}`}>{p.title}</Link>
                  </h3>
                  <p>{p.shortDescription}</p>

                  {p.technologies?.length > 0 && (
                    <div className="project-card__tags">
                      {p.technologies.slice(0, 5).map((t) => (
                        <span className="tag" key={t}>{t}</span>
                      ))}
                    </div>
                  )}

                  <div className="project-card__links">
                    <Link to={`/projects/${p.slug}`}>View Project</Link>
                    {p.liveUrl && (
                      <a href={p.liveUrl} target="_blank" rel="noreferrer"><FiExternalLink /> Live</a>
                    )}
                    {p.githubUrl && (
                      <a href={p.githubUrl} target="_blank" rel="noreferrer"><FiGithub /> Code</a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </AsyncState>
      </div>
    </section>
  );
};

export default Projects;
