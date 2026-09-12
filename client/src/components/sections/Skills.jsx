import {
  FiCode, FiLayout, FiDroplet, FiGrid, FiServer, FiShare2, FiDatabase,
  FiGitBranch, FiGithub, FiTerminal, FiTool, FiCpu,
} from 'react-icons/fi';
import useContent from '../../hooks/useContent';
import { getSkills } from '../../services/content';
import AsyncState from '../AsyncState';
import './Skills.css';

const CATEGORY_ORDER = ['Programming', 'Frontend', 'Backend', 'Databases', 'Tools', 'Concepts'];

const CATEGORY_ICON = {
  Programming: FiTerminal,
  Frontend: FiLayout,
  Backend: FiServer,
  Databases: FiDatabase,
  Tools: FiTool,
  Concepts: FiCpu,
};

// Only Feather icons (react-icons/fi) are used here — this set is already
// proven stable elsewhere in the app (Navbar, Hero, Footer).
const ICON_MAP = {
  Java: FiCode,
  'React.js': FiLayout,
  HTML5: FiCode,
  CSS: FiDroplet,
  Bootstrap: FiGrid,
  'Node.js': FiServer,
  'Express.js': FiServer,
  'REST APIs': FiShare2,
  MongoDB: FiDatabase,
  MySQL: FiDatabase,
  Git: FiGitBranch,
  GitHub: FiGithub,
  'VS Code': FiCode,
  JavaScript: FiCode,
};

const getIcon = (name) => ICON_MAP[name] || FiCode;

const Skills = () => {
  const { data, loading, error } = useContent(getSkills);
  const items = data?.items || [];

  const grouped = CATEGORY_ORDER
    .map((cat) => ({ cat, skills: items.filter((s) => s.category === cat) }))
    .filter((g) => g.skills.length > 0);

  return (
    <section id="skills" className="skills">
      <div className="container">
        <span className="section-kicker"><FiCpu /> Skills</span>
        <h2 className="section-heading">What I work with</h2>

        <AsyncState loading={loading} error={error} isEmpty={!loading && !error && grouped.length === 0} emptyMessage="Skills will be listed here soon.">
          <div className="skills__grid">
            {grouped.map(({ cat, skills }) => {
              const CategoryIcon = CATEGORY_ICON[cat] || FiCode;
              return (
                <div key={cat} className="skills__group">
                  <h3><CategoryIcon className="skills__group-icon" />{cat}</h3>
                  <ul>
                    {skills.map((s) => {
                      const Icon = getIcon(s.name);
                      return (
                        <li key={s._id}>
                          <div className="skills__row">
                            <span><Icon className="skills__icon" /> {s.name}</span>
                            <span className="skills__pct">{s.proficiency}%</span>
                          </div>
                          <div className="skills__bar">
                            <div className="skills__bar-fill" style={{ width: `${s.proficiency}%` }} />
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>
        </AsyncState>
      </div>
    </section>
  );
};

export default Skills;
