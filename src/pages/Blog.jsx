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
      day: 22,
      month: "Sep",
      year: 2013,
      title:
        "Embarking on a Profound Journey into the Intricacies of Web Development",
      desc: "Embark on an immersive and profound journey into the intricate world of web development. This comprehensive guide carefully unravels the subtle nuances of HTML, CSS, and JavaScript, expertly guiding you through the creation of dynamic and responsive web applications. Whether you are a curious novice taking your first steps or a seasoned developer honing your skills, this blog serves as your comprehensive gateway to mastering the intricate art and fascinating science of web development. Explore the depths of modern web technologies, learn to navigate the challenges of cross-browser compatibility, and discover the secrets to crafting seamless user experiences that captivate and delight.",
      publisher: "Admin Tom",
      commentCount: 50,
      tags: "Web, Code, Development",
      img: Layer32
    },
    {
      id:2,
      day: 15,
      month: "Oct",
      year: 2015,
      title:
        "Crafting Digital Experiences: An Epic and Transformative Odyssey in Design",
      desc: "Embark on an epic and transformative journey through the creative and technical realms of digital design. This extensive blog delves deep into the fundamental principles of graphic design, crucial considerations in user interface design, and the ever-evolving landscape of digital aesthetics. Join us on this odyssey to discover the latest trends, cutting-edge tools, and advanced techniques that will elevate your digital design skills to new heights, inspiring your creative endeavors along the way. Unleash your creativity, explore the intersection of art and technology, and master the art of translating ideas into visually stunning digital experiences that leave a lasting impact.",
      publisher: "Admin Lisa",
      commentCount: 87,
      tags: "Design, UI, Graphics",
      img: Layer33
    },
    {
      id:3,
      day: 8,
      month: "May",
      year: 2018,
      title:
        "Mastering Mobile App Development: An Epic Cross-Platform Odyssey into the Future",
      desc: "Immerse yourself in an epic and comprehensive exploration of mobile app development. This in-depth blog delves into the intricate details of building cross-platform apps, providing invaluable insights into the best practices for creating exceptional user experiences on a variety of mobile devices. Whether you're an experienced developer seeking to broaden your skill set or a passionate beginner eager to enter the dynamic and ever-evolving world of mobile app development, this guide is your trusted compass. Navigate the challenges of mobile development, master the art of creating fluid and responsive interfaces, and explore the frontiers of innovation in the mobile app landscape.",
      publisher: "Admin Alex",
      commentCount: 120,
      tags: "Mobile, Cross-Platform, UX",
      img: Layer34
    },
    {
      id:4,
      day: 3,
      month: "Jan",
      year: 2020,
      title:
        "Demystifying Data Science: Unleashing the Limitless Analytical Power of Big Data",
      desc: "Embark on a captivating and extensive journey into the boundless world of data science and analytics. This in-depth blog expertly explores the diverse tools and advanced techniques used to extract valuable insights from data, delving into real-world applications and providing essential resources for aspiring data scientists. Join us on this transformative journey to unleash the immense and limitless power of data, turning raw information into actionable knowledge that drives innovation and success. Dive deep into the realm of big data analytics, learn to harness the potential of machine learning algorithms, and discover the secrets to making data-driven decisions that propel organizations to new heights of success.",
      publisher: "Admin Sarah",
      commentCount: 65,
      tags: "Data, Analytics, ML",
      img: Layer35
    },
  ];

  return (
    <>
      <section className="cover">
        <h1>Blog</h1>
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
      <section className="pagination">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="pagination-list">
                <ul>
                  <li>
                    <a href="#">
                      <i className="fa fa-angle-left" aria-hidden="true"></i>
                    </a>
                  </li>
                  <li>
                    <a href="#">1</a>
                  </li>
                  <li>
                    <a href="#">2</a>
                  </li>
                  <li>
                    <a href="#">3</a>
                  </li>
                  <li>
                    <a href="#">4</a>
                  </li>
                  <li>
                    <a href="#">5</a>
                  </li>
                  <li>
                    <a href="#">6</a>
                  </li>
                  <li>...</li>
                  <li>
                    <a href="#">78</a>
                  </li>
                  <li>
                    <a href="#">
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
