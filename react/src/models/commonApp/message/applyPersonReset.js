/**
 * 作者：贾茹
 * 日期：2019-6-25
 * 邮箱：m18311475903@163.com
 * 文件说明：归档申请人修改
 */

import Cookie from 'js-cookie';
import { message } from "antd";
import * as commonAppService from '../../../services/commonApp/commonAppService.js';
import * as meetManageService from '../../../services/meetingManagement/meetManage.js';
import {routerRedux} from "dva/router";

/*const recordValue = location.query;
console.log(recordValue);*/
export default {
  namespace: 'applyPersonReset',
  state: {

    list: [],
    name:[],
    id:[],
    loading: false,
    topicName:'',           //议题名称
    meetingTypes:[],        //会议类型
    meetingTypeId:'',        //会议类型id
    meetingTypeReset:'',     //会议类型显示
    deptId:[],              //申请单位id
    applyReset:[],          //全局搜索选中汇报人姓名
    applyResetID:'',          //全局搜索选中汇报人id
    outPersonChecked:'',    //选中搜索人员
    outPersonCheckedID:'',
    radioValue: '',         //是否属于三重一大选择
    resonDisplay: '',   //是否显示三重一大原因
    resonValue:'',          //属于三重一大原因
    discussRadioValue:'',    //是否属于前置讨论项选择
    discussDisplay: '',  //前置讨论项原因是否显示
    discussValue:'',        //属于前置讨论项原因
    textCont:'',            //待决议事情内容
    deptRadioValue:'',      //是否已征求各部门意见
    meetingRadioValue:'',   //上会材料是否泄密选择
    meetingDisplay: '',  //上会材料泄密说明显示隐藏
    meetingValue:'',         //上会材料泄密原因说明
    materialsDisplay:'',//上会材料提交
    saveIsSecrate:'',        //议题保存上会材料是否泄密保存
    fileList:[],             //文件上传
    tableUploadFile:[],      //文件上传显示在table里面的数据
    visible: false,         //人员列表弹出框控制
    deptVisible:false,     //点击弹出申请单位的弹出框选择
    partdeptVisible:false,     //点击弹出列席的弹出框选择
    deptInputs:[],         //申请单位选择框显示内容
    outInputs:[],         //列席部门选择框显示内容
    outDeptId:[],         //列席部门选中
    Dept:[],              //申请单位显示
    outDept:[],           //列席部门显示
    writeMinute:'10',        //预计汇报时间
    applyPersons:[],         //汇报人
    outSearchPerson:'',      //人员不在下拉框显示
    outPersonTableSource:[],  //人员不在table表格显示
    addData:{},                 //议题详情数据
    judgeTableSource:[],   //审批环节table数据
    passData:[],           //上个页面传入的数据
    applyR:[],             //外部搜索需传
    personValue:[],             //人员不在选中保存
    reletiveDiscussDisplay:'',   //前置议题是否显示
    meetingTopicName:'',         //一相关议题名称
    meetingMeetingName:'',      //相关会议名称
    tableMeetingType:[],             //总办会选择相关议题
    outMeetingMeetingName:'',       //其他议题相关名称
    noStarDisplay:'',      //显示是否属前置讨论事项
    StarDisplay:'',        //显示是否需要党委会前置讨论
    discussModalDisplayvisible:false, //总经理办公会选中 并且需要党委会参与讨论
    savemeetingRadioValue:'', //暂存是否涉密
    seceretIsVisible:false,     //是否修改议题材料是否涉密
    NOseceretIsVisible:false,      //点击否时弹窗
    FileInfo:[],                     //附件信息
    saveStartUpload:[],
    toppicId:"",                    //点击提交成功后发送消息topicId参数
  },

  reducers: {
    save(state, action) {
      return { ...state,
        ...action.payload
      };
    },
  },

  effects: {
    * init({query}, {call, put, select}) {
      /*console.log(JSON.parse(query.value))*/
        let nameId=[];
        for(let j = 0; j <JSON.parse(query.value).topic_user_name.split(",").length;j++){
          /*console.log(res[i].topic_user_id.split(","));*/
          nameId.push(JSON.stringify({userid:JSON.parse(query.value).topic_user_id.split(",")[j],username:JSON.parse(query.value).topic_user_name.split(",")[j]}))
        }
        yield put({
          type:'save',
          payload:{
            passData:JSON.parse(query.value),
            topicName:JSON.parse(query.value).topic_name,
            deptId:JSON.parse(query.value).topic_dept_id.split(','),         //申请部门
            outDeptId:JSON.parse(query.value).topic_other_dept_id.split(","),         //列席部门选中               转数组
            applyReset:nameId,
            FileInfo:[],
            saveStartUpload:[],
          }
        });

        //初始化页面详情数据
        yield put({
          type:'waitDetails'
        });
      yield put({
        type:'getTopicMeetingName',

      });
        //初始化审批页面table数据
        yield put({
          type:'judgeMoment'
        })

      //初始化会议类型数据
        yield put({
          type:'meetingTypeSearch',

        })

      //初始化汇报人数据
        yield put({
          type:'getApplyPerson'
        })

      //三个点击才会显示的  三重一大  前置会议   是否涉密
        yield put({
          type:'startImportant'
        })
        yield put({
          type:'startPrevice'
        })
        yield put({
          type:'startSerata'
        })
    },

    //议题详情查询
    * waitDetails({},{call, select, put}){
      const { passData } = yield select(state=>state.applyPersonReset);
     /* console.log(passData.topic_id);*/
      const recData={
        arg_topic_id:passData.topic_id, //-- 会议议题id
        arg_state: passData.list_state,//-- 0待办，1已办，2办结
        arg_batch_id:passData.batch_id, // -- 同一人处理的批次id
        arg_user_id:Cookie.get('userid'),
      };
      const response = yield call(commonAppService.waitDetailsService,recData);
      if(response.RetCode==='1') {
        const res = response.DataRows;
        let nameId= [];
        for (let i = 0; i < res.length; i++) {
          res[i].key = i;
          /*console.log(res[i]);*/
         /* console.log(res[i].topic_user_name.split(','));*/
          /*console.log(res[i].topic_user_name.split(","));*/
          //判断前置原因是否显示
          for(let j = 0; j <res[i].topic_user_name.split(",").length;j++){
            /*console.log(res[i].topic_user_id.split(","));*/
            nameId.push(JSON.stringify({userid:res[i].topic_user_id.split(",")[j],username:res[i].topic_user_name.split(",")[j]}))
          }
     /*     console.log(nameId);*/
          if(res[i].topic_if_study==='1' && res[i].note_type_name!=='总经理办公会'){
            yield put({
              type:'save',
              payload:{
                discussDisplay: 'block',
                reletiveDiscussDisplay:'none',
                StarDisplay:'none',
                noStarDisplay:'block'
              }
            })
          }else if(res[i].topic_if_study==='1' && res[i].note_type_name==='总经理办公会'){
            yield put({
              type:'save',
              payload:{
                discussDisplay: 'none',
                reletiveDiscussDisplay:'block',
                StarDisplay:'block',
                noStarDisplay:'none'
              }
            })
          }else if(res[i].topic_if_study==='0'&& res[i].note_type_name==='总经理办公会'){
            yield put({
              type:'save',
              payload:{
                discussDisplay: 'none',
                reletiveDiscussDisplay:'none',
                StarDisplay:'none',
                noStarDisplay:'none'
              }
            })
          }else{
            yield put({
              type:'save',
              payload:{
                discussDisplay: 'none',
                reletiveDiscussDisplay:'none',
                StarDisplay:'block',
                noStarDisplay:'none'
              }
            })
          }
          //判断三重一大原因是否显示
          if(res[i].topic_if_important==='1'){
            yield put({
              type:'save',
              payload:{
                resonDisplay: 'block',
              }
            })
          }else{
            yield put({
              type:'save',
              payload:{
                resonDisplay: 'none',
              }
            })
          }
          //判断涉密原因是否显示
          if(res[i].topic_if_secret==='1'){
            yield put({
              type:'save',
              payload:{
                meetingDisplay: 'block',
                materialsDisplay :'none',
              }
            })
          }else{
            yield put({
              type:'save',
              payload:{
                meetingDisplay: 'none',
                materialsDisplay:'block',
              }
            })
          }
          yield put({
            type:'save',
            payload:{
              addData:res[i],
              topicName:res[i].topic_name,   //议题名称
              meetingTypeId:res[i].topic_type,       //会议类型id
              meetingTypeReset:res[i].note_type_name,     //会议类型显示
              //Dept:res[i].topic_dept_name.split(','),              //申请单位显示
              applyReset:nameId,          //全局搜索选中汇报人       字符串转为数组
              radioValue:res[i].topic_if_important,         //是否属于三重一大选择
              resonValue:res[i].topic_important_reason,          //属于三重一大原因
              discussRadioValue:res[i].topic_if_study,    //是否属于前置讨论项选择
              discussValue:res[i].topic_study_id,        //属于前置讨论项原因
              textCont:res[i].topic_content,            //待决议事情内容
              deptRadioValue:res[i].topic_if_opinions,      //是否已征求各部门意见
              meetingRadioValue:res[i].topic_if_secret,   //上会材料是否泄密选择
              meetingValue:res[i].topic_secret_reason,         //上会材料泄密原因说明
              deptInputs:res[i].topic_dept_name.split(','),         //申请单位选择框显示内容     转数组
              outInputs:res[i].topic_other_dept_name.split(','),         //列席部门选择框显示内容前身   转数组

             // outDept:res[i].topic_other_dept_name.split(','),           //列席部门显示
              writeMinute:res[i].topic_reporting_time,        //预计汇报时间
              saveIsSecrate:res[i].topic_if_secret,
              topicId:res[i].topic_id
            }
          })

        }

        /* console.log(res);*/
      }
      yield put({
        type:'searchUploadFile'
      });


    },

    //默认三重一大原因是否显示
    * startImportant({}, {call, select, put}){
      const {radioValue} =  yield select (state=>state.applyPersonReset);
      if(radioValue==='1'){
        yield put({
          type:'save',
          payload:{
            resonDisplay: 'block',
          }
        })
      }else{
        yield put({
          type:'save',
          payload:{
            resonDisplay: 'none',
          }
        })
      }
    },

    //默认属于前置会议是否显示
    * startPrevice({}, {call, select, put}){
      const {discussRadioValue} =  yield select (state=>state.applyPersonReset);
      if(discussRadioValue==='1'){
        yield put({
          type:'save',
          payload:{
            discussDisplay: 'block',
          }
        })
      }else{
        yield put({
          type:'save',
          payload:{
            discussDisplay: 'none',
          }
        })
      }
    },

    //审批环节调取服务
    * judgeMoment({}, { call, put, select }){

      const { passData} = yield select(state=>state.applyPersonReset);
      /*console.log(detailLine);*/
      const recData={
        arg_topic_id:passData.topic_id
      };
      const response = yield call(commonAppService.judgeMoment,recData);
      if(response.RetCode==='1'){
        const res = response.DataRows;
        for(let i = 0;i<res.length;i++){
          res[i].key=i;
        }
        yield put({
          type:'save',
          payload:{
            judgeTableSource:res
          },
        });
       /* console.log(res);*/
      };

    },

    //议题名称
    * handleTopicName({value}, {call, select, put}){
      yield put({
        type:'save',
        payload:{
          topicName: value,
        }
      })
    },
    //其他议题
    * handleOutMeetingMeetingNameName({value},{put}){
      yield put({
        type:'save',
        payload:{
          discussValue:value,
          outMeetingMeetingName:value
        }
      })
    },



    //点击清空清空条件
    * meetingStudyClear({},{put}){
      yield put({
        type:'save',
        payload:{
          meetingTopicName:'',
          meetingMeetingName:'',

        }
      })
    },

    //点击查询查询相应议题的名称
    * getTopicMeetingName({},{call,select,put}){
      const { meetingTopicName,meetingMeetingName } = yield select (state => state.applyPersonReset);
      const recData = {
        arg_topic_name:meetingTopicName,//议题名称
        arg_note_name:meetingMeetingName//会议名称
      }
      const response = yield call(meetManageService.topicStudyList,recData);
      if(response.RetCode === '1'){
        const res= response.DataRows;
        /*console.log(res);*/
        for(let i =0;i<res.length;i++){
          res[i].key=i;
        }
        yield put({
          type:'save',
          payload:{
            tableMeetingType:res
          }
        })
      }
    },

    //点击前置相关议题modal确定
    * okStudyModal({},{put}){
      yield put({
        type:'save',
        payload:{
          discussModalDisplayvisible:false,
        }
      })
    },

    //点击前置相关议题modal取消
    * cancelStudyModal({},{put}){
      yield put({
        type:'save',
        payload:{
          discussModalDisplayvisible:false,
        }
      })
    },

    //会议类型下拉框选项查询
    * meetingTypeSearch({},{select, call, put}){
      const recData = {
        arg_type_ou_id: Cookie.get('OUID'),
      };
      /*console.log(recData);*/
      const response = yield call(meetManageService.meetingTypeSearch,recData);
       /*console.log(response);*/
      if(response.RetCode === '1'){
        const res = response.DataRows;
        for (let i = 0, j = res.length; i < j; i++) {
          /* console.log(OUs[i]);*/
          res[i].key = i;
        }
        yield put({
          type: 'save',
          payload: {
            // 把数据通过save函数存入state
            meetingTypes: res,
          },

        });
      };
    },

    //获取会议类型id后保存
    * handleMeetingTypeId({i},{call,select,put}){
      /*  console.log(JSON.parse(i));*/
      const {discussRadioValue} = yield select (state=>state.applyPersonReset);

      if(JSON.parse(i).type_name === "总经理办公会" && discussRadioValue ==='1'){
        yield put({
          type:'save',
          payload:{
            discussRadioValue:'',
            noStarDisplay:'none',
            StarDisplay:'inline-block',
            discussDisplay:'none',
            discussValue:'',
          }
        });
      }else if(JSON.parse(i).type_name === "总经理办公会" && discussRadioValue ==='0'){
        yield put({
          type:'save',
          payload:{
            noStarDisplay:'none',
            StarDisplay:'inline-block',
            discussDisplay:'none',
            discussValue:'',
            reletiveDiscussDisplay:'none'
          }
        });
      }else if(JSON.parse(i).type_name !== "总经理办公会"){
        yield put({
          type:'save',
          payload:{
            noStarDisplay:'inline-block',
            StarDisplay:'none',
            discussDisplay:'none',
            reletiveDiscussDisplay:'none',
            discussRadioValue:'',
            discussValue:'',
          }
        });
      }

      yield put({
        type:'save',
        payload:{
          meetingTypeReset:JSON.parse(i).type_name,
          meetingTypeId:JSON.parse(i).type_id
        }
      });
    },

    //申请单位点击确定按钮存入
    * handleDeptOk({},{call,select,put}){
     // const { deptInputs } = yield select(state => state.applyPersonReset);
      /*   console.log(deptInputs);*/
      /*console.log(deptFalse);*/
      yield put({
        type:'save',
        payload:{
          deptVisible: false,
        }
      });

    },

    //申请单位选中
    * onDeptChecked({value},{call,select,put}){
      const { deptInputs,deptId } = yield select(state => state.applyPersonReset);
      /* console.log(value);*/

      if(value.target.checked===true){
       /* console.log()*/
        deptInputs.push(value.target.deptName);
        deptId.push(value.target.value);
        yield put({
          type:'save',
          payload:{
            deptInputs: [...deptInputs],
            deptId:[...deptId]
          }
        });
      }else{
        let dept = deptInputs.filter(i=>i!==value.target.deptName);
        let deptid = deptId.filter(i=>i !== value.target.value);
        yield put({
          type:'save',
          payload:{
            deptInputs: [...dept],
            deptId:[...deptid]
          }
        });
      }
      /*console.log(deptId);*/
      yield put({
        type:'getApplyPerson',

      })
    },

    //选中汇报人
    * displayApplyPerson({item}, {put}){
      /* console.log(item);*/
      yield put({
        type: 'save',
        payload: {
          // 把数据通过save函数存入state
          applyReset:item,
        },

      });
    },

    //获取汇报人下拉框数据
    * getApplyPerson({}, {call, select, put}){

      const { deptId,applyReset } = yield select (state =>state.applyPersonReset);
      const recData = {
        arg_dept_id:deptId.join(),
      };
      const response = yield call(meetManageService.applyPerson,recData);
      if(response.RetCode === '1'){
        const res = response.DataRows;
        res.push({deptname:"新家",deptperson:"["+applyReset+"]"});
        for (let i = 0, j = res.length; i < j; i++) {
          res[i].key = i;
        }
        /* console.log(res);*/
        yield put({
          type: 'save',
          payload: {
            // 把数据通过save函数存入state
            applyPersons: res,
          },

        });
      };

    },

    //人员不在下拉框请显示
    * handleOutSearchPerson({value},{call,select,put}){
      yield put({
        type:'save',
        payload:{
          outSearchPerson: value,
        }
      })
      yield put({
        type:'searchOutPerson'
      })
    },

    //搜索人员不在下拉框时查询服务
    * searchOutPerson({value},{call,select,put}){
      const { outSearchPerson } = yield select (state=>state.applyPersonReset);
      const recData = {
        arg_parameter:outSearchPerson
      };
      const response = yield call(meetManageService.searchApplyPerson,recData);
      if(response.RetCode==='1'){
        const res= response.DataRows;
        console.log(res);
        for(let i =0;i<res.length;i++){
          res[i].key=res[i].userid;
        }
        yield put({
          type:'save',
          payload:{
            outPersonTableSource:res
          }
        })

      }else{
        message.info('请确认输入是否正确，未查到相关数据')
      }

    },

    //搜索人员选中
    * outPersonChecked({value},{put}){
      /*console.log(value);*/
      yield put({
        type:'save',
        payload:{
          personValue:value
        }

      })

    },

    //全局搜索汇报人弹出框点击确定
    * handlePersonOk({}, {call, select, put}){

      const { applyReset, personValue } = yield select (state=>state.applyPersonReset);
      /*console.log(applyReset,applyResetID);*/
      let a = [];
      let b = [];
      for(let i = 0; i<personValue.length; i++){

        a.push(personValue[i].username);
        b.push(JSON.stringify({userid:personValue[i].userid,username:personValue[i].username}));
      }
      /* console.log(b);*/
      yield put({
        type: 'save',
        payload: {
          // 把数据通过save函数存入state
          applyReset:applyReset.concat(a),
          applyR:b,
          //applyPersons:JSON.parse(JSON.stringify(applyPersons)),
        },
      });
      yield put({
        type:'save',
        payload:{
          visible: false,
        }
      })
    },

    //预计填报时间
    * handleMinute({value}, {call, select, put}){

      const num =/^\d+$/;
      if(value.match(num)||value === ""){
        yield put({
          type:'save',
          payload:{
            writeMinute: value,
          }
        });
      }else{
        message.info('请填写数字，时间不得超过30分钟')
      }
    },

    //三重一大单选框
    * onRadioChange({value}, {call, select, put}){
      /*console.log(value);*/
      if(value === '1'){
        yield put({
          type:'save',
          payload:{
            resonDisplay: 'block',
          }
        })
      }else {
        yield put({
          type: 'save',
          payload: {
            resonDisplay: 'none',
            resonValue:''
          }
        });
      }
      yield put({
        type:'save',
        payload:{
          radioValue: value,
        }
      })
    },

    //三重一大原因
    * handleReasonChange({value},{call, select, put}){
      yield put({
        type:'save',
        payload:{
          resonValue:value,
        }
      })
    },

    //前置讨论事项单选框
    * onDiscussChange({value}, {call, select, put}){
      const {meetingTypeReset} = yield select (state => state.applyPersonReset);
      /* console.log(value,meetingTypeId);*/
      if(value === '1'&& meetingTypeReset=== '总经理办公会'){
        yield put({
          type:'save',
          payload:{
            discussModalDisplayvisible:true,
            reletiveDiscussDisplay:'block',
            discussDisplay:'none'

          }
        })
      }else if(value === '1'&& meetingTypeReset!== '总经理办公会'
      ){
        yield put({
          type: 'save',
          payload: {
            discussModalDisplayvisible:false,
            reletiveDiscussDisplay:'none',
            discussDisplay:'block',
          }
        });
      }else {
        yield put({
          type: 'save',
          payload: {
            discussDisplay: 'none',
            reletiveDiscussDisplay:'none',
            discussValue:''

          }
        });
      }
      yield put({
        type:'save',
        payload:{
          discussRadioValue: value,
        }
      })
    },

    //属于前置讨论事项原因：
    * handleDiscussChange({value},{call, select, put}){
      yield put({
        type:'save',
        payload:{
          discussValue:value,
        }
      })
    },

    //选中table一行数据
    * meetingTypeStudyChecked({value},{put}){
      let topic = [];
      for(let i = 0;i<value.length;i++){
        topic.push(value[i].topic_name)
      }
      yield put({
        type:'save',
        payload:{
          discussValue:topic.join('    '),
        }
      })
    },

    // 待决议事项内容
    * handleWaitChange({value},{call, select, put}){
      /* console.log(value);*/
      yield put({
        type:'save',
        payload:{
          textCont:value,
        }
      })
    },

    //是否已征求各部门意见
    * onDeptChange({value}, {call, select, put}){
      yield put({
        type:'save',
        payload:{
          deptRadioValue: value,
        }
      })
    },

    //上会材料是否泄密 修改状态
    * onMeetingChange({value}, {call, select, put}){

      const {meetingValue,tableUploadFile} = yield select(state => state.applyPersonReset);
      console.log(value,meetingValue);
      yield put({
        type: 'save',
        payload: {
          savemeetingRadioValue: value,  //暂存是否涉密
        }
      });

      if (value === '1'&& tableUploadFile.length!==0) {
        yield put({
          type: 'save',
          payload: {
            seceretIsVisible: true,
          }
        })
      }else if(value === '1'&& tableUploadFile.length===0){
        yield put({
          type: 'save',
          payload: {
            seceretIsVisible: false,
            meetingRadioValue: value,
            saveIsSecrate: value,
            meetingDisplay: 'block',
            materialsDisplay: 'none',
          }
        })
      }else if(value === '0'&& meetingValue===''){
        yield put({
          type: 'save',
          payload: {
            meetingRadioValue: value,
            saveIsSecrate: value,
            meetingDisplay: 'none',
            materialsDisplay: 'block',
          }
        })
      }else {
        yield put({
          type: 'save',
          payload: {
            /* meetingDisplay: 'none',
             materialsDisplay:'block',*/
            NOseceretIsVisible: true,

          }
        });
      }

    },

    //点击否时删除泄密原因说明、
    * deleteSecretReason({},{select, put}){
      const { savemeetingRadioValue }= yield select (state=>state.applyPersonReset);
      yield put({
        type: 'save',
        payload: {
          meetingDisplay: 'none',
          materialsDisplay:'block',
          meetingValue:'',
          NOseceretIsVisible:false,
          meetingRadioValue:savemeetingRadioValue,
          saveIsSecrate:savemeetingRadioValue,
        }
      });
    },

    //上会材料泄密原因说明
    * handleMeetingChange({value},{call, select, put}){
      /* console.log(value);*/
        yield put({
          type:'save',
          payload:{
            meetingValue:value,
          }
        })
    },


    //人员不在模块点击显示弹出框
    * showPersonModal({},{call, select, put}){
      yield put({
        type:'save',
        payload: {
          visible:true,
        }
      })
    },

    //人员不在模块点击显示弹出框点击取消
    * handlePersonCancel({},{call, select, put}){
      yield put({
        type:'save',
        payload:{
          visible: false,
        }
      })
    },

    //列席部门选中
    * outPartDeptChecked({value},{call,select,put}){
      const { outInputs,outDeptId } = yield select(state => state.applyPersonReset);
      if(value.target.checked===true){
        outInputs.push(value.target.deptName);
        outDeptId .push(value.target.value);
        yield put({
          type:'save',
          payload:{
            outInputs: [...outInputs],
            outDeptId :[...outDeptId]
          }
        });
      }else{
        let dept = outInputs.filter(i=>i!==value.target.deptName);
        let deptid = outDeptId.filter(i=>i !== value.target.value);
        yield put({
          type:'save',
          payload:{
            outInputs: [...dept],
            outDeptId:[...deptid]
          }
        });
      }

    },

    //列席部门点击确定
    * handlePartDeptOk({value},{call,select,put}){
      const { outInputs } = yield select(state => state.applyPersonReset);
      if(outInputs.length > 5){
        message.info('您已选择超过5个以上列席部门，建议不超过5个');
      }
      /*console.log(outInputs);*/
      //const outdeptFalse=JSON.parse(JSON.stringify(outInputs));
      /*console.log(outdeptFalse);*/
      yield put({
        type:'save',
        payload:{
          //outDept: outdeptFalse,
          partdeptVisible: false,
        }
      })
      /*console.log(Dept);*/
    },

    //点击弹出申请单位弹出框
    * handleDeptModal({},{put}){
      yield put({
        type:'save',
        payload: {
          deptVisible:true,
        }
      })
    },

    //点击弹出列席部门弹出框
    * handlePartDeptModal({},{call, select, put}){
      yield put({
        type:'save',
        payload: {
          partdeptVisible:true,
        }
      })
    },

    //点击取消按钮取消申请单位弹出框
    * handleDeptCancel({},{call, select, put}){
      yield put({
        type:'save',
        payload:{
          deptVisible: false,
        }
      })
    },

    //点击取消按钮取消列席部门弹出框
    * handlePartDeptCancel({},{call, select, put}){
      yield put({
        type:'save',
        payload:{
          partdeptVisible: false,
        }
      })
    },


    //确认修改上会材料涉密选项
    * seceretIsOk({}, {call, put, select}) {
      const {savemeetingRadioValue, tableUploadFile} = yield select(state => state.applyPersonReset);
      /*console.log(tableUploadFile);*/
      if (tableUploadFile.length) {
        let urlID = [];
        let urlID2 = [];
        for (let i = 0; i < tableUploadFile.length; i++) {
          if(tableUploadFile[i].upload_id){
            urlID.push(tableUploadFile[i].upload_id);
          }else{
            urlID2.push(tableUploadFile[i].RelativePath);
          }
        }
       /* console.log(urlID,urlID2);*/
        //走查询文件删除服务
        if(urlID.length !==0 && urlID2.length === 0){
          const recData = {
            arg_upload_id: urlID.join(),//上传材料id
          };
          const response = yield call(meetManageService.deleteUpload, recData);
          if (response.RetVal === '1') {
            message.info('删除成功');
            yield put({
              type: 'save',
              payload: {
                tableUploadFile:[],
                FileInfo:[],
                seceretIsVisible: false,
                meetingRadioValue: savemeetingRadioValue,
                saveIsSecrate: savemeetingRadioValue,
                meetingDisplay: 'block',
                materialsDisplay: 'none',
              }
            })
            yield put({
              type: 'searchUploadFile'
            })
          } else {
            message.info('删除失败');
          }
        }else if(urlID.length === 0 && urlID2.length !== 0){
          const recData = {
            RelativePath: urlID2.join(),//上传材料id
          };
          const response = yield call(meetManageService.writedeleteUpload,recData);
          if(response.RetCode==='1'){
            message.info('删除成功');
            yield put({
              type:'save',
              payload:{
                tableUploadFile:[],
                FileInfo:[],
                seceretIsVisible: false,
                meetingRadioValue: savemeetingRadioValue,
                saveIsSecrate: savemeetingRadioValue,
                meetingDisplay: 'block',
                materialsDisplay: 'none',
              }
            })

          }else{
            message.info('删除失败');
          }
        }else if(urlID.length !== 0 && urlID2.length !== 0){
          const recData1 = {
            arg_upload_id: urlID.join(),//上传材料id
          };
          const recData2= {
            RelativePath: urlID2.join(),//上传材料id
          };
          const response = yield call(meetManageService.deleteUpload, recData1);
          const response2 = yield call(meetManageService.writedeleteUpload,recData2);
          if (response.RetVal === '1') {
            yield put({
              type: 'save',
              payload: {
                seceretIsVisible: false,
                meetingRadioValue: savemeetingRadioValue,
                saveIsSecrate: savemeetingRadioValue,
                meetingDisplay: 'block',
                materialsDisplay: 'none',
                FileInfo:[],

              }
            })
            yield put({
              type: 'searchUploadFile'
            })
          } else {
            message.info('删除失败');
          }
          if(response2.RetCode==='1'){
            message.info('删除成功');
            yield put({
              type:'save',
              payload:{
                tableUploadFile:[],
                FileInfo:[],
                seceretIsVisible: false,
                meetingRadioValue: savemeetingRadioValue,
                saveIsSecrate: savemeetingRadioValue,
                meetingDisplay: 'block',
                materialsDisplay: 'none',
              }
            })

          }else{
            message.info('删除失败');
          }
        }


      }else {
        yield put({
          type: 'save',
          payload: {
            seceretIsVisible: false,
            meetingRadioValue: savemeetingRadioValue,
            saveIsSecrate: savemeetingRadioValue,
            meetingDisplay: 'block',
            materialsDisplay: 'none',
          }
        })
      }



    },

    //点击取消修改议题涉密
    * seceretIsCancel({},{put}){
      yield put({
        type:'save',
        payload:{
          seceretIsVisible: false,
          NOseceretIsVisible: false,
        }
      })

    },

    //点击提交
    * resetSubmissionTopic({},{call, select, put}){
      const { tableUploadFile,passData,topicName,applyR, radioValue,deptId,meetingTypeId,applyReset,writeMinute,outDeptId, resonValue,saveIsSecrate ,discussRadioValue, discussValue,deptRadioValue, meetingValue, textCont } = yield select (state=>state.applyPersonReset);
      /*console.log(applyReset);*/
      /*console.log(typeof outDeptId);
      console.log(outDeptId.toString());*/
      let applyUser =  applyReset.filter(i=>i.includes('userid')).concat(applyR);
      let ids = applyUser.map(i=>JSON.parse(i).userid);
      let names = applyUser.map(i=>JSON.parse(i).username);

      /* console.log(names);
       console.log(ids);*/
      let m = ids.filter(function(element,index,self){
        return self.indexOf(element) === index;
      });
      let n = names.filter(function(element,index,self){
        return self.indexOf(element) === index;
      });
      if(writeMinute>30){
        message.info('汇报时间不可大于30分钟')
      }else if(saveIsSecrate === "0" && tableUploadFile.length === 0){
        message.info('请上传上会材料');
      }else if(writeMinute ===""){
        message.info('请填写预计汇报时间')
      }else {
        const recData = {
          arg_topic_id: passData.topic_id,     //议题id
          arg_topic_dept_id: deptId.toString(),// 申请部门id，id可以多个用逗号隔开 |
          arg_topic_user_id:m.join(),//| 是 | 议题汇报人id，可以多个，用逗号隔开|
          arg_topic_user_name: n.join(),//是 | 议题汇报人名称，可以多个，用逗号隔开 |
          arg_topic_name: topicName, //是 | 议题名称   |
          arg_topic_type: meetingTypeId,//是   | 议题类型id |
          arg_topic_reporting_time: writeMinute,//是 | 议题汇报时长 |
          arg_topic_if_important: radioValue,//是 | 是否是三重一大|
          arg_topic_important_reason: resonValue,// 否 | 三重一大原因 |
          arg_topic_if_study: discussRadioValue,//否 | 是否是前置议题 |
          arg_topic_study_id: discussValue,//否 |总办会:前置研究的议题id，党委会:是前置讨论事项的原因 |
          arg_topic_other_dept_id: outDeptId.toString(),// 是 | 参与议题的部门id  |
          arg_topic_if_opinions: deptRadioValue,//是  | 是否征求相关部门意见 |
          arg_topic_content: textCont,         // 是 | 待决议事项  |
          arg_topic_if_secret: saveIsSecrate,              //议题是否涉密
          arg_topic_secret_reason: meetingValue,              //材料涉密说明
          arg_create_user_id: Cookie.get('userid'),// 是 | 创建人id  |,
          arg_create_user_name: Cookie.get('username'),//是 | 创建人姓名  |
          arg_topic_check_state: passData.topic_check_state, //VARCHAR(1),-- 议题状态
          arg_topic_check_state_desc: passData.topic_check_state_desc, //VARCHAR(100),-- 议题状态描述
          arg_upload_info  :JSON.stringify(tableUploadFile.filter(i=>!i.hasOwnProperty('upload_id'))),

        };
        const response = yield call(commonAppService.submissionReset, recData);
        if (response.RetCode === '1') {
          message.info('修改成功');
          yield put({
            type:'sendMessage'
          })
          yield put(routerRedux.push({
            pathname: '/taskList'
          }))
        }
      }
    },

    //发送通知
    * sendMessage({},{call, select,}){
      const {topicId} =  yield select (state=>state.applyPersonReset);
      const recData = {
        arg_topic_id:topicId
      };
      const response = yield call(meetManageService.sendMessage, recData);
      if (response.RetCode === '1') {
        message.info('已发送审核通知');
      }else{
        message.info('发送审核通知失败');
      }
    },

    //表格点击上传附件删除
    * localDeleteUpload({record},{call, select, put}){
        const {tableUploadFile} = yield select(state => state.applyPersonReset);

        let a = tableUploadFile.filter(i=>i.RelativePath !== record.RelativePath );
       /* console.log(tableUploadFile)
      console.log(record);*/
        yield put({
          type:'save',
          payload:{
            tableUploadFile:JSON.parse(JSON.stringify(a)),
            //FileInfo:c
          }
        })

      //}
    },

    //点击取消 返回上一级并清空填报内容
    * cancelTopic ({},{call, select, put}){
      yield put({
        type:'save',
        payload:{
          topicName:'',
          Dept:'',
          deptId:'',
          writeMinute:'10',
          radioValue:'',
          resonValue:'',
          discussRadioValue:'',
          discussValue:'',
          outDept:'',
          outDeptId:'',
          deptRadioValue:'',
          textCont:'',
          saveIsSecrate:'',
          meetingValue:'',
          tableUploadFile:[],
        }
      })
    },

    //保存附件名称地址
    * saveUploadFile({value},{call,select,put}){
      /* console.log(value);*/
      const {tableUploadFile} = yield select(state => state.applyPersonReset);
      tableUploadFile.push({upload_name:value.filename.RealFileName,AbsolutePath:value.filename.AbsolutePath,RelativePath:value.filename.RelativePath,key:value.filename.AbsolutePath});
      /* console.log(tableUploadFile);*/
      //FileInfo.push({arg_upload_name:value.filename.RealFileName,arg_upload_url:value.filename.RelativePath,arg_upload_real_url:value.filename.AbsolutePath});
      /*console.log("\""+JSON.stringify(FileInfo)+"\"");*/
      yield put({
        type:'save',
        payload:{
          ///FileInfo:FileInfo,
          tableUploadFile:JSON.parse(JSON.stringify(tableUploadFile))
        }
      })
    },

    //附件查询
    * searchUploadFile({},{call, select, put}){
      const { topicName }=yield select (state=>state.applyPersonReset);
      const recData={
        arg_upload_topic_name:topicName//会议议题名称
      };
      const response = yield call(meetManageService.searchFileUpload,recData);
      if(response.RetCode ==='1'){
        const res = response.DataRows;
        /*  console.log(res);*/
        for(let i =0;i<res.length;i++){
          res[i].key=i;
        }
        yield put({
          type:'save',
          payload:{
            tableUploadFile:res,
            saveStartUpload:res
          }
        })
        yield put({
          type:'addFileInfo'
        })
      }

    },

    * addFileInfo({},{call, select, put}){

        const { FileInfo,tableUploadFile }=yield select (state=>state.applyPersonReset);
        if(FileInfo.length!==0){
          for(let i = 0;i<FileInfo.length;i++){
            tableUploadFile.push({upload_name:FileInfo[i].arg_upload_name,AbsolutePath:FileInfo[i].arg_upload_real_url,RelativePath:FileInfo[i].arg_upload_url,key:FileInfo[i].arg_upload_url})
          }
          /*console.log(tableUploadFile);*/
          yield put({
            type:'save',
            payload:{
              tableUploadFile:JSON.parse(JSON.stringify(tableUploadFile))
            }
          })
        }
    },

    //附件删除
    * deleteUpload({record},{call, select, put}){
      /*console.log(record);*/
     /* const { FileInfo }=yield select (state=>state.applyPersonReset);*/
      const {tableUploadFile} = yield select(state => state.applyPersonReset);
      const recData={
        arg_upload_id:record.upload_id,//上传材料id
      };
      const response = yield call(meetManageService.deleteUpload,recData);
      if(response.RetVal==='1'){
        message.info('删除成功');
        let a = tableUploadFile.filter(i=>i.upload_name !== record.upload_name );
        yield put({
          type:'save',
          payload:{
            ///FileInfo:FileInfo,
            tableUploadFile:JSON.parse(JSON.stringify(a))
          }
        })
      }
      /*yield put({
        type:'searchUploadFile'
      })*/

    },

    //弹出相关议题modal
    * openModal({},{put}){
      yield put({
        type:'save',
        payload:{
          discussModalDisplayvisible: true,
        }
      })
    }
  },

  subscriptions: {
    setup({dispatch, history}) {
      return history.listen(({pathname, query}) => {
        if (pathname === '/applyPersonReset') { //此处监听的是连接的地址
          dispatch({
            type: 'init',
            query
          });
        }
      });
    },
  },
};

