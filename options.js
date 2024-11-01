document.addEventListener('DOMContentLoaded', async () => {
  const result = await browser.storage.local.get('smoothViSettings');
  const settings = result.smoothViSettings || { minStep: 100, maxStep: 550 };
  const minStepInput = document.getElementById('minStep');
  const maxStepInput = document.getElementById('maxStep');
  const saveButton = document.getElementById('saveButton');
  const statusElement = document.getElementById('status');

  // Initialize input values
  minStepInput.value = settings.minStep;
  maxStepInput.value = settings.maxStep;

  const showStatus = (message, successful = true) => {
    statusElement.textContent = message;
    statusElement.className = successful ? 'success' : 'error';
    // Clear status after 3 seconds
    setTimeout(() => {
      statusElement.textContent = '';
      statusElement.className = '';
    }, 3000);
  };

  const saveSettings = async () => {
    const minStep = parseInt(minStepInput.value);
    const maxStep = parseInt(maxStepInput.value);

    if (isNaN(minStep) || isNaN(maxStep)) {
      showStatus('Please enter valid numbers', false);
      return;
    }
    if (minStep < 1 || maxStep < 1) {
      showStatus('Values must be greater than 0', false);
      return;
    }

    // Broadcast settings to all tabs
    const tabs = await browser.tabs.query({});
    tabs.forEach(tab => {
      browser.tabs.sendMessage(tab.id, { 
        type: 'smoothViSettingsUpdate', 
        settings: { minStep, maxStep } 
      });
    });
    await browser.storage.local.set({ 
      smoothViSettings: { 
        minStep: minStep, 
        maxStep: maxStep 
      } 
    });
    showStatus('Settings saved');
  };

  saveButton.addEventListener('click', saveSettings);
});
