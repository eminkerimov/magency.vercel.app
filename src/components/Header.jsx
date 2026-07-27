import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

const navigation = [
    { label: 'Home', href: '/' },
    { label: 'Articles', href: '/blogs' },
    { label: 'Categories', href: '/#services' },
    { label: 'About', href: '/#team' },
    { label: 'Pricing', href: '/#pricing' },
    { label: 'Contact', href: '/#contact' },
]

const Header = () => {
    const { pathname, hash } = useLocation()
    const [menuOpen, setMenuOpen] = useState(false)

    const isActive = (href) => {
        if (href === '/blogs') return pathname.startsWith('/blog')
        if (href === '/') return pathname === '/' && !hash

        return pathname === '/' && hash === href.replace('/', '')
    }

  return (
    <header className="site-header">
        <div className="container">
            <div className="site-header__inner">
                <a className="logo" href="/" aria-label="M-Agency home">
                    <span className="logo__mark" aria-hidden="true">M</span>
                    <span>M-Agency</span>
                </a>
                <nav className={`site-nav${menuOpen ? ' is-open' : ''}`} aria-label="Primary navigation">
                <ul className="menu">
                    {navigation.map((item) => {
                        const active = isActive(item.href)

                        return (
                            <li key={item.label}>
                                <a
                                    className={active ? 'is-active' : ''}
                                    href={item.href}
                                    aria-current={active ? 'page' : undefined}
                                    onClick={() => setMenuOpen(false)}
                                >
                                    {item.label}
                                </a>
                            </li>
                        )
                    })}
                </ul>
                </nav>
                <a className="site-header__cta" href="/#pricing">Subscribe</a>
                <button
                    className="site-header__toggle"
                    type="button"
                    aria-label="Toggle navigation"
                    aria-expanded={menuOpen}
                    onClick={() => setMenuOpen((open) => !open)}
                >
                    <span></span>
                    <span></span>
                </button>
            </div>
        </div>
    </header>
  )
}

export default Header
