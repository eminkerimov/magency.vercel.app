import React from 'react';
import teammember1 from "../assets/img/teammember1.jpg"
import teammember2 from "../assets/img/teammember2.jpg"
import teammember3 from "../assets/img/teammember3.jpg"
import teammember4 from "../assets/img/teammember4.jpg"

const Team = () => {
    const team = [
        {img: teammember1, name:'Adrian Thomas', position: "Senior Marketing Manager", desc: "A seasoned strategist, our Senior Marketing Manager delivers impactful, data-driven campaigns, ensuring results in the fast-paced world of digital marketing"},
        {img: teammember4, name:'Narate Ketram', position: "Lead Software Engineer", desc: "Spearheading innovation, our Lead Software Engineer guides a talented team in delivering cutting-edge solutions, driving continuous technological evolution"},
        {img: teammember2, name:'Fernando Comet', position: "Human Resources Specialist", desc: "At the core of our people-centric culture, our HR Specialist excels in talent acquisition and employee development, fostering a positive work environment"},
        {img: teammember3, name:'Adedayo Saheed', position: "Financial Analyst", desc: "Precision and insight define our Financial Analyst, guiding fiscal strategy and contributing to financial health with meticulous budgeting and insightful forecasting"},
    ]
  return (
    <section className="team" id="team">
    <div className="container">
        <h2 className="section-title">The Team</h2>
        <div className="row">
            {team.map((member, indx) => (
                            <div className="col-3" key={indx}>
                            <div className="section-item">
                                <a href="#">
                                    <img src={member.img} alt="team"/>
                                    <span>+</span>
                                </a>
                                <h2 className="section-item__name">{member.name}</h2>
                                <span className="section-item__position">{member.position}</span>
                                <p className="section-item__text">{member.desc}</p>
                            </div>
                        </div>
            ))}
        </div>
    </div>
</section>
  )
}

export default Team