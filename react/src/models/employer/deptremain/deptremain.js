/**
 * 作者：张楠华
 * 日期：2017-08-20
 * 邮箱：zhangnh6@chinaunicom.cn
 * 文件说明：实现个人考核部门余数信息逻辑功能
 */
import * as usersService from '../../../services/employer/deptremain.js'
import * as hrService from '../../../services/hr/hrService.js';
// import message from '../../../components/commonApp/message'
import * as service from "../../../services/encouragement/services";
import Cookie from "js-cookie";
import * as usersService1 from "../../../services/employer/statistic";
import { TENANT_ID } from "../../../utils/config";
import { message } from 'antd'


// 传入任意个 数字字符串，返回准确的加法结果
function calcuateAdd() {
  let params = [...arguments]
  let paramsArr = params.map(item=>{
    let r = 0;
    let valueWithoutPointTemp = Number(item.toString().replace(".", ""));
    try {
      r = item.toString().split(".")[1].length;
    }
    catch (e) {
      r = 0;
    }
    return {
      value: item,  // 本身的值 string
      R: r,         // 小数点后的位数 int
      valueWithoutPoint: valueWithoutPointTemp, // 去掉小数点的数值 int
    }
  })

  let maxR = 0 ;   // 最大的r
  paramsArr.forEach(item=>{
    if(item.R > maxR){
      maxR = item.R 
    }
  })

  // 将所有数值扩大到 maxR 个 10倍，并求和
  let endValueBymaxR = 0
  paramsArr.forEach(item=>{
    endValueBymaxR = endValueBymaxR + item.valueWithoutPoint * Math.pow(10,maxR - item.R)
  })

  return endValueBymaxR/Math.pow(10,maxR)
}

//给数组类型增加一个calcuateByString方法，使用时直接用 .add 即可完成计算。 
Array.prototype.calcuateByString = function () {
  return calcuateAdd.apply(this,arguments);
};


export default {
  namespace: 'deptremain',
  state: {
    list: [],
    arg_year: new Date().getFullYear().toString(),
    arg_season: Math.ceil((new Date().getMonth() + 1) / 3).toString(),
    arg_proj_name: '',
    arg_tag: '',
    arg_type: '',
    focusDept:[],
    bpflag:false
  },

  reducers: {

    save(state, action) {
      return { ...state, ...action.payload };
    },
  },

  effects: {
    * init({ }, { call, select, put }) {
      yield put({
        type: 'save',
        payload: {
          arg_year: new Date().getFullYear().toString(),
          arg_season: Math.ceil((new Date().getMonth() + 1) / 3).toString(),
          arg_dept_name: '',
          arg_tag: '',
          arg_type: '',
          arg_page_index: '1',
          arg_page_size: '10',
          listData: [],
          page_total: '10',
          historyData: [],
        }
      })


      yield put({
        type: 'queryList',
      })
    },

    *focusDept({},{call,put}){
      let focusDept=[];
        //查职位
        const basicInfoData = yield call(hrService.selfinfoquery);
        if (basicInfoData.RetCode === '1'&&basicInfoData.DataRows&&basicInfoData.DataRows.length!=0) {
           //判断bp
           if(basicInfoData.DataRows[0].post_name.indexOf("BP")>=0){

            let result= yield call(service.BPinfo, {
              state:3,
              flag:0,
              upt:Cookie.get('userid'),
              staff_id:Cookie.get('userid')
             });
              if(result.RetCode=='1'&&result.DataRows&&result.DataRows.length!=0){
               let deptarry=result.DataRows.map(item=>{
                  let obj={"principal_deptid":item.principal_deptid,"principal_deptname":item.principal_deptname}
                   return obj
                })
                let obj = {}
                let newArr = []
                newArr = deptarry.reduce((item, next) => {
                  obj[next.principal_deptname] ? ' ' : obj[next.principal_deptname] = true && item.push(next)
                  return item 
                }, [])
                focusDept=newArr
              }else{
                message.warning("未配置归口部门")
              }
  
            yield put({
              type: 'save',
              payload: {
                focusDept,
                bpflag:true
              }
            })

           }
          }
          yield put({type: 'init'})
    },



    // 查列表
    * queryList({ }, { call, select, put }) {
      let {
        arg_year, arg_season, arg_dept_name, arg_type, arg_tag, arg_page_index, arg_page_size,bpflag,focusDept
      } = yield select(state => state.deptremain)

      let postData = {
        arg_year,
        arg_season,
        arg_dept_name: arg_dept_name.trim(),
        arg_page_index,
        arg_page_size,
        arg_tag,
        arg_type,
        arg_ou:Cookie.get('OU')
      }

      if(bpflag){
        postData["arg_dept_name"]=(arg_dept_name.trim())?(arg_dept_name.trim()):focusDept.length!=0?focusDept[0].principal_deptname:""
      }

      let response = yield call(usersService.deptremain, postData)

      if (response.RetCode === '1') {
        let listDataTemp = response.DataRows;
        listDataTemp.forEach(item => {
          item.key = item.id;
        })
        yield put({
          type: 'save',
          payload: {
            listData: listDataTemp,
            page_total: response.TotalCount,
          }
        })
      }
    },

    // 将所有的值赋值为初始状态，然后走查询服务
    * pageChange({ payload }, { call, select, put }) {
      yield put({
        type: 'save',
        payload: {
          arg_page_index: payload.page,
        }
      })


      yield put({
        type: 'queryList',
      })
    },


    // 输入框修改
    * inputChange({ payload }, { call, put, select }) {
      yield put({
        type: 'save',
        payload: {
          [payload.type]: payload.value
        }
      });
    },

    // 查询
    * search({ }, { call, select, put }) {
      yield put({
        type: 'save',
        payload: {
          arg_page_index: '1',
        }
      })

      yield put({
        type: 'queryList',
      })
    },

    // 点击清空按钮
    * clear({ }, { call, put, select }) {
      yield put({
        type: 'init',
      });
    },

    // 点击修改按钮 修改editing状态，点击取消修改状态false
    * updateCell({ payload }, { call, put, select }) {
      let { listData } = yield select(state => state.deptremain);

      let listitem = listData[listData.findIndex(item => item.key === payload.record.key)];
      listitem.editing = payload.editing;

      yield put({
        type: 'save',
        payload: {
          listData: [...listData],
        },
      });
    },

    * cellOK({ payload }, { call, put, select }) {
      // 点击确认直接走修改服务，然后刷新
      let itemNewIndex = payload.listDataNew.findIndex(item => item.key === payload.record.key);
      let postDataTemp = payload.listDataNew[itemNewIndex]
      let { id, a_remainder, b_remainder, c_remainder, d_remainder, e_remainder, } = postDataTemp;


      if (a_remainder && b_remainder && c_remainder && d_remainder && e_remainder) {
        // let reg = /^(-(?=0\.))?0(\.([0-9]{1,2}))?$/
        // if(reg.test(a_remainder) && reg.test(b_remainder) && reg.test(c_remainder) &&
        //   reg.test(d_remainder) && reg.test(e_remainder)){

        // 各项和是0
        let sumRemainder = [].calcuateByString(a_remainder,b_remainder,c_remainder,d_remainder,e_remainder)
  

        if (sumRemainder === 0) {
          let postData = {
            arg_id: id,
            // arg_year: year,
            // arg_season: season,
            arg_a_remainder: a_remainder,
            arg_b_remainder: b_remainder,
            arg_c_remainder: c_remainder,
            arg_d_remainder: d_remainder,
            arg_e_remainder: e_remainder,
            arg_update_userid: Cookie.get('staff_id'),
          }
          let response = yield call(usersService.projRankUpdateS, postData)

          if (response.RetCode === '1') {
            message.info('修改成功！')
            yield put({
              type: 'queryList',
            })

            payload.cleanlistDataNew(payload.record);
          }
        } else {
          message.info('各项余数和必须等于0！当前为'+ sumRemainder)
        }

        // }else{
        //   message.info('各项余数必须在-1到1之间，最多两位小数！')
        // }

      } else {
        message.info('请输入修改后余数！')
      }
    },

    // 部门余数新增
    * addDeptReamin({ payload }, { call, put, select }) {
      const { addCancel, ...partData } = payload
      const postData = { ...partData, arg_update_userid: localStorage.userid }
      const data = yield call(service.addDeptRemainS, postData);
      if (data.RetCode === '1') {
        message.info('添加成功！')
        addCancel();
      } else {
        message.info(data.RetVal || '添加失败！')
      }

    },

    // 获取部门列表
    * getDeptList({ payload }, { call, put, select }) {
      const postData = {
        arg_ou: payload.value,
        arg_tenantid: TENANT_ID,
      };
      const data = yield call(usersService1.searchDeptList, postData);
      if (data.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            add_OU: payload.value,
            deptList: data.DataRows
          }

        });
      }
    },

    // 获取组织单元列表
    * getOuList({ payload }, { call, put, select }) {
      const postData = {
        arg_tenantid: TENANT_ID,
      };
      const data = yield call(usersService1.initOuSearch, postData);
      if (data.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            ouList: data.DataRows
          }
        });
      }
    },


    * getHistoryData({ payload }, { call, put, select }) {
      let postData = {
        arg_dept_name: payload.record.dept_name,
        arg_type: payload.record.type,
        arg_year: payload.record.year,
        arg_season: payload.record.season,
      }

      let response = yield call(service.remainderHistoryS, postData)

      if (response.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            historyData: response.DataRows
          }
        })
      }
    },

    // 部门余数退回 未完成
    * rejectData({ payload }, { call, put, select }) {
      let postData = {
        arg_year: payload.record.year,
        arg_season: payload.record.season,
        arg_dept_name: payload.record.dept_name,
        arg_type: payload.record.type,
      }

      let response = yield call(service.rejectDataS, postData)

      if (response.RetCode === '1') {
        message.info('退回操作完成！')
        yield put({
          type: 'queryList',
        })
      } else {
        message.info(response.RetVal || '退回操作失败！')
      }
    },

    * outPut({ payload }, { call, put, select }) {
      let {
        arg_year, arg_season, arg_detp_name, arg_tag, arg_type
      } = yield select(state => state.deptremain)

      let downloadURL = `/microservice/allexamine/examine/deptrankexport?arg_year=${arg_year}&arg_season=${arg_season}&arg_detp_name=${arg_detp_name}&arg_tag=${arg_tag}&arg_type=${arg_type}`

      window.open(downloadURL)
    },


    * handleCancel({ payload }, { call, put, select }) {
      yield put({
        type: 'save',
        payload: {
          historyData: []
        }
      })
    },
  },


  /**
   * 作者：张楠华
   * 创建日期：2017-08-21
   * 功能：监听路径
   */
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/humanApp/employer/deptremain') {
          dispatch({ type: 'focusDept' });
        }
      });
    },
  },
};
