import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import CommandPalette from "./CommandPalette";

const navigation = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/#services" },
  { label: "Work", href: "/work" },
  { label: "Studio", href: "/studio" },
  { label: "Insights", href: "/blogs" },
  { label: "Topics", href: "/categories" },
];

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { pathname, hash } = location;
  const [menuOpen, setMenuOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const headerRef = useRef(null);
  const logoRef = useRef(null);
  const toggleRef = useRef(null);
  const paletteTriggerRef = useRef(null);

  useEffect(() => {
    const updateHeader = () => setIsScrolled(window.scrollY > 28);

    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });

    return () => window.removeEventListener("scroll", updateHeader);
  }, []);

  useEffect(() => {
    const animationFrame = window.requestAnimationFrame(() => {
      setMenuOpen(false);
      setPaletteOpen(false);
    });

    return () => window.cancelAnimationFrame(animationFrame);
  }, [location.key]);

  useEffect(() => {
    if (!menuOpen) return undefined;

    const handlePointerDown = (event) => {
      if (!headerRef.current?.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key !== "Escape") return;

      event.preventDefault();
      setMenuOpen(false);
      toggleRef.current?.focus();
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  useEffect(() => {
    const desktopQuery = window.matchMedia("(min-width: 992px)");

    const closeOnDesktop = (event) => {
      if (!event.matches) return;

      setMenuOpen(false);

      if (document.activeElement === toggleRef.current) {
        logoRef.current?.focus();
      }
    };

    desktopQuery.addEventListener("change", closeOnDesktop);

    return () => desktopQuery.removeEventListener("change", closeOnDesktop);
  }, []);

  const closePalette = useCallback(({ restoreFocus = true } = {}) => {
    setPaletteOpen(false);

    if (restoreFocus) {
      window.requestAnimationFrame(() => {
        paletteTriggerRef.current?.focus();
      });
    }
  }, []);

  const openPalette = useCallback((event) => {
    const source = event?.currentTarget || document.activeElement;

    if (source instanceof HTMLElement) {
      paletteTriggerRef.current = source;
    }

    setMenuOpen(false);
    setPaletteOpen(true);
  }, []);

  useEffect(() => {
    const handleShortcut = (event) => {
      if (
        event.repeat ||
        event.altKey ||
        (!event.ctrlKey && !event.metaKey) ||
        event.key.toLowerCase() !== "k"
      ) {
        return;
      }

      const target = event.target;
      const isEditing =
        target instanceof HTMLElement &&
        (target.matches("input, textarea, select") || target.isContentEditable);

      if (isEditing && !paletteOpen) return;

      event.preventDefault();

      if (!paletteOpen) {
        openPalette();
      }
    };

    document.addEventListener("keydown", handleShortcut);

    return () => document.removeEventListener("keydown", handleShortcut);
  }, [openPalette, paletteOpen]);

  const handleNavigationClick = (href) => (event) => {
    setMenuOpen(false);

    const target = new URL(href, window.location.origin);

    if (target.pathname === pathname && target.hash === hash) {
      event.preventDefault();
      navigate(
        {
          pathname: target.pathname,
          search: target.search,
          hash: target.hash,
        },
        {
          replace: true,
          state: { scrollRequest: Date.now() },
        }
      );
    }
  };

  const isActive = (href) => {
    if (href === "/blogs") return pathname.startsWith("/blog");
    if (href === "/work") return pathname.startsWith("/work");
    if (href === "/categories") return pathname === "/categories";
    if (href === "/studio") return pathname === "/studio";
    if (href === "/") return pathname === "/" && !hash;

    return pathname === "/" && hash === href.replace("/", "");
  };

  return (
    <>
      <header
        className={
          `site-header${isScrolled ? " is-scrolled" : ""}` +
          `${menuOpen ? " is-menu-open" : ""}`
        }
        ref={headerRef}
      >
        <div className="container">
          <div className="site-header__inner">
            <Link
              className="logo"
              onClick={handleNavigationClick("/")}
              ref={logoRef}
              to="/"
              viewTransition
              aria-label="M-Agency home"
            >
              <span className="logo__mark" aria-hidden="true">M</span>
              <span>M-Agency</span>
            </Link>

            <button
              aria-controls="site-command-palette"
              aria-expanded={paletteOpen}
              aria-haspopup="dialog"
              aria-keyshortcuts="Control+K Meta+K"
              className="site-header__search"
              onClick={openPalette}
              type="button"
            >
              <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24">
                <circle cx="10.8" cy="10.8" r="6.2" />
                <path d="m15.4 15.4 4.1 4.1" />
              </svg>
              <span>Search</span>
              <kbd>Ctrl K</kbd>
            </button>

            <Link
              className="site-header__cta"
              to="/start-project"
              viewTransition
              onClick={handleNavigationClick("/start-project")}
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
              onClick={() => {
                setPaletteOpen(false);
                setMenuOpen((open) => !open);
              }}
            >
              <span></span>
              <span></span>
            </button>

            <nav
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
                        viewTransition
                        aria-current={active ? "page" : undefined}
                        onClick={handleNavigationClick(item.href)}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
                <li className="menu__project">
                  <Link
                    to="/start-project"
                    onClick={handleNavigationClick("/start-project")}
                  >
                    Start a project
                    <span aria-hidden="true">-&gt;</span>
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>

      {paletteOpen && (
        <CommandPalette
          onClose={closePalette}
          onNavigate={() => setPaletteOpen(false)}
        />
      )}
    </>
  );
};

export default Header;
