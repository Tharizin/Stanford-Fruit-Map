// Constrains each photo's credit caption to that photo's own rendered
// width. Photos in a strip render at a fixed height with variable width
// (whatever the aspect ratio works out to), and CSS has no way to size
// one element to match a sibling's rendered width — without this, a long
// credit line just stays on one line and stretches the whole tile wider
// than the image, so the image ends up centered inside a box wider than
// itself instead of the caption wrapping under it.
//
// Call this AFTER the modal/container is actually visible (e.g. after
// adding the "open" class), not before — the containing modal starts out
// `display: none`, and a hidden element's getBoundingClientRect() is
// always zero regardless of whether the image has loaded. A cached photo
// (already shown as a grid thumbnail before the modal opened) can have
// `img.complete` true immediately, so measuring too early reliably
// collapses the caption to ~0px instead of just being a rare race.
export function matchPhotoCreditWidths(root) {
  root.querySelectorAll('.photo-strip-item').forEach(item => {
    const img = item.querySelector('img');
    const credit = item.querySelector('.photo-credit');
    if (!img || !credit) return;

    const apply = () => requestAnimationFrame(() => {
      credit.style.maxWidth = `${img.getBoundingClientRect().width}px`;
    });
    if (img.complete) apply();
    else img.addEventListener('load', apply, { once: true });
  });
}
