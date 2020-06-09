import React from 'react';
import { Component } from 'react';
import _ from 'lodash';
import './layoutScss.scss'
import { Input, Button, TreeSelect, Tree  } from 'antd';
import { HashRouter as Router, withRouter, Switch, Route, Redirect, Link } from 'react-router-dom';
import Copy from '../copy'
import Proxy from '../proxy'
import Drap from '../drap'

class LayoutView extends Component {

  constructor(props, context) {
    super(props, context)
    this.state = {

    }
  }
    
  componentDidMount = () => {

  }

  // 初始状态或状态变化会触发render
  render() {
    return (
      <div className="layout-header">
        <Router>
          <div className="button-container">
            <Button type="primary" className="layout-router-button" >
              <Link to="/copy">复制工具</Link>
            </Button>
            <Button type="primary" className="layout-router-button" >
              <Link to="/proxy">代理服务器</Link>
            </Button>
            <Button type="primary" className="layout-router-button" >
              <Link to="/drap">拖拽排序实现</Link>
            </Button>
          </div>

          <Route path="/copy" exact component={Copy}></Route>
          <Route path="/proxy" exact component={Proxy}></Route>
          <Route path="/drap" exact component={Drap}></Route>

        </Router>
      </div>
    )
  }
}

export default LayoutView
