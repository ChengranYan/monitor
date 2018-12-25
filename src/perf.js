export default{
  init(cb) {
    let performance = window.performance || window.mozPerformance || window.msPerformance || window.webkitPerformance;
    cb(performance.timing)
  }
}