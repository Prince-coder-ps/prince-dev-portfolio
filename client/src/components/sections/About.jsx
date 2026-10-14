import { FiUser } from 'react-icons/fi';
import { optimizeImage } from '../../utils/image';
import './About.css';

const About = ({ profile }) => {
  const paragraphs = (profile?.aboutText || '').split('\n').filter(Boolean);

  return (
    <section id="about" className="about">
      <div className="container about__grid">
        <div className="about__image-frame">
          {profile?.aboutImage?.url ? (
            <img
              src={optimizeImage(profile.aboutImage.url, 640)}
              alt={profile?.name || 'About'}
              width="480"
              height="640"
              loading="lazy"
              decoding="async"
            />
          ) : (
            <div className="about__image-placeholder" aria-hidden="true" />
          )}
        </div>

        <div>
          <span className="section-kicker"><FiUser /> About</span>
          <h2 className="section-heading">Computer Science undergraduate & aspiring SDE</h2>
          <div className="about__text">
            {paragraphs.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>

          {(profile?.email || profile?.location) && (
            <div className="about__meta">
              {profile?.email && (
                <div>
                  <span>Email</span>
                  <p>{profile.email}</p>
                </div>
              )}
              {profile?.location && (
                <div>
                  <span>Location</span>
                  <p>{profile.location}{profile?.openToRelocation ? ' · Open to relocation' : ''}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default About;
