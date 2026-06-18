import Button from "../components/Button";
import PageTitle from "../components/PageTitle";
import { useLanguage } from "../contexts/LanguageContext";
import { routes } from "../utils/routes";

export default function NotFound() {
  const { t } = useLanguage();

  return (
    <>
      <PageTitle title={t.ui.pageNotFoundTitle} subtitle={t.ui.pageNotFoundSubtitle} />
      <section className="padding-large">
        <div className="container text-center">
          <Button to={routes.home} variant="dark">{t.ui.backHome}</Button>
        </div>
      </section>
    </>
  );
}
