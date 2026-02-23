import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <section className="section">
      <div className="container">
        <span className="eyebrow">404</span>
        <h1>페이지를 찾을 수 없습니다.</h1>
        <p>요청하신 페이지가 존재하지 않거나 이동되었습니다.</p>
        <div className="cta-row">
          <Link href="/" className="button">
            홈으로 이동
          </Link>
        </div>
      </div>
    </section>
  );
}
