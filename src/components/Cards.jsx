import { Link } from "react-router-dom";
import { routes } from "../utils/routes";

export function ServiceCard({ item }) {
  return (
    <article className="forma-card service-card">
      <Link to={`${routes.serviceDetails}?id=${item.id}`} className="forma-card-media">
        <img src={item.image} alt={item.title} />
      </Link>
      <div className="forma-card-body">
        <p className="card-kicker">{item.category}</p>
        <h3>
          <Link to={`${routes.serviceDetails}?id=${item.id}`}>{item.title}</Link>
        </h3>
        <p>{item.description}</p>
        <div className="card-meta">
          <span>{item.price}</span>
          <Link to={routes.request}>Request</Link>
        </div>
      </div>
    </article>
  );
}

export function DesignCard({ item }) {
  return (
    <article className="forma-card design-card">
      <Link to={`${routes.serviceDetails}?design=${item.id}`} className="forma-card-media">
        <img src={item.image} alt={item.title} />
      </Link>
      <div className="forma-card-body">
        <p className="card-kicker">{item.category} / {item.style}</p>
        <h3>
          <Link to={`${routes.serviceDetails}?design=${item.id}`}>{item.title}</Link>
        </h3>
        <p>{item.description}</p>
        <div className="card-meta">
          <span>{item.price}</span>
          <Link to={routes.request}>Request</Link>
        </div>
      </div>
    </article>
  );
}

export function ProjectCard({ item }) {
  return (
    <article className="forma-card project-card">
      <Link to={`${routes.projectStory}?id=${item.id}`} className="forma-card-media">
        <img src={item.image} alt={item.title} />
      </Link>
      <div className="forma-card-body">
        <p className="card-kicker">{item.city} / {item.status}</p>
        <h3>
          <Link to={`${routes.projectStory}?id=${item.id}`}>{item.title}</Link>
        </h3>
        <p>{item.description}</p>
        <div className="card-meta">
          <span>{item.category}</span>
          <Link to={`${routes.projectStory}?id=${item.id}`}>View project</Link>
        </div>
      </div>
    </article>
  );
}

export function PricingCard({ item }) {
  return (
    <article className="pricing-card">
      <p className="card-kicker">{item.label}</p>
      <h3>{item.title}</h3>
      <strong>{item.price}</strong>
      <p>{item.description}</p>
      <span>{item.duration}</span>
      <ul>
        {item.includes.map((entry) => (
          <li key={entry}>{entry}</li>
        ))}
      </ul>
      <Link className="btn btn-dark" to={routes.request}>
        Select this package
      </Link>
    </article>
  );
}
