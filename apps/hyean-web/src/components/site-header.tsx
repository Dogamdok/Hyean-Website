import Image from 'next/image';
import Link from 'next/link';
import { mainNav, strategicNav } from '@/data/site';

export function SiteHeader() {
  return (
    <header className="site-header">
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
        <nav className="nav-main" aria-label="Main navigation">
          {mainNav.map((item) => (
            <Link key={item.href} href={item.href} className="nav-link">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="container nav-secondary">
        {strategicNav.map((item) => (
          <Link key={`${item.href}-${item.label}`} href={item.href} className="nav-chip">
            {item.label}
          </Link>
        ))}
      </div>
    </header>
  );
}
