import { companyProfile } from '@/data/site';

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <section>
          <h3 className="footer-heading">{companyProfile.nameKo}</h3>
          <p>{companyProfile.nameEn}</p>
          <p>대표: {companyProfile.ceo}</p>
          <p>사업자등록번호: {companyProfile.businessNumber}</p>
          {companyProfile.credentials?.map((credential) => (
            <p key={credential} className="muted">
              {credential}
            </p>
          ))}
        </section>
        <section>
          <h3 className="footer-heading">Contact</h3>
          <p>Tel: {companyProfile.phone}</p>
          <p>Fax: {companyProfile.fax}</p>
          <p>Email: {companyProfile.email}</p>
          <p>Web: {companyProfile.website}</p>
        </section>
        <section>
          <h3 className="footer-heading">Address</h3>
          <p>{companyProfile.headquarters}</p>
          <p className="muted">지사: {companyProfile.branch}</p>
        </section>
      </div>
      <div className="container footer-bottom">
        <p>© {new Date().getFullYear()} HYEAN Co., Ltd. All rights reserved.</p>
      </div>
    </footer>
  );
}
