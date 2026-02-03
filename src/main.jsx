import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";   
import App from './App.jsx';
import "./Index.css";
import "./App.css";
import { AuthContextProvider } from './auth.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthContextProvider>
      <App />
    </AuthContextProvider>
  </StrictMode>,
)
