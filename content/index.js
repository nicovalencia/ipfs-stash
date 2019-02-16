import IPFS from 'ipfs-http-client';

console.log("Loaded content script in document:", document);

chrome.storage.local.get(['rootHash'], function(result) {
  console.log('rootHash result', result);
  if (!result.rootHash) {

    // Initialize RootHash:
    ipfs.files.mkdir('/stash').then(cid => {
      console.log("Initialized root directory in IPFS:", cid);

      // Save to storage:

    }).catch(e => {
      console.log(e);
    });

  }
});

const ipfs = new IPFS({
  host: "127.0.0.1",
  port: 5001,
  protocol: "http",
});

const post = (obj) => {
  return new Promise((resolve, reject) => {

    if (!obj.data) {
      return reject("No data sent to api!");
    }

    console.log('Converting data into buffer:', obj.data);
    let buffer;
    switch(obj.type) {
      case "dataUrl":
        buffer = Buffer.from(obj.data);
        break;
      case "json":
        buffer = new Buffer(JSON.stringify(obj.data));
        break;
      default:
        throw new Error("Unspecified object type, must be: dataUrl, json");
    }
    console.log('Buffer:', buffer);

    ipfs.add({
      path: `/${obj.name}`,
      content: buffer,
    }).then(cid => {
      console.log('resolving name:', obj.name);
      resolve({ cid, name: obj.name });
    }).catch(e => {
      reject(e);
    });
  });
};


const copyToStashDirectory = (cid, name) => {
  console.log('Copying to /stash', cid[0]);
  ipfs.files.cp(`/ipfs/${cid[0].hash}`, `/stash/${name}`, err => {
    if (err) {
      console.error(err)
    }
  });

  console.log('reading MFS ls /stash:');
  ipfs.files.ls('/stash', (err, files) => {
    if (err) {
      console.log(err);
    }

    console.log(files)

    console.log('reading stat for each file in stash/:');
    files.forEach(file => {
      ipfs.files.stat(`/stash/${file.name}`, (err, stats) => {
        if (err) {
          console.log(err);
        }
        console.log(stats)
      });
    });
  });

};

function processImage(element) {

  let fileParts = element.src.split("/");
  let fileName = fileParts[fileParts.length-1];

  /*
   * CANVAS METHOD:
   * Issue - expands compressed/optimized images like png into bitmap literal.
   *
  let canvas = document.createElement('canvas');
  let context = canvas.getContext('2d');
  canvas.width = element.width;
  canvas.height = element.height;
  context.drawImage(element, 0, 0);
  let imageData = context.getImageData(0, 0, element.width, element.height);

  // Uint8ClampedArray()
  post(imageData.data).then(cid => {
    console.log("Added image to IPFS:", cid);
  }).catch(e => {
    throw new Error(e);
  });
  */

  // (XMLHttpRequest) BLOB METHOD:
  // Issue - max limits (differ by browser).
  var req = new XMLHttpRequest();
  req.open('GET', element.src);
  req.responseType = 'blob';
  req.onload = function() {
    var blob = req.response;
    var fileReader = new FileReader();
    console.log('FILEREADER', fileReader);
    fileReader.onloadend = function() {
      post({
        name: fileName,
        type: "dataUrl",
        data: fileReader.result,
      }).then(result => {
        console.log("Added image to ipfs:", result.cid);
        console.log('resolved name:', result.name);
        copyToStashDirectory(result.cid, result.name);
      }).catch(e => {
        throw new Error(e);
      });
    };
    fileReader.readAsDataURL(blob);
  };
  req.send();

  // Third idea: use download API to download, then use FileReader API to get
  // full array of binary:
  // ...
}

document.addEventListener("click", (e) => {
  switch(e.target.tagName) {
    case "IMG":
      processImage(e.target);
      break;
    default:
      break;
  }
});
