import { useEffect, useState } from 'react';
import Layout from './Layout';
import MobileLayout from './MobileLayout';
import Dashboard from '../pages/Dashboard';
import MobileDashboard from '../pages/MobileDashboard';
import { useLocation } from 'react-router-dom';

const ResponsiveLayout = () => {
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Use mobile dashboard on home page for mobile devices
  if (isMobile && location.pathname === '/') {
    return (
      <MobileLayout>
        <MobileDashboard />
      </MobileLayout>
    );
  }

  return isMobile ? <MobileLayout /> : <Layout />;
};

export default ResponsiveLayout;
