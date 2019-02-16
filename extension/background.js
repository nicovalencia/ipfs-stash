chrome.runtime.onInstalled.addListener(function() {

  console.log("Background process initialized...");

  chrome.storage.local.set({
    rootHash: null,
  }, function() {
    console.log("Storage initialized", 'null');
  });

});
