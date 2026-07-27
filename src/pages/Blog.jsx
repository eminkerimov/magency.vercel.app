import React from "react";
import BlogItem from "../components/BlogItem";
import Layer32 from "../assets/img/Layer32.png";
import Layer33 from "../assets/img/Layer33.png";
import Layer34 from "../assets/img/Layer34.png";
import Layer35 from "../assets/img/Layer35.png";
import Layer37 from "../assets/img/Layer37.png";

const Blog = () => {
  const blogs = [
    {
      id:1,
      day: 18,
      month: "Jul",
      year: 2026,
      title:
        "Building Resilient React Interfaces with Modern Error Boundaries",
      desc: "A practical guide to containing render failures, handling rejected requests, and designing recovery paths that keep the rest of a React application usable. Learn where boundaries belong, what they cannot catch, and how to connect failures to useful observability.",
      publisher: "Adrian Thomas",
      commentCount: 18,
      tags: "React, Reliability, Frontend",
      img: Layer32
    },
    {
      id:2,
      day: 11,
      month: "Jul",
      year: 2026,
      title:
        "Designing Type-Safe APIs with Node.js and TypeScript",
      desc: "Follow an API contract from request validation to database access and response serialization. This article shows how to keep runtime checks and TypeScript types aligned without duplicating schemas or hiding important failure cases.",
      publisher: "Narate Ketram",
      commentCount: 24,
      tags: "Node.js, TypeScript, APIs",
      img: Layer33
    },
    {
      id:3,
      day: 4,
      month: "Jul",
      year: 2026,
      title:
        "Practical CI/CD for Small Engineering Teams",
      desc: "Build a deployment pipeline that is fast enough to use on every change and strict enough to protect production. The walkthrough covers test stages, preview environments, release approvals, rollback signals, and the metrics worth tracking.",
      publisher: "Fernando Comet",
      commentCount: 31,
      tags: "CI/CD, DevOps, Automation",
      img: Layer34
    },
    {
      id:4,
      day: 27,
      month: "Jun",
      year: 2026,
      title:
        "PostgreSQL Query Tuning: A Production Checklist",
      desc: "Use execution plans, table statistics, indexes, and application traces to diagnose slow PostgreSQL queries systematically. The checklist focuses on evidence-driven changes and the verification steps needed before a database optimization reaches production.",
      publisher: "Narate Ketram",
      commentCount: 16,
      tags: "PostgreSQL, Databases, Performance",
      img: Layer35
    },
  ];

  return (
    <>
      <section className="cover">
        <h1>Articles</h1>
      </section>
      <section className="blog-section">
        <div className="container">
          <div className="row">
            <div className="col-md-9">
              {blogs.map((item, index) => (
                <BlogItem blog={item} key={index}/>
              ))}
            </div>
            <div className="col-md-3">
              <aside className="blog-right">
                <div className="blog-form">
                  <form action="">
                    <div className="search-box">
                      <input type="text" placeholder="Search articles" />
                    </div>
                  </form>
                  <div className="blog-form-social">
                    <h2 className="title">Follow M-Agency</h2>
                    <ul>
                      <li>
                        <a href="/" className="social-fb">
                          <i className="fa fa-facebook" aria-hidden="true"></i>
                        </a>
                      </li>
                      <li>
                        <a href="/" className="social-tw">
                          <i className="fa fa-twitter" aria-hidden="true"></i>
                        </a>
                      </li>
                      <li>
                        <a href="/" className="social-gl">
                          <i
                            className="fa fa-google-plus"
                            aria-hidden="true"
                          ></i>
                        </a>
                      </li>
                    </ul>
                    <form action="#">
                      <input type="email" placeholder="Email address" />
                      <button className="blog-btn" type="submit">
                        Join Newsletter
                      </button>
                    </form>
                  </div>
                </div>
                <div className="blog-categories">
                  <h2 className="title">Categories</h2>
                  <ul>
                    <li>
                      <a href="/">Frontend</a>
                    </li>
                    <li>
                      <a href="/">Backend</a>
                    </li>
                    <li>
                      <a href="/">DevOps &amp; Cloud</a>
                    </li>
                    <li>
                      <a href="/">Databases</a>
                    </li>
                    <li>
                      <a href="/">Testing</a>
                    </li>
                    <li>
                      <a href="/">Engineering Career</a>
                    </li>
                  </ul>
                </div>
                <div className="blog-post">
                  <h2 className="title">Popular Article</h2>
                  <div className="blog-post-img">
                    <img src={Layer37} alt="layer-37" />
                  </div>
                  <p>
                    A production-focused guide to React error boundaries,
                    recovery states, and actionable frontend observability.
                  </p>
                  <div className="blog-date">
                    <span>Jul 18, 2026</span>
                    <a href="/">
                      Read Article{" "}
                      <i className="fa fa-angle-right" aria-hidden="true"></i>
                    </a>
                  </div>
                  <div className="blog-post-recent">
                    <h2 className="title">Recent Articles</h2>
                    <ul>
                      <li>Testing React Server Components</li>
                      <li>Reliable Background Jobs in Node.js</li>
                      <li>Reading PostgreSQL Query Plans</li>
                      <li>Writing Useful Incident Reviews</li>
                    </ul>
                  </div>

                  <div className="blog-tags">
                    <h2 className="title">Tags</h2>
                    <div className="blog-tag-list">
                      <a href="/">react</a>
                      <a href="/">typescript</a>
                      <a href="/">node.js</a>
                      <a href="/" className="active">
                        devops
                      </a>
                      <a href="/">testing</a>
                      <a href="/">databases</a>
                      <a href="/">career</a>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </section>
      <section className="pagination">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="pagination-list">
                <ul>
                  <li>
                    <a href="/">
                      <i className="fa fa-angle-left" aria-hidden="true"></i>
                    </a>
                  </li>
                  <li>
                    <a href="/">1</a>
                  </li>
                  <li>
                    <a href="/">2</a>
                  </li>
                  <li>
                    <a href="/">3</a>
                  </li>
                  <li>
                    <a href="/">4</a>
                  </li>
                  <li>
                    <a href="/">5</a>
                  </li>
                  <li>
                    <a href="/">6</a>
                  </li>
                  <li>...</li>
                  <li>
                    <a href="/">78</a>
                  </li>
                  <li>
                    <a href="/">
                      <i className="fa fa-angle-right" aria-hidden="true"></i>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Blog;
