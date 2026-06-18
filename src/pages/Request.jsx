import LegacyPage from "../components/LegacyPage";
import { useLanguage } from "../contexts/LanguageContext";
import { enhanceRequestHtml } from "../utils/projectRequestHtml";

export default function Request() {
  const { language, t } = useLanguage();
  const html = enhanceRequestHtml(t.pages.cart, language);

  return <LegacyPage page="cart" html={html} />;
}
