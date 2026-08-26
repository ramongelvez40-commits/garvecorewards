// Shein Catalog Link Store — persists the admin-configured Shein catalog URL

const SHEIN_LINK_KEY = 'garveco_shein_catalog_link';

export function getSheinCatalogLink(): string {
  if (typeof window === 'undefined') return '';
  try {
    return localStorage.getItem(SHEIN_LINK_KEY) || '';
  } catch {
    return '';
  }
}

export function saveSheinCatalogLink(url: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SHEIN_LINK_KEY, url.trim());
  } catch {
    // ignore
  }
}
