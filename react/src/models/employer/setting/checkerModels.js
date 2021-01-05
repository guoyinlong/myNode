/**
 * 作者：罗玉棋
 * 创建日期：2020-04-20
 * 邮箱：809590923@qq.com
 *文件说明：考核人变更页面
 */
import * as service from '../../../services/employer/empservices';
import message from '../../../components/commonApp/message';
import Cookie from 'js-cookie';
export default {
  namespace : 'checkerChange',
  state : {
    season:"",
    year:"",
    InfoList:[]
  },

  reducers : {

    saveinfo(state, { payload }) {
      return {
        ...state,
        ...payload
      };
    },
  },

  effects : {

    *backTime({},{call, put}){
      const timeList = yield call(service.seasonTime); // 查询季度时间
      if(timeList.RetCode=="1"){
        yield put({
          type: 'saveinfo',
          payload:{
            season:timeList.DataRows[0].examine_season,
            year:timeList.DataRows[0].examine_year,
          }
        })

        yield put({type:"projctInfo"})
      }
     },

      *projctInfo({}, {call, put,select}) {
        let {season,year}=yield select(state=>state.checkerChange)
        const {RetCode,DataRows,RetVal} = yield call(service.projectInfo,{"arg_season":1,"arg_year":year}); // 查询季度时间
        if(RetCode=="1"){
          yield put({
            type: 'saveinfo',
            payload:{
              InfoList:DataRows
            }
          })
        }else{
      message.warning(RetVal)
       }
      },

      *submitInfo({param}, {call,select}) {
        let {season,year}=yield select(state=>state.checkerChange)
        param["arg_year"]=year
        param["arg_season"]=season
        param["arg_uptuserid"]=Cookie.get('staff_id')
        param["arg_uptusername"]=Cookie.get('username')
        const {RetCode,RetVal} = yield call(service.checkerChange,param); // 查询季度时间
        if(RetCode=="1"){
          message.success("变更成功！")
        }else{
           message.warning(RetVal)
       }
      }


       },
  subscriptions : {
    setup({dispatch, history}) {
      return history.listen(({pathname,query}) => {
        if (pathname === '/humanApp/employer/checkerChange') {
          dispatch({type: 'backTime'});
        }
      });
    }
  }
};
