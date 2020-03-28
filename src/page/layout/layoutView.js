import React from 'react';
import { Component } from 'react';
// import router from '../../router/router'
import _ from 'lodash';
// import {deepClone} from '../../utils'
import './layoutScss.scss'
import { Route, Switch, Link, withRouter } from 'react-router-dom';
import { Input, Button, TreeSelect, Tree  } from 'antd';
const fs = window.require('fs').promises
const join = window.require('path').join;
let filesList = [];
let targetObj = {};
let states = null;

const { SHOW_PARENT } = TreeSelect;

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
      level: 1,
      // 树
      value: [],
      // 树形数据
      treeData: {
        children: []
      }
    }
    this.currentlevel = 1;
  }
    
  componentDidMount = () => {
    // let filesList = this.geFileList("D:/react/新复制工具/my-app-new/src");
    // console.log('最终生成结果', filesList)
    // let str = JSON.stringify(filesList);
    // str = "var data ={name:'Egret',children:#1}".replace("#1",str);
    // this.writeFile("tree.js",str);
    
  }

  geFileList = async (path) => {
    filesList = await this.readFile({
      path, filesList, targetObj
    });
    return filesList;
  }

  readFile = async ({
    path, 
  }) => {
    
    let files = await fs.readdir(path);
    let states = await fs.stat(path);
    let fileNameArr = path.split('/');
    let staticList = { 
      name: path, 
      type: 'folder',
      size: states.size,
      key: path,
      value: path,
      title: fileNameArr[fileNameArr.length-1],
      children: []
    };
    // 遍历当前目录下的所有文件
    for (let i = 0; i < files.length; i++) {
      let fileName = files[i];

      if (fileName === 'node_modules') {
        return;
      }
      let states = await fs.stat(path + '/' + fileName);
      // 判断是不是文件夹
      if (states.isDirectory()) {
        let child = await this.readFile({
          path: path + '/' + fileName
        })
        staticList.children.push(child);
      } else {
        staticList.children.push({
          type: 'file',
          size: states.size,
          title: fileName,
          key: path + '/' + fileName,
          value: path + '/' + fileName,
          isLeaf: true
        })
      }
    }
    return staticList;
  }

  writeFile(fileName,data) {  
    fs.writeFile(fileName,data,'utf-8',complete);
    function complete() {
       console.log("文件生成成功");
    }
  }

  onChange = value => {
    console.log('onChange ', value);
    this.setState({ value });
  };

  onSelect = (selectedKeys, info) => {
    console.log('selected', selectedKeys, info);
  };

  onCheck = (checkedKeys, info) => {
    console.log('onCheck', checkedKeys, info);
  };

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
          {/* <InputNumber 
            min={1}
            max={10} 
            defaultValue={3} 
            onChange={(value) => {
              this.setState({
                level: value
              })
            }}
          /> */}
          <Button
            type="primary"
            onClick={async() => {
              const {files} = this.state;
              try {
                let fileStr = files.replace(/\\/g, '/')
                let filesList = await this.geFileList(fileStr);
                console.log('filesList filesList', filesList)
                this.setState({ treeData:  filesList });
              } catch(e) {
                console.log('读取目录出现问题')
              }

            }}>开始复制</Button>
        </div>
        <Tree
          checkable
          onSelect={this.onSelect}
          onCheck={this.onCheck}
          treeData={this.state.treeData.children}
        />
      </div>
    )
  }
}

export default withRouter(LayoutView)
