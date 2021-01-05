/**
 * 作者：窦阳春
 * 日期：2019-9-4
 * 邮箱：douyc@itnova.com.cn
 * 功能：个人查询
 */
import Cookie from 'js-cookie';
import { message } from "antd";
import * as Services from '../../../services/sealManage/sealApply';
import * as ServicesQuery from '../../../services/sealManage/sealQuery';
// 获取当前时间设置为默认显示的时间
let getCurrentTime = (d) => {
  let year = d.getFullYear();
  let mon = d.getMonth() + 1;
  let date = d.getDate();
  mon = mon < 10 ? '0' + mon : mon
  date = date < 10 ? '0' + date : date 
  let currentTime = year + '-' + mon + '-' + date 
  return currentTime
}
// 判断开始或结束时间为' 传入空 查询全部数据
function judgeTimePeriod(start, end) {
  if(start == '' || end == '') {
    return ''
  }else {
    return `${start ? start : getCurrentTime(new Date())},${end ? end : getCurrentTime(new Date())}`
  }
}
// 当前时间减去两天
// function getStartTime() {
//   var dateTime=new Date();
//   dateTime=dateTime.setDate(dateTime.getDate()-2);
//   dateTime=new Date(dateTime)
//   return getCurrentTime(dateTime)
// }
// 判断nameId是不是空数组，是空数组返回true 否返回false
function isEmpty(nameId) {
  return (Array.isArray(nameId) && nameId.length === 0)
    || (Object.prototype.isPrototypeOf(nameId) && Object.keys(nameId).length === 0);
}
// 多选框处理
function mutiply(value) {
  let IdArr = [];
  value.map((v) => {
    let id = v.split("#")[0];
    IdArr.push(id)
  })
  function unique(arr) {
    return Array.from(new Set(arr))
  }
  let IdUnique = unique(IdArr) // id去重
  IdUnique = IdUnique.length>0 ? IdUnique : ['0']
  return IdUnique
}
export default {
  namespace: 'sealPersonalQuery',
  loading: false,
  state: {
    sealState: [],
    stateData: [], // dataRows数据
    typeData: [], //typeDataRows数据
    nameData: [],
    nameDataAllList: [], // 请求回来的全部二级用印名称
    queryDate: null,
    startTime: '',//开始时间
    endTime: '',  //结束时间
    queryState: '0', // 查询状态默认值
    queryType: ['全部'], // 印章证照类别默认值
    queryName: ['全部'], //印章证照名称默认值
    sealPersonalList: [],
    queryTypeId: ['0'], //类型对应的id保存
    queryNameId: ['0'], //名字对应的id保存
    tabKey: "1",
    pageCurrent: 1,
    pageSize: 10,
    totalData: 0
  },

  reducers: { // 刷新数据
    save(state, action) {
      return { ...state,
        ...action.payload
      };
    },
  },

  effects: {
    // 清空查询条件
    *emptyQuery({},{put, select}) {
      const {nameDataAllList} = yield select(state => state.sealPersonalQuery)
      yield put({
        type: 'save',
        payload: {
          queryState: '0',
          queryType: ['全部'],
          queryTypeId: ['0'],
          queryName: ['全部'],
          queryNameId: ['0'],
          queryDate:null,
          startTime: '',
          endTime: '',
          nameData: nameDataAllList,
          pageCurrent: 1,
        }
      })
      yield put({type: "personQuery"}) // 清空之后查询
    },
    // 查询功能
    *personQuery({clickQueryPageCurrent}, {call, put, select}) {
      const {startTime, endTime, queryState, queryTypeId, queryNameId, pageCurrent, pageSize} = yield select(state => state.sealPersonalQuery)
      const queryStateList = { // 状态改为写死状态
        "RetCode": "0",
        "RetVal": "1",
        "DataRows":[
          {
            "0": "全部",
            "1":"待审核",
            "2":"审核通过",
            "3":"审核退回",
            "4":"待领取（使用）",
            "5":"待归还",
            "6":"已完成",
            "7":"草稿",
            "8":"无效（终止、作废）"
          }
        ]
      };
      let postData = {
        ouid: Cookie.get('OUID'),
        seal_uuid: '0'
      }
      let queryNames = yield call(ServicesQuery.sealSecondCategoryQuery, postData)
      if(queryNames.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            nameData: JSON.parse(JSON.stringify(queryNames.DataRows)),
            nameDataAllList: queryNames.DataRows
          }
        })
      }
      if (queryStateList.RetCode) {
        yield put({
          type: 'save',
          payload: {
            stateData: JSON.parse(JSON.stringify(queryStateList.DataRows)), // 状态
          }
        })
      };
      // let timePeroid = `${startTime ? startTime : getCurrentTime(new Date())}/${endTime ? endTime : getCurrentTime(new Date())}`
      let timePeroid = judgeTimePeriod(startTime, endTime)
      let page_current = 1
      page_current = clickQueryPageCurrent ? clickQueryPageCurrent : pageCurrent
      let data = {
        arg_create_user_id: Cookie.get('userid'),
        arg_date_peroid: timePeroid,
        arg_state: queryState,
        arg_seal_uuid: queryTypeId.join(),
        arg_seal_details_id: queryNameId.join(),
        arg_page_current: parseFloat(page_current),
        arg_page_size: parseFloat(pageSize)
      }
      if(queryState == '全部') {data.state = '0'}
      const {DataRows, RetCode, RowCount} = yield call(ServicesQuery.sealPersonalSearch, data);
      if(RetCode == '1') {
        DataRows.map((v, i) => {
          v.list_state = '0';
          v.key = i;
          v.searchType = '2'
          v.index = i + 1;
          if(v.create_date.lastIndexOf('.')>-1) {
            v.create_date = v.create_date.substr(0, v.create_date.lastIndexOf('.'))
          }
        })
        yield put({
          type: 'save',
          payload: {
            sealPersonalList: JSON.parse(JSON.stringify(DataRows)),
            totalData: parseInt(RowCount),
            pageCurrent: parseInt(page_current)
          }
        })
      }else {
        message.error('查询失败');
      }
    },
    *savePage({page}, {put}) { 
      yield put({type: 'save', payload: {pageCurrent: page}})
      yield put({type: "personQuery"}) 
    },
    // 确认删除功能
    *delSealApply({value}, {call, put, select}) {
      const {sealPersonalList} = yield select(state => state.sealPersonalQuery)
      let postData = {
        form_uuid: value.form_uuid,
        stateCode: value.stateCode,
        create_user_id: Cookie.get('userid'),
        create_user_name: Cookie.get('username')
      }
      let data = yield call(Services.sealPersonalDel, postData)
        if(data.RetCode == '1') {
          let List = sealPersonalList.filter((v, i) => {
            return v.key != value.key
          })
          yield put({
            type: 'save',
            payload: {
              sealPersonalList: JSON.parse(JSON.stringify(List))
            }
          })
          message.success("删除成功")
        } else{
          message.error("删除失败")
        }
    },
    // 作废
    *formRecall({value}, {call, put}) {
      let postData = {
        arg_form_uuid : value.form_uuid,
        arg_form_check_state : value.stateCode,
        arg_user_id : Cookie.get('userid'),
        arg_user_name: Cookie.get('username')
      }
      let data = yield call(ServicesQuery.sealFormRecall, postData)
      if(data.RetCode === '1') {
        message.success("申请单作废成功")
        yield put({type: "personQuery"}) // 作废之后走查询
      }
    },
    // 保存输入时间
    *onPickerChange({value}, {put}) {
      yield put({
        type: 'save',
        payload: {
          startTime: value[0],
          endTime: value[1]
        }
      })
    },
    // 当点击的状态改变的时候 获取状态并改变状态值
    *onStateChange({value}, {put}) {
      yield put({
        type:'save',
        payload: {
          queryState:value,
        }
      })
    },
    // 请求查询印章证照类别
    *selectType({}, {call, put}) {
      let postData = {
        ouid: Cookie.get('OUID'),
        // userid : Cookie.get('userid')
      }
      let queryTypes = yield call(ServicesQuery.sealFirstCategoryQuery, postData)
      if(queryTypes.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            typeData: JSON.parse(JSON.stringify(queryTypes.DataRows))
          }
        })
      }
    },
    // 请求查询印章证照名称
    *selectName({}, {call, put, select}) {
      const { queryTypeId } = yield select (state => state.sealPersonalQuery)
      let postData = {
        ouid: Cookie.get('OUID'),
        seal_uuid: queryTypeId.join()
      }
      yield put({
        type: 'save',
        payload: {
          queryName: []
        }
      })
      let queryNames = yield call(ServicesQuery.sealSecondCategoryQuery, postData)
      if(queryNames.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            nameData: JSON.parse(JSON.stringify(queryNames.DataRows))
          }
        })
      }
    },
    // 获取印章证照类别
    *onTypeChange({value}, {put}) {
      value = value.filter((v) => {
        return v!= "全部"
      })
      let IdUnique
      if((value.includes("0#全部")) && !(value.includes("0#全部") && value.length==1)) { 
        // IdUnique = ['0']
        value = value.filter((v) => { 
          return v == "0#全部"
        })
      }
      IdUnique = mutiply(value)
      yield put({
        type:'save',
        payload: {
          queryType: JSON.parse(JSON.stringify(value)),
          queryTypeId: JSON.parse(JSON.stringify(IdUnique))
        }
      })
      yield put({type: 'selectName'})
    },
    // 保存印章证照名称
    *onNameChange({value}, {put}) {
      value = value.filter((v) => {
        return v!= "全部"
      })
      let IdUnique
      if((value.includes("0#全部")) && !(value.includes("0#全部") && value.length==1)) { // 含有全部并且此时有其他选项时
        // IdUnique = ['0']
        value = value.filter((v) => { // 点击全部其他所有的都清空只显示全部
          return v == "0#全部"
        })
      }
      IdUnique = mutiply(value)
      yield put({
        type: 'save',
        payload: {
          queryNameId: JSON.parse(JSON.stringify(IdUnique)),
          queryName: JSON.parse(JSON.stringify(value))
        }
      })
    },
    // 终止申请单
    *stopApply({record}, {call, put, select}) {
      const {startTime, endTime, queryState, queryTypeId, queryNameId} = yield select(state => state.sealPersonalQuery)
      let postData = {
        form_uuid: record.form_uuid,
        state: record.stateCode,
        create_user_id: Cookie.get('userid'),
        create_user_name: Cookie.get('username')
      }
      const data = yield call(Services.sealRequesitionStop,postData);
      let timePeroid = judgeTimePeriod(startTime, endTime)
      if(data.RetCode === '1') {
        message.success("申请单已终止")
        yield put({ // 终止服务后重新走一遍查询
          type: 'personQuery',
          data: {
            arg_create_user_id: Cookie.get('userid'),
            arg_date_peroid: timePeroid,
            arg_state: queryState,
            arg_seal_uuid: queryTypeId.join(),
            arg_seal_details_id: queryNameId.join(),
            arg_page_current: '1',
            arg_page_size: '10'
          }
        })
      }
    },
  },

  subscriptions: {
    setup({dispatch, history}) { 
      return history.listen(({pathname, query}) => {
        if (pathname === '/adminApp/sealManage/sealPersonalQuery') { //此处监听的是连接的地址
          if (Object.keys(query).length === 0) {
            dispatch({
              type: 'emptyQuery', // 匹配到路由，初始化页面
            });
          }
          dispatch({ 
            type: 'personQuery', // 匹配到路由，初始化页面
          });
        }
      });
    },
  },
};
