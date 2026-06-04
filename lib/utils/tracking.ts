export function getBrowserTrackingContext() {
  if (typeof window === 'undefined') {
    return {
      sourcePage: '',
      utmSource: null,
      utmMedium: null,
      utmCampaign: null,
    };
  }

  const url = new URL(window.location.href);

  return {
    sourcePage: `${url.pathname}${url.search}`,
    utmSource: url.searchParams.get('utm_source'),
    utmMedium: url.searchParams.get('utm_medium'),
    utmCampaign: url.searchParams.get('utm_campaign'),
  };
}
