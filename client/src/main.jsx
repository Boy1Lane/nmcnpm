import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Chỉ để lại <App /> thôi, vì trong App.jsx đã có Router rồi */}
    <App />
  </React.StrictMode>,
)