import { Link } from "react-router-dom";
import { routes } from "../utils/routes";

export default function PageTitle({ title, subtitle }) {
  return (
    <section className="page-title react-page-title">
      <div className="container">
        <Link to={routes.home} className="page-title-logo">
          <img src="/images/Logo only 1.png" alt="FORMA" />
        </Link>
        <p>
          <Link to={routes.home}>Home</Link> / {title}
        </p>
        <h1>{title}</h1>
        {subtitle ? <span>{subtitle}</span> : null}
      </div>
    </section>
  );
}
