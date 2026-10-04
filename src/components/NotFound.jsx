import { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import Seo from "./Seo";

const NotFound = ({
  eyebrow = "Route not found",
  title = "This page slipped out of the build.",
  message = "The address may have changed, or the page may no longer be available.",
}) => {
  const { pathname } = useLocation();
  const titleRef = useRef(null);

  useEffect(() => {
    titleRef.current?.focus({ preventScroll: true });
  }, [pathname]);

  return (
    <main className="not-found">
      <Seo
        title="Page not found | M-Agency"
        description="The requested M-Agency portfolio page could not be found."
        path={pathname}
        robots="noindex, nofollow"
      />

      <div className="container not-found__layout">
        <div className="not-found__content">
          <span className="not-found__eyebrow">{eyebrow}</span>
          <strong className="not-found__code" aria-hidden="true">404</strong>
          <h1 ref={titleRef} tabIndex={-1}>{title}</h1>
          <p>{message}</p>
          <code className="not-found__path">{pathname}</code>

          <div className="not-found__actions">
            <Link className="not-found__primary" to="/">Back home</Link>
            <Link className="not-found__secondary" to="/work">View work</Link>
          </div>

          <Link className="not-found__insights" to="/blogs">
            Or continue with engineering insights <span aria-hidden="true">&#8594;</span>
          </Link>
        </div>

        <div className="not-found__visual" aria-hidden="true">
          <div className="not-found__window-bar">
            <span />
            <span />
            <span />
            <small>router.ts</small>
          </div>
          <div className="not-found__terminal">
            <span><i>const</i> route = match(pathname);</span>
            <span><i>if</i> (!route) &#123;</span>
            <span className="not-found__indent">return &#123;</span>
            <span className="not-found__indent-2">status: <b>404</b>,</span>
            <span className="not-found__indent-2">next: <em>&quot;/work&quot;</em></span>
            <span className="not-found__indent">&#125;;</span>
            <span>&#125;</span>
          </div>
          <div className="not-found__status">
            <span>Route check</span>
            <strong>Not found</strong>
          </div>
        </div>
      </div>
    </main>
  );
};

export default NotFound;
