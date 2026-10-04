import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { submitContact } from '../api/forms'
import ContentState from '../components/ContentState'
import Engagements from '../components/Engagements'
import Faq from '../components/Faq'
import MainSlider from '../components/MainSlider'
import Process from '../components/Process'
import SelectedWork from '../components/SelectedWork'
import Seo from '../components/Seo'
import Services from '../components/Services'
import Team from '../components/Team'
import TechnologyStack from '../components/TechnologyStack'
import { engagements, getEngagement } from '../data/engagements'
import { useArticlesQuery } from '../features/articles/queries'

const articleThemes = {
    1: { cover: 'react', glyph: '</>' },
    2: { cover: 'backend', glyph: '{ }' },
    4: { cover: 'devops', glyph: '↗' },
}

const featuredArticleIds = [1, 2, 4]

const initialContactForm = {
    name: '',
    email: '',
    message: '',
    website: '',
}

const initialContactState = {
    status: 'idle',
    message: '',
    fields: {},
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const validateContactForm = ({ name, email, message }) => {
    const fields = {}

    if (name.length < 2) fields.name = 'Enter at least 2 characters.'
    if (!emailPattern.test(email)) fields.email = 'Enter a valid email address.'
    if (message.length < 20) fields.message = 'Add at least 20 characters.'

    return fields
}

const Home = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const engagementSelectRef = useRef(null)
  const contactFieldRefs = useRef({})
  const {
    data: articles,
    error: articlesError,
    isError: isArticlesError,
    isPending: isArticlesPending,
    refetch: refetchArticles,
  } = useArticlesQuery()
  const [contactForm, setContactForm] = useState(initialContactForm)
  const [contactState, setContactState] = useState(initialContactState)
  const isSubmitting = contactState.status === 'submitting'
  const selectedEngagement = getEngagement(searchParams.get('interest'))
  const selectedEngagementId = selectedEngagement?.id || ''
  const featuredArticles = useMemo(() => {
    if (!articles?.length) return []

    return featuredArticleIds.flatMap((id) => {
        const article = articles.find((item) => item.id === id)

        if (!article) return []

        return [{
            ...article,
            ...articleThemes[id],
            href: `/blog/${article.id}`,
            initials: article.author.split(' ').map((part) => part[0]).join(''),
            dateLabel: new Intl.DateTimeFormat('en', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
            }).format(new Date(`${article.publishedAt}T00:00:00`)),
        }]
    })
  }, [articles])

  useEffect(() => {
    if (location.hash !== '#contact' || !selectedEngagementId) {
        return undefined
    }

    const animationFrame = window.requestAnimationFrame(() => {
        engagementSelectRef.current?.focus({ preventScroll: true })
    })

    return () => window.cancelAnimationFrame(animationFrame)
  }, [location.hash, selectedEngagementId])

  const handleContactChange = ({ target: { name, value } }) => {
    setContactForm((current) => ({ ...current, [name]: value }))
    setContactState((current) => {
        const fields = { ...current.fields }
        delete fields[name]

        return {
            status: 'idle',
            message: '',
            fields,
        }
    })
  }

  const handleEngagementChange = ({ target: { value } }) => {
    const engagement = getEngagement(value)

    navigate(
        {
            pathname: '/',
            search: engagement ? `?interest=${engagement.id}` : '',
            hash: '#contact',
        },
        { replace: true }
    )
    setContactState(initialContactState)
  }

  const handleContactSubmit = async (event) => {
    event.preventDefault()

    const payload = {
        ...contactForm,
        engagement: selectedEngagementId,
        name: contactForm.name.trim(),
        email: contactForm.email.trim(),
        message: contactForm.message.trim(),
    }
    const fields = validateContactForm(payload)

    if (Object.keys(fields).length) {
        setContactState({
            status: 'error',
            message: 'Please check the highlighted information.',
            fields,
        })
        window.requestAnimationFrame(() => {
            const firstInvalidField = ['name', 'email', 'message'].find(
                (field) => fields[field]
            )
            contactFieldRefs.current[firstInvalidField]?.focus()
        })
        return
    }

    setContactState({ status: 'submitting', message: '', fields: {} })

    try {
        const response = await submitContact(payload)

        setContactForm(initialContactForm)
        setContactState({
            status: 'success',
            message: `Thanks — request ${response.requestId} has been received.`,
            fields: {},
        })
    } catch (error) {
        setContactState({
            status: 'error',
            message: error?.message || 'The request could not be sent. Please try again.',
            fields: error?.fields || {},
        })
    }
  }

  return (
    <main className="home-page">
    <Seo
        title="M-Agency - Frontend Engineering Portfolio"
        description="Senior frontend engineering portfolio featuring product work, modern interface systems, and practical engineering insights."
        path="/"
    />
    <MainSlider/>
    <Services/>
    <SelectedWork/>
    <Process/>
    <TechnologyStack/>

<section className="featured-articles" id="insights">
    <div className="container">
        <div className="featured-articles__heading">
            <div>
                <span>From our team</span>
                <h2>Latest Insights</h2>
                <p>Practical perspectives on the engineering decisions behind reliable digital products.</p>
            </div>
            <Link to="/blogs">View all insights <span aria-hidden="true">→</span></Link>
        </div>
        {isArticlesPending ? (
            <ContentState count={3} label="Loading featured insights" />
        ) : isArticlesError ? (
            <ContentState
                status="error"
                title="Featured insights are unavailable"
                message={articlesError?.message || 'The latest articles could not be loaded.'}
                onRetry={() => refetchArticles()}
            />
        ) : featuredArticles.length === 0 ? (
            <ContentState
                status="empty"
                eyebrow="Insights coming soon"
                title="No featured articles yet"
                message="New engineering stories will appear here as soon as they are published."
            />
        ) : (
        <div className="featured-articles__grid">
            {featuredArticles.map((article) => (
                <article className="article-card" key={article.title}>
                    <Link
                        className={`article-card__cover article-card__cover--${article.cover}`}
                        to={article.href}
                        aria-label={`Read ${article.title}`}
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
                    </Link>
                    <div className="article-card__content">
                        <div className="article-card__meta">
                            <span>{article.category}</span>
                            <span>{article.readingTime} min read</span>
                        </div>
                        <h3><Link to={article.href}>{article.title}</Link></h3>
                        <p>{article.excerpt}</p>
                        <div className="article-card__footer">
                            <div className="article-card__author">
                                <span>{article.initials}</span>
                                <div>
                                    <strong>{article.author}</strong>
                                    <time dateTime={article.publishedAt}>{article.dateLabel}</time>
                                </div>
                            </div>
                            <Link className="article-card__button" to={article.href} aria-label={`Read ${article.title}`}>
                                Read insight <span aria-hidden="true">→</span>
                            </Link>
                        </div>
                    </div>
                </article>
            ))}
        </div>
        )}
    </div>
</section>

<Team
    articles={articles}
    error={articlesError}
    isError={isArticlesError}
    isPending={isArticlesPending}
    onRetry={() => refetchArticles()}
/>


<Engagements/>


<Faq/>


<section className="contact" id="contact">
    <div className="container">
        <div className="contact__panel">
            <div className="contact__content">
                <span className="contact__eyebrow">Project enquiries</span>
                <h2 id="contact-title">Tell us what you’re building</h2>
                <p>Share your goals, timeline, and where you need support so we can understand the project.</p>

                <div className="contact__links">
                    <a href="https://magency.vercel.app">
                        <span>Website</span>
                        <strong>magency.vercel.app</strong>
                        <i aria-hidden="true">↗</i>
                    </a>
                    <a href="mailto:editor@magency.vercel.app">
                        <span>Projects</span>
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

            <form
                className="contact__form"
                onSubmit={handleContactSubmit}
                noValidate
                aria-busy={isSubmitting}
                aria-labelledby="contact-title"
            >
                <label className="contact__honeypot" aria-hidden="true">
                    <span>Leave this field blank</span>
                    <input
                        type="text"
                        name="website"
                        value={contactForm.website}
                        onChange={handleContactChange}
                        tabIndex={-1}
                        autoComplete="off"
                        disabled={isSubmitting}
                    />
                </label>
                <div className="contact__fields">
                    <label className="contact__engagement">
                        <span>What do you need?</span>
                        <select
                            id="contact-engagement"
                            ref={engagementSelectRef}
                            name="engagement"
                            value={selectedEngagementId}
                            onChange={handleEngagementChange}
                            disabled={isSubmitting}
                            aria-describedby="contact-engagement-hint"
                        >
                            <option value="">Not sure yet — help me choose</option>
                            {engagements.map((engagement) => (
                                <option value={engagement.id} key={engagement.id}>
                                    {engagement.title}
                                </option>
                            ))}
                        </select>
                        <small
                            className="contact__field-hint"
                            id="contact-engagement-hint"
                        >
                            Choose a starting point. Final scope follows discovery.
                        </small>
                    </label>
                    <label>
                        <span>Name</span>
                        <input
                            ref={(element) => {
                                contactFieldRefs.current.name = element
                            }}
                            type="text"
                            name="name"
                            value={contactForm.name}
                            onChange={handleContactChange}
                            placeholder="Your name"
                            autoComplete="name"
                            minLength={2}
                            required
                            disabled={isSubmitting}
                            aria-invalid={Boolean(contactState.fields.name)}
                            aria-describedby={contactState.fields.name ? 'contact-name-error' : undefined}
                        />
                        {contactState.fields.name && (
                            <small className="contact__field-error" id="contact-name-error">
                                {contactState.fields.name}
                            </small>
                        )}
                    </label>
                    <label>
                        <span>Email</span>
                        <input
                            ref={(element) => {
                                contactFieldRefs.current.email = element
                            }}
                            type="email"
                            name="email"
                            value={contactForm.email}
                            onChange={handleContactChange}
                            placeholder="Work email"
                            autoComplete="email"
                            inputMode="email"
                            required
                            disabled={isSubmitting}
                            aria-invalid={Boolean(contactState.fields.email)}
                            aria-describedby={contactState.fields.email ? 'contact-email-error' : undefined}
                        />
                        {contactState.fields.email && (
                            <small className="contact__field-error" id="contact-email-error">
                                {contactState.fields.email}
                            </small>
                        )}
                    </label>
                    <label className="contact__message">
                        <span>Message</span>
                        <textarea
                            ref={(element) => {
                                contactFieldRefs.current.message = element
                            }}
                            name="message"
                            value={contactForm.message}
                            onChange={handleContactChange}
                            placeholder={
                                selectedEngagement
                                    ? `What would make this ${selectedEngagement.title.toLowerCase()} successful?`
                                    : 'Goals, scope, timeline, and any useful context'
                            }
                            minLength={20}
                            required
                            disabled={isSubmitting}
                            aria-invalid={Boolean(contactState.fields.message)}
                            aria-describedby={contactState.fields.message ? 'contact-message-error' : undefined}
                        ></textarea>
                        {contactState.fields.message && (
                            <small className="contact__field-error" id="contact-message-error">
                                {contactState.fields.message}
                            </small>
                        )}
                    </label>
                </div>
                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Sending…' : 'Send project enquiry'} <span aria-hidden="true">→</span>
                </button>
                {contactState.message && (
                    <p
                        className={`contact__status contact__status--${contactState.status}`}
                        role={contactState.status === 'error' ? 'alert' : 'status'}
                        aria-live="polite"
                    >
                        {contactState.message}
                    </p>
                )}
            </form>
        </div>
    </div>
</section>
    </main>
  )
}

export default Home
