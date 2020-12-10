chrome.runtime.sendMessage({
  from: 'content',
  subject: 'reload',
});
