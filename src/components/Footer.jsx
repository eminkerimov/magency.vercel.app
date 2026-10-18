import { Link } from "react-router-dom";

const footerNavigation = [
  ["Services", "/#services"],
  ["Work", "/work"],
  ["Studio", "/studio"],
  ["Insights", "/blogs"],
  ["Topics", "/categories"],
  ["Quick contact", "/#contact"],
];

const Footer = () => (
  <footer className="site-footer">
    <div className="container">
      <div className="site-footer__top">
        <div className="site-footer__brand">
          <Link className="site-footer__logo" to="/" aria-label="M-Agency home">
            <span aria-hidden="true">M</span>
            M-Agency
          </Link>
          <p>Senior frontend engineering for clear, dependable digital products.</p>
        </div>

        <nav aria-label="Footer navigation">
          <span>Explore</span>
          <ul className="site-footer__nav">
            {footerNavigation.map(([label, href]) => (
              <li key={label}><Link to={href} viewTransition>{label}</Link></li>
            ))}
          </ul>
        </nav>

        <div className="site-footer__project">
          <span>Have a product challenge?</span>
          <p>Share the context and find the right starting point.</p>
          <Link to="/start-project">Send a project brief <span aria-hidden="true">&#8599;</span></Link>
        </div>
      </div>

      <div className="site-footer__bottom">
        <p>&copy; {new Date().getFullYear()} M-Agency.</p>
        <span>Frontend portfolio / Built with React and Vite</span>
      </div>
    </div>
  </footer>
);

export default Footer;
