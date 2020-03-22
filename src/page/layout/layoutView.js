import React from 'react';
import { Component } from 'react';
// import router from '../../router/router'
import './layoutScss.scss'
import { Route, Switch, Link, withRouter } from 'react-router-dom';
import { Upload, message, Button } from 'antd';
const fs = window.require('fs').promises
const join = window.require('path').join;


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

  componentDidMount = () => {
    // const root = fs.readdirSync('/')
    console.log(fs)
    let path = 'C:\\Users\\mwh\\Desktop\\麦文豪的文件夹\\12306Bypass_1.13.19';
    let files = this.findSync(path);
    console.log('files', files);
  }

  findSync(startPath) {
    let result = [];
    function finder(path) {
      let files = fs.readdirSync(path);
      files.forEach((val, index) => {
        let fPath = join(path, val);
        let stats = fs.statSync(fPath);
        if (stats.isDirectory()) finder(fPath);
        if (stats.isFile()) result.push(fPath);
      });

    }
    finder(startPath);
    return result;
  }

  openFolder = () => {
    this.uploadInput.click()
  }

  onChange = (e) => {
    console.log('filefilefile', e.target.files)
    if (e.target.files[0]) {
      // 对应的方法在下面 取第0个
      this.upload(e.target.files[0]);
    }
  };

  upload = (file) => {
    if (!file) {
      console.log('请选择文件');
      return;
    }

  };

  // 初始状态或状态变化会触发render
  render() {

    return (
      <div className="layout-header">
        <div>
          <Button onClick={() => this.openFolder()}>选择文件夹</Button>
          <input
            accept={true}
            type="file"
            webkitdirectory="webkitdirectory"
            multiple
            directory="directory"
            ref={
              (uploadInput) => { this.uploadInput = uploadInput; }
            }
            onChange={this.onChange}
            style={{ display: 'none' }}
          />
        </div>
      </div>
    )
  }
}

export default withRouter(LayoutView)
