/**
  * 作者： 卢美娟
  * 创建日期： 2018-05-24
  * 邮箱: lumj14@chinaunicom.cn
  * 功能： 会议统计页面的逻辑处理层
  */
import * as usersService from '../../../services/meetSystem/meetSystem.js'
import {getToday} from '../../../components/meetSystem/meetConst.js'
import moment from 'moment';  //时间
import Cookie from 'js-cookie';
import {message} from 'antd'
const dateFormat = 'YYYY-MM-DD';
export default {
  namespace: 'statistical',
  state: {

  },

  reducers: {

  },

  effects: {

  },
  subscriptions: {
    setup({ dispatch, history }) {

      return history.listen(({ pathname, query }) => {

      });


    },
  },
};
