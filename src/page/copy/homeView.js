import React from 'react';
import { Component } from 'react';
import _ from 'lodash';
import './homeScss.scss';
import { Input, Button, TreeSelect, Tree, Tag, Tooltip, tags } from 'antd';

// import { PlusOutlined } from '@ant-design/icons';
const fs = window.require('fs')
const path = window.require('path');

class HomeView extends Component {
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
      sourceFlieList: [],
      tags: ['node_modules'],
      inputVisible: false,
      inputValue: '',
    }

  }
    
  componentDidMount = () => {

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

  handleClose = removedTag => {
    const tags = this.state.tags.filter(tag => tag !== removedTag);
    this.setState({ tags });
  };

  showInput = () => {
    this.setState({ inputVisible: true }, () => this.input.focus());
  };

  handleInputChange = e => {
    this.setState({ inputValue: e.target.value });
  };

  handleInputConfirm = async () => {
    const { inputValue } = this.state;
    const {sourceFile, targetFile} = this.state;
    let { tags } = this.state;
    if (inputValue && tags.indexOf(inputValue) === -1) {
      tags = [...tags, inputValue];
    }

    try {
      let filesList = await this.geFileList(sourceFile);
      this.setState({ 
        treeData:  filesList,
        tags,
        inputVisible: false,
        inputValue: '',
       });
    } catch(e) {

    }
  };

  saveInputRef = input => (this.input = input);

  // 控制器
  copeFileController = () => {
    //复制文件
    this.copeFile()
  }

  // 拷贝文件
  copeFile = async () => {
    const {
      // 选择的源目录
      sourceFile,
      sourceFlieList,
      targetFile
    } = this.state;
    console.log('sourceFile', sourceFile)
    console.log('点击开始复制', sourceFlieList);
    debugger
     for (let fileUrl of sourceFlieList) {
        // 源： 相对目录 + 文件名
        let sourcedir = fileUrl.replace(sourceFile, '');
        console.log('sourcedir', sourcedir)
        // 源：相对目录
        let arr = sourcedir.split("/");
        arr.splice(arr.length-1, 1);
        let str = arr.join("/")
        // 目标： 绝对路径 + 相对目录
        let relativeTargetFile = targetFile + sourcedir;
        let relativeTargetDir = targetFile + str;   
        // console.log('str str str str', str)     
        await this.createDir(relativeTargetDir);
        // 源：绝对路径+相对目录+文件名    目标： 绝对路径+相对目录+文件名
        fs.copyFile(fileUrl, relativeTargetFile, (err) => {
          if (!err)
            console.log(targetFile);
        });
     }
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

      if (this.state.tags.indexOf(fileName) !== -1) {
        continue;
      }

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

  onSelect = (selectedKeys, info) => {
    this.setState({
      sourceFlieList: selectedKeys
    })
  };

  onCheck = (checkedKeys, info) => {
    console.log('checkedKeys', checkedKeys)
    this.setState({
      sourceFlieList: checkedKeys
    })
  };


  render() {
    const { tags, inputVisible, inputValue } = this.state;
    return (
      <div className="home-layout">
         <div style={{display: 'flex', marginTop: '10px'}}>
          <Input 
            value={this.state.sourceFile} 
            placeholder="源文件路径" 
            onChange={(e) => {
              this.setState({
                sourceFile: e.target.value.replace(/\\/g, '/')
              })
            }} />
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
          }}>检索当前文件夹</Button>
        </div>
        <div style={{display: 'flex', marginTop: '10px'}}>
          <Input
            value={this.state.targetFile} 
            placeholder="目标文件路径" 
            onChange={(e) => {
              this.setState({
                targetFile: e.target.value.replace(/\\/g, '/')
              })
            }} />
          <Button
            type="primary"
            onClick={() => {
              this.copeFileController()
          }}>开始复制</Button>
        </div>

        <div style={{margin: '10px'}}>
          选择要忽略的文件或者文件夹：
        {tags.map((tag, index) => {
          const isLongTag = tag.length > 20;
          const tagElem = (
            <Tag closable key={tag} onClose={() => this.handleClose(tag)}>
              {isLongTag ? `${tag.slice(0, 20)}...` : tag}
            </Tag>
          );
          return isLongTag ? (
            <Tooltip title={tag} key={tag}>
              {tagElem}
            </Tooltip>
          ) : (
            tagElem
          );
        })}
        {inputVisible && (
          <Input
            ref={this.saveInputRef}
            type="text"
            size="small"
            style={{ width: 78 }}
            value={inputValue}
            onChange={this.handleInputChange}
            onBlur={this.handleInputConfirm}
            onPressEnter={this.handleInputConfirm}
          />
        )}
        {!inputVisible && (
          <Tag className="site-tag-plus" onClick={this.showInput}>
            + 点击添加忽略文件
          </Tag>
        )}
        </div>

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

export default HomeView
