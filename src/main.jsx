// entry point of react application
import { StrictMode } from 'react' // Used for identifying potential issues during development (does not affect production builds)
import { createRoot } from 'react-dom/client' // Creates a root for rendering the app in React 18+
import './index.css'
import App from './App.jsx' // Main component of the app
import ContextProvider from './context/Context.jsx' // Provides global state/context to the app using React Context API

// Create the root element for the app and render the app inside it
createRoot(document.getElementById('root')).render(
  // StrictMode helps with identifying potential problems during development
  <StrictMode>
    {/* ContextProvider wraps the entire app to provide global state */}
    <ContextProvider>
      {/* The main component of the app */}
      <App />
    </ContextProvider>
  </StrictMode>
)
