import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './styles/globals.css'

const root = document.getElementById('root')
if (!root) {
  console.error('Root element not found')
} else {
  try {
    ReactDOM.createRoot(root).render(
      <React.StrictMode>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </React.StrictMode>,
    )
  } catch (err) {
    console.error('React render error:', err)
    root.innerHTML = '<p>Error loading app</p>'
  }
}
