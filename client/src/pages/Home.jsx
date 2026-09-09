import { useOutletContext } from 'react-router-dom';
import Hero from '../components/sections/Hero';
import About from '../components/sections/About';
import Skills from '../components/sections/Skills';
import Projects from '../components/sections/Projects';
import Education from '../components/sections/Education';
import Certifications from '../components/sections/Certifications';
import Gallery from '../components/sections/Gallery';
import Contact from '../components/sections/Contact';

const Home = () => {
  const { profile } = useOutletContext() || {};

  return (
    <>
      <Hero profile={profile} />
      <About profile={profile} />
      <Skills />
      <Projects />
      <Education />
      <Certifications />
      <Gallery />
      <Contact />
    </>
  );
};

export default Home;
