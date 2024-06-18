import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import routes from './routers/routers';
import setupAxiosInterceptors from './api/setupAxiosInterceptors';

const InnerApp = () => {
  const navigate = useNavigate();

  useEffect(() => {
    setupAxiosInterceptors(navigate);
  }, [navigate]);

  return (
    <Routes>
      {routes.map((route, index) => (
        <Route key={index} path={route.path} element={<route.component />} />
      ))}
    </Routes>
  );
};

const App = () => {
  return (
    <Router>
      <InnerApp />
    </Router>
  );
};

export default App;
