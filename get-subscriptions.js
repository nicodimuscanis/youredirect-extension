// основано на: https://dev.to/hazy/downloading-your-youtube-subscriptions-in-csv-format-because-google-takeout-takes-too-long-5ca1
// добавлена поддержка UTF-8 и сразу же сохранение в файл
// Функция для проверки продолжения
function canContinue() {
  return getLast().continuationItemRenderer != null;
}

// Функция для получения последнего элемента
function getLast() {
  return ytInitialData.contents.twoColumnBrowseResultsRenderer.tabs[0].tabRenderer.content.sectionListRenderer.contents.slice(-1)[0];
}

// Функция для скролла
async function scrollToBottom() {
  while (canContinue()) {
    let current = getLast().continuationItemRenderer.continuationEndpoint.continuationCommand.token;
    scrollTo(0, document.getElementById('primary').scrollHeight);
    while (canContinue() && current == getLast().continuationItemRenderer.continuationEndpoint.continuationCommand.token) {
      await new Promise(r => setTimeout(r, 100));
    }
  }
  scrollTo(0, 0);
}

// Функция для формирования CSV текста
function generateCsvText() {
  return "Channel Id,Channel Url,Channel Title\n" + ytInitialData.contents.twoColumnBrowseResultsRenderer.tabs[0].tabRenderer.content.sectionListRenderer.contents.map(e => {
    if (!e.itemSectionRenderer) return;
    return e.itemSectionRenderer.contents[0].shelfRenderer.content.expandedShelfContentsRenderer.items
  }).flat().map(e => {
    if (e && e.channelRenderer) return `${e.channelRenderer.channelId},http://www.youtube.com/channel/${e.channelRenderer.channelId},${e.channelRenderer.title.simpleText}`;
    return '';
  }).join('\n');
}

// Функция для сохранения CSV текста в файл
function saveCsvToFile(csvText, fileName) {
  var blob = new Blob([csvText], { type: "text/plain;charset=utf-8" });
  var link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  link.click();
}

// Вызываем последовательность действий
(async () => {
  await scrollToBottom(); // Прокручиваем до конца
  let csvText = generateCsvText(); // Формируем CSV текст
  saveCsvToFile(csvText, "subscriptions.csv"); // Сохраняем CSV текст в файл
})();