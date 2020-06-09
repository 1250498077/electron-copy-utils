import React from 'react';
import { Component } from 'react';
import _ from 'lodash';
import './homeScss.scss';

class HomeView extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      list: [1, 2, 3, 4, 5, 6, 7, 8, 9, 3, 4, 5, 6, 7, 8, 9, 3, 4, 5, 6, 7, 8, 9]
    }
    this.source = [];
    this.container = null;
  }

  componentDidMount = () => {
    this.init();
  }

  init = () => {
    // trans.style.transform = "translate3d(0, "+k +", 0)";

    this.source.map((drag, index) => {
      drag.onmousedown = (event) => {

        var currentEvent = event || window.event;  //兼容IE浏览器
        let clickX = event.x;
        let clickY = event.y;
        let diffY = 0;
        let diffX = 0;
        // 起始下标
        let originIndex = index;
        // 结束下标
        let currentIndex = index;
        // console.log('currentIndexcurrentIndex', currentIndex)
        let currentDom = currentEvent.target;

        currentDom.style.zIndex = 5000;
        currentDom.style.position = 'fixed';
        currentDom.style.width = currentDom.parentNode.getBoundingClientRect().width + 'px';
        currentDom.style.top = 1 + currentDom.getBoundingClientRect().y + currentDom.parentNode.getBoundingClientRect().y + 'px'
        currentDom.classList.remove("box11");

        document.getElementsByTagName("*").item(0).style.cursor = "pointer"

        this.mengban.style.zIndex = 4000

        let timer = null;
        // 滚动条下拉的距离
        let distance = this.container.scrollTop;
        let scrollY = this.container.scrollTop;

        // 容器顶部到浏览器顶部的距离（屏幕）
        // this.container.getBoundingClientRect().y

        // 监听全局的dom移动事件
        document.onmousemove = (event) => {

          var event = event || window.event;  //兼容IE浏览器

          // 原始位置和当前移动位置的差值
          diffY = event.y - clickY;
          // console.log('diffY', diffY)
          diffX = event.x - clickX;
          // console.log(' currentIndex',  currentIndex*50 - )
         

          currentDom.style.transform = `translate3d(${diffX}px, ${diffY}px, 0)`;

          // 要把这个if代码放到上一句代码的后面，这样才能让当前移动元素发生跳转
          // console.log('event.pageY', event.pageY)
          // console.log(' this.container.getBoundingClientRect().y',  this.container.getBoundingClientRect())
          if ((currentIndex*50 - this.container.scrollTop) > 300) {
            // console.log('下拉', timer)
            if (!timer) {
              // console.log('timer', timer)
              // clearInterval(timer)
              timer = setInterval(() => {
                distance = distance + 2;
                this.container.scrollTo(0, distance);
                // 移动元素的距离 + 滚动条顶部距离
                scrollY = diffY + this.container.scrollTop;

                this.source.map((other, otherIndex) => {
                  if (otherIndex === index) { return false }
                  if (scrollY > 0) {
                    currentIndex = parseInt((scrollY + 25) / 50) + index;
                    if (originIndex < otherIndex && currentIndex >= otherIndex) {
                      other.style.transform = "translate3d(0, -50px, 0)";
                    } else {
                      other.style.transform = "translate3d(0, 0, 0)";
                    }
                  } else {
                    currentIndex = parseInt((scrollY - 25) / 50) + index;
                    if (originIndex > otherIndex && currentIndex <= otherIndex) {
                      other.style.transform = "translate3d(0, 50px, 0)";
                    } else {
                      other.style.transform = "translate3d(0, 0, 0)";
                    }
                  }
                })

              }, 10)
            }
            return false
          } else {
            scrollY = diffY + this.container.scrollTop;
            clearInterval(timer)
            timer=null;
            this.source.map((other, otherIndex) => {
              console.log('currentIndex', currentIndex)
              if (otherIndex === index) { return false }
              if (scrollY > 0) {
                currentIndex = parseInt((scrollY + 25) / 50) + index;
                if (originIndex < otherIndex && currentIndex >= otherIndex) {
                  other.style.transform = "translate3d(0, -50px, 0)";
                } else {
                  other.style.transform = "translate3d(0, 0, 0)";
                }
              } else {
                currentIndex = parseInt((scrollY - 25) / 50) + index;
                if (originIndex > otherIndex && currentIndex <= otherIndex) {
                  other.style.transform = "translate3d(0, 50px, 0)";
                } else {
                  other.style.transform = "translate3d(0, 0, 0)";
                }
              }
            }, 100)
          }


        }
        document.onmouseup = (event) => {
          this.mengban.style.zIndex = 2000;
          clearInterval(timer);
          timer=null;
          // 提高移动元素的层级，遮盖其他元素
          currentDom.style.zIndex = 3000;
          currentDom.style.position = 'absolute';

          if (currentIndex < 0) {
            currentIndex = 0;
          }

          currentDom.style.top = index * 50 + 'px';
          currentDom.style.transform = `translate3d(0, ${(currentIndex - originIndex) * 50}px, 0)`;
          currentDom.style.width = '100%';
          document.onmousemove = null;
          document.onmouseup = null;

          // 回显的时候去除动画效果
          this.source.map((other, otherIndex) => {
            other.style = null;
            other.style.top = 50 * otherIndex + 'px';
            other.classList.remove("box11");
          })

          // 异步恢复动画
          setTimeout(() => {
            this.source.map((other, otherIndex) => {
              other.classList.add("box11");
            })
          }, 0)

          const { list } = this.state;
          // 删除原来位置的内容，在目标区域插入正确的内容
          let temp = list[originIndex];
          list.splice(originIndex, 1);
          list.splice(currentIndex, 0, temp);

          this.setState({ list: JSON.parse(JSON.stringify(list)) });

        }
      }
    });


  }

  render() {
    const { list } = this.state;
    this.source = [];

    return (
      <div className="home-layout">
        <div
          ref={(ref) => { this.mengban = ref }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            zIndex: 3000,
          }}
        />
        <div className="box2" id="target" ref={(ref) => { this.container = ref }}>
          <div ref={(ref) => { this.containerRef = ref }}>
            {
              list.map((item, index) => {
                return (
                  <div
                    style={{ top: 50 * index }}
                    key={index}
                    className="box1 box11"
                    draggable="false"
                    ref={(ref) => {
                      if (ref) {
                        this.source.push(ref)
                      }
                    }}
                  >
                    {item}===={index}
                  </div>
                )
              })
            }
          </div>
        </div>

      </div>
    )
  }
}

export default HomeView
