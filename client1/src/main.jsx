import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import axios from 'axios';
// Set base URL for API calls
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
axios.defaults.baseURL = baseURL;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);