
import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import * as serviceWorker from "./serviceWorker";

const root = createRoot(document.getElementById('root'));
root.render(<App />);
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. This is assuming the new PWA solution still uses this naming.
// Note this might come with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorker.unregister();
