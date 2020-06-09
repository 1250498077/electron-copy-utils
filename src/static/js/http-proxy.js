const PORT = 8086;
// const webRoot = 'D:/v1.2.0/gugupay/';
const webRoot = 'C:/Users/Administrator/Desktop/buge-ec-gerrit/buge-cms/src/main/resources/static/';  //**** 项目目录

const http = require('http');
const httpProxy = require('http-proxy');
const url = require('url');
const fs = require('fs');
const mine = {
    css: 'text/css',
    gif: 'image/gif',
    html: 'text/html',
    ico: 'image/x-icon',
    jpeg: 'image/jpeg',
    jpg: 'image/jpeg',
    js: 'text/javascript',
    json: 'application/json',
    pdf: 'application/pdf',
    png: 'image/png',
    svg: 'image/svg+xml',
    swf: 'application/x-shockwave-flash',
    tiff: 'image/tiff',
    txt: 'text/plain',
    wav: 'audio/x-wav',
    wma: 'audio/x-ms-wma',
    wmv: 'video/x-ms-wmv',
    xml: 'text/xml'
};

const path = require('path');
const options = {
        host: '127.0.0.1', //这里放代理服务器的ip或者域名
        port: '8089', //这里放代理服务器的端口号
        tls: {
            rejectUnauthorized: false
        },
        changeOrigin: true
            // method: 'POST', //这里是发送的方法
            // path: '', //这里是访问的路径
            // headers: { //这里放期望发送出去的请求头
            //   'Accept': 'application/json',
            //   'Accept-Encoding': 'gzip, deflate, br',
            //   'Accept-Language': 'zh-CN,zh;q=0.8',
            //   'X-Requested-With': 'XMLHttpRequest'
            // },
            // target: {
            //   host: 'www.google.com', // 不要加http://
            //   port: 80
            // }
    }
    // Create your proxy server and set the target in the options
    // 可以理解为直接把请求地址 替换成https: //www.google.com
const proxy = httpProxy.createProxyServer(options)

const server = http.createServer((request, response) => {
    let pathname = url.parse(request.url).pathname;
    // localhost:8080 报错
    if (pathname == '/') {
        pathname = '/index.html';
    }
    // const realPath = path.join(webRoot, pathname.replace(/\/wucgweb\/app/, ''));
    const realPath = path.join(webRoot, pathname.replace(/\/cms/, ''));  //**** http://127.0.0.1/cms/index.html

    console.log('request: ' + pathname);
    console.log('realPath: ' + realPath);
    let ext = path.extname(realPath);
    ext = ext ? ext.slice(1) : 'unknown';

    fs.exists(realPath, (exists) => {
        if (!/home\.html|page|css|font|Public|javascript|js|assets/g.test(pathname)) {  //**** 添加需要修改的目录或者文件名
            console.log(1111111111111111111);
            proxy.web(request, response, {
                // target: 'https://testhtml.bugegaming.com',
                // target: 'https://devh.bugegaming.com',
                target: 'http://www.baidu.com/', //**** 代理的服务器ip
                // target: 'http://10.8.0.70:8070',
                changeOrigin: true
            });
        } else if (!exists || !realPath) {
            response.writeHead(404, {
                'Content-Type': 'text/plain'
            });
            response.write('This request URL ' + pathname + ' was not found on this server.');
            response.end();
        } else {
            fs.readFile(realPath, 'binary', (err, file) => {
                if (err) {
                    response.writeHead(500, {
                        'Content-Type': 'text/plain'
                    });
                    response.end(err);
                } else {
                    let contentType = mine[ext] || 'text/plain';
                    response.writeHead(200, {
                        'Content-Type': contentType,
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Headers': 'X-Requested-With',
                        'Access-Control-Allow-Methods': 'PUT,POST,GET,DELETE,OPTIONS'
                    });
                    response.write(file, 'binary');
                    response.end();
                }
            });
        }
    });
});
server.listen(PORT);
console.log('Server runing at port: ' + PORT + '.');