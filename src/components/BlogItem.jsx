import React from 'react';
import { useNavigate } from 'react-router-dom';

const BlogItem = ({blog, id}) => {
    const navigate = useNavigate();

  return (
    <div className="blog-item">
    <div className="blog-item__info">
        <h4>{blog?.day}</h4>
        <span>{blog?.month}</span>
        <span>{blog?.year}</span>
    </div>
    <div className="blog-item__content">
        <h2>{blog?.title}</h2>
        <div className="blog-item__content__flex">
            <div className="blog-item__content__img">
                <img src={blog?.img} alt="layer32"/>
            </div>
            <div className="blog-item__content__text">
                <p>{blog?.desc}</p>
                <p onClick={()=> navigate(`/blog/${blog?.id}`)}>Read More <i className="fa fa-angle-right" aria-hidden="true"></i></p>
                <span className="calendar">{blog?.month} {blog?.day}, {blog?.year}</span>
            </div>
        </div>
        <div className="blog-content__social">
            <ul>
                <li>By <a href="#">{blog?.publisher}</a></li>
                <li><a href="#">{blog?.commentCount} comments</a></li>
                <li><a href="#">Tags : {blog?.tags}</a></li>
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