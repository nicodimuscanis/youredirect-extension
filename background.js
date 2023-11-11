chrome.webNavigation.onBeforeNavigate.addListener(function(details) {
  if (details.url.startsWith("https://www.youtube.com/watch?v=")) {
    var videoId = details.url.split("v=")[1];
    var redirectUrl = "https://az.piped.video/watch?v=" + videoId;
    chrome.tabs.create({ url: redirectUrl });
  }
});
