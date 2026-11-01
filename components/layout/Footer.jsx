
export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-main">
        {/* IDENTITAS SYCLE */}
        <div className="footer-brand">
          <span className="footer-logo">Sycle</span>
          <p>
            Lingkungan, tubuh, dan cerita harianmu.
          </p>
        </div>

        {/* INFORMASI */}
        <div className="footer-info">
          <p className="footer-disclaimer">
            Informasi edukatif berbasis evidence,
            bukan diagnosis medis.
          </p>
        </div>
      </div>

      {/* COPYRIGHT */}
      <div className="footer-bottom">
        <span>© 2026 Sycle</span>
        <span>
          Edukasi kesehatan reproduksi perempuan
        </span>
      </div>
    </footer>
  );
}