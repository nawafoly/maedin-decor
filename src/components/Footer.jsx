import { legacyFooter } from "../data/legacyPages";

export default function Footer() {
  return <div dangerouslySetInnerHTML={{ __html: legacyFooter }} />;
}
