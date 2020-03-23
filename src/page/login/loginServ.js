import axios from 'axios';

export default class {
  // 查询图片列表
  static login(data) {
    return axios.post('/login', data);
  }
}