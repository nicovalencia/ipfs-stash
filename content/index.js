import IPFS from 'ipfs-http-client';

console.log("Loaded content script in document:", document);

chrome.storage.local.get(['config'], function(result) {
  console.log('config:', result);
});

const ipfs = new IPFS({
  host: "127.0.0.1",
  port: 5001,
  protocol: "http",
});

// Initialize Unstashed Stash:
ipfs.files.mkdir('/unstashed').then(() => {
  console.log("Initialized default Unstashed stash!");
}).catch(e => {
  // Already initialized
});

const post = (obj) => {
  return new Promise((resolve, reject) => {

    console.log('POSTING', obj);

    if (!obj.data) {
      return reject("No data sent to api!");
    }

    let buffer;
    switch(obj.type) {
      case "dataUrl":
        buffer = Buffer.from(obj.data, 'base64');
        break;
      case "json":
        buffer = new Buffer(JSON.stringify(obj.data));
        break;
      default:
        throw new Error("Unspecified object type, must be: dataUrl, json");
    }

    ipfs.add({
      path: `/${obj.name}`,
      content: buffer,
    }).then(cid => {
      resolve({ cid, name: obj.name });
    }).catch(e => {
      reject(e);
    });
  });
};

const copyToUnstashedDirectory = (cid, name) => {
  console.log(name);
  ipfs.files.cp(`/ipfs/${cid[0].hash}`, `/unstashed/${name}`);
};

function processImage(element) {

  let fileParts = element.src.split("/");
  //let fileName = new Date().getTime(); // use timestamp as name for now
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
        copyToUnstashedDirectory(result.cid, result.name);
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

// Extension asset paths:
const BUTTON_URL = 'data:image/png;base64,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';
const STASHED_URL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEsAAAAaCAYAAAGIm5EuAAAAAXNSR0IArs4c6QAAB8BJREFUWAntWQlQlVUU/gTeQwQFWSQXEFfMJUlhcjRLLRfUzKIxU9uXaappm0lramqaphptn1LH9hpt1EknNUxEsRRMFLQiS9xFRUA2AUFZ3us7B/7f9/CHB5o2ZWfmvv/+55577rnnnnvv958HkJxOZ1+WpihZZEQouikJV74PZW+VDpO+/ga1DgdGRkXipVE3YP3+gyiqrMRd1wyUZrSRH+kpz6aojZA0Uq6cjwArQRUSTTUczublZSWjPLENCd8sx9naWmU8MPRatPXxweR+feFdP1CL7Io1bGrWeB3C84/Nq2FyKjr+y8Woo1PkGf/VEn0++f065JaXY8bylfg1Lx9v/pSqss+v39hYfc3fadl8UzstTBYPt5LKKd/XUNKGL7ICNQbjQp+y3rLIpqKs/IIL1aXBr3EhGsrOnkXG8Vx0ad8ev5zIw6HSUsxgvM5J2qCLcrysDL2Cg7G70YBJ980yDMg0w6+qplYVBbfzQ4+OQRgRGYE9Jwtxc6+eKvxw7BDklVdoADZEOXqFBBuK5PmamPdRK51uKS7ajNAYynqGMC6ExPnST3+k0rCq1a484V9Gkl1op126qY1ZOsg0jbyMxlgN5aRxXrLN5Sx1M6r0zBlMX7YCWw7n6FaX3rL1PdFja9Z6EtF2Q5fxbNRJ9mSyhH9kowYEtW2LpXcmYPux49pUWWNuN7yXtg1J+w/I0uOHe2fqUS9CS6bdrrIO8tfu3Yc6hxML0ncoT35euHEk0o7k4MVRI01eFHdGE1RvEwc5jziAM7uw0I1PA/W9ziGt9VRcWeXkFjNez3tyP5s86Vddy6PXA7kZS9kUD/KXoznFzSjXF44+myX7cljRMM5s1/Hd6hT4Ww6zi5jMR4ZBxjEhrhttMP/B5yYeEWNkO17U6XwJJhArRlninEMlpQhs64tgP79LMG7zKs1b1lVsyuKl+KPgJOZuTsOH27ZjN+uLdmS6iljWJxBneaKUg4ewLGs3fi8owGzCASsycYRro1yXiTwMHxgSg9iuXdS4Y8QRxVVVeDoxCf52G+6OuQZvp/6MWTGD8GnGLqy9Z4Yerm+lbsUG4mbBFxOJp2OuCkdYgD/KiVOyC4vA8w33UW/3wCBEBHZwHdasWxq1auZ0VFRX45OMnXhl44+YN2EsUnkyB9jtqOJJX+d04FhZOWI6X4VF2zNxY48oVSiX/3PXD1ejUo8c5QnvQGbuCXMwMTQxe5/qbu9rx6DwTmaba8Vy+W7l8s3ftgP+NjvC/P0VkUuMrdj9J6YNGoB2Npt6Ra6QdyaOw0+HDrvq1Hps187w9vLCU8OHQa6WyKBAfPBzOj7fuUvbj54qIwgrOq+fMhjnGyXYG1NBxWknP11MNt2v9dwyAbjnaG9h0bmXRjW5lE6Un5PPKT3VSMLydaNxTlnuQOtpXFouQ0DRt4ziBlYv7bDNalc7NKZoXIlYSPGmL8VmdV10Y4qMTyoRTbp8Viq52nLSz2MZY9X+H+XJosymcywPZTdn0UEdKbyCZfR/1BmtmdYmCicYUSUdzSOUjhJUU8zyv6PEM/V+KG7wizI0ssiQfMmVtN108q34kbPrJgF8AuLntqRjOr8PP9iarqk9kacCjOkZhad5Adu9vRXmyMdtb2Y2BnQKa4nKJmWeSlwHAQSrZ01vUqalDSkHDxNybVX4NG1gf8WNc9ZvIGIJxxtjWxwjcwRePdiSQSVx9/KGTRjRPRIvj75Bu5w6cxZLs37Hd39m43ry525O1RRReEAAJvTphRmDByEt5yiWE3iePF2pGC+OGPIOGiy0izmqdXv347f8fHQPCsLoHlEYz35CkgytrqtDCoHrkl+zQACC+L59IJMVklzXxzt2ap7Lz+aD6yK6KUb14gLKx/7C7Rna1pm5sIGEcQL1GBja1+7jDX4rmzlTZXr+eVCc1cWzHDCYQPft+HH4InOXZkHFeCHJpT00dAjzagF4JG4onl2bRIdGqKPyKipQWnVGI08mtPiXLMW3DvaLDg3B80TtfUJC8GhcLCIIC0sIwPMrTiOcgFpIJieJv89um4LFdNhnxMYBBOfRoaF4bHUi4rp1xcIpk0A34AmmX1b9sQeLpk7G/StWIdS/Hb5MmKrZZ0kWulJvJgz9CF3Fia2gzuKsbSw3e+q0NecYviC+lcTiuxPHm+LP0DnztqQhOizE5BmVzdySMsGp/fvh3msH0zHBSGZKRygyMFAnJvXf8gqwhpg8ixGWMKA/nT5E2LrN+4WFaj2I34BCNXUOVNXWp4l8iMHlI0Low8nxdG59xMl7oK+vmaYXHZJpdaVnRwzD1WGtOirSxVlPsOxxVWRVHx7ZDb4MX/nQ+JzRZZAY8sltt6Bbhw6MCAe68rmSHx7E/nh8WBy32T58xxVfv+8AxjVssQNFxbqd5jPHteXwEUMVU8QdMZNb1xMN7NQJ70+agLe4SHcu/VbFZdyXmB/rSR0LGG3ydSbJO9ly8X16u6k8UFyC13/cgmHcuq/eNMqtrZmXx43bUACoZOf0vZkOV2KTnDdxAlQVZ0mFDDvLpivRG83MWfwhyXdF9CYoJaOWRe5RG4v8kyQevRJJ5i3zt4k/xC+GEzxuO95I0RSWv1PHskSyyO1p+Sco+f8mqqCxuSw5LMksq+iYbD6bpL8AMrESEyvlDwcAAAAASUVORK5CYII=';

// Track which image is currently hovered:
let $currentImg;

// Create button markup, inject to DOM:
let button = document.createElement('div');
button.id = 'stashBtn';
document.body.append(button);
button.style.backgroundImage = `url(${BUTTON_URL})`;

// Button click handler:
button.addEventListener('click', e => {
  processImage($currentImg);
  button.style.backgroundImage = `url(${STASHED_URL})`;
  setTimeout(() => {
    button.style.backgroundImage = `url(${BUTTON_URL})`;
  }, 2000);
});

function showButton(element) {
  let rect = element.getBoundingClientRect();
  let $button = document.getElementById('stashBtn');
  $button.style.top = rect.y + 'px';
  $button.style.left = rect.x + rect.width - 75 + 'px';
}

function hideButton() {
  let $button = document.getElementById('stashBtn');
  $button.style.top = '-200px';
  $button.style.left = '-200px';
}

// Show button when image is hovered:
document.querySelectorAll('img').forEach(tag => {
  tag.addEventListener('mouseenter', e => {
    showButton(e.target);
    $currentImg = e.target;
  });
});

// Hide button when scrolling:
window.addEventListener('scroll', e => {
  hideButton();
});
