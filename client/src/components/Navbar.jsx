import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';
import ThemeToggle from './ThemeToggle';
import './Navbar.css';

const CENTER_LINKS = [
  { label: 'Home', hash: '#home' },
  { label: 'About', hash: '#about' },
  { label: 'Skills', hash: '#skills' },
  { label: 'Projects', hash: '#projects' },
  { label: 'Education', hash: '#education' },
  { label: 'Certifications', hash: '#certifications' },
  { label: 'Gallery', hash: '#gallery' },
];

const Navbar = ({ profile }) => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('#home');
  const location = useLocation();
  const navigate = useNavigate();
  const onHome = location.pathname === '/';
  const name = profile?.name || 'Prince Saini';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!onHome) return undefined;
    const allHashes = [...CENTER_LINKS, { hash: '#contact' }];
    const sections = allHashes.map((l) => document.querySelector(l.hash)).filter(Boolean);
    const onScroll = () => {
      let current = '#home';
      sections.forEach((section) => {
        if (window.scrollY >= section.offsetTop - 220) {
          current = `#${section.id}`;
        }
      });
      setActive(current);
    };
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [onHome]);

  const handleNavClick = (hash) => (e) => {
    setOpen(false);
    if (onHome) {
      e.preventDefault();
      document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      e.preventDefault();
      navigate('/');
      setTimeout(() => document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' }), 60);
    }
  };

  return (
    <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__inner container">
        <Link to="/" className="navbar__brand" onClick={handleNavClick('#home')}>
          <span className="navbar__avatar">
            {profile?.profileImage?.url ? (
              <img src={profile.profileImage.url} alt={name} />
            ) : (
              <span className="navbar__avatar-fallback">{name.charAt(0)}</span>
            )}
          </span>
          <span className="navbar__brand-name">{name}</span>
        </Link>

        <button
          className="navbar__menu-btn"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>

        <nav className={`navbar__links ${open ? 'navbar__links--open' : ''}`} aria-label="Primary">
          {CENTER_LINKS.map((link) => (
            <a
              key={link.hash}
              href={link.hash}
              onClick={handleNavClick(link.hash)}
              className={active === link.hash && onHome ? 'is-active' : ''}
            >
              {link.label}
            </a>
          ))}

          {/* Contact also lives inside the mobile dropdown */}
          <a
            href="#contact"
            className="navbar__mobile-only"
            onClick={handleNavClick('#contact')}
          >
            Contact
          </a>
        </nav>

        <div className="navbar__right">
          <a
            href="#contact"
            className={`navbar__contact-link ${active === '#contact' && onHome ? 'is-active' : ''}`}
            onClick={handleNavClick('#contact')}
          >
            Contact
          </a>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
