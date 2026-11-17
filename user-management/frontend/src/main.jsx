import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import { DonationContextProvider } from './context/DonationContext.jsx'

// Start React at the HTML root and make shared donation state available to every page.
createRoot(document.getElementById('root')).render(
  <StrictMode>
      <DonationContextProvider>
        <App />
      </DonationContextProvider>
  </StrictMode>,
)
