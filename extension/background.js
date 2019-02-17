chrome.runtime.onInstalled.addListener(function() {

  console.log("Background process initialized...");

  chrome.storage.local.set({
    config: {},
  }, function() {
    console.log("Storage initialized: config", {});
  });

});
