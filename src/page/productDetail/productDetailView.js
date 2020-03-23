import React from 'react';
import { Component } from 'react';
import { Carousel, WingBlank } from 'antd-mobile';
import './productDetailScss.scss';
import clothes1 from '../../common/imgs/clothes1.jpg';
class productDetailView extends Component {
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

  toBuy = () => {
    this.props.history.push('/product-order')
  }

  render() {
    const {titlelist} = this.state;
    return (
      <div className="product-detail">

        <div className="product-img">
          <img src={clothes1} className="product-header-img"/>
        </div>

        <div className="product-detail-footer-action">
          <div className="product-detail-footer-icon-button">
            <div>客服</div>
            <div>店铺</div>
            <div>收藏</div>
          </div>
          <div className="product-detail-footer-buy-button">
            <div className="add-shopcart" >加入购物车</div>
            <div className="quick-buy" onClick={() => this.toBuy()}>立即购买</div>
          </div>
        </div>
      </div>
    )
  }
}

export default productDetailView;
