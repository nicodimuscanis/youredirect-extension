document.addEventListener('DOMContentLoaded', function () {
  var currentSettingElement = document.getElementById('currentSetting');

  chrome.storage.sync.get('redirectOption', function(data) {
    var currentSetting = data.redirectOption || 'disabled';
    currentSettingElement.textContent = currentSetting;
  });
});
