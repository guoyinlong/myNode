/**
 * 文件说明：项目经理正态分布操作
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2017-08-20
 */
import * as service from '../../../services/employer/empservices';
import config  from '../../../utils/config';
import message from '../../../components/commonApp/message'
import Cookie from 'js-cookie';
import moment from 'moment';
import { routerRedux } from 'dva/router';
import {Modal} from 'antd'
import Style from '../../../components/employer/employer.less'
// let year = new Date().getFullYear().toString();
// let season = Math.floor((new Date().getMonth() + 2) / 3).toString();
// if(season === '0'){
//   season = '4';
//   year = (new Date().getFullYear() - 1).toString()
// }

const  openNotification = () => {
  Modal.info({
    title: '温馨提示',
    content: (
    "正态分布结果新增导入功能，可导入excel并提交考核结果"
    ),
    okType:"link",
    className:Style.black
  });
};

import {splitEnter} from '../../../utils/func'
export default {
  namespace : 'pmdist',
  state : {
    display:false,
    projList:[],
    year:"",
    season:""
  },

  reducers : {
    /**
     * 功能：更新状态树
     * 作者：陈莲
     * 邮箱：chenl192@chinaunicom.cn
     * 创建日期：2017-08-20
     * @param state 初始状态
     * @param projList 正态分布数据
     */
    saveRes(state, {projList}){
      return {
        ...state,
        projList
      };
    },
    saveinfo(state, { payload }) {
      return {
        ...state,
        ...payload
      };
    },

  },

  effects : {

    *backTime({query},{call, put}){
      const timeList = yield call(service.seasonTime); // 查询季度时间
      if(timeList.RetCode=="1"){
        yield put({
          type: 'saveinfo',
          payload:{
            season:timeList.DataRows[0].examine_season,
            year:timeList.DataRows[0].examine_year,
          }
        })

        yield put({type:"pmEmpScoresSearch",query })
      }
     },

    /**
     * 功能：初始化项目成员考核结果及余数信息
     * 作者：陈莲
     * 邮箱：chenl192@chinaunicom.cn
     * 创建日期：2017-08-20
     */
    *pmEmpScoresSearch({}, {call, put,select}) {
      let{season,year}=yield select(state=>state.pmdist)
      const scoreRes = yield call(service.pmEmpScoresSearch,
        {
          'arg_mgr_id':Cookie.get('userid'),
          'arg_year':year,
          'arg_season':season,
          "arg_tenantid":config.TENANT_ID
        });

      if(scoreRes.RetCode==='1' && scoreRes.DataRows){
        let tips = '';
        let score_has_null = false;
        for(let i = 0; i < scoreRes.DataRows.length;i++){
          if(!scoreRes.DataRows[i].scores || !scoreRes.DataRows[i].scores.length){
            tips += scoreRes.DataRows[i].proj_name + '的项目成员未填报考核指标!<br />';
          }
          if(!scoreRes.DataRows[i].rank || !scoreRes.DataRows[i].rank[0]){
            tips += scoreRes.DataRows[i].proj_name + '未配合考核评级比例及余数信息!'+'<br />';
          }

          for(var j = 0;scoreRes.DataRows[i].scores && j < scoreRes.DataRows[i].scores.length;j++) {
            if (scoreRes.DataRows[i].scores[j].score == undefined || scoreRes.DataRows[i].scores[j].score == '') {
              score_has_null = true;
              scoreRes.DataRows[i].score_has_null = true;
              break
            }
          }
          if(score_has_null){
            scoreRes.DataRows[i]["score_has_null"] = true;
            //data[i]["score_has_null"] = true;
            tips += scoreRes.DataRows[i].proj_name + '尚有员工没有考核成绩，暂不能做正态分布!'+'<br />';
          }
        }
        if(tips){
          message.warning(splitEnter(tips),10)
        }
        yield put({
          type: 'saveRes',
          projList: scoreRes.DataRows,
          score_has_null
        });
      }else{
        message.error("未查询到该项目经理负责项目信息！");
      }
    },

    /**
     * 功能：提交正态分布结果
     * 作者：陈莲
     * 邮箱：chenl192@chinaunicom.cn
     * 创建日期：2017-08-20
     * @param proj_id 项目id
     * @param rankList 员工正态分布结果
     * @param ratio 下季度评级余数信息
     */
    *pmEmpDistSubmit({proj_id,rankList,ratio}, {call, put,select}) {
      let{season,year}=yield select(state=>state.pmdist)
      const subRes = yield call(service.pmEmpDistSubmit,
        {
          'arg_checker_id':Cookie.get('userid'),
          'arg_checker_name':Cookie.get('username'),
          'arg_year':year,
          'arg_season':season,
          "rank":JSON.stringify(rankList),
          "ratio":JSON.stringify(ratio),
          "arg_proj_id":proj_id,
        });
      if(subRes.RetCode==='1'){
        message.success("提交成功！")
        yield put({
          type: 'pmEmpScoresSearch'
        });
      }
    },

  //文件导入
  *fileImport({param,number},{call,put,select}){
    let {projList}=yield select((state)=>state.pmdist)
    let data = yield call(service.deptImport,param);
    if(data.RetCode === '1'){
      projList[number].scores= data.DataRows[number].scores
      yield put({
        type: 'save',
        payload:{
          projList: [...projList],
        }
      });
    }
   },

      //原文件导出 
    //   * outPut({postData}) {
    //    let{arg_mdzz,arg_mgr_id,arg_tenantid,arg_year,arg_season,proj_id,arg_ranks}=postData

    //   let downloadURL= `/microservice/allexamine/examine/informationExport?
    //   arg_mdzz=${arg_mdzz}&arg_mgr_id=${arg_mgr_id}&arg_tenantid=${arg_tenantid}
    //   &arg_year=${arg_year}&arg_season=${arg_season}&proj_id=${proj_id}&arg_ranks=${arg_ranks}`

    //   window.open(downloadURL)
    // //  项目的post方式请求
    // //  const results = yield call(service.excelExpot,{ 
    // //       'arg_mdzz':arg_mdzz,
    // //       'arg_mgr_id':arg_mgr_id,
    // //       'arg_tenantid':arg_tenantid,
    // //       'arg_year':arg_year,
    // //       "arg_season":arg_season,
    // //       "proj_id":proj_id,
    // //      // "arg_ranks":arg_ranks,
    // //     })
    //  },
  },
  subscriptions : {
    setup({dispatch, history}) {

      return history.listen(({pathname,query}) => {

        if (pathname === '/humanApp/employer/pmdistribute') {
          dispatch({type: 'backTime', query});
          openNotification()
          //dispatch({type: 'pmEmpScoresSearch',query});
        }
      });

    },
  },
};
