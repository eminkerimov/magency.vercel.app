import React from 'react'

const Footer = () => {
  return (
    <footer>
    <div className="container">
        <div className="row">
            <div className="col-12">
                <ul className="footer-social">
                    <li>
                        <a href="#">
                            <i className="fa fa-facebook" aria-hidden="true"></i>
                        </a>
                    </li>
                    <li>
                        <a href="#">
                            <i className="fa fa-twitter" aria-hidden="true"></i>
                        </a>
                    </li>
                    <li>
                        <a href="#">
                            <i className="fa fa-google-plus" aria-hidden="true"></i>
                        </a>
                    </li>
                </ul>
            </div>
            <div className="col-12">
                <div className="footer-copyright">
                    <p>Copyright © 2013 Designed by cssauthor.com</p>
                </div>
            </div>
        </div>
    </div>
</footer>
  )
}

export default Footer