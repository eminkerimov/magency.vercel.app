import React from 'react'
import Layer6 from "../assets/img/Layer6.png"
import Layer7 from "../assets/img/Layer7.png"
import Layer8 from "../assets/img/Layer8.png"
import Layer9 from "../assets/img/Layer9.png"
import Layer10 from "../assets/img/Layer10.png"
import Layer11 from "../assets/img/Layer11.png"
import ClientsSlider from '../components/ClientsSlider'
import MainSlider from '../components/MainSlider'
import Services from '../components/Services'
import Team from '../components/Team'

const Home = () => {
  return (
    <>
    <MainSlider/>
    <Services/>

<section className="portfolio" id="portfolio">
    <div className="container">
        <h2 className="section-title">Portfolio</h2>
        <div className="row">
            <div className="col-4">
                <a className="portfolio-item" href="#"><img src={Layer6} alt="image1"/></a>
            </div>
            <div className="col-4">
            <a className="portfolio-item" href="#"><img src={Layer7} alt="image1"/></a>
            </div>
            <div className="col-4">
            <a className="portfolio-item" href="#"><img src={Layer8} alt="image1"/></a>
            </div>
            <div className="col-4">
            <a className="portfolio-item" href="#"><img src={Layer9} alt="image1"/></a>
            </div>
            <div className="col-4">
            <a className="portfolio-item" href="#"><img src={Layer10} alt="image1"/></a>
            </div>
            <div className="col-4">
            <a className="portfolio-item" href="#"><img src={Layer11} alt="image1"/></a>
            </div>
        </div>
        <a className="portfolio-link" href="#">See all works</a>
    </div>
</section>

<Team/>


<section className="tariffs">
    <div className="container">
        <div className="row">
            <div className="col-4">
                <ul className="tariffs-item">
                    <li><h2>Basic</h2></li>
                    <li>$5.01/ Month</li>
                    <li>Lorem ipsum </li>
                    <li>Dolor sit amet, consect</li>
                    <li>Adipiscing elit</li>
                    <li>Proin commodo turpis</li>
                    <li>lacus pulvinarvel </li>
                    <li>Prnare nisi pretium.</li>
                    <li><button>Buy now</button></li>
                </ul>
            </div>
            <div className="col-4">
                <ul className="tariffs-item">
                    <li><h2>Pro</h2></li>
                    <li>$10.01/ Month</li>
                    <li>Lorem ipsum </li>
                    <li>Dolor sit amet, consect</li>
                    <li>Adipiscing elit</li>
                    <li>Proin commodo turpis</li>
                    <li>lacus pulvinarvel </li>
                    <li>Prnare nisi pretium.</li>
                    <li><button>Buy now</button></li>
                </ul>
            </div>
            <div className="col-4">
                <ul className="tariffs-item">
                    <li><h2>Premium</h2></li>
                    <li>$20.01/ Month</li>
                    <li>Lorem ipsum </li>
                    <li>Dolor sit amet, consect</li>
                    <li>Adipiscing elit</li>
                    <li>Proin commodo turpis</li>
                    <li>lacus pulvinarvel </li>
                    <li>Prnare nisi pretium.</li>
                    <li><button>Buy now</button></li>
                </ul>
            </div>
        </div>
    </div>
</section>


<ClientsSlider/>


<section className="contact" id="contact">
    <div className="container">
        <h2 className="section-title white">Contact Us</h2>
        <div className="row">
            <div className="col-6">
                <h3>Get in touch with us</h3>
                <span>Questions, collaborations, or just a friendly hello – we're all ears! Use the form below to reach out, and let's start a conversation. Your ideas matter, and we're excited to bring them to life</span>
                <a href="#">Cssaauthor.com</a>
                <a href="tel:+594-3929-322-34">+594-3929-322-34</a>
                <a href="mailto:info@cssauthor.com">info@cssauthor.com</a>
            </div>
            <div className="col-6">
                <form className="row">
                    <div className="col-6">
                        <input type="text" placeholder="Name"/>
                        <small></small>
                    </div>
                    <div className="col-6">
                        <input type="email" placeholder="Email"/>
                        <small></small>
                    </div>
                    <div className="col-12">
                        <textarea placeholder="Message" ></textarea>
                        <small></small>
                    </div>
                    <div className="col-12">
                        <button type="submit">Send</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</section>
    </>
  )
}

export default Home