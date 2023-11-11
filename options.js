document.addEventListener('DOMContentLoaded', function () {
  var select = document.getElementById('redirectOptions');

  chrome.storage.sync.get('redirectOption', function(data) {
    select.value = data.redirectOption || 'disabled';
  });

  select.addEventListener('change', function () {
    var selectedOption = select.value;
    chrome.storage.sync.set({ 'redirectOption': selectedOption });
  });
});
