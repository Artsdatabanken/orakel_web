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
  var url = window.location.href;
  var api = "https://ai.artsdatabanken.no/";

  // if the url does not start with https://orakel.artsdatabanken.no/ then we are in development mode
  if (!url.startsWith("https://orakel.artsdatabanken.no")) {
    api = "https://ai.test.artsdatabanken.no/";
  }
  return api;
};
