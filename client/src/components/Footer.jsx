import { FiGithub, FiLinkedin, FiInstagram, FiMail } from 'react-icons/fi';
import './Footer.css';

const Footer = ({ profile }) => {
  const socials = profile?.socials || {};
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__col">
          <h3>{profile?.name || 'Prince Saini'}</h3>
          <p>Thanks for visiting. Feel free to reach out — I'm always open to new projects and opportunities.</p>
        </div>

        <div className="footer__col">
          <h4>Quick links</h4>
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#projects">Projects</a>
          <a href="#education">Education</a>
          <a href="#contact">Contact</a>
        </div>

        <div className="footer__col">
          <h4>Contact</h4>
          {profile?.email && <p>{profile.email}</p>}
          {profile?.phone && <p>{profile.phone}</p>}
          {profile?.location && <p>{profile.location}</p>}
          <div className="footer__socials">
            {socials.github && (
              <a href={socials.github} target="_blank" rel="noreferrer" aria-label="GitHub"><FiGithub /></a>
            )}
            {socials.linkedin && (
              <a href={socials.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"><FiLinkedin /></a>
            )}
            {socials.instagram && (
              <a href={socials.instagram} target="_blank" rel="noreferrer" aria-label="Instagram"><FiInstagram /></a>
            )}
            {profile?.email && (
              <a href={`mailto:${profile.email}`} aria-label="Email"><FiMail /></a>
            )}
          </div>
        </div>
      </div>

      <p className="footer__credit">© {year} {profile?.name || 'Prince Saini'}. Built with the MERN stack.</p>
    </footer>
  );
};

export default Footer;
