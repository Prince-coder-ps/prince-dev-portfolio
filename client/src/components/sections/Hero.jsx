import { motion } from 'framer-motion';
import { FiGithub, FiLinkedin, FiInstagram, FiArrowDown, FiDownload } from 'react-icons/fi';
import { getActiveResume } from '../../services/content';
import './Hero.css';

const Hero = ({ profile }) => {
  const socials = profile?.socials || {};

  const handleDownloadResume = async () => {
    try {
      const { resume } = await getActiveResume();
      window.open(resume.fileUrl, '_blank', 'noopener');
    } catch {
      // no resume uploaded yet — fail quietly, admin can upload later
    }
  };

  return (
    <section id="home" className="hero">
      <div className="hero__blob hero__blob--one" aria-hidden="true" />
      <div className="hero__blob hero__blob--two" aria-hidden="true" />

      <div className="container hero__grid">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="hero__content"
        >
          <span className="hero__eyebrow">{profile?.eyebrow || 'Final Year CSE Student'}</span>
          <h1 className="hero__heading">{profile?.heroHeading || "Hi, I'm Prince Saini."}</h1>
          <p className="hero__title">{profile?.title || 'Full Stack Developer'}</p>
          <p className="hero__tagline">{profile?.tagline || 'Building Ideas Into Scalable Web Experiences.'}</p>
          <p className="hero__description">{profile?.heroDescription}</p>

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
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.15 }}
          className="hero__photo-wrap"
        >
          <div className="hero__photo-ring">
            {profile?.profileImage?.url ? (
              <img src={profile.profileImage.url} alt={profile?.name || 'Prince Saini'} />
            ) : (
              <div className="hero__image-placeholder" aria-hidden="true" />
            )}
          </div>
        </motion.div>
      </div>

      <a href="#about" className="hero__scroll-cue" aria-label="Scroll to About section">
        <FiArrowDown />
      </a>
    </section>
  );
};

export default Hero;
