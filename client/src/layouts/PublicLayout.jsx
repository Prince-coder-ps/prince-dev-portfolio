import { Suspense, useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BackToTop from '../components/BackToTop';
import { getProfile } from '../services/content';

const CACHE_KEY = 'portfolio-profile-cache-v1';

const readCachedProfile = () => {
  try {
    return JSON.parse(window.localStorage.getItem(CACHE_KEY)) || null;
  } catch {
    return null;
  }
};

const PublicLayout = () => {
  // Stale-while-revalidate: show the last known profile instantly on repeat
  // visits, then refresh it from the API in the background.
  const [profile, setProfile] = useState(readCachedProfile);

  useEffect(() => {
    let alive = true;
    getProfile()
      .then((data) => {
        if (!alive || !data?.profile) return;
        setProfile(data.profile);
        try {
          window.localStorage.setItem(CACHE_KEY, JSON.stringify(data.profile));
        } catch {
          // storage full / unavailable — safe to ignore
        }
      })
      .catch(() => {
        // keep showing the cached/fallback content if the API is unreachable
      });
    return () => {
      alive = false;
    };
  }, []);

  return (
    <>
      <Navbar profile={profile} />
      <Suspense fallback={<p className="state-message container" role="status">Loading…</p>}>
        <Outlet context={{ profile }} />
      </Suspense>
      <Footer profile={profile} />
      <BackToTop />
    </>
  );
};

export default PublicLayout;
