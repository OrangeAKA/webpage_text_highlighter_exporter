chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === 'getSelectedText') {
    const selectedText = window.getSelection().toString();
    setTimeout(() => {
      sendResponse({ text: selectedText });
    }, 0);
    return true; // Indicate that a response will be sent asynchronously
  }
});
