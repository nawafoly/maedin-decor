import LegacyPage from "../components/LegacyPage";
import { useLanguage } from "../contexts/LanguageContext";
import { enhanceCheckoutHtml } from "../utils/projectRequestHtml";

export default function Checkout() {
  const { language, t } = useLanguage();
  const html = enhanceCheckoutHtml(t.pages.checkout, language);

  return <LegacyPage page="checkout" html={html} />;
}
