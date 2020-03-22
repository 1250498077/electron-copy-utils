import React from 'react';
import { Component } from 'react';
import { Carousel, WingBlank } from 'antd-mobile';
import Good from '../../component/goods/good';
import './classifyScss.scss';
class ClassifyView extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      data: ['1', '2', '3'],
      titlelist: [{
        id: 1,
        name: '影响数码'
      }, {
        id: 2,
        name: '衣服大概'
      }],
      imgHeight: 176,
    }
  }

  componentDidMount() {
    let product = [];
    const dd = new Array(25).fill('')
    dd.map((item, index) => {
      product.push({
        id: index,
        name: '衣服大概'
      })
    })
    this.setState({
      titlelist: product
    });
  }

  //准备：即将被重新渲染，状态未变化
  componentWillUpdate(nextProps, nextState) {}
  //完成：正在被重新渲染，状态已变化
  componentDidUpdate(prevProps, prevState) {}
  // 已加载组件，收到新属性时调用
  componentWillReceiveProps(nextProps) {}

  render() {
    const {titlelist} = this.state;
    return (
      
      <div className="classify-layout">
        <div className="classify-layout-left">
          <ul>
            {
              titlelist.length && titlelist.map((item) => {
                return <li key={item.id}>{item.name}</li>
              })
            }
            <li className="classify-layout-left-end" ></li>
          </ul>
        </div>
        <div className="classify-layout-right">

        </div>
      </div>
    )
  }
}

export default ClassifyView
