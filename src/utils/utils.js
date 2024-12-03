export const runningOnMobile = () => {
  return (
    navigator.userAgent.match(/Android/i) ||
    navigator.userAgent.match(/webOS/i) ||
    navigator.userAgent.match(/iPhone/i) ||
    navigator.userAgent.match(/iPad/i) ||
    navigator.userAgent.match(/iPod/i) ||
    navigator.userAgent.match(/BlackBerry/i) ||
    navigator.userAgent.match(/Windows Phone/i)
  );
};

export const getApiUrl = () => {
  var api = "https://ai.artsdatabanken.no/";

  // if the url does not start with https://orakel.artsdatabanken.no/ then we are in development mode
  if (window.location.hostname !== "orakel.artsdatabanken.no") {
    api = "https://ai.test.artsdatabanken.no/";
  }
  return api;
};

const piexif = require("piexifjs");

export const getExif = (imgFile) => {
  const reader = new FileReader();

  reader.readAsDataURL(imgFile);

  return new Promise((resolve, reject) => {
    reader.onloadend = () => {
      try {
        var exif = piexif.load(reader.result);
        resolve(exif);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = (error) => {
      reject(error);
    };
  });
};


// write exif data to an image provided as a blob
export const writeExif = (imgBlob, exif) => {
  return new Promise((resolve, reject) => {
    var reader = new FileReader();
    reader.readAsArrayBuffer(imgBlob);
    reader.onloadend = () => {
      var buf = reader.result;
      var newData = piexif.dump(exif);
      var base64String = btoa(
        new Uint8Array(buf)
          .reduce((data, byte) => data + String.fromCharCode(byte), '')
      );
      var result = piexif.insert(newData, "data:image/jpeg;base64," + base64String);
      var byteString = atob(result.split(',')[1]);
      var ab = new ArrayBuffer(byteString.length);
      var ia = new Uint8Array(ab);
      for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      resolve(new Blob([ab], { type: "image/jpeg" }));
    };
    reader.onerror = (error) => {
      reject(error);
    };
  });
};