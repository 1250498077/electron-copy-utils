// 状态管理方法
import { observable, action, useStrict, runInAction, autorun, configure } from 'mobx';
// 工具方法
import { isEmpty, isArray, cloneDeep, filter, merge, get, includes, has, pick, isUndefined, isNull, setWith } from 'lodash';
// 引入Serv
import Serv from './loginServ';
import routers from '../../router/router';


// 严格模式
configure({enforceActions: true})
/**
 * mod层 - 业务逻辑，数据逻辑应该存储于此
 */
class LoginStore {
  // 监视状态
  @observable state = {
    visible: false,
    imgList: [],
    data: {
        username: '',
        password: ''
    }
  };

  // 构造函数
  constructor(){

  };


  @action async setStoreState(data) {
    let copyState= { ...this.state };
    Object.keys(data).forEach((key) => {
      copyState= setWith(copyState, key, data[key]);
    });
    runInAction(() => {this.state = copyState;});
  }

  // 登录接口
  @action login = async (payload) => {
    let res = await Serv.login(this.state.data);
    localStorage.setItem("userInfo", JSON.stringify({
        token: res.token
    }));
    console.log('window.router', window.router)
    window.router.push('/home');
  }

}

// 将组件实例化，这意味着组件将不能从别处实例化
const loginStore = new LoginStore();
export default loginStore;