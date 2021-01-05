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
import {getUuid,deepClone,propertySort} from '../../../../utils/func';
import moment from 'moment';
export default {
    namespace: 'projAssessmentStandardDetail',
    state: {
        list:[],
        listClone:[],
        userId:localStorage.getItem('userid'),
        userName:localStorage.getItem('fullName'),
        detail:{},
        year:'',
        season:'',
        batch:'',
        current:'',
        task:'',
        exe:'',
        next:'',
        wf:'',
        id:'',
        role:'',
        tmos:[],
        record:{},
        historys:[],
        activeKey:'0',
        modalVisible:false,
        kpiState: ''
    },
    reducers: {
        initData(state) {
          return {
            ...state,
            role: '',
          }
        },
        itemKpiState(state,{payload}){
            return {
                ...state,
                ...payload,
            }
        },
        itemCopy(state,{payload}){
            let array = [...state.list]
            let concatGeneral = [];
            let concatAdd = [];
            for(let i=0; i< array.length;i++){
                if(array[i].classify === "通用考核指标"){
                    concatGeneral.push(array[i])
                }else if(array[i].classify === "加减分项"){
                    concatAdd.push(array[i])
                }
            }
            let newArray = concatGeneral.concat(payload.list)
            for(let i =0; i< newArray.length; i++){
                if(newArray[i].create_time != newArray[0].create_time){
                    newArray[i].create_time = newArray[0].create_time
                }
                if(newArray[i].sort_index != parseInt(newArray[0].sort_index) + i){
                    newArray[i].sort_index = parseInt(newArray[0].sort_index) + i + ''
                }
            }
            message.success("复制成功")
            return {
                ...state,
                list:newArray,
            }
        },
        itemReset(state, {payload}) {
            const newData = [...state.list];
            const oldData = [...state.listClone];
            const newTarget = newData.filter(item => item.uid === payload.uid)[0];
            const oldTarget = oldData.filter(item => item.uid === payload.uid)[0];

            if (newTarget && oldTarget) {
                newTarget[payload.column] = oldTarget[payload.column];
            }else {
                newTarget[payload.column] = "";
            }
            return {
                ...state,
                list:newData,
            };
        },
        itemChange(state, {payload}) {
            const newData = [...state.list];

            const target = newData.filter(item => item.uid === payload.uid)[0];

            if (target) {
                target[payload.column] = payload.value;
            }
            return {
                ...state,
                list:newData,
            };
        },
        itemEdit(state, {payload}) {
            const newData = [...state.list];
            const target = newData.filter(item => item.uid === payload.uid)[0];
            if (target) {
                target.editable = true;
            }
            return {
                ...state,
                list:newData
            };
        },
        itemSave(state, {payload}) {
            const newData = [...state.list];
            const target = newData.filter(item => item.uid === payload.uid)[0];
            if (target) {
                delete target.editable;
            }
            return {
                ...state,
                list:newData
            };
        },
        itemDel(state, {payload}) {
            const newData = [...state.list];
            const array = newData.filter(item => item.uid !== payload.uid)
            const temp = array.map(function(item, index){
                item.key = getUuid(32,62);
                return item;
            })
            return {
                ...state,
                list:temp
            };
        },
        itemAdd(state, {payload}) {
            const array = [...state.list];
            const indexArray = array.map(function(value,index){
                return value.sort_index === payload.sort_index ? index+1 : null;
            }).filter(item => typeof(item) === "number" );
            array.splice(indexArray[indexArray.length-1],0,payload);
            return {
                ...state,
                list:array
            };
        },
        projectDetailQuerySuccess(state, {payload}) {
            return {
                ...state,
                ...payload
            };
        },
        projKpiQuerySuccess(state, {payload}) {
            return {
                ...state,
                ...payload
            };
        },
        tabChange(state, {payload}) {
            return {
                ...state,
                ...payload,
            };
        },
        modalShow(state) {
            return {
                ...state,
                modalVisible : true
            };
        },
        modalHide(state) {
            return {
                ...state,
                modalVisible : false
            };
        },
    },
    effects: {

        *projAssessmentStandardDetailPage ({payload}, { call, put }) {
            yield put(routerRedux.push({pathname:'/projectApp/projexam/examsetting/projAssessmentStandardDetail',query:payload}));
        },
        /**
         * 作者：任华维
         * 日期：2017-12-21
         * 邮箱：renhw21@chinaunicom.cn
         * 功能：保存|'1'和提交|'2'
         */
        *projKpiUpdate ({payload}, { call, put, select}) {
            const {year,season,id,list,detail,task, exe, next, wf} = yield select(state => state.projAssessmentStandardDetail);
            const data = list.map((item, index) => {
                item.kpi_fill_state = payload;
                //提交时对通用指标里tag做处理，用来匹配之后需要的数据
                if (item.kpi_flag === '0' && item.tag === '1') {
                    item.tag = '0';
                }else{
                    delete item.tag;
                }
                //提交时对效益指标里kpi_score做处理，用来匹配之后需要的数据
                if (item.kpi_flag === '1') {
                    item.kpi_score = item.kpi_ratio;
                }
                //提交时对kpi_state初始化成'0'
                item.kpi_state = '0';
                delete item.rw;
                delete item.uid;
                delete item.sort_index;
                delete item.key;
                return '{"opt":"insert","data":'+JSON.stringify(item)+'}';
            })
            const args = {
                transjsonarray:'['
                    +'{"opt":"delete","data":{"year":"'+year+'","season":"'+season+'","proj_id":"'+id+'"}},'
                    + data.join(',')
                +']'
            }
            const res = yield call(projAssessmentStandardServices.projKpiUpdate,args);
            if (res.RetCode === '1') {
                if (payload === '1' || payload === '3' ) {
                    yield put({
                        type : 'projectDetailQuery',
                        payload : {'year':year,'season':season,'id':id}
                    });
                    message.success('保存成功！');
                }
                if (payload === '2') {
                    //yield put({type : 'projScoreAdd'});
                    yield put({
                        type:"itemKpiState",
                        payload :{
                            kpiState : "2"
                        }
                    });
                    yield put({
                        type : 'projKpiSubmit',
                        payload : {
                            'arg_staff_id':detail.mgr_id,
                            'arg_staff_name':detail.mgr_name,
                            'arg_proj_id':detail.proj_id,
                            'arg_proj_name':detail.proj_name,
                            'arg_pu_dept_name':detail.pu_dept_name,
                            //  'arg_pu_dept_name':detail.dept_name,
                            'arg_year':year,
                            'arg_season':season,
                            'arg_task_uid':task,
                            'arg_exe_id':exe,
                            'arg_task_next_id':next,
                            'arg_task_wf_batchid':wf
                        }
                    });
                }
            }
        },
        // *projScoreAdd ({payload}, { call, put, select}) {
        //     const {year,season,detail} = yield select(state => state.projAssessmentStandardDetail);
        //     const data = {
        //         'proj_id':detail.proj_id,
        //         'proj_code':detail.proj_code,
        //         'proj_name':detail.proj_name,
        //         'proj_dept_name':detail.dept_name,
        //         'mgr_id':detail.mgr_id,
        //         'mgr_name':detail.mgr_name,
        //         'year':year,
        //         'season':season,
        //         'state':'3',
        //     }
        //     const res = yield call(projAssessmentStandardServices.projScoreAdd,{'transjsonarray':'['+JSON.stringify(data)+']'});
        //     if (res.RetCode === '1') {
        //         yield put(routerRedux.push({pathname:'/projectApp/projexam/examsetting'}));
        //     }
        // },
        *projKpiSubmit ({payload}, { call, put}) {
            const res = yield call(projAssessmentStandardServices.projKpiSubmit,payload);
            if (res.RetCode === '1') {
                message.success('提交成功，请等待部门经理审核');
                yield put(routerRedux.push({pathname:'/projectApp/projexam/examsetting'}));
            }
        },
        *kpiNotPass ({payload}, { call, put, select}) {
            const {tmos} = yield select(state => state.projAssessmentStandardDetail);
            const isTMO = tmos.find(item=>item.staff_id === payload.arg_check_id)
            if (isTMO) {
                payload.arg_role = 'TMO';
            } else {
                payload.arg_role = 'DM';
            }
            const res = yield call(projAssessmentStandardServices.checkkpinotpass,payload);
            if (res.RetCode === '1') {
                message.success('退回成功');
                yield put(routerRedux.push({pathname:'/taskList'}));
            }
        },
        *kpiPass ({payload}, { call, put, select}) {
            const {tmos} = yield select(state => state.projAssessmentStandardDetail);
            const isTMO = tmos.find(item=>item.staff_id === payload.arg_dm_id)
            if (isTMO) {
                payload.arg_tmo_id = payload.arg_dm_id;
                payload.arg_tmo_name = payload.arg_dm_name;
                delete payload.arg_dm_id;
                delete payload.arg_dm_name;
                const res = yield call(projAssessmentStandardServices.tmocheckkpipass,payload);
                if (res.RetCode === '1') {
                    message.success('提交成功');
                    yield put(routerRedux.push({pathname:'/taskList'}));
                }
            } else {
                const res = yield call(projAssessmentStandardServices.dmcheckkpipass,payload);
                if (res.RetCode === '1') {
                    message.success('提交成功');
                    yield put(routerRedux.push({pathname:'/taskList'}));
                }
            }
        },
        /**
         * 作者：任华维
         * 日期：2017-11-20
         * 功能：获取项目详情并查询用户身份
         */
        *projectDetailQuery({ payload }, {call, put, select}) {
            const userId = yield select(state => state.projAssessmentStandardDetail.userId);
            const [detailRes,tmoRes, stateRes, kpiRes, tempRes, hisRes, historyRes] = yield [
                call(projAssessmentStandardServices.projectDetailQuery,{'arg_flag':1,'arg_proj_id':payload.id}),
                call(projAssessmentStandardServices.projectTMOQuery, {'arg_vr_name':'项目管理-TMO'}),
                call(projAssessmentStandardServices.listProjKpiState,{'arg_proj_id':payload.id}),
                call(projAssessmentStandardServices.projKpiQuery,{transjsonarray:'{"sequence":[{"kpi_flag":0},{"sort_index":0}],"condition":{"proj_id":'+payload.id+',"year":'+payload.year+',"season":'+payload.season+'}}'}),
                call(projAssessmentStandardServices.templetQuery,{transjsonarray:'{"sequence":[{"kpi_flag":0},{"sort_index":0}],"condition":{"f_year":'+payload.year+',"f_season":'+payload.season+'}}'}),
                call(projAssessmentStandardServices.checkHisquery,{transjsonarray:'{"condition":{"check_id":'+payload.current+'}}'}),
                call(projAssessmentStandardServices.checkHisquery,{transjsonarray:'{"sequence":[{"check_auto_id":0}],"condition":{"check_batchid":'+payload.wf+'}}'}),
            ]
            if (detailRes.RetCode === '1'  && tmoRes.RetCode === '1'  && stateRes.RetCode === '1' && kpiRes.RetCode === '1' && tempRes.RetCode === '1' && hisRes.RetCode === '1' && historyRes.RetCode === '1') {
                const detail = detailRes.DataRows[0];
                const tmos = tmoRes.DataRows;
                const states = stateRes.DataRows;
                const kpi = kpiRes.DataRows;
                const temp = tempRes.DataRows;
                const his = hisRes.DataRows[0];
                const historys = historyRes.DataRows;
                const state = {};
                for (let i = 0; i < states.length; i++) {
                if (
                  payload.year === states[i].year &&
                  payload.season === states[i].season
                ) {
                  state.year = parseInt(states[i].year);
                  state.season = parseInt(states[i].season);
                  state.template_state = parseInt(states[i].template_state);
                  if (states[i].kpi_fill_state) {
                    state.kpi_fill_state = parseInt(states[i].kpi_fill_state);
                  }
                  if (states[i].state) {
                    state.state = parseInt(states[i].state);
                  }
                  break;
                }
              }

              let yearSeasonStr = state.year + "" + state.season;
            let changeNewPageTime = "20204";
              let data;
              let tempData = temp
              const flag =
                userId === detail.mgr_id ? (state.kpi_fill_state == 2 ? 0 : 1) : 0;
              if (yearSeasonStr >= changeNewPageTime) {
                if (typeof state.kpi_fill_state === "undefined") {
                  data = temp
                    .map((item, index) => {
                      const id = getUuid(32, 62);
                      const obj = {
                        kpi_id: id,
                        uid: id,
                        proj_code: detail.proj_code,
                        proj_id: detail.proj_id,
                        year: payload.year,
                        season: payload.season,
                        classify: item.classify,
                        kpi_flag: item.kpi_flag,
                        kpi_type: item.kpi_type,
                        kpi_name: item.kpi_name,
                        kpi_content: item.kpi_content,
                        formula: item.formula,
                        target: item.target,
                        percentile_score: item.percentile_score,
                        kpi_ratio: item.kpi_ratio,
                        kpi_score: "0",
                        kpi_type_ratio: item.kpi_type_ratio,
                        remark: item.remark,
                        kpi_state: "0",
                        kpi_fill_state: "0",
                        tag: item.tag,
                        sort_index: item.sort_index,
                        key: id,
                        kpi_assessments: item.kpi_assessments,
                      };

                      if (item.kpi_flag !== "0" && flag) {
                        obj.rw = true;
                      }
                      return obj;
                    })

                    data = data.filter (item => item.kpi_flag =="1"||item.kpi_flag =="0").concat(data.filter (item => item.kpi_flag =="2"||item.kpi_flag =="3").sort((a,b)=>b.kpi_flag-a.kpi_flag))


                } else {
                  data = kpi
                    .map((item, index) => {
                      item.uid = item.kpi_id;
                      item.key = item.kpi_id;
                      item.tag = item.tag ? "1" : "0";
                      if (item.kpi_flag !== "0" && 
                        (state.kpi_fill_state === 1 || state.kpi_fill_state === 3) &&
                        flag
                      ) {
                        item.rw = true;
                        item.kpi_state = "2";
                      }
                      return item;
                    })
                  data = data.filter (item => item.kpi_flag =="1"||item.kpi_flag =="0").concat(data.filter (item => item.kpi_flag =="2"||item.kpi_flag =="3").sort((a,b)=>b.kpi_flag-a.kpi_flag))
                }
              } else {
                if (typeof state.kpi_fill_state === "undefined") {
                  data = temp.map((item, index) => {
                    const id = getUuid(32, 62);
                    const obj = {
                      kpi_id: id,
                      uid: id,
                      proj_code: detail.proj_code,
                      proj_id: detail.proj_id,
                      year: payload.year,
                      season: payload.season,
                      classify: item.classify,
                      kpi_flag: item.kpi_flag,
                      kpi_type: item.kpi_type,
                      kpi_name: item.kpi_name,
                      kpi_content: item.kpi_content,
                      formula: item.formula,
                      target: item.target,
                      percentile_score: item.percentile_score,
                      kpi_ratio: item.kpi_ratio,
                      kpi_score: "0",
                      kpi_type_ratio: item.kpi_type_ratio,
                      remark: item.remark,
                      kpi_state: "0",
                      kpi_fill_state: "0",
                      tag: item.tag,
                      sort_index: item.sort_index,
                      key: id,
                      kpi_assessments: item.kpi_assessments,
                    };

                    if (item.kpi_flag === "1" && flag) {
                      obj.rw = true;
                    }
                    return obj;
                  });
                } else {
                  data = kpi.map((item, index) => {
                    item.uid = item.kpi_id;
                    item.key = item.kpi_id;
                    item.tag = item.tag ? "1" : "0";
                    if (
                      (state.kpi_fill_state === 1 || state.kpi_fill_state === 3) &&
                      item.kpi_flag === "1" &&
                      flag
                    ) {
                      item.rw = true;
                      item.kpi_state = "2";
                    }
                    return item;
                  });
                }
              }
              yield put({
                type: "projectDetailQuerySuccess",
                payload: {
                  detail: detailRes.DataRows[0],
                  list: data,
                  listClone: deepClone(data),
                  tmos: tmos,
                  role: flag,
                  record: his,
                  historys: historys,
                  ...payload,
                },
              });
            }
          },
        /**
         * 作者： 刘洪若
         * 时间： 2020-6-8
         * 功能：判断复制按钮在页面是否显示
        */
        *projectKpiState({payload},{call,put}){
            const res = yield call(projAssessmentStandardServices.listProjKpiState,{'arg_proj_id':payload.id})
            for(let i =0; i<res.DataRows.length; i++){
                if(res.DataRows[i].season === payload.season && res.DataRows[i].year === payload.year){
                    if(res.DataRows[i].state === undefined && res.DataRows[i].kpi_fill_state === undefined){
                        res.DataRows[i].kpi_fill_state = ""
                    }
                    yield put({
                        type : 'itemKpiState',
                        payload:{
                            kpiState : res.DataRows[i].kpi_fill_state
                        }
                    })
                }
            }
        },
        /**
         * pm专业考核指标设定复制功能
         */
        *projectDetailCopy({payload},{call,put}){
            let oldSeason = payload.season-1;
            let oldYear = payload.year
            if(oldSeason == "0" ){
                oldSeason = "4"
                oldYear = payload.year -1
            }
            const [templetRes,newTempletRes,projRes] = yield [
                call(projAssessmentStandardServices.templetQuery,{transjsonarray:'{"sequence":[{"kpi_flag":0},{"sort_index":0}],"condition":{"f_year":'+oldYear+',"f_season":'+oldSeason+'}}'}),
                call(projAssessmentStandardServices.templetQuery,{transjsonarray:'{"sequence":[{"kpi_flag":0},{"sort_index":0}],"condition":{"f_year":'+payload.year+',"f_season":'+payload.season+'}}'}),
                call(projAssessmentStandardServices.projKpiQuery,{transjsonarray:'{"sequence":[{"kpi_flag":0},{"sort_index":0}],"condition":{"proj_id":'+payload.id+',"year":'+oldYear+',"season":'+oldSeason+'}}'})
            ]
            let oldUniqe = []
            for(let i = 0; i< templetRes.DataRows.length;i++){
                if(oldUniqe.indexOf(templetRes.DataRows[i].kpi_type) == -1 && (templetRes.DataRows[i].classify === "专业考核指标" || templetRes.DataRows[i].classify === "党建与学习成长类")){
                    oldUniqe.push(templetRes.DataRows[i])
                }
            }
            let nowUniqe = []
            for(let i = 0; i < newTempletRes.DataRows.length; i++){
                if(nowUniqe.indexOf(newTempletRes.DataRows[i].kpi_type) == -1 && (newTempletRes.DataRows[i].classify === "专业考核指标" || newTempletRes.DataRows[i].classify === "党建与学习成长类")){
                    nowUniqe.push(newTempletRes.DataRows[i]);
                }
            }
           let judge = "" ;
           if(oldUniqe.length === nowUniqe.length){
                judge = nowUniqe.every((item,index) => {
                    return (item.kpi_type == oldUniqe[index].kpi_type && item.kpi_type_ratio == oldUniqe[index].kpi_type_ratio)
                })
           }else{
               judge = false
           }
        //    let projResClone = deepClone(projRes.DataRows)
        //    let projResArray = []
        //    if(projResClone.length != 0){
        //         projResArray = projResClone.filter((item,index) => {
        //            if(item.classify === "专业考核指标" || item.classify === "党建与学习成长类"){
        //                return item
        //            }
        //        })
        //    }
        //    let projJudge = true;
        //     if(projResArray.length){
        //         projJudge =  projResArray.every((item,index) => {
        //                 return (item.finish !== undefined )
        //         })
        //     }else{
        //         projJudge = false
        //     }
            if(judge){
                let data = []
                let inData = []
                for(let i = 0 ; i < projRes.DataRows.length; i++){
                    if(projRes.DataRows[i].classify === "专业考核指标" || projRes.DataRows[i].classify == "党建与学习成长类"){
                        projRes.DataRows[i].rw = true,
                        projRes.DataRows[i].kpi_id = getUuid(32,62),
                        projRes.DataRows[i].uid=getUuid(32,62),
                        projRes.DataRows[i].year = payload.year,
                        projRes.DataRows[i].season = payload.season,
                        projRes.DataRows[i].target = '',
                        projRes.DataRows[i].kpi_ratio = parseFloat(projRes.DataRows[i].kpi_ratio),
                        projRes.DataRows[i].kpi_state = '0',
                        projRes.DataRows[i].kpi_fill_state = '0',
                        projRes.DataRows[i].key = getUuid(32,62);
                        delete projRes.DataRows[i].create_time;
                        delete projRes.DataRows[i].finish;
                        delete projRes.DataRows[i].pm_finish;
                        data.push(projRes.DataRows[i])
                        }else if(projRes.DataRows[i].classify == "激励约束类"){
                            projRes.DataRows[i].rw = true,
                            projRes.DataRows[i].kpi_id = getUuid(32,62),
                            projRes.DataRows[i].uid=getUuid(32,62),
                            projRes.DataRows[i].year = payload.year,
                            projRes.DataRows[i].season = payload.season,
                            projRes.DataRows[i].target = '',
                            projRes.DataRows[i].kpi_ratio = parseFloat(projRes.DataRows[i].kpi_ratio),
                            projRes.DataRows[i].kpi_state = '0',
                            projRes.DataRows[i].kpi_fill_state = '0',
                            projRes.DataRows[i].key = getUuid(32,62);
                            delete projRes.DataRows[i].create_time;
                            delete projRes.DataRows[i].finish;
                            delete projRes.DataRows[i].pm_finish;
                            inData.push(projRes.DataRows[i])
                        }
                    }
                    let temp = data.concat(inData)
                yield put({
                    type:"itemCopy",
                    payload:{
                        list:temp
                    }
                })
            }else{
                message.info("上季度未参加季度考核或模板不同,无指标可复制")
            }
        },
    },
    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, query }) => {
                if(pathname === '/taskAS') {
                    dispatch({type: 'initData'});
                    dispatch({
                      type : 'projectDetailQuery',
                      payload : query
                    });
                }
                if (pathname === '/projectApp/projexam/examsetting/projAssessmentStandardDetail') {
                    dispatch({
                        type : 'projectDetailQuery',
                        payload : query
                    });
                    dispatch({
                        type:"saveFlag"
                    });
                    dispatch({
                        type : 'projectKpiState',
                        payload : query
                    })
                }
            });
        },
    },
};
