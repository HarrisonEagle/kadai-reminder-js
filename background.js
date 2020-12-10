
chrome.runtime.onStartup.addListener(function() {
  getinf(true);
  chrome.alarms.create('loopalarm', {  periodInMinutes : 60 });
  setInterval(function() { getinf(true); }, 1800000);
});

chrome.runtime.onMessage.addListener((msg, sender) => {
  // First, validate the message's structure.
  if ((msg.from === 'content') && (msg.subject === 'reload')) {
    // Enable the page-action for the requesting tab.
    getinf(false);
  }
});

chrome.alarms.onAlarm.addListener(function(alarm) {
  if (alarm.name == 'loopalarm') {
    getinf(true);
  }else{

  }
});
