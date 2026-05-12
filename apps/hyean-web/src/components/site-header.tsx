'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { mainNav, strategicNav } from '@/data/site';

export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.classList.toggle('nav-menu-open', isMenuOpen);
    return () => {
      document.body.classList.remove('nav-menu-open');
    };
  }, [isMenuOpen]);

  const menuId = 'site-primary-navigation';
  const menuToggleLabel = isMenuOpen ? '메뉴 닫기' : '메뉴 열기';

  return (
    <header className={`site-header${isMenuOpen ? ' is-open' : ''}`}>
      <div className="container nav-wrap">
        <Link href="/" className="brand">
          <Image
            src="/brand/hyean-logo-header.png"
            alt="HYEAN Solutions for Social Impact"
            width={220}
            height={116}
            priority
            className="brand-logo"
          />
        </Link>
        <button
          type="button"
          className="nav-toggle"
          aria-expanded={isMenuOpen}
          aria-controls={menuId}
          aria-label={menuToggleLabel}
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          <span className="nav-toggle-label">{isMenuOpen ? '닫기' : '메뉴'}</span>
          <span className="nav-toggle-icon" aria-hidden="true">
            <span />
            <span />
          </span>
        </button>
        <nav className="nav-main" id={menuId} aria-label="Main navigation">
          {mainNav.map((item) => (
            <Link key={item.href} href={item.href} className="nav-link" onClick={() => setIsMenuOpen(false)}>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="container nav-secondary">
        {strategicNav.map((item) => (
          <Link
            key={`${item.href}-${item.label}`}
            href={item.href}
            className="nav-chip"
            onClick={() => setIsMenuOpen(false)}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </header>
  );
}
