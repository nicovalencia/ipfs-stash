import IPFS from 'ipfs-http-client';

console.log("Loaded content script in document:", document);

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
      path: `/tmp/${obj.name}`,
      content: buffer,
    }).then(cid => {
      resolve(cid);
    }).catch(e => {
      reject(e);
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
    fileReader.onloadend = function() {
      post({
        name: fileName,
        type: "dataUrl",
        data: fileReader.result,
      }).then(cid => {
        console.log("Added image to ipfs:", cid);
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
