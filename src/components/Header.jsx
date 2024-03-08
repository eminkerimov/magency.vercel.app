import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from "../assets/img/logo.png"

const Header = () => {
    const navigate = useNavigate()
  return (
    <header>
    <div className="container">
        <div className="row">
            <div className="col-3">
                <span className="logo" onClick={() => navigate("/")}>M-Agency</span>
            </div>
            <div className="offset-3"></div>
            <div className="col-6">
                <ul className="menu">
                    <li><a href="#" onClick={() => navigate("/")}>Home</a></li>
                    <li><a href="#services">Service</a></li>
                    <li><a href="#portfolio">Portfolio</a></li>
                    <li><a href="#team">Team</a></li>
                    <li><a href="#" onClick={() => navigate("/blog")}>Blog</a></li>
                    <li><a href="#contact">Contact</a></li>
                </ul>
            </div>
        </div>
    </div>
</header>
  )
}

export default Header