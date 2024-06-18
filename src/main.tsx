import { createRoot } from 'react-dom/client';
import App from '@/App';
import React from 'react';
import '@/global.less';

const container = document.getElementById('root');

if (!container) {
  throw new Error('root element not found');
}
const root = createRoot(container);

root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
);
