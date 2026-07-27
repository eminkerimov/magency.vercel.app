import React from "react";
import Layer32 from "../assets/img/Layer32.png";
import Layer38 from "../assets/img/Layer38.png";
import Layer37 from "../assets/img/Layer37.png";
import teammember2 from "../assets/img/teammember2.jpg";
import teammember1 from "../assets/img/teammember1.jpg";
import teammember3 from "../assets/img/teammember3.jpg";
import teammember4 from "../assets/img/teammember4.jpg";

const InnerBlog = () => {
  return (
    <>
      <section className="cover">
        <h1>Articles</h1>
      </section>
      <section className="blog-section">
        <div className="container">
          <div className="row">
            <div className="col-md-9">
              <div className="blog-item">
                <div className="blog-item__info">
                  <h4>18</h4>
                  <span>Jul</span>
                  <span>2026</span>
                </div>
                <div className="blog-item__content">
                  <h2 className="inner-title">
                  Building Resilient React Interfaces with Modern Error Boundaries
                  </h2>
                  <div className="blog-content__social inner-social">
                    <ul>
                      <li>
                        By <a href="#">Adrian Thomas</a>
                      </li>
                      <li>
                        <a href="#">18 comments</a>
                      </li>
                      <li>
                        <a href="#">Topics : React, Reliability, Frontend</a>
                      </li>
                      <li>
                        <a href="#">Share</a>
                      </li>
                      <li>
                        <a href="#">
                          <i className="fa fa-twitter" aria-hidden="true"></i>
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <i className="fa fa-facebook" aria-hidden="true"></i>
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div className="blog-item__content__flex">
                    <div className="blog-item__content__img">
                      <img src={Layer32} alt="layer32" />
                    </div>
                    <div className="blog-item__content__text">
                      <p>
                        A resilient React interface assumes that requests,
                        third-party code, and unexpected data will eventually
                        fail. One broken widget should not replace an entire
                        application with a blank screen. The goal is to contain
                        the failure, preserve useful context, and give the user
                        a clear path back to a working state.
                      </p>
                      <p>
                        Error boundaries provide that containment for render
                        failures. Used deliberately, they become part of the
                        application architecture rather than a last-minute
                        fallback screen.
                      </p>
                    </div>
                  </div>
                  <div className="blog-inner__content">
                    <p>
                      Place boundaries around meaningful product areas: the
                      editor, account panel, search results, or any feature that
                      can fail independently. A single boundary at the root is
                      still useful, but it cannot preserve the rest of the page
                      when one isolated feature throws during rendering.
                    </p>
                    <p>
                      A boundary catches errors in descendants during rendering
                      and lifecycle work. It does not replace validation for
                      event handlers, rejected promises, server responses, or
                      errors thrown inside the boundary itself. Those paths
                      still need explicit error handling and well-defined state.
                    </p>
                    <h3>
                      Treat every failure state as a product state with a clear
                      recovery action.
                    </h3>
                    <p>
                      Recovery UI should explain what failed without exposing
                      internal details. Offer a focused retry when it is safe,
                      preserve unsaved input where possible, and provide a route
                      to support when repeated attempts cannot restore the
                      feature.
                    </p>
                    <div className="blog-inner__content__img">
                      <img src={Layer38} alt="layer-38" />
                    </div>
                    <p>
                      Observability turns a graceful fallback into an actionable
                      engineering signal. Report the original error together
                      with the component stack and the boundary that handled it.
                    </p>
                    <p>
                      Include the route, release version, relevant feature flag,
                      and a correlation identifier, while excluding private user
                      data. Monitor fallback frequency after each deployment;
                      a boundary should reduce impact, not make regressions easy
                      to ignore.
                    </p>
                    <blockquote>
                      A boundary is useful only when it contains the failure,
                      explains the next step, and leaves enough context to debug
                      the cause.
                    </blockquote>
                    <p>Adrian Thomas</p>
                  </div>
                  <div className="blog-inner__share">
                    <fieldset>
                      <legend>Share this article</legend>
                      <ul>
                        <li>
                          <a
                            href="https://twitter.com/share?ref_src=twsrc%5Etfw"
                            className="twitter-share-button"
                            data-show-count="false"
                          >
                            Tweet
                          </a>
                        </li>
                        <li>2,085</li>
                        <li>
                          <div
                            className="fb-share-button"
                            data-href="https://developers.facebook.com/docs/plugins/"
                            data-layout="button_count"
                            data-size="small"
                          >
                            <a
                              target="_blank"
                              href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fplugins%2F&amp;src=sdkpreparse"
                              className="fb-xfbml-parse-ignore"
                            >
                              Like
                            </a>
                          </div>
                        </li>
                        <li>20 K</li>
                      </ul>
                    </fieldset>
                  </div>
                  <div className="inner-post">
                    <div className="inner-post__pagination">
                      <a className="previous" href="#">
                        Previous Article
                      </a>
                      <a className="next" href="#">
                        Next Article
                      </a>
                    </div>
                    <h2 className="title">Recent Articles</h2>
                    <ul className="inner-post__recent">
                      <li>
                        Testing React Server Components
                      </li>
                      <li>
                        Reliable Background Jobs in Node.js
                      </li>
                      <li>
                        Reading PostgreSQL Query Plans
                      </li>
                      <li>
                        Writing Useful Incident Reviews
                      </li>
                    </ul>
                  </div>
                  <div className="blog-comment">
                    <h2 className="title">5 Comments</h2>
                    <div className="blog-comment__content">
                      <div className="profile-img">
                        <img src={teammember2} alt="user_name" />
                      </div>
                      <div className="user-name">
                        <strong>Krishna, 19 July 2026</strong>
                        <a href="#">Reply</a>
                        <p>
                          The distinction between render errors and rejected
                          promises is especially useful. We were expecting one
                          boundary to handle both paths in our dashboard.
                        </p>
                      </div>
                    </div>
                    <div className="blog-comment__content reply">
                      <div className="profile-img">
                        <img src={teammember1} alt="user_name" />
                      </div>
                      <div className="user-name">
                        <strong>Russel, 19 July 2026</strong>
                        <p>
                          We made the same assumption. Handling request state
                          separately also gave us much better retry behavior.
                        </p>
                      </div>
                    </div>
                    <div className="blog-comment__content">
                      <div className="profile-img">
                        <img src={teammember3} alt="user_name" />
                      </div>
                      <div className="user-name">
                        <strong>Elena, 20 July 2026</strong>
                        <a href="#">Reply</a>
                        <p>
                          Feature-level boundaries helped us keep navigation and
                          unsaved form data available during a recent rollout.
                        </p>
                      </div>
                    </div>
                    <div className="blog-comment__content reply">
                      <div className="profile-img">
                        <img src={teammember4} alt="user_name" />
                      </div>
                      <div className="user-name">
                        <strong>Zarina, 20 July 2026</strong>
                        <p>
                          That is a good example of choosing boundaries around
                          user tasks instead of matching the component tree
                          mechanically.
                        </p>
                      </div>
                    </div>
                    <div className="blog-comment__content ">
                      <div className="profile-img">
                        <img src={teammember3} alt="user_name" />
                      </div>
                      <div className="user-name">
                        <strong>Aisha, 22 July 2026</strong>
                        <a href="#">Reply</a>
                        <p>
                          Adding the release version and feature flags to error
                          reports made regressions much faster for us to isolate.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="blog-inner__form">
                    <h2 className="title">Leave a Comment</h2>
                    <form action="#">
                      <div className="row">
                        <div className="col-md-6 col-sm-6">
                          <input type="text" placeholder="Your name*" />
                        </div>
                        <div className="col-md-6 col-sm-6">
                          <input type="email" placeholder="Email address*" />
                        </div>
                        <div className="col-md-12 col-sm-12 col-12">
                          <textarea
                            placeholder="Write your comment..."
                            cols="30"
                            rows="10"
                          ></textarea>
                        </div>
                        <div className="col-md-8 col-sm-8 col-8 elem-flex">
                          <input type="checkbox" name="check" id="check" />
                          <label for="check">
                            Notify me about replies by email
                          </label>
                        </div>
                        <div className="col-md-4 col-sm-4 col-4">
                          <button type="submit">Post Comment</button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
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
                        <a href="#" className="social-fb">
                          <i className="fa fa-facebook" aria-hidden="true"></i>
                        </a>
                      </li>
                      <li>
                        <a href="#" className="social-tw">
                          <i className="fa fa-twitter" aria-hidden="true"></i>
                        </a>
                      </li>
                      <li>
                        <a href="#" className="social-gl">
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
                      <a href="#">Frontend</a>
                    </li>
                    <li>
                      <a href="#">Backend</a>
                    </li>
                    <li>
                      <a href="#">DevOps &amp; Cloud</a>
                    </li>
                    <li>
                      <a href="#">Databases</a>
                    </li>
                    <li>
                      <a href="#">Testing</a>
                    </li>
                    <li>
                      <a href="#">Engineering Career</a>
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
                    <a href="#">
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
                      <a href="#">react</a>
                      <a href="#">typescript</a>
                      <a href="#">node.js</a>
                      <a href="#" className="active">
                        devops
                      </a>
                      <a href="#">testing</a>
                      <a href="#">databases</a>
                      <a href="#">career</a>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default InnerBlog;
