import Button from "../components/Button";
import PageTitle from "../components/PageTitle";
import { routes } from "../utils/routes";

export default function NotFound() {
  return (
    <>
      <PageTitle title="Page not found" subtitle="The requested page could not be found." />
      <section className="padding-large">
        <div className="container text-center">
          <Button to={routes.home} variant="dark">Back home</Button>
        </div>
      </section>
    </>
  );
}
