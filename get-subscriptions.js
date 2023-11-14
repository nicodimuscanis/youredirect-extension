// источник: https://dev.to/hazy/downloading-your-youtube-subscriptions-in-csv-format-because-google-takeout-takes-too-long-5ca1
// добавлена поддержка UTF-8
function getLast() {
  return ytInitialData.contents.twoColumnBrowseResultsRenderer.tabs[0].tabRenderer.content.sectionListRenderer.contents.slice(-1)[0]
}
function canContinue() { return getLast().continuationItemRenderer != null }
(async () => {
  while (canContinue()) {
    let current = getLast().continuationItemRenderer.continuationEndpoint.continuationCommand.token;
    scrollTo(0, document.getElementById('primary').scrollHeight);
    while (canContinue() && current == getLast().continuationItemRenderer.continuationEndpoint.continuationCommand.token) {
      await new Promise(r => setTimeout(r, 100));
    }
  }
  scrollTo(0, 0);
  let floatDiv = document.createElement('div');
  let preText = document.createElement('pre');
  floatDiv.setAttribute('style', `position: fixed;
  background: #0f0f0f;
  z-index: 100000;
  inset: 2rem;
  overflow: auto;
  font-size: 2rem;
  white-space: pre;
  color: white;
  padding: 1rem;`);
  let csvText = "Channel Id,Channel Url,Channel Title\n" + ytInitialData.contents.twoColumnBrowseResultsRenderer.tabs[0].tabRenderer.content.sectionListRenderer.contents.map(e => {
    if (!e.itemSectionRenderer) return;
    return e.itemSectionRenderer.contents[0].shelfRenderer.content.expandedShelfContentsRenderer.items
  }).flat().map(e => {
    if (e && e.channelRenderer) return `${e.channelRenderer.channelId},http://www.youtube.com/channel/${e.channelRenderer.channelId},${e.channelRenderer.title.simpleText}`;
    return '';
  }).join('\n');
  preText.innerText = csvText;
  let downloadLink = document.createElement('a');
  downloadLink.innerText = 'Скачать CSV';
  downloadLink.setAttribute('target', '_blank');
  downloadLink.setAttribute('style', `color: #bf3838;
  font-weight: bold;
  margin-bottom: 1rem;
  display: block;
  padding: 1rem;
  border-radius: 0.5rem;
  border: 2px solid #bf3838;
  width: fit-content;
  text-decoration: none;`);
  var t = new Blob([csvText], { type: "text/plain;charset=utf-8" });
  downloadLink.href = window.URL.createObjectURL(t)
  floatDiv.appendChild(downloadLink);
  floatDiv.appendChild(preText);
  document.body.appendChild(floatDiv);
})()
