'use client'

import './Preloader.css'

export default function Preloader() {
  return (
    <div className="preloader">
      <div className="preloader-inner">
        <img src="/images/logo.png" alt="B&B" className="preloader-logo-img" width="80" height="80" />
        <div className="preloader-logo">B&B</div>
        <div className="preloader-text">Apartments</div>
        <div className="preloader-bar">
          <div className="preloader-progress"></div>
        </div>
      </div>
    </div>
  )
}
