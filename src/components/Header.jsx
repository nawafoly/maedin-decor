import { useLanguage } from "../contexts/LanguageContext";

function removeRequestDropdown(html, requestText) {
  const requestDropdownStart = '<li class="cart-dropdown nav-item dropdown">';
  const requestLink = `<li class="nav-item"><a class="nav-link me-0" href="/cart.html">${requestText}</a></li>`;
  const start = html.indexOf(requestDropdownStart);

  if (start === -1) {
    return html;
  }

  const endMarker = "\r\n                </ul>\r\n              </ul>";
  const end = html.indexOf(endMarker, start);

  if (end === -1) {
    return html;
  }

  return `${html.slice(0, start)}${requestLink}${html.slice(end)}`;
}

function addLanguageSwitcher(html, label, ariaLabel) {
  const marker = "</li>\r\n                </ul>\r\n              </ul>";
  const index = html.lastIndexOf(marker);
  const switcher = `</li>\r\n                  <li class="nav-item language-switcher"><button class="nav-link me-0" type="button" data-language-toggle aria-label="${ariaLabel}">${label}</button>`;

  if (index === -1) {
    return html;
  }

  return `${html.slice(0, index)}${switcher}${html.slice(index)}`;
}

export default function Header() {
  const { t } = useLanguage();
  const headerHtml = addLanguageSwitcher(
    removeRequestDropdown(t.header, t.ui.request),
    t.meta.nextLanguageLabel,
    t.ui.languageToggleLabel,
  );

  return <div dangerouslySetInnerHTML={{ __html: headerHtml }} />;
}
