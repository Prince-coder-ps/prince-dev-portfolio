import { LazyMotion, m } from 'framer-motion';
import { FiGithub, FiLinkedin, FiInstagram, FiArrowDown, FiDownload } from 'react-icons/fi';
import { getActiveResume } from '../../services/content';
import useTypewriter from '../../hooks/useTypewriter';
import { optimizeImage } from '../../utils/image';
import './Hero.css';

// framer-motion's animation engine is fetched asynchronously (separate chunk),
// so it never delays the first paint of the Hero.
const loadMotionFeatures = () => import('../motionFeatures').then((mod) => mod.default);

const HERO_ROLES = ['Full Stack Developer', 'Inspire Software Developer'];

// Approved hero copy — used until the profile arrives from the API so the
// first paint never waits on the (possibly cold-starting) backend.
const DEFAULT_HERO_DESCRIPTION =
  "Full-stack developer with a strong foundation in Data Structures & Algorithms, OOP, and DBMS. I build real-world MERN applications and I'm always working toward writing cleaner, more scalable code.";

// Kept in its own component so the per-character re-renders of the typewriter
// don't re-render the rest of the Hero.
const TypedTitle = () => {
  const typedTitle = useTypewriter(HERO_ROLES, {
    typingSpeed: 85,
    deletingSpeed: 45,
    pauseTime: 1400,
  });

  return (
    <p className="hero__title" aria-label={HERO_ROLES.join(' / ')}>
      <span className="hero__title-typed" aria-hidden="true">{typedTitle}</span>
      <span className="hero__title-cursor" aria-hidden="true">|</span>
    </p>
  );
};

const Hero = ({ profile }) => {
  const socials = profile?.socials || {};

  const handleDownloadResume = async () => {
    try {
      const { resume } = await getActiveResume();
      const response = await fetch(resume.fileUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const baseName = (resume.originalName || 'resume').replace(/\.[^/.]+$/, '');
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${baseName}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch {
      // no resume uploaded yet — fail quietly, admin can upload later
    }
  };

  return (
    <LazyMotion features={loadMotionFeatures} strict>
    <section id="home" className="hero">
      <div className="hero__blob hero__blob--one" aria-hidden="true" />
      <div className="hero__blob hero__blob--two" aria-hidden="true" />

      <div className="container hero__grid">
        <m.div
          initial={{ opacity: 0.35, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="hero__content"
        >
          <span className="hero__eyebrow">{profile?.eyebrow || 'Final Year CSE Student'}</span>
          <h1 className="hero__heading">{profile?.heroHeading || "Hi, I'm Prince Saini."}</h1>
          <TypedTitle />
          <p className="hero__tagline">{profile?.tagline || 'Building Ideas Into Scalable Web Experiences.'}</p>
          <p className="hero__description">{profile?.heroDescription || DEFAULT_HERO_DESCRIPTION}</p>

          <div className="hero__cta">
            <a href="#projects" className="btn btn-primary">View Projects</a>
            <button onClick={handleDownloadResume} className="btn btn-outline">
              <FiDownload /> Download Resume
            </button>
            <a href="#contact" className="hero__contact-link">Contact me →</a>
          </div>

          <div className="hero__socials">
            {socials.github && (
              <a href={socials.github} target="_blank" rel="noreferrer" aria-label="GitHub"><FiGithub /></a>
            )}
            {socials.linkedin && (
              <a href={socials.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"><FiLinkedin /></a>
            )}
            {socials.instagram && (
              <a href={socials.instagram} target="_blank" rel="noreferrer" aria-label="Instagram"><FiInstagram /></a>
            )}
          </div>
        </m.div>

        <m.div
          initial={{ opacity: 0.35, scale: 0.92, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.15 }}
          className="hero__photo-wrap"
        >
          <div className="hero__photo-ring">
            {profile?.profileImage?.url ? (
              <img
                src={optimizeImage(profile.profileImage.url, 640)}
                alt={profile?.name || 'Prince Saini'}
                width="640"
                height="800"
                decoding="async"
                fetchpriority="high"
              />
            ) : (
              <div className="hero__image-placeholder" aria-hidden="true" />
            )}
          </div>
        </m.div>
      </div>

      <a href="#about" className="hero__scroll-cue" aria-label="Scroll to About section">
        <FiArrowDown />
      </a>
    </section>
    </LazyMotion>
  );
};

export default Hero;
