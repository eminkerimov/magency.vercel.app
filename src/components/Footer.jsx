import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer>
    <div className="container">
        <div className="row">
            <div className="col-12">
                <ul className="footer-nav">
                    <li><Link to="/blogs">Articles</Link></li>
                    <li><Link to="/categories">Categories</Link></li>
                    <li><Link to="/#contact">Contact</Link></li>
                </ul>
            </div>
            <div className="col-12">
                <div className="footer-copyright">
                    <p>Copyright © 2026 M-Agency. Practical knowledge for developers.</p>
                </div>
            </div>
        </div>
    </div>
</footer>
  )
}

export default Footer
