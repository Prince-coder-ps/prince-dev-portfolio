import { FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';
import './ThemeToggle.css';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
    >
      <span className={`theme-toggle__icon ${isDark ? 'theme-toggle__icon--hidden-up' : 'theme-toggle__icon--shown'}`}><FiSun /></span>
      <span className={`theme-toggle__icon ${isDark ? 'theme-toggle__icon--shown' : 'theme-toggle__icon--hidden-down'}`}><FiMoon /></span>
    </button>
  );
};

export default ThemeToggle;
