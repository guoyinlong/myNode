const jsdom = require("jsdom");
const { JSDOM } = jsdom;

if (typeof document === 'undefined') {
  const jsdom=new JSDOM('<!doctype html><html><body></body></html>');

  global.document =  jsdom.window.document;
  global.window = jsdom.window;
  global.navigator = jsdom.window.navigator;


  const matchMediaPolyfill = function matchMediaPolyfill() {
    return {
      matches: false,
      addListener() {
      },
      removeListener() {
      },
    };
  };

  global.window.matchMedia =matchMediaPolyfill;

}
