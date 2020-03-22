import React from 'react';
import { Component } from 'react';
import { Carousel, WingBlank } from 'antd-mobile';
import './good.scss';
import clothes1 from '../../common/imgs/clothes1.jpg';

class Good extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      data: ['1', '2', '3'],
      imgHeight: 176,
      product: {
        img: '',
        title: '夏季新款连衣裙时尚女装印花裹身裙显瘦v领七分袖沙滩裙长裙',
        rate: '4.5',
        sold: '111',
        tips: '不支持港澳台',
        tags: ['16减10', '32减20', '100减50']
    }
    }
  }

  componentDidMount() {
    
  }
  //准备：即将被重新渲染，状态未变化
  componentWillUpdate(nextProps, nextState) { }
  //完成：正在被重新渲染，状态已变化
  componentDidUpdate(prevProps, prevState) { }
  // 已加载组件，收到新属性时调用
  componentWillReceiveProps(nextProps) { }

  render() {
    const {product} = this.state;
    return (
      <div className="good-tags-detail" onClick={() => this.props.onClick()}>
        <div className="good-img-view">

            <img className="good-img" src={clothes1} />

            <div className="good-explain">
                {product.tips}
            </div>
            
        </div>

        <div className="good-desc">
            <div className="good-desc-title">
                {product.title}
            </div>
            <div className="good-desc-rate">
                <span className="good-desc-rate-number">{product.rate}分</span>
                <span className="good-desc-rate-desc">支持自取</span>
            </div>
            <div className="good-desc-tags">
                {
                    product.tags && product.tags.map((item) => {
                        return (
                            <div className="good-desc-tag" key={item}>
                                {item}
                            </div>
                        )
                    })
                }
            </div>
            <div className="good-desc-sell">
                月售{product.sold}件
            </div>
        </div>
        
      </div>
    )
  }
}

export default Good
