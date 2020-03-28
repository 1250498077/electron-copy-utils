import React from 'react';
import { Component } from 'react';
// import router from '../../router/router'
import './layoutScss.scss'
import { Route, Switch, Link, withRouter } from 'react-router-dom';
import { Input, Button, InputNumber } from 'antd';
const fs = window.require('fs').promises
const join = window.require('path').join;
let level = 2;
let currentlevel = 1;
let states = null;

class LayoutView extends Component {

  constructor(props, context) {
    super(props, context)
    window.router = this.props.history;
    this.state = {
      selectedTab: 'redTab',
      hidden: false,
      fullScreen: false,
      files: '',
      // 设定搜索层级
      level: 1
    }
  }
    
  componentDidMount = () => {
    let filesList = this.geFileList("D:/react/新复制工具/my-app-new/src");
    console.log('最终生成结果', filesList)
    // let str = JSON.stringify(filesList);
    // str = "var data ={name:'Egret',children:#1}".replace("#1",str);
    // this.writeFile("tree.js",str);
  }

  geFileList = async (path) => {
    let filesList = [];
    let targetObj = {};

    await this.readFile({
      path, filesList, targetObj
    });
    return filesList;
  }

  readFile = async ({
    path, filesList, targetObj
  }) => {
    let files = await fs.readdir(path);//需要用到同步读取

    currentlevel++;
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

        if (currentlevel <= this.state.level) {
          this.readFile({
            path: path + '/' + file, 
            filesList, 
            targetObj: item
          });
        }
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

  // 初始状态或状态变化会触发render
  render() {

    return (
      <div className="layout-header">
        <div style={{display: 'flex'}}>
          <Input placeholder="Basic usage" onChange={(e) => {
            this.setState({
              files: e.target.value
            })
          }} />
          <InputNumber 
            min={1}
            max={10} 
            defaultValue={3} 
            onChange={(value) => {
              this.setState({
                level: value
              })
            }}
          />
          <Button
            type="primary"
            onClick={() => {
              const {files} = this.state;
              try {
                let fileStr = files.replace(/\\/g, '/')
                this.geFileList(fileStr);
              } catch(e) {
                console.log('出现问题')
              }

            }}>开始复制</Button>
        </div>
      </div>
    )
  }
}

export default withRouter(LayoutView)
