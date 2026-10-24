export class UI {
  constructor() {
    this._titles = document.querySelectorAll('.scene-title');
    this._dots = document.querySelectorAll('.dot');
    this._vhsOverlay = document.getElementById('vhs-overlay');
    this._scrollHint = document.getElementById('scroll-hint');
    this._current = -1;

    // Show scene 0 immediately
    this._titles[0]?.classList.add('visible');
    this._dots[0]?.classList.add('active');
    this._current = 0;
  }

  /**
   * Switch active scene. No-ops if index hasn't changed.
   * @param {number} index  0–4
   */
  setScene(index) {
    if (index === this._current) return;
    this._current = index;

    this._titles.forEach((el, i) =>
      el.classList.toggle('visible', i === index)
    );
    this._dots.forEach((el, i) => el.classList.toggle('active', i === index));
    this._vhsOverlay.style.opacity = index === 3 ? '0.6' : '0';
  }

  hideScrollHint() {
    this._scrollHint.style.opacity = '0';
  }
}
