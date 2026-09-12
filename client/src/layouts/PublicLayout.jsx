import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BackToTop from '../components/BackToTop';
import useContent from '../hooks/useContent';
import { getProfile } from '../services/content';

const PublicLayout = () => {
  const { data } = useContent(getProfile);
  const profile = data?.profile;

  return (
    <>
      <Navbar profile={profile} />
      <Outlet context={{ profile }} />
      <Footer profile={profile} />
      <BackToTop />
    </>
  );
};

export default PublicLayout;
