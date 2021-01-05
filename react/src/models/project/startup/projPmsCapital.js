/**
 * 作者：张枫
 * 日期：2018-09-18
 * 邮箱：zhangf142@chinaunicom.cn
 * 说明：项目启动-资本化项目
 **/
import * as projPmsCapitalService from '../../../services/project/projPmsCapitalService';
import Cookie from 'js-cookie';
import {message} from 'antd';
export default {
  namespace : 'projPmsCaptial',
  state :{
    projList : [],
    detailsList : [],
    pmsList : [],
    detailRecord :'',
    startDingDingModal : false, //开始-是否开启钉钉通知弹框
    endDingDingModal : false,  //结束-是否开启钉钉通知弹框
    allEndModal : false, //全部结束模态框
    proj_time :'',
    pms_time :'',
    arg_proj_id : '',
    arg_proj_uid : '',
    arg_pms_uuid : '',
    pmsData :{
      arg_flag : '',//PMS项目开始或关闭  0:开始 1：结束
    },
    tagList:[],
    tag_key:'0',
    tag_value:'全部',
    projParam :{
      arg_staff_id : '',
      arg_page_size : '',
      arg_page_current: 1,
      arg_proj_name:'',
      arg_proj_code:'',
      arg_mgr_name:'',
      rowCount :'',
      tag_key:'0',
    },
    pmsParam :{
      arg_page_size :'',
      arg_page_current : 1,
      rowCount : '',
      proj_id :'',
    },
    contentIndex : 'mainPage',
  },
  reducers:{
    initData(state) {
      return{
        ...state,
      }
    },
    save(state, action) {
      return {
        ...state,
        ...action.payload,
      }
    }
  },
  effects: {
    /**
     * 作者：张枫
     * 日期：2018-09-25
     * 邮箱：zhangf142@chinaunicom.cn
     * 说明：初始化查询
     **/
      *initQueryProjInfo( {},{ put}){
      let projParam = {
        arg_staff_id : '',
        arg_page_size : '',
        arg_page_current: 1,
        arg_proj_name:'',
        arg_proj_code:'',
        arg_mgr_name:'',
        rowCount :'',
        tag_key:'0',
      };
      yield put({
        type : 'save',
        payload :{
          projParam : JSON.parse(JSON.stringify(projParam))
        }
      });
      yield put({
        type : 'queryProjInfoDataList',
      });
      yield put({
        type : 'queryTag',
      });
    },
    /**
     * 作者：张枫
     * 日期：2018-09-18
     * 邮箱：zhangf142@chinaunicom.cn
     * 说明：项目列表查询
     **/
    *queryProjInfoDataList({}, {call,select,put}){
      let {projParam} = yield select(state =>state.projPmsCaptial);
      let postData = {
        arg_staff_id :Cookie.get('userid'),
        arg_page_size :10,
        arg_page_current :projParam.arg_page_current,
        arg_proj_name : projParam.arg_proj_name,
        arg_mgr_name : projParam.arg_mgr_name,
        arg_tag:projParam.tag_key
      };
      let data = yield call(projPmsCapitalService.queryProjInfoDataList,postData) ;
      if (data.RetCode === '1'){
        projParam.rowCount = data.RowCount;
        data.DataRows.forEach((item,index) => {
          item.key = index;
          let pms_list = item.pms_list;
          pms_list = pms_list.replace(/\"\[+/g, ':[');
          pms_list = pms_list.replace(/\]\"/g, ']');
          pms_list = JSON.parse(pms_list);
          pms_list.forEach((innerItem)=>{
            innerItem.proj_id = item.proj_id;
            innerItem.proj_uid = item.proj_uid;
          });
          item.pms_list = pms_list;
        });
      }
      yield put({
        type: 'save',
        payload: {
          projList: data.DataRows,
          tableParam1: JSON.parse(JSON.stringify(data.DataRows)),
          projParam: JSON.parse(JSON.stringify(projParam)),
          contentIndex : 'mainPage',
        }
      })
    },
    /**
     * 作者：张枫
     * 日期：2018-09-18
     * 邮箱：zhangf142@chinaunicom.cn
     * 说明：PMS开始、PMS结束、项目全部结束
     **/
    *startOrEndProjectCapital({ pms_uuid,proj_id,proj_uid,arg_flag},{select,put}){
      let {startDingDingModal,endDingDingModal,allEndModal} = yield select(state =>state.projPmsCaptial);
      if (arg_flag === '0')
      {
        startDingDingModal = true;
      } else if (arg_flag === '1'){
        endDingDingModal = true;
      }else if (arg_flag === '2'){
        allEndModal =true;
      }
      yield put ({
        type : 'save',
        payload : {
          startDingDingModal :startDingDingModal,
          endDingDingModal :endDingDingModal,
          allEndModal :allEndModal,
          arg_pms_uuid : pms_uuid,
          arg_proj_id :proj_id,
          arg_proj_uid :proj_uid,
        },
      });
    },
    /**
     * 作者：张枫
     * 日期：2018-09-18
     * 邮箱：zhangf142@chinaunicom.cn
     * 说明：确认 开始or结束or全部结束
     **/
    *confirmSendDingDing({values,arg_flag},{select,call,put}){
      let {startDingDingModal,endDingDingModal,arg_pms_uuid,arg_proj_id,arg_proj_uid,allEndModal} = yield select(state =>state.projPmsCaptial);
      if (arg_flag === '0')
      {
        startDingDingModal = false;
      } else if (arg_flag === '1'){
        endDingDingModal = false;
      }else if (arg_flag === '2'){
        allEndModal = false;
      }
      let postData ={
        arg_proj_id : arg_proj_id,
        arg_proj_uid : arg_proj_uid,
        arg_opt_byid : Cookie.get('userid'),
        arg_is_send_dingding : values.arg_is_send_dingding === true ? '1':'0',
        arg_flag : arg_flag,
        arg_pms_uuid : arg_pms_uuid,
      };
      const data = yield call (projPmsCapitalService.startOrEndProjectCapital,postData);
      if (data.RetCode ==='1'){
        yield put({
          type: 'initQueryProjInfo'
        });
        message.info("操作成功！");
      }
      else{
        message.info("操作失败！");
      }
      yield put ({
        type : 'save',
        payload : {
          startDingDingModal :startDingDingModal,
          endDingDingModal :endDingDingModal,
          allEndModal :allEndModal,
        },
      });
    },
    /**
     * 作者：张枫
     * 日期：2018-09-25
     * 邮箱：zhangf142@chinaunicom.cn
     * 说明：资本项目查看
     **/
      *queryProjCaptialDetail({proj_id,pms_uuid,record},{select,put,call}){
      let {pmsParam} = yield select(state =>state.projPmsCaptial);
      pmsParam.arg_page_current=1;
        yield put ({
          type : 'save',
          payload : {
            pmsParam: JSON.parse(JSON.stringify(pmsParam)),
          }
        });
      if (proj_id !== 'NAN')
      {
        pmsParam.proj_id = proj_id;
      }
      //detailRecord = record;
      let postData = {
        arg_proj_id : pmsParam.proj_id,
        arg_page_size : '10',
        arg_page_current : pmsParam.arg_page_current,
       // arg_page_current : 1,
        //arg_proj_pms_uuid : pms_uuid,
      };
      const data = yield call(projPmsCapitalService.queryProjDetailDataList,postData);
      if (data.RetCode === '1'){
        pmsParam.rowCount = data.RowCount,
            data.DataRows.forEach((item,index)=>{
              item.key=index;
            });
        yield put ({
          type : 'save',
          payload : {
            contentIndex : 'details',
            detailsList : data.DataRows,
            detailRecord : record,
            pmsParam: JSON.parse(JSON.stringify(pmsParam)),
          },
        });
      }
    },
    /**
     * 作者：张枫
     * 日期：2018-09-25
     * 邮箱：zhangf142@chinaunicom.cn
     * 说明：返回资本化项目
     **/
      *goBack({content}, {call,select,put}){
      let {projParam} = yield select(state =>state.projPmsCaptial);
      let postData = {
        arg_staff_id :Cookie.get('userid'),
        arg_page_size :10,
        arg_page_current :projParam.arg_page_current,
        arg_proj_name : projParam.arg_proj_name,
        arg_mgr_name : projParam.arg_mgr_name,
        arg_tag:projParam.tag_key
      };
      const data = yield call(projPmsCapitalService.queryProjInfoDataList,postData) ;
      if (data.RetCode === '1'){
        projParam.rowCount = data.RowCount;
        data.DataRows.forEach((item,index) => {
          item.key = index;
          let pms_list = item.pms_list;
          pms_list = pms_list.replace(/\"\[+/g, ':[');
          pms_list = pms_list.replace(/\]\"/g, ']');
          pms_list = JSON.parse(pms_list);
          pms_list.forEach((innerItem)=>{
            innerItem.proj_id = item.proj_id;
            innerItem.proj_uid = item.proj_uid;
          });
          item.pms_list = pms_list;
        });
        yield put({
          type: 'save',
          payload: {
            projList: data.DataRows,
            contentIndex : content,
          }
        })
      }
    },
    /**
     * 作者：张枫
     * 创建日期：2018-09-26
     * 功能：设置是选择框的值
     * @param value 选择的key
     * @param objParam 输入的对象参数
     */
      *searchProject({value,objParam},{ put, select }){
      let {projParam} =  yield select( state => state.projPmsCaptial);
      projParam[objParam] = value;
      yield put({
        type: 'save',
        payload:{
          projParam: JSON.parse(JSON.stringify(projParam))
        }
      });
    },
    /**
     * 作者：张枫
     * 创建日期：2018-09-26
     * 功能：点击查询或清空
     */
      *queryProject({typeItem},{ put,select }){
      let {projParam} = yield select(state =>state.projPmsCaptial);
      projParam.arg_page_current = 1;
      yield put({
        type: 'save',
        payload: {
          projParam: JSON.parse(JSON.stringify(projParam))
        }
      });
      if (typeItem === 'query'){
        yield put({
          type : 'queryProjInfoDataList1',
        });
      }
      else if (typeItem === 'clear'){
        yield put({
          type : 'initQueryProjInfo',
        });

      }
    },
    *queryProjInfoDataList1({}, {call,select,put}){
      let {projParam} = yield select(state =>state.projPmsCaptial);
      let postData = {
        arg_staff_id :Cookie.get('userid'),
        arg_page_size :10,
        arg_page_current :1,
        arg_proj_name : projParam.arg_proj_name,
        arg_mgr_name : projParam.arg_mgr_name,
        arg_tag:projParam.tag_key,
      };
      let data = yield call(projPmsCapitalService.queryProjInfoDataList,postData) ;
      if (data.RetCode === '1'){
        projParam.rowCount = data.RowCount;
        data.DataRows.forEach((item,index) => {
          item.key = index;
          let pms_list = item.pms_list;
          pms_list = pms_list.replace(/\"\[+/g, ':[');
          pms_list = pms_list.replace(/\]\"/g, ']');
          pms_list = JSON.parse(pms_list);
          pms_list.forEach((innerItem)=>{
            innerItem.proj_id = item.proj_id;
            innerItem.proj_uid = item.proj_uid;
          });
          item.pms_list = pms_list;
        });
      }
      yield put({
        type: 'save',
        payload: {
          projList: data.DataRows,
          tableParam1: JSON.parse(JSON.stringify(data.DataRows)),
          projParam: JSON.parse(JSON.stringify(projParam)),
          contentIndex : 'mainPage',
        }
      })
    },

    /**
     * 作者：张枫
     * 创建日期：2018-09-26
     * 功能：取消 开始or 结束 or 全部结束
     */
      *cancelSendDingDing({arg_flag},{put,select}){
      let {startDingDingModal,endDingDingModal,allEndModal} = yield select(state =>state.projPmsCaptial);
      //startDingDingModal = 'true';
      if (arg_flag === '0')
      {
        startDingDingModal = false;
      } else if (arg_flag === '1'){
        endDingDingModal = false;
      } else if(arg_flag === '2'){
        allEndModal =false;
      }
      yield put ({
        type :'save',
        payload : {
          startDingDingModal : startDingDingModal,
          endDingDingModal :endDingDingModal,
          allEndModal : allEndModal,
        }
      });
    },
    /**
     * 作者：张枫
     * 创建日期：2018-09-26
     * 功能：页码处理
     */
    *handlePage({page},{put,select}){
      let {projParam} = yield select(state => state.projPmsCaptial);
      projParam.arg_page_current = page;
      yield put({
        type: 'save',
        payload: {
          projParam: JSON.parse(JSON.stringify(projParam))
        }
      });
      yield put({
        type: 'queryProjInfoDataList'
      });
    },

/**
     * 作者：张枫
     * 创建日期：2018-09-26
     * 功能：pms查看页码处理
     */
      *handlePmsPage({page},{put,select,call}){
      let {pmsParam} = yield select(state => state.projPmsCaptial);
      pmsParam.arg_page_current = page;
      let postData = {
        arg_proj_id : pmsParam.proj_id,
        arg_page_size : '10',
        arg_page_current : pmsParam.arg_page_current,
      };
      const data = yield call(projPmsCapitalService.queryProjDetailDataList,postData);
      if (data.RetCode === '1'){
        pmsParam.rowCount = data.RowCount,
            data.DataRows.forEach((item,index)=>{
              item.key=index;
            });
        yield put ({
          type : 'save',
          payload : {
            contentIndex : 'details',
            detailsList : data.DataRows,
            pmsParam: JSON.parse(JSON.stringify(pmsParam)),
          },
        });
      }
    },
    /**
     * 作者：张枫
     * 创建日期：2018-09-26
     * 功能:状态列表查询
     */
    *queryTag({},{select,put,call}){
      let {tagList} = yield select(state =>state.projPmsCaptial);
      const data = yield call(projPmsCapitalService.queryTag,'');
      if(data.RetCode === '1'){
       tagList=data.DataRows;
        yield put ({
          type : 'save',
          payload : {
            tagList:tagList
          },
        });
      }

    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/projectApp/projStartUp/projPmsCapital') {
          dispatch({type:'initQueryProjInfo',query});
        }
      });
    },
  }
}
