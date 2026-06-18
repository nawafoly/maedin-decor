import { Link } from "react-router-dom";

export default function Button({ children, to, variant = "light", className = "", ...props }) {
  const classes = `forma-btn forma-btn-${variant} ${className}`.trim();

  if (to) {
    return (
      <Link className={classes} to={to} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} type="button" {...props}>
      {children}
    </button>
  );
}
