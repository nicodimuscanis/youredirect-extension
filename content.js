document.addEventListener('click', function (event) {
  var target = event.target;

  // Проверяем, является ли кликнутый элемент ссылкой
  if (target.tagName === 'A') {
    // Отправляем сообщение в background.js для проверки и, если нужно, перенаправления
    chrome.runtime.sendMessage({ action: 'checkLink', url: target.href });
  }
});
