var redirectOption = "disabled"; // По умолчанию перенаправление отключено

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === 'updateRedirectOption') {
    redirectOption = message.option;
    chrome.storage.sync.set({ 'redirectOption': redirectOption });
  }
});

chrome.runtime.onInstalled.addListener(function () {
  // Установите значение по умолчанию при первой установке расширения
  chrome.storage.sync.get('redirectOption', function (data) {
    redirectOption = data.redirectOption || 'disabled';
  });
});

// Обработчик событий для кликов в контенте страницы
function handleLink(url) {
  chrome.storage.sync.get('redirectOption', function(data) {
    redirectOption = data.redirectOption || 'disabled';

    if (redirectOption !== "disabled" && url.startsWith("https://www.youtube.com/watch?v=")) {
      var videoId = url.split("v=")[1];
      var redirectUrl = redirectOption + "/watch?v=" + videoId;
      chrome.tabs.create({ url: redirectUrl });
    }
  });
}

// Добавляем обработчик для кликов
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === 'checkLink') {
    handleLink(request.url);
  }
});

// Добавляем обработчик для обновления вкладок
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.url) {
    handleLink(changeInfo.url);
  }
});

// Добавляем обработчик для события перед навигацией
chrome.webNavigation.onBeforeNavigate.addListener(function (details) {
  if (details.url) {
    handleLink(details.url);
  }
});
