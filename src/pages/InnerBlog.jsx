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
        <h1>Blog</h1>
      </section>
      <section className="blog-section">
        <div className="container">
          <div className="row">
            <div className="col-md-9">
              <div className="blog-item">
                <div className="blog-item__info">
                  <h4>22</h4>
                  <span>Sep</span>
                  <span>2013</span>
                </div>
                <div className="blog-item__content">
                  <h2 className="inner-title">
                    Lorem Ipsum is simply dummy text of the printing .
                  </h2>
                  <div className="blog-content__social inner-social">
                    <ul>
                      <li>
                        By <a href="#">Admin Tom</a>
                      </li>
                      <li>
                        <a href="#">126 comments</a>
                      </li>
                      <li>
                        <a href="#">Tags : Design, Creative, Wordpress theme</a>
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
                        Lorem Ipsum is simply dummy text of the printing and
                        typesetting industry. Lorem Ipsum has been the
                        industry's standard dummy text ever since the 1500s,
                        when an unknown printer took a galley of type and
                        scrambled it to make a type specimen book. It has
                        survived not only five centuries, but also the leap into
                        electronic typesetting, remaining essentially unchanged.
                        It was popularised in the.
                      </p>
                      <p>
                        1960s with the release of Letraset sheets containing
                        Lorem Ipsum passages, and more recently with desktop
                        publishing
                      </p>
                    </div>
                  </div>
                  <div className="blog-inner__content">
                    <p>
                      Lorem Ipsum is simply dummy text of the printing and
                      typesetting industry. Lorem Ipsum has been the industry's
                      standard dummy text ever since the 1500s, when an unknown
                      printer took a galley of type and scrambled it to make a
                      type specimen book. It has survived not only five
                      centuries, but also the leap into electronic typesetting,
                      remaining essentially unchanged. It was popularised in
                      the.
                    </p>
                    <p>
                      when an unknown printer took a galley of type and
                      scrambled it to make a type specimen book. It has survived
                      not only five centuries, but also the leap into electronic
                      typesetting, remaining essentially unchanged. It was
                      popularised in the. when an unknown printer took a galley
                      of type and scrambled it to make a type specimen book. It
                      has survived not only five centuries, but also the leap
                      into electronic typesetting,{" "}
                    </p>
                    <h3>
                      There are many variations of passages of Lorem Ipsum
                      available, but the majority have suffered alteration in
                      some.
                    </h3>
                    <p>
                      orem Ipsum is simply dummy text of the printing and
                      typesetting industry. Lorem Ipsum has been the industry's
                      standard dummy text ever since the 1500s, when an unknown
                      printer took a galley of type and scrambled it to make a
                      type specimen book. It has survived not only five
                      centuries
                    </p>
                    <div className="blog-inner__content__img">
                      <img src={Layer38} alt="layer-38" />
                    </div>
                    <p>
                      Lorem Ipsum is simply dummy text of the printing and
                      typesetting industry. Lorem Ipsum has been the industry's
                      standard dummy text ever since the 1500s,{" "}
                    </p>
                    <p>
                      when an unknown printer took a galley of type and
                      scrambled it to make a type specimen book. It has survived
                      not only five centuries, but also the leap into electronic
                      typesetting, remaining essentially unchanged. It was
                      popularised in the. when an unknown printer took a galley
                      of type and scrambled{" "}
                    </p>
                    <blockquote>
                      since the 1500s, when an unknown printer took a galley of
                      type and scrambled it to make a type specimen book. It has
                      survived not only five centuries, but also the leap into
                      electronic typesetting, remaining essentially unchanged.{" "}
                    </blockquote>
                    <p>Robort John</p>
                  </div>
                  <div className="blog-inner__share">
                    <fieldset>
                      <legend>Share With your friends</legend>
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
                        Previos Post
                      </a>
                      <a className="next" href="#">
                        Next Post
                      </a>
                    </div>
                    <h2 className="title">Recent Post</h2>
                    <ul className="inner-post__recent">
                      <li>
                        Lorem ipsum, dolor sit amet consectetur adipisicing.
                      </li>
                      <li>
                        Lorem ipsum dolor sit amet consectetur, adipisicing.
                      </li>
                      <li>
                        Lorem ipsum dolor sit, amet consectetur adipisicing.
                      </li>
                      <li>
                        Lorem ipsum dolor sit amet consectetur adipisicing.
                      </li>
                    </ul>
                  </div>
                  <div className="blog-comment">
                    <h2 className="title">3 Comments</h2>
                    <div className="blog-comment__content">
                      <div className="profile-img">
                        <img src={teammember2} alt="user_name" />
                      </div>
                      <div className="user-name">
                        <strong>Krishna, 10 October 2013</strong>
                        <a href="#">Reply</a>
                        <p>
                          Lorem ipsum dolor sit amet consectetur adipisicing
                          elit. Asperiores aperiam facere dolore aut, quaerat
                          atque unde amet beatae eligendi voluptatum.
                        </p>
                      </div>
                    </div>
                    <div className="blog-comment__content reply">
                      <div className="profile-img">
                        <img src={teammember1} alt="user_name" />
                      </div>
                      <div className="user-name">
                        <strong>Russel, 10 October 2013</strong>
                        <p>
                          Lorem ipsum dolor sit amet consectetur adipisicing
                          elit. Asperiores aperiam facere dolore aut, quaerat
                          atque unde amet beatae eligendi voluptatum.
                        </p>
                      </div>
                    </div>
                    <div className="blog-comment__content">
                      <div className="profile-img">
                        <img src={teammember3} alt="user_name" />
                      </div>
                      <div className="user-name">
                        <strong>Elena, 10 October 2013</strong>
                        <a href="#">Reply</a>
                        <p>
                          Lorem ipsum dolor sit amet consectetur adipisicing
                          elit. Asperiores aperiam facere dolore aut, quaerat
                          atque unde amet beatae eligendi voluptatum.
                        </p>
                      </div>
                    </div>
                    <div className="blog-comment__content reply">
                      <div className="profile-img">
                        <img src={teammember4} alt="user_name" />
                      </div>
                      <div className="user-name">
                        <strong>Zarina, 10 October 2013</strong>
                        <p>
                          Lorem ipsum dolor sit, amet consectetur adipisicing
                          elit. Officia, nulla provident? Quae, sed illo.
                          Reiciendis voluptatibus odit laboriosam quos eum
                          sapiente laudantium aspernatur sit ab?
                        </p>
                      </div>
                    </div>
                    <div className="blog-comment__content ">
                      <div className="profile-img">
                        <img src={teammember3} alt="user_name" />
                      </div>
                      <div className="user-name">
                        <strong>Elena, 20 September 2013</strong>
                        <a href="#">Reply</a>
                        <p>
                          Lorem ipsum dolor sit amet consectetur adipisicing
                          elit. Asperiores aperiam facere dolore aut, quaerat
                          atque unde amet beatae eligendi voluptatum.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="blog-inner__form">
                    <h2 className="title">Leave a Comment</h2>
                    <form action="#">
                      <div className="row">
                        <div className="col-md-6 col-sm-6">
                          <input type="text" placeholder="Name*" />
                        </div>
                        <div className="col-md-6 col-sm-6">
                          <input type="email" placeholder="Email*" />
                        </div>
                        <div className="col-md-12 col-sm-12 col-12">
                          <textarea
                            placeholder="Text your comment..."
                            cols="30"
                            rows="10"
                          ></textarea>
                        </div>
                        <div className="col-md-8 col-sm-8 col-8 elem-flex">
                          <input type="checkbox" name="check" id="check" />
                          <label for="check">
                            notiy me of follow up comments via e-mail
                          </label>
                        </div>
                        <div className="col-md-4 col-sm-4 col-4">
                          <button type="submit">Send</button>
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
                      <input type="text" placeholder="Search" />
                    </div>
                  </form>
                  <div className="blog-form-social">
                    <h2 className="title">Follow Us</h2>
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
                      <input type="email" placeholder="Enter Your e-mail" />
                      <button className="blog-btn" type="submit">
                        Subscribe
                      </button>
                    </form>
                  </div>
                </div>
                <div className="blog-categories">
                  <h2 className="title">Categories</h2>
                  <ul>
                    <li>
                      <a href="#">Animals</a>
                    </li>
                    <li>
                      <a href="#">Fruits</a>
                    </li>
                    <li>
                      <a href="#">Colors</a>
                    </li>
                    <li>
                      <a href="#">Genres of Music</a>
                    </li>
                    <li>
                      <a href="#">Countries</a>
                    </li>
                    <li>
                      <a href="#">Planets in the Solar System</a>
                    </li>
                  </ul>
                </div>
                <div className="blog-post">
                  <h2 className="title">Popular Post</h2>
                  <div className="blog-post-img">
                    <img src={Layer37} alt="layer-37" />
                  </div>
                  <p>
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry. Lorem Ipsum has been the industry's
                  </p>
                  <div className="blog-date">
                    <span>Sep 26,2013</span>
                    <a href="#">
                      Read More{" "}
                      <i className="fa fa-angle-right" aria-hidden="true"></i>
                    </a>
                  </div>
                  <div className="blog-post-recent">
                    <h2 className="title">Recent Post</h2>
                    <ul>
                      <li>Introduction to React Hooks</li>
                      <li>Exploring the Wonders</li>
                      <li>Creative Web Design Trends</li>
                      <li>The Art of Writing Clean Code</li>
                    </ul>
                  </div>

                  <div className="blog-tags">
                    <h2 className="title">Tags</h2>
                    <div className="blog-tag-list">
                      <a href="#">design</a>
                      <a href="#">development</a>
                      <a href="#">multipurpose</a>
                      <a href="#" className="active">
                        creactive
                      </a>
                      <a href="#">seo</a>
                      <a href="#">adverticement</a>
                      <a href="#">life</a>
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
