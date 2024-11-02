const smoothVi = {
  active: false,
  step: 100,
  sequenceTimer: null,
  interval: 100, // Interval in milliseconds for subsequent steps
  minStep: 100, // Movement in pixels per step
  maxStep: 550, // Movement in pixels for subsequent steps
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
  async init() {
    const result = await browser.storage.local.get('smoothViSettings');
    if (result && result.settings) {
      const settings = result.smoothViSettings;
      if (settings.minStep && settings.maxStep) {
        this.minStep = settings.minStep;
        this.maxStep = settings.maxStep;
      }
    } else {
      await browser.storage.local.set({
        smoothViSettings: {
          minStep: this.minStep,
          maxStep: this.maxStep
        }
      });
    }

    browser.runtime.onMessage.addListener((message) => {
      if (message.type === 'smoothViSettingsUpdate') {
        this.minStep = message.settings.minStep;
        this.maxStep = message.settings.maxStep;
        this.setStepToMin();
      } else if (message.type === 'smoothViStateUpdate') {
        this.active = message.active;
      }
    });
    browser.runtime.sendMessage({ type: 'smoothViRequestStateUpdate' });

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
    if (this.active || event.key === 'Escape') {
      const fn = this.keymap.get(event.key);
      if (fn) {
        // Prevent triggering actions bound by the current web page
        if (this.capturingKeys.includes(event.key)) {
          event.preventDefault();
          event.stopPropagation();
        }
        fn();
        // Acclerates scrolling on subsequent key presses
        // For simplicity, keep only track of one timer.
        if (['h', 'j', 'k', 'l'].includes(event.key)) {
          this.step = this.maxStep;
          // Restarts timer for resetting `step` value
          clearTimeout(this.sequenceTimer);
          this.sequenceTimer = setTimeout(
            () => { smoothVi.setStepToMin(); },
            this.interval,
          );
        }
      } else {
        this.disable();
      }
    }
  },
  enable() {
    if (!this.active) {
      this.active = true;
      browser.runtime.sendMessage({
        type: 'smoothViStateUpdate',
        active: true
      });
    }
  },
  disable() {
    if (this.active) {
      this.active = false;
      browser.runtime.sendMessage({
        type: 'smoothViStateUpdate',
        active: false
      });
    }
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

smoothVi.init();
