import { FiBookOpen } from 'react-icons/fi';
import useContent from '../../hooks/useContent';
import { getEducation } from '../../services/content';
import AsyncState from '../AsyncState';
import './Education.css';

const Education = () => {
  const { data, loading, error } = useContent(getEducation);
  const items = data?.items || [];

  return (
    <section id="education" className="education">
      <div className="container">
        <span className="section-kicker"><FiBookOpen /> Education</span>
        <h2 className="section-heading">Academic background</h2>

        <AsyncState loading={loading} error={error} isEmpty={!loading && !error && items.length === 0} emptyMessage="Education details coming soon.">
          <div className="education__list">
            {items.map((e) => (
              <div className="education__row" key={e._id}>
                {e.image?.url && (
                  <div className="education__logo">
                    <img src={e.image.url} alt={e.institution} />
                  </div>
                )}
                <div>
                  <h3>{e.degree}</h3>
                  <p className="education__institution">{e.institution}</p>
                  <div className="education__meta">
                    {e.duration && <span>{e.duration}</span>}
                    {e.status && <span>{e.status}</span>}
                    {e.scoreLabel && <span>{e.scoreLabel}</span>}
                  </div>
                  {e.description && <p className="education__desc">{e.description}</p>}
                </div>
              </div>
            ))}
          </div>
        </AsyncState>
      </div>
    </section>
  );
};

export default Education;
