const smoothViBackground = {
  active: false, // Enable vi mode on page load
  async init() {
    browser.action.onClicked.addListener(() => {
      browser.runtime.openOptionsPage();
    });

    browser.runtime.onMessage.addListener((message) => {
      if (message.type === 'smoothViStateUpdate') {
        this.updateState(message.active);
      } else if (message.type === 'smoothViRequestStateUpdate') {
        browser.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          var tabId = tabs[0].id;
          browser.tabs.sendMessage(tabs[0].id, {
            type:'smoothViStateUpdate',
            active: this.active
          });
        });
      }
    });

    browser.tabs.onActivated.addListener((activeInfo) => {
      browser.tabs.sendMessage(activeInfo.tabId, {
        type: 'smoothViStateUpdate',
        active: this.active
      });
    });
  },
  updateState(active) {
    this.active = active;
    const path = active ? {
      48: "smooth_vi_48.png",
      96: "smooth_vi_96.png"
    } : {
      48: "smooth_vi_disabled_48.png",
      96: "smooth_vi_disabled_96.png"
    };
    browser.action.setIcon({ path });
  },
}

smoothViBackground.init();
