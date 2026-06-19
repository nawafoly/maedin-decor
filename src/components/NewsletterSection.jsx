import { useLanguage } from "../contexts/LanguageContext";

export default function NewsletterSection() {
  const { language } = useLanguage();
  const isArabic = language === "ar";

  return (
    <section id="newsletter" className="newsletter-section">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-6">
            <h2>{isArabic ? "ابق على اطلاع مع" : "Stay Updated With"}<br />FORMA</h2>
            <p>
              {isArabic
                ? "استقبل تحديثات التصميم وملاحظات المشاريع وتوجيهات المواد من الاستوديو."
                : "Receive design updates, project notes, and material direction from our studio."}
            </p>
          </div>
          <div className="col-lg-6">
            <form className="newsletter-form d-flex" onSubmit={(event) => event.preventDefault()}>
              <input
                className="form-control"
                type="email"
                placeholder={isArabic ? "بريدك الإلكتروني" : "Your email address"}
                aria-label={isArabic ? "بريدك الإلكتروني" : "Your email address"}
              />
              <button className="btn" type="submit">
                {isArabic ? "اشتراك" : "Subscribe"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

