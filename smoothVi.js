const smoothVi = {
  active: false, // Enable vi mode on page load
  minStep: 100, // Movement in pixels per step
  maxStep: 500, // Movement in pixels for fast steps
  interval: 100, // Interval in milliseconds for subsequent steps
  step: 100,
  timer: null,
  keymap: new Map([
    ['Escape', () => smoothVi.enable()],
    ['Shift', () => {}],
    ['h', () => smoothVi.scrollLeft()],
    ['j', () => smoothVi.scrollDown()],
    ['k', () => smoothVi.scrollUp()],
    ['l', () => smoothVi.scrollRight()],
    ['g', () => smoothVi.goToTop()],
    ['G', () => smoothVi.goToBottom()],
    ['i', () => smoothVi.disable()],
  ]),
  capturingKeys: ['h', 'j', 'k', 'l', 'g', 'G', 'i'],
  init() {
    document.addEventListener(
      'keydown',
      (event) => this.onKeyDown(event),
      true,
    );
    // Disable vi mode on mouse events
    document.addEventListener( 'mousedown', () => this.disable(), true);
    // Disable vi mode on touch events
    document.addEventListener( 'touchstart', () => this.disable(), true);
  },
  onKeyDown(event) {
    const fn = this.keymap.get(event.key);
    if (fn) {
      // Prevent triggering actions bound by
      // the current web page for keys listed when in vi mode
      if (this.active && this.capturingKeys.includes(event.key)) {
        event.preventDefault();
        event.stopPropagation();
      }
      // Escape needs to be handled even when vi mode is not active
      if (this.active || event.key === 'Escape') {
        fn();
      }
    } else {
      // Disable vi mode for every key that is not mapped
      this.disable();
      return;
    }

    // Acclerates scrolling on subsequent key presses
    // Sets `step` to `maxStep` but resets it when the timer expires.
    // `steps` remains unchanged if a key is pressed before the timer
    // has expired because the timer will get cancelled.
    // For simplicity, keep only track of one timer for all directions.
    clearTimeout(this.timer);
    this.step = this.maxStep;
    this.timer = setTimeout(
      () => { smoothVi.setStepToMin(); },
      this.interval,
    );
  },
  enable() {
    this.active = true;
  },
  disable() {
    this.active = false;
  },
  setStepToMin() {
    this.step = this.minStep;
  },
  scrollLeft() {
    window.scrollBy({ top: 0, left: -this.step, behavior:'smooth' });
  },
  scrollDown() {
    window.scrollBy({ top: this.step, left: 0, behavior:'smooth' });
  },
  scrollUp() {
    window.scrollBy({ top: -this.step, left: 0, behavior:'smooth' });
  },
  scrollRight() {
    window.scrollBy({ top: 0, left: this.step, behavior:'smooth' });
  },
  goToTop() {
    window.scrollTo({ top: 0, left: window.scrollX, behavior: 'instant' });
  },
  goToBottom() {
    window.scrollTo(
      {
        top: document.body.scrollHeight,
        left: window.scrollX,
        behavior: 'instant',
      },
    );
  },
};

window.onload = smoothVi.init();
