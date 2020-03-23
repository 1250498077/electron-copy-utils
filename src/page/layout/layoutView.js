import React from 'react';
import { Component } from 'react';
// import router from '../../router/router'
import './layoutScss.scss'
import { Route, Switch, Link, withRouter } from 'react-router-dom';
import { Input, Button } from 'antd';
const fs = window.require('fs').promises
const join = window.require('path').join;


const data = [
  {
    img: 'https://zos.alipayobjects.com/rmsportal/dKbkpPXKfvZzWCM.png',
    title: 'Meet hotel',
    des: '不是所有的兼职汪都需要风吹日晒',
  },
  {
    img: 'https://zos.alipayobjects.com/rmsportal/XmwCzSeJiqpkuMB.png',
    title: 'McDonald\'s invites you',
    des: '不是所有的兼职汪都需要风吹日晒',
  },
  {
    img: 'https://zos.alipayobjects.com/rmsportal/hfVtzEhPzTUewPm.png',
    title: 'Eat the week',
    des: '不是所有的兼职汪都需要风吹日晒',
  },
]
let states = null;

class LayoutView extends Component {

  constructor(props, context) {
    super(props, context)
    window.router = this.props.history;
    this.state = {
      selectedTab: 'redTab',
      hidden: false,
      fullScreen: false,
    }
  }

  geFileList = async (path) => {
    let filesList = [];
    let targetObj = {};
    filesList = await this.readFile(path, filesList, targetObj);
    return filesList;
  }

  readFile = async (path, filesList, targetObj) => {
    let files = await fs.readdir(path);//需要用到同步读取
    debugger
    files.forEach(async (file) => {
      states = await fs.stat(path + '/' + file);
      if (states.isDirectory()) {
        let item;
        if (targetObj["children"]) {
          item = { name: file, children: [] };
          targetObj["children"].push(item);
        }
        else {
          item = { name: file, children: [] };
          filesList.push(item);
        }

        this.readFile(path + '/' + file, filesList, item);
      } else {
        //创建一个对象保存信息
        let obj = new Object();
        obj.size = states.size;//文件大小，以字节为单位
        obj.name = file;//文件名
        obj.path = path + '/' + file; //文件绝对路径

        if (targetObj["children"]) {
          let item = { name: file, value: obj.path }
          targetObj["children"].push(item);
        }
        else {
          let item = { name: file, value: obj.path };
          filesList.push(item);
        }
      }
    });
    return filesList;
  }

  writeFile(fileName,data) {  
    fs.writeFile(fileName,data,'utf-8',complete);
    function complete() {
       console.log("文件生成成功");
    }
  }
  
  componentDidMount = () => {
    let filesList = this.geFileList("D:/react/新复制工具/my-app-new/src");
    let str = JSON.stringify(filesList);
    str = "var data ={name:'Egret',children:#1}".replace("#1",str);
    this.writeFile("tree.js",str);
  }

  // 初始状态或状态变化会触发render
  render() {

    return (
      <div className="layout-header">
        <div>
          <Input placeholder="Basic usage" />
          <Button type="primary">开始复制</Button>
        </div>
      </div>
    )
  }
}

export default withRouter(LayoutView)
