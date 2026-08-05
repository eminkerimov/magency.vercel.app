import React from 'react';
import { Link } from 'react-router-dom';
import teammember1 from "../assets/img/author-frontend.jpg"
import teammember2 from "../assets/img/author-devops.jpg"
import teammember3 from "../assets/img/author-career.jpg"
import teammember4 from "../assets/img/author-backend.jpg"

const Team = () => {
    const team = [
        {img: teammember1, name:'Adrian Thomas', position: "Frontend Engineering Author", desc: "Adrian writes about scalable React architecture, accessibility, and the browser performance lessons learned while shipping production interfaces", articles: 28, topic: "Frontend"},
        {img: teammember4, name:'Narate Ketram', position: "Backend Systems Author", desc: "Narate covers API design, distributed systems, and practical techniques for building services that remain reliable as traffic grows", articles: 24, topic: "Backend"},
        {img: teammember2, name:'Fernando Comet', position: "DevOps & Cloud Author", desc: "Fernando shares field-tested guidance on CI/CD, observability, containers, and keeping cloud infrastructure understandable and secure", articles: 19, topic: "DevOps"},
        {img: teammember3, name:'Adedayo Saheed', position: "Engineering Career Author", desc: "Adedayo explores technical leadership, developer growth, and the communication habits that help engineering teams do their best work", articles: 17, topic: "Career"},
    ]
  return (
    <section className="top-authors" id="team">
      <div className="container">
        <div className="top-authors__heading">
          <span>Meet the contributors</span>
          <h2>Top Authors</h2>
          <p>Experienced engineers sharing practical lessons from real products and teams.</p>
        </div>

        <div className="top-authors__grid">
          {team.map((member) => (
            <article className="author-tile" key={member.name}>
              <img className="author-tile__image" src={member.img} alt={member.name}/>
              <div className="author-tile__overlay" aria-hidden="true" />
              <div className="author-tile__meta">
                <span className="author-tile__badge">{member.topic}</span>
                <span className="author-tile__count">{member.articles} articles</span>
              </div>
              <div className="author-tile__content">
                <h3>{member.name}</h3>
                <p>{member.position}</p>
                <Link to={`/blogs?q=${encodeURIComponent(member.name)}`}>
                  View articles <span aria-hidden="true">→</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Team
