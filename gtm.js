// Google Tag Manager init. Kept out of the HTML as a separate file so
// it's allowed by the CSP's script-src without needing 'unsafe-inline'.
// This is the standard GTM snippet verbatim, just not inlined — it
// creates and inserts the real googletagmanager.com <script> tag itself.
(function (w, d, s, l, i) {
  w[l] = w[l] || [];
  w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
  var f = d.getElementsByTagName(s)[0],
    j = d.createElement(s),
    dl = l !== 'dataLayer' ? '&l=' + l : '';
  j.async = true;
  j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
  f.parentNode.insertBefore(j, f);
})(window, document, 'script', 'dataLayer', 'GTM-WT5KM7VB');
