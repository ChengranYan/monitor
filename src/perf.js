export default{
  init(cb) {
    let cycleFreq = 100;
    let isOnload = false;
    let isDOMReady = false;
    let performance = window.performance || window.mozPerformance || window.msPerformance || window.webkitPerformance;

    let Util = {
      addEventListener: function (name, callback, useCapture) {
        if (window.addEventListener) {
          return window.addEventListener(name, callback, useCapture)
        } else if (window.attachEvent) {
          return window.attachEvent('on' + name, callback)
        }
      },

      onload: function (callback) {
        let timer = null

        if (document.readyState === 'complete') {
          runCheck()
        } else {
          Util.addEventListener('load', function () {
            runCheck()
          }, false)
        }

        function runCheck() {
          if (performance.timing.loadEventEnd) {
            clearTimeout(timer)
            callback();
            isOnload = true;
          } else {
            timer = setTimeout(runCheck, cycleFreq);
          }
        }
      }
    };

    let reportPerf = function () {
      if (!performance) {
        return void 0;
      }

      function filterTime(a, b) {
        return (a > 0 && b > 0 && (a - b) >= 0) ? (a - b) : undefined
      }

      let timing = performance.timing
      let perfData = {
        //网络连接
        pervPage: filterTime(timing.fetchStart, timing.navigationStart),
        redirect: filterTime(timing.redirectEnd, timing.redirectStart),
        dns: filterTime(timing.domainLoopupEnd, timing.domainLoopupStart),
        connect: filterTime(timing.connectEnd, timing.connectStart),
        network: filterTime(timing.connectEnd, timing.navigationStart),

        //网络接收
        send: filterTime(timing.responseStart, timing.requestStart),
        receive: filterTime(timing.responseEnd, timing.responseStart),
        request: filterTime(timing.responseEnd, timing.requestStart),

        //前端渲染
        dom: filterTime(timing.domComplete, timing.domLoading),
        loadEvent: filterTime(timing.loadEventEnd, timing.loadEventStart),
        frontend: filterTime(timing.loadEventEnd, timing.domLoading),

        // 关键阶段
        load: filterTime(timing.loadEventEnd, timing.navigationStart), // 页面完全加载总时间
        domReady: filterTime(timing.domContentLoadedEventStart, timing.navigationStart), // domready时间
        interactive: filterTime(timing.domInteractive, timing.navigationStart), // 可操作时间
        ttfb: filterTime(timing.responseStart, timing.navigationStart), // 首字节时间
      }

      return perfData
    };


    Util.onload(function (d) {
      let perfData = reportPerf('onload')
      perfData.type = 'onload'
      cb(perfData)
    })
  }
}