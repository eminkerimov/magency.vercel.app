import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const navigation = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/#services" },
  { label: "Work", href: "/work" },
  { label: "Insights", href: "/blogs" },
  { label: "Topics", href: "/categories" },
  { label: "Contact", href: "/#contact" },
];

const Header = () => {
  const { pathname, hash } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef(null);
  const toggleRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return undefined;

    const animationFrame = window.requestAnimationFrame(() => {
      navRef.current?.querySelector("a")?.focus();
    });

    return () => window.cancelAnimationFrame(animationFrame);
  }, [menuOpen]);

  const isActive = (href) => {
    if (href === "/blogs") return pathname.startsWith("/blog");
    if (href === "/work") return pathname.startsWith("/work");
    if (href === "/categories") return pathname === "/categories";
    if (href === "/") return pathname === "/" && !hash;

    return pathname === "/" && hash === href.replace("/", "");
  };

  return (
    <header
      className="site-header"
      onKeyDown={(event) => {
        if (event.key !== "Escape" || !menuOpen) return;
        setMenuOpen(false);
        toggleRef.current?.focus();
      }}
    >
      <div className="container">
        <div className="site-header__inner">
          <Link className="logo" to="/" aria-label="M-Agency home">
            <span className="logo__mark" aria-hidden="true">M</span>
            <span>M-Agency</span>
          </Link>

          <nav
            ref={navRef}
            className={`site-nav${menuOpen ? " is-open" : ""}`}
            id="primary-navigation"
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
            to="/#contact"
            onClick={() => setMenuOpen(false)}
          >
            Start a project
          </Link>

          <button
            ref={toggleRef}
            className="site-header__toggle"
            type="button"
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={menuOpen}
            aria-controls="primary-navigation"
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
