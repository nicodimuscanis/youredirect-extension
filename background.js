var redirectOption = "disabled"; // По умолчанию перенаправление отключено

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === 'updateRedirectOption') {
    redirectOption = message.option;
  }
});

chrome.webNavigation.onBeforeNavigate.addListener(function(details) {
  if (redirectOption !== "disabled" && details.url.startsWith("https://www.youtube.com/watch?v=")) {
    var videoId = details.url.split("v=")[1];
    var redirectUrl = "https://" + redirectOption + ".piped.video/watch?v=" + videoId;
    chrome.tabs.create({ url: redirectUrl });
  }
});

chrome.runtime.onInstalled.addListener(function() {
  // Установите значение по умолчанию при первой установке расширения
  chrome.storage.sync.get('redirectOption', function(data) {
    if (!data.redirectOption) {
      chrome.storage.sync.set({ 'redirectOption': redirectOption });
    }
  });
});
