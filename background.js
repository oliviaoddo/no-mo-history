chrome.history.onVisited.addListener(function(item) {
  if (item.url.includes('facebook.com')) {
    chrome.history.deleteUrl({ url: item.url }, function(res) {
      console.log(res);
    });
  }
});
