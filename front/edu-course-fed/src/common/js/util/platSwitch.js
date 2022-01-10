
  let canvas = null;
  let gl  =  null;
  let glRenderer = null;
  let models = null;
  let devices = {
    'Apple A7 GPU': {
        1136: ['iPhone 5', 'iPhone 5s'],
        2048: ['iPad Air', 'iPad Mini 2', 'iPad Mini 3']
    },

    'Apple A8 GPU': {
        1334: ['iPhone 6'],
        2208: ['iPhone 6 Plus'],
        2048: ['iPad Air 2', 'iPad Mini 4']
    },

    'Apple A9 GPU': {
        1136: ['iPhone SE'],
        1334: ['iPhone 6s'],
        2208: ['iPhone 6s Plus'],
    },

    'Apple A10 GPU': {
        1334: ['iPhone 7'],
        2208: ['iPhone 7 Plus']
    },

    'Apple A11 GPU': {
        1334: ['iPhone 8'],
        2208: ['iPhone 8 Plus'],
        2436: ['iPhone X'],
    },

    'Apple A12 GPU': {
        2436: ['iPhone XS'],
        2688: ['iPhone XS MAX'],
        1792: ['iphone XR']
    },
    };
  function getCanvas() {
      if (canvas == null) {
          canvas = document.createElement('canvas');
      }

      return canvas;
  }

  function getGl() {
      if (gl == null) {
          gl = getCanvas().getContext('experimental-webgl');
      }

      return gl;
  }

  function getScreenWidth() {
      // alert(Math.max(screen.width, screen.height) * (window.devicePixelRatio || 1))
      console.log(Math.max(screen.width, screen.height) * (window.devicePixelRatio || 1));
      return Math.max(screen.width, screen.height) * (window.devicePixelRatio || 1);
  }

  function getGlRenderer() {
      if (glRenderer == null) {
          let debugInfo = getGl().getExtension('WEBGL_debug_renderer_info');
          glRenderer = debugInfo == null ? 'unknown' : getGl().getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
      }
      console.log(glRenderer);
      return glRenderer;
  }

export function getModels() {
      var userAgent = window.navigator.userAgent;
      // 安卓设备
      if (userAgent.indexOf('iPhone') === -1) {
          // return 'Android';
          models = ['Android'];
          return models;
      }

      var device = devices[getGlRenderer()];
      if (device == undefined) {
          models = ['unknown'];
      } else {
          models = device[getScreenWidth()];
          if (models == undefined) {
              models = ['unknown'];
          }
      }
      return models;
  }

  function getIphoneVersion() {
      var userAgent = window.navigator.userAgent;
      // 安卓设备
      if (userAgent.indexOf('iPhone') === -1) {
          return '安卓不显示版本！';
      }

      var str = userAgent.toLowerCase();
      var version = str.match(/cpu iphone os (.*?) like mac os/);
      return version[1].replace(/_/g, '.');
  }

  if (window.MobileDevice == undefined) {
      window.MobileDevice = {};
  }

