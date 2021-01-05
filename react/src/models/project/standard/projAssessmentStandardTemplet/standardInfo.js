/**
 * 作者：任华维
 * 日期：2017-07-31
 * 邮箱：renhw21@chinaunicom.cn
 * 功能：项目考核指标
 */
import * as projAssessmentStandardServices from '../../../../services/project/projAssessmentStandard';
import { routerRedux } from 'dva/router';
import { message } from 'antd';
import config from '../../../../utils/config';
import {getUuid,deepClone} from '../../../../utils/func';
import * as commonAppService from "../../../../services/commonApp/commonAppService.js";
export default {
    namespace: 'standardInfo',
    state: {
        templetList:[],
        templetListReset:[],
        templetState:"",
        templetYear:'',
        templetSeason:'',
        userId:localStorage.getItem('userid'),
        userName:localStorage.getItem('fullName'),
        role: false,
        ImmunityFlag: false , // 状态值

    },
    reducers: {
        templetQuerySuccess(state, {payload}) {
            return {
                ...state,
                ...payload
            };
        },

        templetQueryCopy(state,{payload}){
            message.success("复制成功")
            return {
                ...state,
                ...payload
            };
        },
        templetReset(state, {payload}) {
            const newData = [...state.templetList];
            const oldData = [...state.templetListReset];
            const newTarget = newData.filter(item => item.uid === payload.uid)[0];
            const oldTarget = oldData.filter(item => item.uid === payload.uid)[0];

            if (newTarget && oldTarget) {
                newTarget[payload.column] = oldTarget[payload.column];
            }else {
                newTarget[payload.column] = "";
            }
            return {
                ...state,
                templetList:newData,
            };
        },
        templetChange(state, {payload}) {
            const newData = [...state.templetList];

            const target = newData.filter(item => item.uid === payload.uid)[0];
            if (target) {
                target[payload.column] = payload.value;
            }

        if (payload.column === "kpi_weight" || payload.column === "kpi_point") {
          target["kpi_type_ratio"] = target["kpi_weight"] * 0.01 * target["kpi_point"];
      }

            return {
                ...state,
                templetList:newData,
            };
        },
        templetEdit(state, {payload}) {
            const newData = [...state.templetList];
            const target = newData.filter(item => item.uid === payload.uid)[0];
            if (target) {
                target.editable = true;
            }
            return {
                ...state,
                templetList:newData
            };
        },
        templetSave(state, {payload}) {
            const newData = [...state.templetList];
            const target = newData.filter(item => item.uid === payload.uid)[0];
            if (target) {
                delete target.editable;
            }
            return {
                ...state,
                templetList:newData
            };
        },
        templetDel(state, {payload}) {
            const newData = [...state.templetList];
            const array = newData.filter(item => item.uid !== payload.uid);
            const temp = array.map(function(item, index){
                item.key = getUuid(32,62);
                return item;
            })
            return {
                ...state,
                templetList:temp
            };
        },
        templetAdd(state, {payload}) {
            const array = [...state.templetList];
            const indexArray = array.map(function(value,index){
                return value.sort_index === payload.sort_index ? index+1 : null;
            }).filter(item => typeof(item) === "number" );
            array.splice(indexArray[indexArray.length-1],0,payload);
            return {
                ...state,
                templetList:array
            };
        },
    },
    effects: {
    *templetQuery({ payload }, { call, put, select }) {
        const userId = yield select((state) => state.standardInfo.userId);

        const roleRes = yield call(commonAppService.p_purchase_getroles, {
        arg_user_id: userId,
        });

      const res = yield call(projAssessmentStandardServices.templetQuery, {
        transjsonarray:
          '{"sequence":[{"kpi_flag":0},{"sort_index":0}],"condition":{"f_year":' +
          payload.year +
          ',"f_season":' +
          payload.season +
          "}}",
      });
      if (res.RetCode === "1") {
        const data = res.DataRows;
        const dataClone = deepClone(data);
        const temp = data.map((item, index) => {
                    if (item.kpi_state !== '3') {
                        item.rw = true;
                    }
                    item.key = getUuid(32,62);
                    return item;
        });
        let role = false;
        if (roleRes.RetCode === "1") {
          if (roleRes.RetNum === "3") {
            role = true;
          }
        }

        yield put({
          type: "templetQuerySuccess",
          payload: {
            templetList: temp,
            templetListReset: dataClone,
            templetYear: payload.year,
            templetSeason: payload.season,
            role: role,
          },
        });
      }
    },
    // *reasonUpdate ({data}, {call,put}) {
    //     const res = yield call(projAssessmentStandardServices.reasonUpdate,data);
    //     if(res.RetCode === "1") {
    //         console.log(res.DataRows,"结果")
    //     }
    // },
    //改变状态值
        *setImmunityFlag ({},{put}) {
            yield put({
                type:"templetQuerySuccess",
                payload: {
                    ImmunityFlag: true
                }
            })
        },
        /**
         * 判断通用指标复制页面复制按钮是否出现
         */
        *templetKpiState({payload},{call, put}){
            const res = yield call(projAssessmentStandardServices.templetStateQuery)
            for( let i = 0; i< res.DataRows.length; i++){
                if(res.DataRows[i].f_year === payload.year && res.DataRows[i].f_season === payload.season){
                    yield put({
                        type : "templetQuerySuccess",
                        payload : {
                            templetState : res.DataRows[i].kpi_state
                          },
                      });
                   }
                }
        },
        /**
         * 作者：刘洪若
         * 时间：2020-6-10
         * 功能： TMO一级考核模板复制
         */
        *templetCopy ({payload}, { call, put}) {
            const res = yield call(projAssessmentStandardServices.templetQuery,{transjsonarray:'{"sequence":[{"kpi_flag":0},{"sort_index":0}],"condition":{"f_year":'+payload.year+',"f_season":'+payload.season+'}}'})
            if (res.RetCode === '1') {
                const data = res.DataRows;
                for(let i = 0;i < data.length; i++){
                    for(let j= i+1; j<data.length;){
                        if(data[i].kpi_type == data[j].kpi_type){
                            data.splice(j,1)
                        }else{
                            j++
                        }
                    }
                    if(data[i].kpi_type ==="加减分项" ||data[i].kpi_type ==="激励约束类" ){
                        data.splice(i,1)
                    }
                }
                const temp = data.map((item, index) => {
                    item.editable = true;
                    item.classify = '';
                    item.formula = '';
                    item.kpi_content = '';
                    item.kpi_name = '';
                    item.kpi_ratio = '0';
                    item.kpi_state = '';
                    item.sort_index = '0';
                    item.uid = getUuid(32,62);
                    item.kpi_type_ratio = parseFloat(item.kpi_type_ratio);
                    item.percentile_score = '' + parseInt(item.percentile_score);
                    item.tag = '0';
                    if(item.f_season == 4){
                        item.f_season = '1';
                        item.f_year = (+item.f_year + 1).toString();
                    }else{
                        item.f_season = (+item.f_season + 1).toString()  ;
                    }
                    return item;
                })
                yield put({
                    type : 'templetQueryCopy',
                    payload : {
                        'templetList':temp,
                    }
                });
            }else{
                message.info("无上季度模板可复制")
            }
        },
        /**
         * 作者：刘洪若
         * 时间：2020-6-10
         *功能：通用考核指标复制

     */
        *templetDetailCopy({payload}, {call,put}){
            const res = yield call(projAssessmentStandardServices.templetQuery,{transjsonarray:'{"sequence":[{"kpi_flag":0},{"sort_index":0}],"condition":{"f_year":'+payload.year+',"f_season":'+payload.season+'}}'})
            let newYear = payload.year;
            let newSeason = payload.season + 1
            if(newSeason == 5){
                newYear = +payload.year + 1
                newSeason = '1'
            }

            let oldUniqe = []
            for(let i = 0; i< res.DataRows.length;i++){
                if(oldUniqe.indexOf(res.DataRows[i].kpi_type) == -1 && res.DataRows[i].classify === "通用考核指标"){
                    oldUniqe.push(res.DataRows[i])
                }
            }
            for(let i =0 ; i< oldUniqe.length-1; i++){
                for(let j = i+1 ; j<oldUniqe.length;j++){
                    if(oldUniqe[i].kpi_type == oldUniqe[j].kpi_type){
                        oldUniqe.splice(j,1);
                        j--;
                    }
                }
            }
            //判断上一季度的考核指标是否复制
            const newRes = yield call(projAssessmentStandardServices.templetQuery,{transjsonarray:'{"sequence":[{"kpi_flag":0},{"sort_index":0}],"condition":{"f_year":'+newYear+',"f_season":'+newSeason+'}}'})
            let newData = [];
            let new_sort_index = ""
            for(let i = 0 ; i< newRes.DataRows.length; i++){
                if(newRes.DataRows[i].classify === "通用考核指标"){
                    new_sort_index = newRes.DataRows[i].sort_index;
                }else if(newRes.DataRows[i].classify === "专业考核指标" || newRes.DataRows[i].classify == "党建与学习成长类" || newRes.DataRows[i].classify == "激励约束类"){
                    newData.push(newRes.DataRows[i])
                }
            }
            let nowUniqe = []
            for(let i = 0; i < newRes.DataRows.length; i++){
                if(nowUniqe.indexOf(newRes.DataRows[i].kpi_type) == -1 && newRes.DataRows[i].classify === "通用考核指标"){
                    nowUniqe.push(newRes.DataRows[i]);
                }
            }
            let ajudge = false
            if(oldUniqe.length === nowUniqe.length){
                ajudge = nowUniqe.every((item,index) =>  {
                    return (item.kpi_type == oldUniqe[index].kpi_type && item.kpi_type_ratio == oldUniqe[index].kpi_type_ratio)
                })
            }
            // let judge = ""
            // if(oldUniqe.length === nowUniqe.length){
            //     judge = oldUniqe.every((item,index) => {
            //         return ( item === nowUniqe[index])
            //     })
            // }else{
            //     judge = false
            // }
            if(ajudge){
                let data = []
                // let addData = []
                res.DataRows.map((item,idx)=> {
                    if(item.classify ==="通用考核指标"){
                        item.rw = true,
                        item.editable = true,
                        item.uid = getUuid(32,62),
                        item.f_year = newYear,
                        item.f_season = newSeason,
                        item.kpi_ratio = parseFloat(item.kpi_ratio);
                        item.kpi_state = '0';
                        item.remark = "";
                        item.tag = "0";
                        item.sort_index = parseInt(new_sort_index) + idx + '';
                        item.key = getUuid(32,62);
                        data.push(item)
                    }
                    // else if(item.classify ==="加减分项"){
                    //     item.rw = true,
                    //     item.editable = true,
                    //     item.uid = getUuid(32,62),
                    //     item.f_year = newYear,
                    //     item.f_season = newSeason,
                    //     item.kpi_state = '0';
                    //     item.remark = "";
                    //     item.tag = "0";
                    //     item.sort_index =parseInt(new_sort_index) +idx + '';
                    //     item.key = getUuid(32,62);
                    //     addData.push(item)
                    // }
                    // return (data,addData)
                    return data
                })
                let temp = data.concat(newData)
                yield put({
                    type : 'templetQueryCopy',
                    payload : {
                        'templetList':temp,
                    }

        });
            }else{
                message.info("上季度无相同指标可复制")
            }
        },
    *templetUpdate({ payload, onComplete }, { call, put, select }) {
      const {
        userId,
        userName,
        templetYear,
        templetSeason,
        templetList,
      } = yield select((state) => state.standardInfo);
      const other = [
        {
          editable: false,
          uid: getUuid(32, 62),
          f_year: templetYear,
          f_season: templetSeason,
          classify: "激励约束类",
          kpi_type: "激励约束类",
          kpi_name: "激励类",
          kpi_content: "",
          formula: "",
          target: "",
          percentile_score: "0",
          kpi_point:"100",
          kpi_weight:"5",
          kpi_ratio: "5",
          kpi_type_ratio: "5",
          kpi_flag: "2",
          kpi_state: "0",
          create_id: userId,
          create_name: userName,
          remark: "",
          tag: "",
        },
        {
          editable: false,
          uid: getUuid(32, 62),
          f_year: templetYear,
          f_season: templetSeason,
          classify: "激励约束类",
          kpi_type: "激励约束类",
          kpi_name: "约束类",
          kpi_content: "",
          formula: "",
          target: "",
          percentile_score: "0",
          kpi_point:"100",
          kpi_weight:"5",
          kpi_ratio: "5",
          kpi_type_ratio: "5",
          kpi_flag: "2",
          kpi_state: "0",
          create_id: userId,
          create_name: userName,
          remark: "",
          tag: "",
        },
      ];
      let list = [];
      let flag = false;
      for (let i = 0; i < templetList.length; i++) {
                if (templetList[i].kpi_flag === '2') {
                    flag = true;
                }
            }
            if (flag) {
                list = templetList;
            } else {
                list = [...templetList,...other];
            }
            const newList = list.filter(item=>item.kpi_flag=="0"||item.kpi_flag=="1").concat(list.filter(item=>item.kpi_flag=="2"||item.kpi_flag=="3").sort((a,b)=>b.kpi_flag-a.kpi_flag))
            const data = newList.map((item, index) => {
                item.kpi_state = payload;
                if (item.kpi_flag  === '0' ) {
                    item.classify = '通用考核指标';
                }
                if (item.kpi_flag  === '1' ) {
                    item.classify = '专业考核指标';

                }

                if (item.kpi_flag === "3") {
                    item.classify = "党建与学习成长类";
                }
        delete item.editable;
                delete item.editable;
                delete item.rw;
                delete item.sort_index;
                delete item.key;
                return '{"opt":"insert","data":'+JSON.stringify(item)+'}';
            })

            const args = {
                transjsonarray:'['
                    +'{"opt":"delete","data":{"f_year":"'+templetYear+'","f_season":"'+templetSeason+'"}},'
                    + data.join(',')
                +']'

            }

            const res = yield call(projAssessmentStandardServices.templetUpdate,args);
            if (res.RetCode === '1') {
                if (payload==='1' || payload==='3') {
                    // onComplete();
                    //yield put(routerRedux.push({pathname:'/projectApp/projAssessment/projAssessmentStandardTempletDetail',query:{'year':templetYear,'season':templetSeason}}));
                }else{
                    yield put({
                        type : 'templetQuery',
                        payload : {'season':templetSeason,'year':templetYear}
                    });
                    message.success('保存成功！');
                }
            }
        },
        // 跳转页
        *templetDetailPage ({payload}, { call, put }) {
            yield put(routerRedux.push({pathname:'/projectApp/projexam/tmp_setting/projAssessmentStandardTempletDetail',query:payload}));
        },
        // 跳转页
        *TempletListPage ({payload}, { call, put }) {
            yield put(routerRedux.push({pathname:'/projectApp/projexam/tmp_setting',query:payload}));
        },
    },
    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, query }) => {
                if (pathname === '/projectApp/projexam/tmp_setting/projAssessmentStandardTempletInfo') {
                    dispatch({
                        type : 'templetQuery',
                        payload : query
                    });
                }
                if (pathname === '/projectApp/projexam/tmp_setting/projAssessmentStandardTempletDetail') {
                    dispatch({
                        type : 'templetQuery',
                        payload : query
                    });
                    dispatch({
                        type:"setImmunityFlag"
                    });
                    dispatch({
                        type : 'templetKpiState',
                        payload : query
                    })
                }
            });
        },
    },
};
