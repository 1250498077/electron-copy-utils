import React from 'react';
import { Component } from 'react';
import _ from 'lodash';
import './homeScss.scss';
import { Input, Button, TreeSelect, Tree, Tag, Tooltip, tags, message } from 'antd';

const PORT = 8086;
// const webRoot = 'D:/v1.2.0/gugupay/';
const webRoot = 'C:/Users/Administrator/Desktop/buge-ec-gerrit/buge-cms/src/main/resources/static/';  //**** 项目目录
const fs = window.require('fs')
const path = window.require('path');
const http = window.require('http');
const httpProxy = window.require('http-proxy');
const url = window.require('url');
const nodeCmd = window.require('node-cmd');

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
const options = {
  host: '127.0.0.1', //这里放代理服务器的ip或者域名
  port: '8089', //这里放代理服务器的端口号
  tls: {
      rejectUnauthorized: false
  },
  changeOrigin: true
}
const proxy = httpProxy.createProxyServer(options);

const runCmdTest = () =>{
  nodeCmd.get(
    'ipconfig',
    function(err, data, stderr){
        console.log(data);
    }
  );
  nodeCmd.get(
    'dir',
    function(err, data, stderr){
        console.log(data);
    }
  );
  nodeCmd.run('ipconfig');
  nodeCmd.run('dir');
}

const server = http.createServer((request, response) => {
  let pathname = url.parse(request.url).pathname;
  // localhost:8080 报错
  if (pathname == '/') {
      pathname = '/index.html';
  }
  // const realPath = path.join(webRoot, pathname.replace(/\/wucgweb\/app/, ''));
  const realPath = path.join(webRoot, pathname.replace(/\/cms/, ''));  //**** http://127.0.0.1/cms/index.html

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

class HomeView extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {

    }

  }
    
  componentDidMount = () => {
    console.log('server', server)
  }

  render() {

    return (
      <div className="home-layout">
          <Button
            type="primary"
            onClick={async() => {
              runCmdTest()
          }}>启动</Button>
          <Button
            type="primary"
            onClick={async() => {
              server = null;
          }}>关闭</Button>
      </div>
    )
  }
}

export default HomeView
