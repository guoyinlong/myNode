/**
 * 作者：张枫
 * 日期：2019-01-13
 * 邮箱：zhangf142@chinaunicom.cn
 * 说明：合作伙伴-信息填报保存提交
 **/
import * as infoFillService from '../../../../services/project/partnerService';
import { getUuid } from '../../../../utils/func';
import Cookie from 'js-cookie';
import {message } from 'antd';
export default{
  namespace: 'infoFill',
  state: {
    isDelVisible :false, //
    projList: [], // 项目信息列表
    saveProjList:[],//选择日期后查询保存的某项目下合作伙伴数据
    saveProjList1:[],//保存后查询数据
    saveProjList2 :[],
    partnerList: [], //合作伙伴列表数据
    arg_total_year:'', //保存选择的年份
    arg_total_month:'', //保存选择的月份
    arg_proj_code:'',//保存选择项目code
    arg_proj_name:'',//保存选择项目名称
    partnerId:'',//取消勾选合作伙伴id
    isCardVisible :false,// 提示是否删除合作伙伴提示模态框记录
    isWorkloadServiceVisible:false,// 模态框是否可见
    workloadModalKey: '',
    isPreviewSubmitModalVisible:false,// 提交预览弹框不可见
    partner_name_modal:'',//模态框中展示的合作伙伴名称
    partner_id_modal:'',
    defaultDate:"",// 初始化日期
    workLoadServiceParam : {
      arg_month_work_cnt_h: 0,  //高级标准工作量
      arg_other_month_work_cnt_h: 0,//高级额外工作量
      arg_month_work_cnt_m: 0,//中级标准工作量
      arg_other_month_work_cnt_m: 0,//中级额外工作量
      arg_month_work_cnt_l: 0,//低级标准工作量
      arg_other_month_work_cnt_l: 0,//低级额外工作量
      arg_stability_score: 0, //资源稳定性
      arg_attend_score: 0,//资源覆盖率
      arg_delivery_score: 0,//交付及时率
      arg_quality_score: 0,//交付质量
      arg_manage_score: 0,//管理规范性
      arg_invest_score:0,//资源投入率
    },
    partner_param:'',
  },
  reducers: {
    initData(state){
      return {
        ...state,
      }
    },
    save(state, action){
      return {
        ...state,
        ...action.payload,
      }
    }
  },
  effects: {
    /**
     * 作者：张枫
     * 日期：2019-02-27
     * 邮箱：zhangf142@chinaunicom.cn
     * 说明：填报页面初始化
     **/
     *init({}, {call,put,select}){
      //初始化数据
      //初始化查询 登录账号下各项目
      let postData = {
        arg_user_id: Cookie.get('userid'),
        arg_total_year:'',
        arg_total_month:'',
        arg_proj_code:''
      };
      let data = yield call(infoFillService.infoFillQuery, postData); //基本信息查询
      data.DataRows.forEach((item,index) => {
        item.key = index;
        });
      if (data.RetCode === '1')
      {
        yield put({
          type : 'save',
          payload:{
            defaultDate:'',
            projList : JSON.parse(JSON.stringify(data.DataRows)),
            saveProjList:[],
            saveProjList2 :[],

          }
        });
        /*
        yield put({
          type : 'queryPartner',
        });
        */
        //初始化保存首个项目的项目code 供tab使用
        let {projList,arg_proj_code} = yield select(state =>state.infoFill);
        if(projList.length!=0){
          for(let i =0;i<projList.length;i++)
          {
            arg_proj_code=projList[0].proj_code;
          }
          yield put({
            type : 'save',
            payload:{
              arg_proj_code : arg_proj_code
            }
          });
        }
      }
      else {
        message.info('查询失败');
      }
    },
    *initTab({}, {call,put,select}){
      //初始化数据
      //初始化查询 登录账号下各项目
      let postData = {
        arg_user_id: Cookie.get('userid'),
        arg_total_year:'',
        arg_total_month:'',
        arg_proj_code:''
      };
      let data = yield call(infoFillService.infoFillQuery, postData); //基本信息查询
      data.DataRows.forEach((item,index) => {
        item.key = index;
      });
      if (data.RetCode === '1')
      {
        yield put({
          type : 'save',
          payload:{
            defaultDate:'',
            projList : JSON.parse(JSON.stringify(data.DataRows)),
            saveProjList:[],
            saveProjList2 :[],

          }
        });
      }
      else {
        message.info('查询失败');
      }
    },
    /**
     * 作者：张枫
     * 日期：2019-02-20
     * 邮箱：zhangf142@chinaunicom.cn
     * 说明：各项目保存数据查询
     **/
    *queryProject({},{select,put,call}){
      let {arg_total_year,arg_total_month,arg_proj_code,saveProjList1,saveProjList2} = yield select(state =>state.infoFill);
      saveProjList2 =[];
      let postData = {
        arg_user_id: Cookie.get('userid'),
        arg_total_year:arg_total_year,
        arg_total_month:arg_total_month,
        arg_proj_code:arg_proj_code,
      };
      let data = yield call(infoFillService.infoFillQuery, postData); //基本信息查询
      data.DataRows.forEach((item,index) => {
        item.key = index;
      });
      if (data.RetCode === '1') {
        saveProjList1 = JSON.parse(JSON.stringify(data.DataRows));
        for(let i =0;i<saveProjList1.length;i++)
        {
          // if(saveProjList1[i].state ==2 ||saveProjList1[i].state ==4){
          saveProjList1[i].year_month = arg_total_year+"-"+arg_total_month;
          let workload = JSON.parse(saveProjList1[i].work_load);
          for(let j =0;j<workload.length;j++){
            if(workload[j].level_id=="A"){
              saveProjList1[i].month_work_cnt_h=workload[j].month_work_cnt;
              saveProjList1[i].other_month_work_cnt_h=workload[j].other_month_work_cnt;
              saveProjList1[i].workload_sum_h=workload[j].workload_sum;
            }else if(workload[j].level_id=="B"){
              saveProjList1[i].month_work_cnt_m=workload[j].month_work_cnt;
              saveProjList1[i].other_month_work_cnt_m=workload[j].other_month_work_cnt;
              saveProjList1[i].workload_sum_m=workload[j].workload_sum;
            }else if(workload[j].level_id=="C"){
              saveProjList1[i].month_work_cnt_l=workload[j].month_work_cnt;
              saveProjList1[i].other_month_work_cnt_l=workload[j].other_month_work_cnt;
              saveProjList1[i].workload_sum_l=workload[j].workload_sum;
            }
          }
        }
        if(saveProjList1.length!=0){
          for(let i =0;i<saveProjList1.length;i++)
          {
            if(saveProjList1[i].state ==2||saveProjList1[i].state ==4){
              saveProjList2.push(saveProjList1[i]);
            }
          }
        }
        yield put({
          type : 'save',
          payload:{
            saveProjList : JSON.parse(JSON.stringify(data.DataRows)),
            saveProjList2:saveProjList2,

          }
        });
        // 如果有合作伙伴数据，展示数据函数
        yield put({
          type : 'showCardParam',
        });
      }
      else {
        message.info('查询失败');
      }
    },
/**
    *queryProject1({},{select,put,call}){
      let {arg_total_year,arg_total_month,arg_proj_code,saveProjList1,saveProjList2} = yield select(state =>state.infoFill);
      let postData = {
        arg_user_id: Cookie.get('userid'),
        arg_total_year:arg_total_year,
        arg_total_month:arg_total_month,
        arg_proj_code:arg_proj_code,
      };
      let data = yield call(infoFillService.infoFillQuery, postData); //基本信息查询
      data.DataRows.forEach((item,index) => {
        item.key = index;
      });
      saveProjList1 = JSON.parse(JSON.stringify(data.DataRows));

      for(let i =0;i<saveProjList1.length;i++)
      {
        // if(saveProjList1[i].state ==2 ||saveProjList1[i].state ==4){
        saveProjList1[i].year_month = arg_total_year+"-"+arg_total_month;
        let workload = JSON.parse(saveProjList1[i].work_load);
        for(let j =0;j<workload.length;j++){
          if(workload[j].level_id=="A"){
            saveProjList1[i].month_work_cnt_m=workload[j].month_work_cnt;
            saveProjList1[i].other_month_work_cnt_m=workload[j].other_month_work_cnt;
            saveProjList1[i].workload_sum_m=workload[j].workload_sum;
          }else if(workload[j].level_id=="B"){
            saveProjList1[i].month_work_cnt_h=workload[j].month_work_cnt;
            saveProjList1[i].other_month_work_cnt_h=workload[j].other_month_work_cnt;
            saveProjList1[i].workload_sum_h=workload[j].workload_sum;
          }else if(workload[j].level_id=="C"){
            saveProjList1[i].month_work_cnt_l=workload[j].month_work_cnt;
            saveProjList1[i].other_month_work_cnt_l=workload[j].other_month_work_cnt;
            saveProjList1[i].workload_sum_l=workload[j].workload_sum;
          }
        }
      }
      if(saveProjList1.length!=0){
        for(let i =0;i<saveProjList1.length;i++)
        {
          if(saveProjList1[i].state ==2||saveProjList1[i].state ==4){
            saveProjList2.push(saveProjList1[i]);
          }
        }
      }
      console.log("saveProjList2");
      console.log(saveProjList2);
      yield put({
        type : 'save',
        payload:{
          saveProjList1 : saveProjList1,
          saveProjList2 : saveProjList2,
        }
      });
    },
**/
    /**
     * 作者：张枫
     * 日期：2019-02-20
     * 邮箱：zhangf142@chinaunicom.cn
     * 说明：合作伙伴列表查询（所有合作伙伴）
     **/
    *queryPartner({},{call,put,select}){
      let postData = {
        arg_null:''
      };
      let data = yield call(infoFillService.queryPartner,postData);
      if (data.RetCode === '1') {
        //增添可见不可见新属性
        for (let i =0;i<data.DataRows.length;i++){
          {
            data.DataRows[i].visible= false;
            data.DataRows[i].disabled= true;
          }
        }
        yield put({
          type : 'save',
          payload:{
            partnerList : data.DataRows,
          }
        });
      }
      else {
        message.info('合作伙伴列表查询失败');
      }
    },
    /**
     * 作者：张枫
     * 日期：2019-02-20
     * 邮箱：zhangf142@chinaunicom.cn
     * 说明：根据合作伙伴保存数据展示卡片
     **/
    *showCardParam({},{put,select}){
      let {saveProjList,partnerList,isDelVisible} = yield select(state =>state.infoFill);
      for (let i =0;i<partnerList.length;i++){
        partnerList[i].visible=false; //现将合作伙伴都置为不显示，以免显示其他月份的。  勾选
        partnerList[i].disabled=false;  //  全部可见
        for(let j=0;j<saveProjList.length;j++)
        {
          if(partnerList[i].partner_name==saveProjList[j].partner_name){
            partnerList[i].visible=true;
          }
          //  0  审核通过数据  3  提交 未审核   4  退回 2 保存  2、4 均可填写    （0、3 不可填写）
          if(partnerList[i].partner_name==saveProjList[j].partner_name){
            if((saveProjList[j].state ==3)||(saveProjList[j].state ==0)||(saveProjList[j].state ==1)||(saveProjList[j].state ==5)){
              partnerList[i].disabled=true;
            }
          }
        }
      }
      isDelVisible = false;
      for (let i =0;i<partnerList.length;i++){
        if((partnerList[i].visible==true)&&(partnerList[i].disabled==false)){
          isDelVisible = true;
        }
      }
      yield put({
        type : 'save',
        payload:{
          partnerList : partnerList,
          isDelVisible:isDelVisible

        }
      });
    },
    /**
     * 作者：张枫
     * 日期：2019-02-20
     * 邮箱：zhangf142@chinaunicom.cn
     * 说明：根据合作伙伴勾选记录记录对应卡片展示状态
     **/
    *selectPartner({partnerName,partnerId,value},{select,put,call}){
      let {partnerList} = yield select(state =>state.infoFill);
      for (let i =0;i<partnerList.length;i++){
        if(partnerName==partnerList[i].partner_name){
          partnerList[i].visible=value
        }
      }
      //如果checkbox 为false 则认为要删除卡片数组
      if(value == false){
        yield put({
          type : 'save',
          payload:{
            partnerId : partnerId,
            isCardVisible : true
          }
        });
      }
      yield put({
        type : 'save',
        payload:{
          partnerList : JSON.parse(JSON.stringify(partnerList)),
        }
      });
    },
    /**
     * 作者：张枫
     * 日期：2019-02-20
     * 邮箱：zhangf142@chinaunicom.cn
     * 说明：删除卡片数据
     **/
    *deleteCard({},{select,put,call}){
      let {arg_total_year,arg_total_month,arg_proj_code,partnerId,saveProjList} = yield select(state =>state.infoFill);
      let postData = {
        arg_proj_code : arg_proj_code,
        arg_total_year : arg_total_year,
        arg_total_month : arg_total_month,
        arg_partner_id : partnerId
      };
      let data = yield call(infoFillService.deleteFilledWorkload,postData) ;
      if(data.RetCode == "1"){
        yield put({
          type : 'save',
          payload:{
            isCardVisible : false
          }
        });
        // 如果删除的卡片是已有数据保存的卡片  则删除后刷新页面，  若是未填写数据的卡片 删除后不用刷新页面
        let temp = false;
        // 删除一条数据后，重新查询一遍数据
        if(saveProjList.length!=0){
          saveProjList.map((item)=>{
            if (partnerId==item.partner_id){
              temp =true;
            }
          })
         }
        //如果是已保存数据的卡片，刷新页面
        if(temp ==true){
          yield put({
            type : 'queryProject',
          });
        }
      }
    },
    /**
     * 作者：张枫
     * 日期：2019-02-20
     * 邮箱：zhangf142@chinaunicom.cn
     * 说明：取消删除卡片
     **/
    *cancelDeleteCard({},{select,put,call}){
      let {partnerId,partnerList} = yield select(state =>state.infoFill);
      for(let i =0;i<partnerList.length;i++){
        if(partnerId==partnerList[i].partner_id)
          partnerList[i].visible =true;
      }
        yield put({
          type : 'save',
          payload:{
            isCardVisible : false,
            partnerList:partnerList
          }
        });
    },
    /**
     * 作者：张枫
     * 日期：2019-02-20
     * 邮箱：zhangf142@chinaunicom.cn
     * 说明：工作量填报及服务评价模块模态框展示
     **/
    *showWorkloadServiceModal({partner_name,partner_id,partner_param},{put}){
      yield put({
        type : 'save',
        payload:{
          isWorkloadServiceVisible:true,
          workloadModalKey: getUuid(32,64),
          partner_name_modal:partner_name,
          partner_id_modal:partner_id,
          partner_param:partner_param,
        }
      });
    },
    /**
     * 作者：张枫
     * 日期：2019-02-20
     * 邮箱：zhangf142@chinaunicom.cn
     * 说明：取消工作量填报及服务评价模块模态框展示
     **/
    *cancelWorkloadServiceModal({},{put}){
      yield put({
        type : 'save',
        payload:{
          isWorkloadServiceVisible : false,
        }
      });
    },
    /**
     * 作者：张枫
     * 日期：2019-02-20
     * 邮箱：zhangf142@chinaunicom.cn
     * 说明：记录勾选年月
     **/
    *selectYearMonth({dateTime},{put,select,call}){
      //let {partnerList} = yield select(state =>state.infoFill);
      if(dateTime== ''){
        yield put({
          type : 'save',
          payload:{
            arg_total_year : dateTime.slice(0,4),
            arg_total_month :dateTime.slice(5),
          }
        });
        yield put({
          type : 'save',
          payload:{
            defaultDate:dateTime,
          }
        });
        yield put({
          type : 'queryProject',
        });
        yield put({
          type : 'queryPartner',
        });
      }else
      {
        yield put({
          type : 'save',
          payload:{
            arg_total_year : dateTime.slice(0,4),
            arg_total_month :dateTime.slice(5),
          }
        });
        yield put({
          type : 'save',
          payload:{
            defaultDate:dateTime
          }
        });
        yield put({
          type : 'queryProject',
        });
      }
    },
    /**
     * 作者：张枫
     * 日期：2019-02-20
     * 邮箱：zhangf142@chinaunicom.cn
     * 说明：切换项目tab
     **/
    *changeTabs({proj_code},{select,put,call}){
      let {partnerList} = yield select(state =>state.infoFill);
      for (let i =0 ;i<partnerList.length;i++){
        partnerList[i].disabled =true
        if(partnerList[i].visible == true){
          partnerList[i].visible =false
        }
      }
      yield put({
        type : 'save',
        payload:{
          arg_proj_code : proj_code,
          saveProjList:[],
          partnerList:partnerList,
          defaultDate:'',
          saveProjList2:[],
          isDelVisible:false,
        }
      });
    },
    /**
     * 作者：张枫
     * 日期：2019-02-20
     * 邮箱：zhangf142@chinaunicom.cn
     * 说明：保存服务
     **/
    *setSave({values},{select,put,call}){
      if(values.arg_other_month_work_cnt_h=='')
      {
        values.arg_other_month_work_cnt_h ='0'
      }
      if(values.arg_other_month_work_cnt_m=='')
      {
        values.arg_other_month_work_cnt_m ='0'
      }
      if(values.arg_other_month_work_cnt_l=='')
      {
        values.arg_other_month_work_cnt_l ='0'
      }

      let {partner_name_modal,partner_id_modal,arg_total_year,arg_total_month,arg_proj_code,projList,arg_proj_name} = yield select(state =>state.infoFill);
      for(let i = 0;i<projList.length;i++){
        if(projList[i].proj_code == arg_proj_code){
          arg_proj_name = projList[i].proj_name
        }
      }
      yield put({
        type : 'save',
        payload:{
          //workloadServiceParam : JSON.parse(JSON.stringify(values)),
          arg_proj_name:arg_proj_name
        }
      });
      let postData = {
        arg_user_id : Cookie.get('userid'),
        arg_user_name : Cookie.get('username'),
        arg_proj_code :arg_proj_code,
        arg_proj_name :arg_proj_name,
        arg_total_year : arg_total_year,
        arg_total_month :arg_total_month,
        arg_partner_id : partner_id_modal,
        arg_partner_name :partner_name_modal,
        arg_month_work_cnt_h :values.arg_month_work_cnt_h,
        arg_other_month_work_cnt_h :values.arg_other_month_work_cnt_h,
        arg_month_work_cnt_m :values.arg_month_work_cnt_m,
        arg_other_month_work_cnt_m :values.arg_other_month_work_cnt_m,
        arg_month_work_cnt_l :values.arg_month_work_cnt_l,
        arg_other_month_work_cnt_l :values.arg_other_month_work_cnt_l,
        arg_stability_score :values.arg_stability_score,
        arg_attend_score :values.arg_attend_score,
        arg_delivery_score :values.arg_delivery_score,
        arg_quality_score :values.arg_quality_score,
        arg_manage_score :values.arg_manage_score,
        arg_invest_score :values.arg_invest_score,
        arg_state:2 //-- 2保存，3提交  定值
      };
      let data = yield call(infoFillService.saveOrSubmitWorkLoad,postData) ;
      if(data.RetCode === '1'){
        message.info('保存成功');
        //保存成功后查询该项目下所有数据
        yield put({type:'queryProject'});
     //   yield put({type:'queryProject1'});
      }
    },
    /**
     * 作者：张枫
     * 日期：2019-02-20
     * 邮箱：zhangf142@chinaunicom.cn
     * 说明：提交预览弹框展示
     **/
    *isPreviewSubmitModalVisible({},{put}){
      /**
      yield put({
        type : 'queryProject',
      });
       **/
      //弹框可见
      yield put({
        type : 'save',
        payload:{
          isPreviewSubmitModalVisible : true
        }
      });
    },
    *cancelPreviewSubmitModalVisible({},{put}){
      yield put({
        type : 'save',
        payload:{
          isPreviewSubmitModalVisible : false
        }
      });
    },
    /**
     * 作者：张枫
     * 日期：2019-02-20
     * 邮箱：zhangf142@chinaunicom.cn
     * 说明：服务评价提交
     **/
    *submitWorkloadService({},{select,put,call}){
      let {arg_total_year,arg_total_month,arg_proj_code,partnerList,saveProjList} = yield select(state =>state.infoFill);
      //计算一共提交了几个合作伙伴的数据 计算number
      let num = 0;  //勾选的合作伙伴个数
      for(let i =0;i<partnerList.length;i++){
        if(partnerList[i].visible==true){
          const department = partnerList[i]
          //选择的部门
          num++;
        }
      }
      if(saveProjList.length == 0){
        message.error("没有待提交数据");
      }else
        if(saveProjList.length>num){
          message.error("存在未填报合作伙伴，请填报！");
        }
      else {
          let postData = {
            arg_proj_code: arg_proj_code,  //项目code
            arg_total_year: arg_total_year, //提交年份
            arg_total_month: arg_total_month, //提交月份
            arg_partner_id: num,     //合作伙伴的数量
            arg_state: 3,//-- 2保存，3提交  定值
          };
          let data = yield call(infoFillService.saveOrSubmitWorkLoad, postData);
          if (data.RetCode === '1') {
            message.success("服务评价提交成功");
            yield put({
              type: 'save',
              payload: {
                isPreviewSubmitModalVisible: false,
                //提交完后日期置空
                defaultDate:"",
                isDelVisible:false,
              }
            });
            // 提交完成后刷新页面
            yield put ({type:'initTab'});
            yield put ({type:'queryPartner'});
            //yield put ({type:'queryProject'});
          }
        }
    },
  },
  subscriptions: {
      setup({dispatch,history}){
        return history.listen(({pathname,query})=> {
          if (pathname == '/projectApp/purchase/infoFill') {
            dispatch({type: 'init', query});
            dispatch({type: 'queryPartner', query});
          }
        })
      }
    }
}
