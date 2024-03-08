import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layer32 from "../assets/img/Layer32.png"

const BlogItem = () => {
    const navigate = useNavigate();
  return (
    <div className="blog-item">
    <div className="blog-item__info">
        <h4>22</h4>
        <span>Sep</span>
        <span>2013</span>
    </div>
    <div className="blog-item__content">
        <h2>Lorem Ipsum is simply dummy text of the printing.</h2>
        <div className="blog-item__content__flex">
            <div className="blog-item__content__img">
                <img src={Layer32} alt="layer32"/>
            </div>
            <div className="blog-item__content__text">
                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been
                    the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley
                    of type and scrambled it to make a type specimen book. It has survived not only five centuries,
                    but also the leap into electronic typesetting, remaining essentially unchanged. It was
                    popularised in the.</p>
                <p>1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with
                    desktop publishing</p>
                <a href="#" onClick={()=> navigate('/innerblog')}>Read More <i className="fa fa-angle-right" aria-hidden="true"></i></a>
                <span className="calendar">Sep 26,2013</span>
            </div>
        </div>
        <div className="blog-content__social">
            <ul>
                <li>By <a href="#">Admin Tom</a></li>
                <li><a href="#">126 comments</a></li>
                <li><a href="#">Tags : Design, Creative, Wordpress theme</a></li>
                <li><a href="#">Share</a></li>
                <li><a href="#"><i className="fa fa-twitter" aria-hidden="true"></i></a></li>
                <li><a href="#"><i className="fa fa-facebook" aria-hidden="true"></i></a></li>
            </ul>
        </div>
    </div>
</div>
  )
}

export default BlogItem