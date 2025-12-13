import React, { useState, useEffect } from 'react';
import './index.css';
import ReactDOM from 'react-dom/client';
import App from './App';
import { DocsLayout } from './components/docs/DocsLayout';

const Router = () => {
  const [route, setRoute] = useState(window.location.hash);

  useEffect(() => {
    const onHashChange = () => setRoute(window.location.hash);
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  if (route.startsWith('#/docs')) {
    return <DocsLayout />;
  }

  // Default to App
  return <App />;
};

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <Router />
  </React.StrictMode>
);