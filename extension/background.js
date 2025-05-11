let capturedVideos = [];

chrome.webRequest.onBeforeSendHeaders.addListener(
  (details) => {
    const userAgentHeader = details.requestHeaders?.find(h => h.name.toLowerCase() === 'user-agent');
    const target = capturedVideos.find(v => v.url === details.url);
    if (target && userAgentHeader) {
      target.userAgent = userAgentHeader.value;
    }
  },
  { urls: ["<all_urls>"], types: ["media", "xmlhttprequest", "fetch", "other"] },
  ["requestHeaders", "extraHeaders"]
);

chrome.webRequest.onCompleted.addListener(
  (details) => {
    const fullUrl = details.url;
    if (!/\/.*\.(mp4|webm|mkv|mov|avi|flv|mpg|mpeg)(\?|$)|\/video|\/stream/i.test(fullUrl)) return;

    const url = fullUrl.split('?')[0]; // normalize
    let referer;
    try {
      referer = details.initiator || new URL(fullUrl).origin;
    } catch {
      referer = 'https://example.com';
    }

    if (!capturedVideos.some(v => v.url.split('?')[0] === url)) {
      if (capturedVideos.length > 100) capturedVideos.shift(); // limit stored items
      capturedVideos.push({
        url: fullUrl,
        tabId: details.tabId,
        referer,
        userAgent: '' // will be filled in by onBeforeSendHeaders
      });
    }
  },
  { urls: ["<all_urls>"], types: ["media", "xmlhttprequest"] },
  ["extraHeaders"] // ONLY valid option here
);

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "getVideos") {
    sendResponse(capturedVideos);
  } else if (msg.action === "downloadVideo") {
    chrome.scripting.executeScript({
      target: { tabId: msg.tabId },
      func: injectedDownload,
      args: [msg.url]
    });
  }
});

function injectedDownload(videoUrl) {
  fetch(videoUrl)
    .then(res => res.blob())
    .then(blob => {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = videoUrl.split('/').pop().split('?')[0];
      document.body.appendChild(a);
      a.click();
      a.remove();
    })
    .catch(err => {
      alert("Failed to download video: " + err.message);
    });
}
