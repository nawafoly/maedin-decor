export default function PageTitle({ title, subtitle }) {
  return (
    <section className="page-title react-page-title">
      <div className="container">
        <h1>{title}</h1>
        {subtitle ? <span>{subtitle}</span> : null}
      </div>
    </section>
  );
}
