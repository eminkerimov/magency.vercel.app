import React from 'react'
import ClientsSlider from '../components/ClientsSlider'
import MainSlider from '../components/MainSlider'
import Services from '../components/Services'
import Team from '../components/Team'

const featuredArticles = [
    {
        category: 'Frontend',
        title: 'Building Resilient React Interfaces with Modern Error Boundaries',
        excerpt: 'Design recovery paths that contain failures and keep the rest of your application useful.',
        readingTime: '8 min read',
        author: 'Adrian Thomas',
        initials: 'AT',
        date: 'Jul 18, 2026',
        href: '/blog/1',
        cover: 'react',
        glyph: '</>',
    },
    {
        category: 'Backend',
        title: 'Designing Type-Safe APIs with Node.js and TypeScript',
        excerpt: 'Keep validation, domain models, and response contracts aligned from request to database.',
        readingTime: '9 min read',
        author: 'Narate Ketram',
        initials: 'NK',
        date: 'Jul 11, 2026',
        href: '/blog/2',
        cover: 'backend',
        glyph: '{ }',
    },
    {
        category: 'DevOps',
        title: 'Practical CI/CD for Small Engineering Teams',
        excerpt: 'Build a deployment pipeline that stays fast, understandable, and safe as your team grows.',
        readingTime: '7 min read',
        author: 'Fernando Comet',
        initials: 'FC',
        date: 'Jul 4, 2026',
        href: '/blog/3',
        cover: 'devops',
        glyph: '↗',
    },
    {
        category: 'Databases',
        title: 'PostgreSQL Query Tuning: A Production Checklist',
        excerpt: 'Diagnose slow queries with execution plans, statistics, indexes, and application traces.',
        readingTime: '10 min read',
        author: 'Narate Ketram',
        initials: 'NK',
        date: 'Jun 27, 2026',
        href: '/blog/4',
        cover: 'database',
        glyph: 'DB',
    },
    {
        category: 'Testing',
        title: 'Testing React Server Components Without Brittle Mocks',
        excerpt: 'Test behavior at useful boundaries while keeping implementation details free to change.',
        readingTime: '6 min read',
        author: 'Adrian Thomas',
        initials: 'AT',
        date: 'Jun 20, 2026',
        href: '/blogs',
        cover: 'testing',
        glyph: '✓',
    },
    {
        category: 'Career',
        title: 'Writing Incident Reviews That Improve Engineering Systems',
        excerpt: 'Turn production failures into specific learning, safer processes, and better technical decisions.',
        readingTime: '8 min read',
        author: 'Adedayo Saheed',
        initials: 'AS',
        date: 'Jun 13, 2026',
        href: '/blogs',
        cover: 'career',
        glyph: '01',
    },
]

const Home = () => {
  return (
    <>
    <MainSlider/>
    <Services/>

<section className="featured-articles" id="portfolio">
    <div className="container">
        <div className="featured-articles__heading">
            <div>
                <span>Editor’s picks</span>
                <h2>Featured Articles</h2>
                <p>Deep, practical writing for the decisions developers face in production.</p>
            </div>
            <a href="/blogs">View all articles <span aria-hidden="true">→</span></a>
        </div>
        <div className="featured-articles__grid">
            {featuredArticles.slice(0, 3).map((article) => (
                <article className="article-card" key={article.title}>
                    <a
                        className={`article-card__cover article-card__cover--${article.cover}`}
                        href={article.href}
                        role="img"
                        aria-label={`${article.title} cover`}
                    >
                        <span className="article-card__brand" aria-hidden="true">M / DEV</span>
                        <div className="article-card__visual" aria-hidden="true">
                            <strong>{article.glyph}</strong>
                            <div>
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                    </a>
                    <div className="article-card__content">
                        <div className="article-card__meta">
                            <span>{article.category}</span>
                            <span>{article.readingTime}</span>
                        </div>
                        <h3><a href={article.href}>{article.title}</a></h3>
                        <p>{article.excerpt}</p>
                        <div className="article-card__footer">
                            <div className="article-card__author">
                                <span>{article.initials}</span>
                                <div>
                                    <strong>{article.author}</strong>
                                    <time>{article.date}</time>
                                </div>
                            </div>
                            <a className="article-card__button" href={article.href} aria-label={`Read ${article.title}`}>
                                Read article <span aria-hidden="true">→</span>
                            </a>
                        </div>
                    </div>
                </article>
            ))}
        </div>
    </div>
</section>

<Team/>


<section className="tariffs" id="pricing">
    <div className="container">
        <header className="tariffs__heading">
            <div>
                <span>Membership</span>
                <h2>Choose how you read</h2>
            </div>
            <p>Start free, unlock deeper technical content, or bring your whole engineering team.</p>
        </header>

        <div className="tariffs__grid">
            <article className="tariffs-item">
                <header className="tariffs-item__header">
                    <h3>Reader</h3>
                    <div className="tariffs-item__price"><strong>$0</strong><span>/ month</span></div>
                </header>
                <ul className="tariffs-item__features">
                    <li>Public articles</li>
                    <li>Weekly newsletter</li>
                    <li>Topic bookmarks</li>
                    <li>Community comments</li>
                    <li>Full RSS feed</li>
                    <li>No credit card</li>
                </ul>
                <button type="button">Start reading</button>
            </article>

            <article className="tariffs-item tariffs-item--featured">
                <span className="tariffs-item__badge">Most popular</span>
                <header className="tariffs-item__header">
                    <h3>Member</h3>
                    <div className="tariffs-item__price"><strong>$8</strong><span>/ month</span></div>
                </header>
                <ul className="tariffs-item__features">
                    <li>Everything in Reader</li>
                    <li>Members-only deep dives</li>
                    <li>Ad-free reading</li>
                    <li>Offline article access</li>
                    <li>Source code downloads</li>
                    <li>Monthly author Q&amp;A</li>
                </ul>
                <button type="button">Join as member</button>
            </article>

            <article className="tariffs-item">
                <header className="tariffs-item__header">
                    <h3>Team</h3>
                    <div className="tariffs-item__price"><strong>$24</strong><span>/ month</span></div>
                </header>
                <ul className="tariffs-item__features">
                    <li>Up to 5 members</li>
                    <li>Shared reading lists</li>
                    <li>Private team notes</li>
                    <li>Curated learning paths</li>
                    <li>Monthly team digest</li>
                    <li>Priority support</li>
                </ul>
                <button type="button">Start team plan</button>
            </article>
        </div>
    </div>
</section>


<ClientsSlider/>


<section className="contact" id="contact">
    <div className="container">
        <div className="contact__panel">
            <div className="contact__content">
                <span className="contact__eyebrow">Contact</span>
                <h2>Talk to the editorial team</h2>
                <p>Suggest an article, report a technical issue, or propose a collaboration. Include relevant context so our editors can respond efficiently.</p>

                <div className="contact__links">
                    <a href="https://magency.vercel.app">
                        <span>Website</span>
                        <strong>magency.vercel.app</strong>
                        <i aria-hidden="true">↗</i>
                    </a>
                    <a href="mailto:editor@magency.vercel.app">
                        <span>Editorial</span>
                        <strong>editor@magency.vercel.app</strong>
                        <i aria-hidden="true">↗</i>
                    </a>
                    <a href="mailto:support@magency.vercel.app">
                        <span>Support</span>
                        <strong>support@magency.vercel.app</strong>
                        <i aria-hidden="true">↗</i>
                    </a>
                </div>
            </div>

            <form className="contact__form">
                <div className="contact__fields">
                    <label>
                        <span>Name</span>
                        <input type="text" placeholder="Your name"/>
                    </label>
                    <label>
                        <span>Email</span>
                        <input type="email" placeholder="Work email"/>
                    </label>
                    <label className="contact__message">
                        <span>Message</span>
                        <textarea placeholder="Topic, feedback, or collaboration idea" ></textarea>
                    </label>
                </div>
                <button type="submit">
                    Send message <span aria-hidden="true">→</span>
                </button>
            </form>
        </div>
    </div>
</section>
    </>
  )
}

export default Home
