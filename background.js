var enable = true;
const notification = {
  type: 'basic',
  iconUrl: 'images/icon.png',
  title: 'no mo history'
};
const historyListener = item => {
  let noMoHistoryData = JSON.parse(localStorage.getItem('noMoHistory')) || [];
  const domainName = getDomainName(item.url);
  if (noMoHistoryData.includes(domainName)) {
    chrome.history.deleteUrl({ url: item.url }, function(res) {
      console.log(res);
    });
  }
};

chrome.extension.onConnect.addListener(port => {
  port.onMessage.addListener(message => {
    if (message === 'DISABLE') {
      enable = false;
      toggle(enable);
      const notification = chrome.notifications.create(
        'enable',
        {
          ...notification,
          message: 'no mo history has been disabled'
        },
        notificationId => {}
      );
      chrome.notifications.clear('enable', () => {});
    }
    if (message === 'ENABLE') {
      enable = true;
      toggle(enable);
      const notification = chrome.notifications.create(
        'disabled',
        {
          ...notification,
          message: 'no mo history has been enabled'
        },
        notificationId => {}
      );
      chrome.notifications.clear('disabled', () => {});
    }
  });
});

function toggle(enable) {
  if (enable === true) {
    chrome.history.onVisited.addListener(historyListener);
  } else {
    chrome.history.onVisited.removeListener(historyListener);
  }
}

function getDomainName(url) {
  var match = url.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/i);
  if (
    match != null &&
    match.length > 2 &&
    typeof match[2] === 'string' &&
    match[2].length > 0
  ) {
    return match[2];
  } else {
    return null;
  }
}

toggle(enable);
