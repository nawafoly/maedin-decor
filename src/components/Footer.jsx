import { useLanguage } from "../contexts/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  return <div dangerouslySetInnerHTML={{ __html: t.footer }} />;
}
