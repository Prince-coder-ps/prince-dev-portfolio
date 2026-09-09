import { FiAward, FiExternalLink } from 'react-icons/fi';
import useContent from '../../hooks/useContent';
import { getCertifications } from '../../services/content';
import AsyncState from '../AsyncState';
import './Certifications.css';

const Certifications = () => {
  const { data, loading, error } = useContent(getCertifications);
  const items = data?.items || [];

  return (
    <section id="certifications" className="certifications">
      <div className="container">
        <span className="section-kicker">Certifications</span>
        <h2 className="section-heading">Training & certifications</h2>

        <AsyncState loading={loading} error={error} isEmpty={!loading && !error && items.length === 0} emptyMessage="Certifications will be listed here soon.">
          <div className="certifications__grid">
            {items.map((c) => (
              <div className="cert-card" key={c._id}>
                <FiAward className="cert-card__icon" />
                <div>
                  <h3>{c.name}</h3>
                  <p>{c.issuer}{c.date ? ` · ${c.date}` : ''}</p>
                  {c.description && <p className="cert-card__desc">{c.description}</p>}
                  {c.credentialUrl && (
                    <a href={c.credentialUrl} target="_blank" rel="noreferrer" className="cert-card__link">
                      <FiExternalLink /> View credential
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </AsyncState>
      </div>
    </section>
  );
};

export default Certifications;
