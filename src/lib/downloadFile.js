// Robust same-origin file download.
//
// Three-stage fallback because no single approach works in every browser:
//   1. fetch() the resource and trigger a Blob download — works on desktop
//      Chrome/Firefox/Edge/Safari and most Android browsers, and is the only
//      reliable way to honor a custom filename on mobile Safari (which
//      ignores the HTML `download` attribute on plain anchors).
//   2. If fetch fails (network error, SW edge case, opaque response), fall
//      back to a synthetic anchor click with the `download` attribute.
//   3. If the anchor click is blocked (rare — some embedded webviews),
//      open the URL in a new tab so the user still gets the file via the
//      server's Content-Disposition: attachment header.
//
// The server is configured (.htaccess / _headers / vercel.json) to send
// Content-Disposition: attachment for /assets/doc/*, so even path 3 results
// in a download rather than an in-page preview.
export async function downloadFile(url, filename) {
  try {
    const res = await fetch(url, { credentials: 'same-origin', cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const ct = res.headers.get('content-type') || '';
    // Guard against the SPA fallback ever returning index.html for a missing PDF.
    if (ct.includes('text/html')) throw new Error('Got HTML instead of file');

    const blob = await res.blob();
    const objectUrl = URL.createObjectURL(blob);
    triggerAnchorDownload(objectUrl, filename);
    // Revoke after the click handler has had a chance to run.
    setTimeout(() => URL.revokeObjectURL(objectUrl), 10_000);
    return true;
  } catch {
    // Stage 2: direct anchor with download attribute.
    try {
      triggerAnchorDownload(url, filename);
      return true;
    } catch {
      // Stage 3: last-resort new-tab navigation. Server-side
      // Content-Disposition still forces a download.
      window.open(url, '_blank', 'noopener,noreferrer');
      return false;
    }
  }
}

function triggerAnchorDownload(href, filename) {
  const a = document.createElement('a');
  a.href = href;
  a.download = filename || '';
  a.rel = 'noopener';
  // Some browsers require the element to be in the DOM for the click to fire.
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
