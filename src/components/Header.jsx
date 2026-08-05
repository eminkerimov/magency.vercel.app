import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const navigation = [
  { label: "Home", href: "/" },
  { label: "Articles", href: "/blogs" },
  { label: "Categories", href: "/categories" },
  { label: "About", href: "/#team" },
  { label: "Pricing", href: "/#pricing" },
  { label: "Contact", href: "/#contact" },
];

const Header = () => {
  const { pathname, hash } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname, hash]);

  const isActive = (href) => {
    if (href === "/blogs") return pathname.startsWith("/blog");
    if (href === "/categories") return pathname === "/categories";
    if (href === "/") return pathname === "/" && !hash;

    return pathname === "/" && hash === href.replace("/", "");
  };

  return (
    <header className="site-header">
      <div className="container">
        <div className="site-header__inner">
          <Link className="logo" to="/" aria-label="M-Agency home">
            <span className="logo__mark" aria-hidden="true">M</span>
            <span>M-Agency</span>
          </Link>

          <nav
            className={`site-nav${menuOpen ? " is-open" : ""}`}
            aria-label="Primary navigation"
          >
            <ul className="menu">
              {navigation.map((item) => {
                const active = isActive(item.href);

                return (
                  <li key={item.label}>
                    <Link
                      className={active ? "is-active" : ""}
                      to={item.href}
                      aria-current={active ? "page" : undefined}
                      onClick={() => setMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <Link
            className="site-header__cta"
            to="/#pricing"
            onClick={() => setMenuOpen(false)}
          >
            Subscribe
          </Link>

          <button
            className="site-header__toggle"
            type="button"
            aria-label="Toggle navigation"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
