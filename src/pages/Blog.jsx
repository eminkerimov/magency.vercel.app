import React from 'react'
import BlogItem from "../components/BlogItem";
import Layer37 from "../assets/img/Layer37.png"

const Blog = () => {
  return (
    <>
    <section className="cover">
    <h1>Blog</h1>
</section>
<section className="blog-section">
    <div className="container">
        <div className="row">
            <div className="col-md-9">
              <BlogItem/>
              <BlogItem/>
              <BlogItem/>
              <BlogItem/>
            </div>
            <div className="col-md-3">
                <aside className="blog-right">
                    <div className="blog-form">
                        <form action="">
                            <div className="search-box">
                                <input type="text" placeholder="Search"/>
                            </div>
                        </form>
                        <div className="blog-form-social">
                            <h2 className="title">Follow Us</h2>
                            <ul>
                                <li><a href="#" className="social-fb"><i className="fa fa-facebook" aria-hidden="true"></i></a>
                                </li>
                                <li><a href="#" className="social-tw"><i className="fa fa-twitter" aria-hidden="true"></i></a>
                                </li>
                                <li><a href="#" className="social-gl"><i className="fa fa-google-plus"
                                            aria-hidden="true"></i></a></li>
                            </ul>
                            <form action="#">
                                <input type="email" placeholder="Enter Your e-mail"/>
                                <button className="blog-btn" type="submit">Subscribe</button>
                            </form>
                        </div>
                    </div>
                    <div className="blog-categories">
                        <h2 className="title">Categories</h2>
                        <ul>
                            <li><a href="#">Lorem Ipsum is simply dummy</a></li>
                            <li><a href="#">Lorem Ipsum is simply dummy</a></li>
                            <li><a href="#">Lorem Ipsum is simply dummy</a></li>
                            <li><a href="#">Lorem Ipsum is simply dummy</a></li>
                            <li><a href="#">Lorem Ipsum is simply dummy</a></li>
                            <li><a href="#">Lorem Ipsum is simply dummy</a></li>
                        </ul>
                    </div>
                    <div className="blog-post">
                        <h2 className="title">Popular Post</h2>
                        <div className="blog-post-img">
                            <img src={Layer37} alt="layer-37"/>
                        </div>
                        <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
                            been the industry's</p>
                        <div className="blog-date">
                            <span>Sep 26,2013</span>
                            <a href="#">Read More <i className="fa fa-angle-right" aria-hidden="true"></i></a>
                        </div>
                        <div className="blog-post-recent">
                            <h2 className="title">Recent Post</h2>
                            <ul>
                                <li>Lorem Ipsum is simply dummy</li>
                                <li>Lorem Ipsum is simply dummy</li>
                                <li>Lorem Ipsum is simply dummy</li>
                                <li>Lorem Ipsum is simply dummy</li>
                            </ul>
                        </div>
                        <div className="blog-tags">
                            <h2 className="title">Tags</h2>
                            <div className="blog-tag-list">
                                <a href="#">design</a>
                                <a href="#">development</a>
                                <a href="#">multipurpose</a>
                                <a href="#" className="active">creactive</a>
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
                        <li><a href="#"><i className="fa fa-angle-left" aria-hidden="true"></i></a></li>
                        <li><a href="#">1</a></li>
                        <li><a href="#">2</a></li>
                        <li><a href="#">3</a></li>
                        <li><a href="#">4</a></li>
                        <li><a href="#">5</a></li>
                        <li><a href="#">6</a></li>
                        <li>...</li>
                        <li><a href="#">78</a></li>
                        <li><a href="#"><i className="fa fa-angle-right" aria-hidden="true"></i></a></li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</section>
    </>
  )
}

export default Blog