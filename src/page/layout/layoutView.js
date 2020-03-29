import React from 'react';
import { Component } from 'react';
// import router from '../../router/router'
import _ from 'lodash';
// import {deepClone} from '../../utils'
import './layoutScss.scss'
// import { Route, Switch, Link, withRouter } from 'react-router-dom';
import { Input, Button, TreeSelect, Tree  } from 'antd';
const fs = window.require('fs')
const path = window.require('path');

class LayoutView extends Component {

  constructor(props, context) {
    super(props, context)
    // window.router = this.props.history;
    this.state = {
      selectedTab: 'redTab',
      hidden: false,
      fullScreen: false,
      // 源文件目录
      sourceFile: '',
      // 目标目录
      targetFile: '',
      // 树形数据
      treeData: {
        children: []
      },
      // 选中的全部文件
      sourceFlieList: []
    }

  }
    
  componentDidMount = () => {
    console.log('fs', fs)
  }

  // 创建目录
  createDir = async (dirname) => {
    if (fs.existsSync(dirname)) {
      return true;
    } else {
      if (this.createDir(path.dirname(dirname))) {
        fs.mkdirSync(dirname);
        return true;
      }
    }
  }

  // 控制器
  copeFileController = () => {
    
    const {
      // 目标文件的绝对路径
      targetFile,
      // 每一个文件的绝对路径
      sourceFlieList
    } = this.state;
    //复制文件
    this.copeFile(sourceFlieList, targetFile)
  }

  // 拷贝文件
  copeFile = async (sourceFlieList, targetFile) => {
    const {
      // 选择的源目录
      sourceFile
    } = this.state;
    sourceFlieList.map(async (fileUrl) => {
      // 源： 相对目录 + 文件名
      let sourcedir = fileUrl.replace(sourceFile, '');
      // 源：相对目录
      let arr = sourcedir.split("/");
      arr.splice(arr.length-1, 1);
      let str = arr.join("/")
      // 目标： 绝对路径 + 相对目录
      let relativeTargetFile = targetFile + sourcedir;
      let relativeTargetDir = targetFile + str;
      await this.createDir(relativeTargetDir);
      // 源：绝对路径+相对目录+文件名    目标： 绝对路径+相对目录+文件名
      fs.copyFile(fileUrl, relativeTargetFile, (err) => {
        if (!err)
          console.log(targetFile);
      });
    })
  }

  geFileList = async (path) => {
    let filesList = await this.readFile({
      path
    });
    return filesList;
  }

  readFile = async ({
    path, 
  }) => {
    let files = await fs.promises.readdir(path);
    let states = await fs.promises.stat(path);
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
      let states = await fs.promises.stat(path + '/' + fileName);
      if (fileName === 'node_modules') {
        staticList.children.push({
          type: 'file',
          size: states.size,
          title: fileName,
          key: path + '/' + fileName,
          value: path + '/' + fileName,
          isLeaf: true
        })
      }

      // 判断是不是文件夹
      if (states.isDirectory() && fileName !== 'node_modules') {
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

  onSelect = (selectedKeys, info) => {
    this.setState({
      sourceFlieList: selectedKeys
    })
  };

  onCheck = (checkedKeys, info) => {
    console.log('onCheck', checkedKeys, info);
    this.setState({
      sourceFlieList: checkedKeys
    })
  };

  // 初始状态或状态变化会触发render
  render() {
    return (
      <div className="layout-header">
        <div style={{display: 'flex'}}>
          <Input value={this.state.sourceFile} placeholder="source" onChange={(e) => {
            this.setState({
              sourceFile: e.target.value.replace(/\\/g, '/')
            })
          }} />
        </div>
        <div>
          <Input value={this.state.targetFile} placeholder="target" onChange={(e) => {
            this.setState({
              targetFile: e.target.value.replace(/\\/g, '/')
            })
          }} />
        </div>
        <Button
          type="primary"
          onClick={async() => {
            const {sourceFile, targetFile} = this.state;
            try {
              let filesList = await this.geFileList(sourceFile);
              this.setState({ treeData:  filesList });
            } catch(e) {
              console.log('读取目录出现问题')
            }

        }}>检索</Button>
        <Button
          type="primary"
          onClick={() => {
            this.copeFileController()
        }}>开始复制</Button>
        <Tree
          defaultCheckedKeys={true}
          checkable
          onSelect={this.onSelect}
          onCheck={this.onCheck}
          treeData={[this.state.treeData]}
        />
      </div>
    )
  }
}

export default LayoutView
