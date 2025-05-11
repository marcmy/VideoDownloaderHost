chrome.runtime.sendMessage({ action: "getVideos" }, function (videos) {
  const container = document.getElementById("videos");
  if (!videos.length) {
    container.innerText = "No videos detected yet.";
    return;
  }

  videos.forEach(video => {
    const div = document.createElement("div");
    div.className = "entry";

    const getFileName = url =>
      decodeURIComponent(url.split('/').pop().split('?')[0] || 'video.mp4');
    const filename = getFileName(video.url);

    const link = document.createElement("a");
    link.href = video.url;
    link.innerText = filename;
    link.target = "_blank";
    link.style.display = "block";
    link.style.marginBottom = "6px";

    const nativeBtn = document.createElement("button");
    nativeBtn.innerText = "Download via Native Host";
    nativeBtn.onclick = () => {
      chrome.runtime.sendNativeMessage("com.marc.video_downloader", {
        url: video.url,
        referer: video.referer,
        userAgent: video.userAgent,
        filename: filename
      }, (response) => {
        if (chrome.runtime.lastError) {
          alert("Native host error: " + chrome.runtime.lastError.message);
        } else if (response && response.status === "ok") {
          alert("Downloading: " + filename);
        } else {
          alert("Download failed: " + (response?.message || "Unknown error"));
        }
      });
    };

    div.appendChild(link);
    div.appendChild(nativeBtn);
    container.appendChild(div);
  });
});
