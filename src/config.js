const url = (window.location.href.indexOf('192') || window.location.href.indexOf('localhost'))
    ? '192.168.20.254' : '45.77.249.168';

const Config = {
    serverImageUrl: 'http://' + url + ':7001'
}
export {Config};
