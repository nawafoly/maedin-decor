import { legacyHeader } from "../data/legacyPages";

export default function Header() {
  return <div dangerouslySetInnerHTML={{ __html: legacyHeader }} />;
}
