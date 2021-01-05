/**
 * 作者：张楠华
 * 日期：2017-11-20
 * 邮箱：zhangnh6@chinaunicom.cn
 * 文件说明：工时查询
 */
import * as timeManageService from '../../../services/project/timeManagement';
import * as costService from  '../../../services/finance/costService';
import { MergeCells } from './../../../components/finance/mergeCells';
const dateFormat = 'YYYY-MM';
import moment from 'moment';
import 'moment/locale/zh-cn';
import { message } from 'antd';
import config from '../../../utils/config';
import cookies from 'js-cookie'
moment.locale('zh-cn');
function parseParam (param, key){
  let paramStr = "";
  if (typeof param==="string" || typeof param==="number" || typeof param==='boolean') {
    paramStr += "&" + key + "=" + encodeURIComponent(param);
  } else {
    for (var v in param) {
      let k = key==null ? v : key + (param instanceof Array ? "[" + v + "]" : "." + v);
      paramStr += '&' + parseParam(param[v], k);
    }
  }
  return paramStr.substr(1);
}
async function request(url, options,key) {

  const response = await fetch(url, {
    method:'post',
    credentials: 'include',
    headers:{'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
    body:parseParam(options,key)
  });
  const data = await response.json();
  if(!data.DataRows){
    data.DataRows=[]
  }
  return data;
}
function getuserModule(postData) {
  return request('/microservice/serviceauth/p_userhasmodule', postData);
}
export default {
  namespace: 'worktimeDataStatistics',
  state: {
    list:[],//合作伙伴工时查询
    ouList:[],
    listPartner : [],//查询合作伙伴工时生成
    stateCode:'',
    examList:[],//考核查询
    projRatioList:[],//季度项目考核系数
    Rowcount:0, //季度项目考核系数
    has_num : '',//季度项目考核系数
    scoreList:[],//得分查询
    hasData:'',

    annualList:[],//工时数据统计年化人数
    radioList:[],//工时数据统计月工时占比

    noRule:true,
  },

  reducers: {
    initData(state){
      return {
        ...state,
        list:[],
        ouList:[],
        listPartner : [],
        stateCode:'',
        examList:[],
        projRatioList:[],
        Rowcount:0,

        scoreList:[],

        has_num : '',//项目考核系数是否可以生成
        have_generate:'',//季度考核工作量是否可以生成
        hasData:'',//员工工时考核得分是否可以生成

        noRule:true,//是否有该模块的权限

        isGen : '0',//项目考核系数，0不可以生成
        IsSyn:true//项目考核系数，true不可以撤销
      }
    },
    save(state,action) {
      return { ...state, ...action.payload};
    },
  },

  effects: {
    //3 1 都要查ou
    //2年化人数
    //3 月工时占比
    *init({flag}, { call, put }) {
      if(flag === 1){//合作伙伴，已废弃
        yield put({
          type:'queryPartner',
          date:moment(),
          ou:localStorage.ou,
        })
      }
      if(flag === 2){//工时数据统计年化人数
        yield put({
          type:'queryAnnual',
          date:moment(),
        });
      }
      if( flag === 3){//月工时占比
        let postData = {};
        postData["argtenantid"] = cookies.get('tenantid');
        postData["arguserid"] = cookies.get('userid');
        postData["argrouterurl"] = '/timesheetManage/worktimeMonthRatio';
        const moduleIdData = yield call(getuserModule,postData);
        if(moduleIdData.RetCode === '1'){
          const data= yield call(costService.costUserGetOU, {
            argtenantid:cookies.get('tenantid'),
            arguserid:cookies.get('userid'),
            argmoduleid:moduleIdData.moduleid,
            argvgtype:'2'
          });
          yield put({
            type:'save',
            payload:{
              ouList:data.DataRows
            }
          });
          yield put({
            type:'queryMonthRadio',
            date:moment(),
            ou:localStorage.ou,
          })
        }else{
          message.info('用户没有权限');
          yield put({
            type:'save',
            payload:{
              noRule:false
            }
          })
        }
      }
      if(flag === 4 || flag === 5 || flag === 6 ){//员工项目考核系数，员工工时考核得分，季度考核工作量
        let argrouterurl = '';
        if( flag === 4){
          argrouterurl = '/timesheetManage/staffSeasonProjExamine';
        }else if( flag === 5){
          argrouterurl = '/timesheetManage/staffSeasonProjScore';
        }else if( flag === 6){
          argrouterurl = '/timesheetManage/seasonExamineWorkload';
        }
        let postData = {};
        postData["argtenantid"] = cookies.get('tenantid');
        postData["arguserid"] = cookies.get('userid');
        postData["argrouterurl"] = argrouterurl;
        const moduleIdData = yield call(getuserModule,postData);
        if(moduleIdData.RetCode === '1'){
          const data= yield call(costService.costUserGetOU, {
            argtenantid:cookies.get('tenantid'),
            arguserid:cookies.get('userid'),
            argmoduleid:moduleIdData.moduleid,
            argvgtype:'2'
          });
          const { HasAuth } = yield call(timeManageService.isHasAuto,{arg_staff_id:cookies.get('userid'),'model_type':argrouterurl});
          yield put({
            type:'save',
            payload:{
              ouList:data.DataRows,
              HasAuth:HasAuth || ''
            }
          });
        }else{
          message.info('用户没有权限');
          yield put({
            type:'save',
            payload:{
              noRule:false
            }
          })
        }
      }
    },
    //。。。。。。。。。。。。。。。。。。。。。。。。工时年化数据统计
    *queryAnnual({date}, { call,put }){
      let beginTime = date.format(dateFormat).split('-')[0];
      let endTime = parseInt(date.format(dateFormat).split('-')[1]);
      let postData = {};
      postData['arg_this_year'] = beginTime;
      postData['arg_this_month'] = endTime;
      const data = yield call(timeManageService.queryAnnual,postData);
      MergeCells(data.DataRows,'ou','1');
      MergeCells(data.DataRows,'dept_name_part','2');
      data.DataRows.forEach((i)=>{
        if(i.dept_name_part === 'zzz'){
            i.colSpan=3;
            i.dept_name_part = <span style={{color:'red'}}>小计</span>;
            delete i.proj_code;
            delete i.proj_name;
        }
        if(i.dept_name_part === 'zzz总计'){
          i.colSpan=4;
          i.ou = <span style={{color:'red'}}>总计</span>;
          delete i.proj_code;
          delete i.proj_name;
          delete i.dept_name_part;
        }
      });
      const columnsAnnual = [];
      if(endTime<2 || data.DataRows.length !== 0){
        columnsAnnual.push(
          {
            title: '院部',
            dataIndex: 'ou',
            key:'ou',
            width:'100px',
            render: (text, record) => {return{children : <div>{record.ou}</div>, props:{rowSpan:record[1]}}},
          },
          {
            title: '归属部门',
            dataIndex: 'dept_name_part',
            key: 'dept_name_part',
            width:'150px',
            render: (text, record) => {return{children : <div>{record.dept_name_part}</div>, props:{rowSpan:record[2]}}},
          },
          {
            title: '项目名称',
            dataIndex: 'proj_name',
            key: 'proj_name',
            width:'200px',
          },
          {
            title: '项目编号',
            dataIndex: 'proj_code',
            key: 'proj_code',
            width:'100px',
          },
        )
      }else{
        columnsAnnual.push(
          {
            title: '院部',
            dataIndex: 'ou',
            key:'ou',
            width:'100px',
            fixed: 'left',
          },
          {
            title: '归属部门',
            dataIndex: 'dept_name_part',
            key: 'dept_name_part',
            width:'150px',
            fixed: 'left',
          },
          {
            title: '项目名称',
            dataIndex: 'proj_name',
            key: 'proj_name',
            width:'200px',
            fixed: 'left',
          },
          {
            title: '项目编号',
            dataIndex: 'proj_code',
            key: 'proj_code',
            width:'100px',
            fixed: 'left',
          },
        )
      }
      for(let i=0;i<endTime;i++){
        columnsAnnual.push(
          {
            title:(i+1)+'月',
            children: [
              {
                title: '总院',
                dataIndex: 'ouhead'+(i+1),
                key: 'ouhead'+i,
                width:'100px',
              },
              {
                title: '哈院',
                dataIndex: 'ouhaerbin'+(i+1),
                key: 'ouhaerbin'+i,
                width:'100px'
              },
              {
                title: '济院',
                dataIndex: 'oujinan'+(i+1),
                key: 'oujinan'+i,
                width:'100px'
              },
              {
                title: '广州院',
                dataIndex: 'ouguangzhou'+(i+1),
                key: 'ouguangzhou'+i,
                width:'100px'
              },
              {
                title: '西安院',
                dataIndex: 'ouxian'+(i+1),
                key: 'ouxian'+i,
                width:'100px'
              },
            ]
          },
        );
      }
      columnsAnnual.push(
        {
          title:'年化人数',
          children: [
            {
              title: '总院',
              dataIndex: 'ouhead_year',
              key: 'ouhead_year',
              width:'100px',
            },
            {
              title: '哈院',
              dataIndex: 'ouhaerbin_year',
              key: 'ouhaerbin_year',
              width:'100px'
            },
            {
              title: '济院',
              dataIndex: 'oujinan_year',
              key: 'oujinan_year',
              width:'100px'
            },
            {
              title: '广州院',
              dataIndex: 'ouguangzhou_year',
              key: 'ouguangzhou_year',
              width:'100px'
            },
            {
              title: '西安院',
              dataIndex: 'ouxian_year',
              key: 'ouxian_year',
              width:'100px'
            },
          ]
        },
      );
      let scrollAnnual = endTime*500+550+500;
      if(data.RetCode === '1'){
        yield put({
          type:'save',
          payload:{
            annualList:data.DataRows,
            columnsAnnual:columnsAnnual,
            scrollAnnual:scrollAnnual,
            isCanGenPopulation:data.RowCount,
          }
        })
      }
    },
    *generate({date}, { call,put }){
      let beginTime = date.format(dateFormat).split('-')[0];
      let endTime = parseInt(date.format(dateFormat).split('-')[1]);
      let postData = {};
      postData['arg_staff_id'] = localStorage.userid;
      postData['arg_this_year'] = beginTime;
      postData['arg_this_month'] = endTime;
      const data = yield call(timeManageService.GeneratePopulationData,postData);
      if(data.RetCode === '1'){
        message.info(date.format(dateFormat)+'生成成功！');
        yield put({
          type:'queryAnnual',
          date
        })
      }
    },
    *TimesheetPopulationMonthUndo({date}, { call,put }){
      let beginTime = date.format(dateFormat).split('-')[0];
      let endTime = parseInt(date.format(dateFormat).split('-')[1]);
      let postData = {};
      postData['arg_staff_id'] = localStorage.userid;
      postData['arg_this_year'] = beginTime;
      postData['arg_this_month'] = endTime;
      const data = yield call(timeManageService.TimesheetPopulationMonthUndo,postData);
      if(data.RetCode === '1'){
        message.info(date.format(dateFormat)+'撤销成功！');
        yield put({
          type:'queryAnnual',
          date
        })
      }
    },
    *exportMonth({date}){
      let beginTime = date.format(dateFormat).split('-')[0];
      let endTime = parseInt(date.format(dateFormat).split('-')[1]);
      let exportUrl='/microservice/alltimesheet/timesheet/ExportAllProjYearPopulationDetails?'+'arg_this_year='+beginTime+'&arg_this_month='+endTime;
      window.open(exportUrl);
    },
    *exportYear({date}){
      let beginTime = date.format(dateFormat).split('-')[0];
      let endTime = parseInt(date.format(dateFormat).split('-')[1]);
      let exportUrl='/microservice/alltimesheet/timesheet/ExportAllProjYearPopulation?'+'arg_this_year='+beginTime+'&arg_this_month='+endTime;
      window.open(exportUrl);
    },
    //。。。。。。。。。。。。。。。。。。。。。。。。。。。。。工时占比数据统计
    *queryMonthRadio({date,ou}, { call,put }){
      let beginTime = date.format(dateFormat).split('-')[0];
      let endTime = parseInt(date.format(dateFormat).split('-')[1]);
      let postData = {};
      postData['arg_ou'] = ou;
      postData['arg_year'] = beginTime;
      postData['arg_month'] = endTime;
      const data = yield call(timeManageService.queryMonthRadio,postData);
      let dataHasRadio = [];
      let dataFilter = data.DataRows.filter(item => item.hasOwnProperty('ratio_list'));
      if(data.DataRows.length !== 0){
        dataFilter.map((i)=>{dataHasRadio.push(JSON.parse(i.ratio_list).length);});
      }
      let dataHasRadioNum = dataHasRadio.sort().reverse()[0];

      for(let i=0;i<dataFilter.length;i++){

        let radioList = JSON.parse(dataFilter[i].ratio_list);
        let sumRatio = 0,maxRatio ={ key :0,value : 0};
        for(let k=0;k<radioList.length;k++){//i表示数据中有多少条，有多少个ratio_list就有多少个项目
          sumRatio =sumRatio + parseFloat(radioList[k].proj_ratio);//JSON.parse(dataFilter[i].ratio_list)[k].proj_ratio:取第i条的第k个项目
          if(parseFloat(radioList[k].proj_ratio)> maxRatio.value){
            maxRatio.key = k;
            maxRatio.value = parseFloat(radioList[k].proj_ratio);
          }
        }
        if(sumRatio !== 1){//如果添加出来的和大于1，表示超出了，用最大那个值的proj_ratio减去多出来的值
          radioList[maxRatio.key].proj_ratio = (maxRatio.value - (sumRatio-1)).toFixed(2);
        }
        for(let j=0;j<radioList.length;j++){
          dataFilter[i]['proj_name'+j] = radioList[j].proj_name;
          dataFilter[i]['proj_ratio'+j] = radioList[j].proj_ratio;
        }
      }
      if(data.RetCode === '1'){
        yield put({
          type:'save',
          payload:{
            radioList:data.DataRows,
            radioListOrg:JSON.parse(JSON.stringify(data.DataRows)),
            dataHasRadioNum:dataHasRadioNum,
            isGenCalMonthRatio :data.have_generate,
          }
        })
      }
    },
    *genRadio({date,ou}, { call,put }){
      let beginTime = date.format(dateFormat).split('-')[0];
      let endTime = parseInt(date.format(dateFormat).split('-')[1]);
      let postData = {};
      postData['arg_ou'] = ou;
      postData['arg_year'] = beginTime;
      postData['arg_month'] = endTime;
      postData['arg_staff_id'] = cookies.get('userid');
      const data = yield call(timeManageService.genRadio,postData);
      if(data.RetCode === '1'){
        message.info('生成成功');
        yield put({
          type:'queryMonthRadio',
          date,
          ou,
        })
      }
    },
    *calRadio({date,ou}, { call,put }){
      let beginTime = date.format(dateFormat).split('-')[0];
      let endTime = parseInt(date.format(dateFormat).split('-')[1]);
      let postData = {};
      postData['arg_ou'] = ou;
      postData['arg_year'] = beginTime;
      postData['arg_month'] = endTime;
      postData['arg_staff_id'] = cookies.get('userid');
      const data = yield call(timeManageService.calRadio,postData);
      if(data.RetCode === '1'){
        message.info('撤销成功');
        yield put({
          type:'queryMonthRadio',
          date,
          ou,
        })
      }
    },
    //....................................................合作伙伴
    //合作伙伴工时查询
    *queryPartner({date,ou}, { call,put }){
      let yearMonth = date.format(dateFormat);
      //let endTime = date.format(dateFormat).split('-')[1];
      let postData = {};
      postData['arg_year_month'] = yearMonth;
      postData['arg_ou'] = ou;
      const data = yield call(timeManageService.queryPartner,postData);
      if(data.RetCode === '1'){
        yield put({
          type:'save',
          payload:{
            list:data.DataRows,
          }
        })
      }
    },
    //合作伙伴工时同步
    *synPartner({date,ou}, { call }){
      let yearMonth = date.format(dateFormat);
      //let endTime = date.format(dateFormat).split('-')[1];
      let postData = {};
      postData['arg_year_month'] = yearMonth;
      postData['arg_ou'] = ou;
      const data = yield call(timeManageService.synPartner,postData);
      if(data.RetCode === '1'){
        message.info(date.format(dateFormat)+'同步成功！');
      }
    },
    //合作伙伴工时生成
    *generatePartner({date}, { call,put }){
      let year = date.format(dateFormat).split('-')[0];
      let month = date.format(dateFormat).split('-')[1];
      //let endTime = date.format(dateFormat).split('-')[1];
      let postData = {};
      postData['arg_total_year'] = year;
      postData['arg_total_month'] = month;
      const data = yield call(timeManageService.generatePartner,postData);
      if(data.RetCode === '1'){
        message.info(date.format(dateFormat)+'生成成功！');
        yield put({
          type:'queryPartnerGenerate',
          date,
        })
      }
    },
    //合作伙伴工时撤销
    *cancelPartner({date}, { call,put }){
      let year = date.format(dateFormat).split('-')[0];
      let month = date.format(dateFormat).split('-')[1];
      //let endTime = date.format(dateFormat).split('-')[1];
      let postData = {};
      postData['arg_total_year'] = year;
      postData['arg_total_month'] = month;
      postData['arg_staff_id'] = localStorage.userid;
      const data = yield call(timeManageService.cancelPartner,postData);
      if(data.RetCode === '1'){
        message.info(date.format(dateFormat)+'撤销成功！');
        yield put({
          type:'queryPartnerGenerate',
          date,
        })
      }
    },
    //查询合作伙伴工时生成
    *queryPartnerGenerate({date}, { call,put }){
      let year = date.format(dateFormat).split('-')[0];
      let month = date.format(dateFormat).split('-')[1];
      //let endTime = date.format(dateFormat).split('-')[1];
      let postData = {};
      postData['arg_total_year'] = year;
      postData['arg_total_month'] = month;
      const data = yield call(timeManageService.queryPartnerGenerate,postData);
      if(data.RetCode === '1'){
        yield put({
          type:'save',
          payload:{
            listPartner:data.DataRows,
            stateCode : data.state_code,
          }
        })
      }
    },
    //。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。工时考核数据统计
    //季度项目考核系数查询
    *queryProjRatio({projYear,projSeason,projOU,page}, { call,put }){
      let postData = {};
      postData['arg_this_year'] = projYear;
      postData['arg_this_season'] = projSeason;
      postData['arg_ou_name'] = projOU;
      postData['arg_page_size'] = 10;
      postData['arg_current_page'] = page;
      const data = yield call(timeManageService.queryProjRatio,postData);
      let genPostData = {
        transjsonarray: JSON.stringify(
          {
            "condition":
              {
                "year": projYear,
                "season": projSeason
              },
            "property":
              {
                "state": "state"
              }
          }
        )
      };
      const { DataRows } = yield call(timeManageService.isGen,genPostData);//生成是否可用
      let calPostData ={
        arg_year:projYear,
        arg_season:projSeason,
      };
      const { IsSyn } = yield call(timeManageService.IsSyn,calPostData);//撤销是否可用
      if(data.RetCode === '1'){
        yield put({
          type:'save',
          payload:{
            projRatioList:data.DataRows,
            Rowcount : data.Rowcount,
            has_num : data.has_Data,
            IsSyn,
            isGen:DataRows.length !==0 ? DataRows[0].state : '0',
          }
        })
      }
    },
    //季度项目考核系数生成
    *generateProjRatio({projYear,projSeason,projOU,page}, { call,put }){
      let postData = {};
      postData['arg_year'] = projYear;
      postData['arg_season'] = projSeason;
      postData['arg_ou'] = projOU;
      const data = yield call(timeManageService.generateProjRatio,postData);
      if(data.RetCode === '1'){
        yield put({
          type:'queryProjRatio',
          projYear,
          projSeason,
          projOU,
          page
        })
      }
    },
    //季度项目考核系数撤销
    *backProjRatio({projYear,projSeason,projOU,page}, { call,put }){
      let postData = {};
      postData['arg_this_year'] = projYear;
      postData['arg_this_season'] = projSeason;
      postData['arg_staff_id'] = localStorage.staffid;
      postData['arg_ou_name'] = projOU;
      const data = yield call(timeManageService.backProjRatio,postData);
      if(data.RetCode === '1'){
        yield put({
          type:'queryProjRatio',
          projYear,
          projSeason,
          projOU,
          page
        })
      }
    },

    //工时考核得分查询
    *queryTimeSheetScore({timeSheetYear,timeSheetSeason}, { call,put }){
      let postData = {};
      postData['arg_year'] = timeSheetYear;
      postData['arg_season'] = timeSheetSeason;
      const data = yield call(timeManageService.queryTimeSheetScore,postData);
      if(data.RetCode === '1'){
        yield put({
          type:'save',
          payload:{
            scoreList:data.DataRows,
            hasData : data.have_generate
          }
        })
      }
    },
    //工时考核得分生成
    *generateScoreData({timeSheetYear,timeSheetSeason}, { call,put }){
      let postData = {};
      postData['arg_year'] = timeSheetYear;
      postData['arg_season'] = timeSheetSeason;
      const data = yield call(timeManageService.generateScoreData,postData);
      if(data.RetCode === '1'){
        yield put({
          type:'queryTimeSheetScore',
          timeSheetYear,timeSheetSeason
        })
      }
    },
    //工时考核得分撤销
    *backScoreData({timeSheetYear,timeSheetSeason}, { call,put }){
      let postData = {};
      postData['arg_year'] = timeSheetYear;
      postData['arg_season'] = timeSheetSeason;
      postData['arg_update_staff_id'] = localStorage.userid;
      const data = yield call(timeManageService.backScoreData,postData);
      if(data.RetCode === '1'){
        yield put({
          type:'queryTimeSheetScore',
          timeSheetYear,timeSheetSeason
        })
      }
    },

    //季度项目考核工作量年化查询
    *queryProjExam({projExamSeason,projExamYear}, { call,put }){
      let postData = {};
      postData['arg_year'] = projExamYear;
      postData['arg_season'] = projExamSeason;
      const data = yield call(timeManageService.queryProjExam,postData);
      if(data.RetCode === '1'){
        yield put({
          type:'save',
          payload:{
            examList:data.DataRows,
            have_generate : data.have_generate === undefined ? '' : data.have_generate
          }
        })
      }
    },
    //季度项目考核工作量年化生成
    *generateProjExam({projExamSeason,projExamYear}, { call,put }){
      let postData = {};
      postData['arg_year'] = projExamYear;
      postData['arg_season'] = projExamSeason;
      postData['arg_staff_id'] = localStorage.staffid;
      const data = yield call(timeManageService.generateProjExam,postData);
      if(data.RetCode === '1'){
        yield put({
          type:'queryProjExam',
          projExamSeason,
          projExamYear,
        })
      }
    },
    //季度项目考核工作量年化撤销
    *backProjExam({projExamSeason,projExamYear}, { call,put }){
      let postData = {};
      postData['arg_year'] = projExamYear;
      postData['arg_season'] = projExamSeason;
      postData['arg_staff_id'] = localStorage.staffid;
      const data = yield call(timeManageService.backProjExam,postData);
      if(data.RetCode === '1'){
        yield put({
          type:'queryProjExam',
          projExamSeason,
          projExamYear,
        })
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if(pathname === '/projectApp/timesheetManage/purchaseDataStatistics'){
          dispatch({type: 'initData'});
          dispatch({ type: 'init',flag:1 });//合作伙伴
        }
        if (pathname === '/projectApp/timesheetManage/worktimeDataStatistics') {
          dispatch({type: 'initData'});
          dispatch({ type: 'init',flag : 2 });//工时数据统计年化人数
        }
        if(pathname === '/projectApp/timesheetManage/worktimeMonthRatio'){
          dispatch({type: 'initData'});
          dispatch({ type: 'init',flag:3 });//月工时占比
        }
        if(pathname === '/projectApp/timesheetManage/staffSeasonProjExamine'){
          dispatch({type: 'initData'});
          dispatch({ type: 'init',flag:4 });//项目考核系数
        }
        if(pathname === '/projectApp/timesheetManage/staffSeasonProjScore'){
          dispatch({type: 'initData'});
          dispatch({ type: 'init',flag:5 });//员工工时考核得分
        }
        if(pathname === '/projectApp/timesheetManage/seasonExamineWorkload'){
          dispatch({type: 'initData'});
          dispatch({ type: 'init',flag:6 });//季度考核工作量
        }
      });
    },
  },
};
