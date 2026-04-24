import { createRoot } from 'react-dom/client';
import App from '@/App';
import React from 'react';
import '@/global.less';
import { BrowserRouter as Router, useNavigate } from 'react-router-dom';
import setupAxiosInterceptors from './api/setupAxiosInterceptors';
import ScrollToTop from '@/utils/ScrollToTop';
import { StompProvider } from '@/utils/StompContext';
import { HelmetProvider } from 'react-helmet-async'; // 新增

const SetupInterceptors = () => {
  const navigate = useNavigate();
  React.useEffect(() => {
    setupAxiosInterceptors(navigate);
  }, [navigate]);
  return null;
};

const container = document.getElementById('root');
if (!container) throw new Error('root element not found');
const root = createRoot(container);

root.render(
  <HelmetProvider> {/* 新增，包在最外层 */}
    <Router future={{ v7_relativeSplatPath: true }}>
      <StompProvider>
        <ScrollToTop />
        <SetupInterceptors />
        <App />
      </StompProvider>
    </Router>
  </HelmetProvider>
);