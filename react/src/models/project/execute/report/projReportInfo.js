/**
 * 作者：邓广晖
 * 创建日期：2017-11-06
 * 邮件：denggh6@chinaunicom.cn
 * 文件说明：实现项目执行报告管理（月报）详细信息的服务
 */
import * as projServices from '../../../../services/project/projService';
import moment from 'moment';
import Cookie from 'js-cookie';

moment.locale('zh-cn');

const dataFormat = 'YYYY-MM-DD';
//timeDuration用于测试项目的开始时间和结束时间
//const timeDuration = {projStartTime:'2016-05-13',projEndTime:'2016-11-04'};
//const timeDuration = {projStartTime:'2017-11-01',projEndTime:'2017-11-03'};

//每年每月的第一个周一时间列表，可以通过moment对象来计算时间，但是如果出现闰年情况，时间会错位
const yearMonthWeek = {
  2015: {
    1: '2015-01-05', 2: '2015-02-02', 3: '2015-03-02', 4: '2015-04-06', 5: '2015-05-04', 6: '2015-06-01',
    7: '2015-07-06', 8: '2015-08-03', 9: '2015-09-07', 10: '2015-10-05', 11: '2015-11-02', 12: '2015-12-07'
  },
  2016: {
    1: '2016-01-04', 2: '2016-02-01', 3: '2016-03-07', 4: '2016-04-04', 5: '2016-05-02', 6: '2016-06-06',
    7: '2016-07-04', 8: '2016-08-01', 9: '2016-09-05', 10: '2016-10-03', 11: '2016-11-07', 12: '2016-12-05'
  },
  2017: {
    1: '2017-01-02', 2: '2017-02-06', 3: '2017-03-06', 4: '2017-04-03', 5: '2017-05-01', 6: '2017-06-05',
    7: '2017-07-03', 8: '2017-08-07', 9: '2017-09-04', 10: '2017-10-02', 11: '2017-11-06', 12: '2017-12-04'
  },
  2018: {
    1: '2018-01-01', 2: '2018-02-05', 3: '2018-03-05', 4: '2018-04-02', 5: '2018-05-07', 6: '2018-06-04',
    7: '2018-07-02', 8: '2018-08-06', 9: '2018-09-03', 10: '2018-10-01', 11: '2018-11-05', 12: '2018-12-03'
  },
  2019: {
    1: '2019-01-07', 2: '2019-02-04', 3: '2019-03-04', 4: '2019-04-01', 5: '2019-05-06', 6: '2019-06-03',
    7: '2019-07-01', 8: '2019-08-05', 9: '2019-09-02', 10: '2019-10-07', 11: '2019-11-04', 12: '2019-12-02'
  },
  2020: {
    1: '2020-01-06', 2: '2020-02-03', 3: '2020-03-02', 4: '2020-04-06', 5: '2020-05-04', 6: '2020-06-01',
    7: '2020-07-06', 8: '2020-08-03', 9: '2020-09-07', 10: '2020-10-05', 11: '2020-11-02', 12: '2020-12-07'
  },
  2021: {
    1: '2021-01-04', 2: '2021-02-01', 3: '2021-03-01', 4: '2021-04-05', 5: '2021-05-03', 6: '2021-06-07',
    7: '2021-07-05', 8: '2021-08-02', 9: '2021-09-06', 10: '2021-10-04', 11: '2021-11-01', 12: '2021-12-06'
  },
  2022:{
    1: '2022-01-03', 2: '2022-02-07', 3: '2022-03-07', 4: '2022-04-04', 5:'2022-05-02', 6:'2022-06-06',
    7: '2022-07-04', 8: '2022-08-01', 9: '2022-09-05', 10: '2022-10-03', 11:'2022-11-07', 12:'2022-12-05'
  },
  2023:{
    1: '2023-01-02', 2: '2023-02-06', 3: '2023-03-06', 4: '2023-04-03', 5:'2023-05-01', 6:'2023-06-05',
    7: '2023-07-03', 8: '2023-08-07', 9: '2023-09-04', 10: '2023-10-02', 11:'2023-11-06', 12:'2023-12-04'
  },
  2024:{
    1: '2024-01-01', 2: '2024-02-05', 3: '2024-03-04', 4: '2024-04-01', 5:'2024-05-06', 6:'2024-06-03',
    7: '2024-07-01', 8: '2024-08-05', 9: '2024-09-02', 10: '2024-10-07', 11:'2024-11-04', 12:'2024-12-02'
  },
  2025:{
    1: '2025-01-06', 2: '2025-02-03', 3: '2025-03-03', 4: '2025-04-07', 5:'2025-05-05', 6:'2025-06-02',
    7: '2025-07-07', 8: '2025-08-04', 9: '2025-09-01', 10: '2025-10-06', 11:'2025-11-03', 12:'2025-12-01'
  },
  2026:{
    1: '2026-01-05', 2: '2026-02-02', 3: '2026-03-02', 4: '2026-04-06', 5:'2026-05-04', 6:'2026-06-01',
    7: '2026-07-06', 8: '2026-08-03', 9: '2026-09-07', 10: '2026-10-05', 11:'2026-11-02', 12:'2026-12-07'
  },
  2027:{
    1: '2027-01-04', 2: '2027-02-01', 3: '2027-03-01', 4: '2027-04-05', 5:'2027-05-03', 6:'2027-06-07',
    7: '2027-07-05', 8: '2027-08-02', 9: '2027-09-06', 10: '2027-10-04', 11:'2027-11-01', 12:'2027-12-06'
  },
  2028:{
    1: '2028-01-03', 2: '2028-02-07', 3: '2028-03-06', 4: '2028-04-03', 5:'2028-05-01', 6:'2028-06-05',
    7: '2028-07-03', 8: '2028-08-07', 9: '2028-09-04', 10: '2028-10-02', 11:'2028-11-06', 12:'2028-12-04'
  },
  2029:{
    1: '2029-01-01', 2: '2029-02-05', 3: '2029-03-05', 4: '2029-04-02', 5:'2029-05-07', 6:'2029-06-04',
    7: '2029-07-02', 8: '2029-08-06', 9: '2029-09-03', 10: '2029-10-01', 11:'2029-11-05', 12:'2029-12-03'
  },
  2030:{
    1: '2030-01-07', 2: '2030-02-04', 3: '2030-03-04', 4: '2030-04-01', 5:'2030-05-06', 6:'2030-06-03',
    7: '2030-07-01', 8: '2030-08-05', 9: '2030-09-02', 10: '2030-10-07', 11:'2030-11-04', 12:'2030-12-02'
  }


};

/**
 * 作者：邓广晖
 * 创建日期：2017-11-06
 * 功能：计算两个时间段（字符串型）之间的月份数
 * @param dateStart 开始时间段
 * @param dateEnd 结束时间段
 */
function getMidMonths(dateStart, dateEnd) {
  //获取年,月数
  let dateStartSplit = dateStart.split("-");
  let dateEndSplit = dateEnd.split("-");
  //通过年,月差计算月份差
  return (parseInt(dateEndSplit[0]) - (dateStartSplit[0])) * 12 + (parseInt(dateEndSplit[1]) - parseInt(dateStartSplit[1])) + 1;
}

export default {
  namespace: 'projReportInfo',

  state: {
    queryData: {},                /*由项目列表进入时的参数，用于返回时返回列表的查询状态*/
    dateTableList: [],            /*时间表格列表，所有tab共用一张表格*/
    collapsePanelList: [],        /*折叠面板列表，其实也是年份列表*/
    oneYearMonthStart: '',        /*某一年的开始月份*/
    oneYearMonthEnd: '',          /*某一年的结束月份*/
    duarationObject: {},          /*时间段的对象*/
    oneYearMonth: {},             /*每一年的月份时间段索引对象*/
    yearPaneIndex: '',            /*年份索引*/
    monthTabIndex: '',            /*月份索引*/
    addReportVisible:false,       /*新增月报按钮是否可见，根据年份+月份索引来决定*/
    proj_id: '',
    proj_name: '',
    begin_time: '',              /*项目开始时间*/
    end_time: '',                /*项目结束时间*/
    isSelfProj:false,            /*判断是否为自己的项目*/
    tableDataLoadSpin:false,     /*表格数据加载是否有旋转*/
    monthFromProjStart:'',       /*从项目开始算起的月份*/
    monthHaveReport:false,       /*月份有无月报，提交的才有*/
    monthStartTime:'',           /*月份开始时间*/
    monthEndTime:'',             /*月份结束时间*/
    canAddReport:false,          /*是否能新增月报*/
    hasFullCostCount:false,      /*全成本是否出账，没有出账不让新增*/
    fullCostVal:'',              /*全成本出账时的提示语句*/
    serverCurrentTime:'',        /*服务器当前时间*/
  },

  reducers: {
    save(state, action) {
      return {...state, ...action.payload};
    }
  },

  effects: {
    /**
     * 作者：邓广晖
     * 创建日期：2017-11-10
     * 功能：转换数据并初始化
     * @param query 点击项目列表时，通过url传入的参数
     * @param put 返回reducer
     * @param call 请求服务
     */
    *converDataAndInit({query}, {put,call}) {
      //开始时首先获取服务器当前时间
      const serverData = yield call(projServices.getServerCurrentTime);
      const serverCurrentTime = serverData.date_time.split(' ')[0];
      //初始化基本显示信息,标题头部门
      yield put({
        type: 'save',
        payload: {
          proj_id: query.proj_id,
          proj_name: query.proj_name,
          begin_time: query.begin_time,
          end_time: query.end_time,
          isSelfProj:query.mgr_id === Cookie.get('staff_id'),   //判断是否为自己的项目
          serverCurrentTime:serverCurrentTime
        }
      });

      //将所有日期存入一个数组里，数组每一项里面是{start:'2015-04-02',end:'2015-04-08',week:1}
      //start是一周的开始时间，end是一周的结束时间，week是当月第几周
      let duarationList = [];
      for (let yearIndex in yearMonthWeek) {
        for (let month in yearMonthWeek[yearIndex]) {
          let momentStart = moment(yearMonthWeek[yearIndex][month]);
          let momentEnd = moment(yearMonthWeek[yearIndex][month]).add(6, 'days');
          let weekIndex = 1;
          //如果是当月的，就push进去
          while (parseInt(momentStart.format(dataFormat).split('-')[1]) === parseInt(month)) {
            duarationList.push({
              start: momentStart.format(dataFormat),
              end: momentEnd.format(dataFormat),
              week: weekIndex
            });
            momentStart = momentStart.add(1, 'week');
            momentEnd = momentEnd.add(1, 'week');
            weekIndex++;
          }
        }
      }

      //确定好日期列表后，根据项目的开始时间和结束时间截取列表，同时增加字段 weekFromStart 代表从项目开始的第几周
      let newDuarationList = [];
      let projStartTime = query.begin_time; //timeDuration.projStartTime;
      let projEndTime = query.end_time;   //timeDuration.projEndTime;
      //let currentTime = moment().format(dataFormat);
      let currentTime = serverCurrentTime;
      projEndTime = projEndTime <= currentTime ? projEndTime : currentTime;
      let startPushTag = false;
      let endPushTag = false;
      for (let i = 0; i < duarationList.length; i++) {
        if (projStartTime >= duarationList[i].start && projStartTime <= duarationList[i].end) {
          startPushTag = true;
        }
        if (startPushTag === true) {
          newDuarationList.push(duarationList[i]);
        }
        if (projEndTime >= duarationList[i].start && projEndTime <= duarationList[i].end) {
          endPushTag = true;
        }
        if (endPushTag === true) {
          break;
        }
      }
      let listLength = newDuarationList.length;
      for(let n = 0; n < listLength; n++) {
        newDuarationList[n].weekFromStart = n + 1;
      }

      //年份列表
      let yearList = [];
      //年的索引，先从结束时间的年份往回开始算起
      let yearIndex = parseInt(newDuarationList[listLength - 1].start.split('-')[0]);
      //将开始时间作为结束标志
      let yearEndTagIndex = parseInt(newDuarationList[0].start.split('-')[0]);
      //如果年份索引不超过开始年份，进行添加
      while (yearIndex >= yearEndTagIndex) {
        yearList.push(yearIndex.toString());
        yearIndex--;
      }

      let duarationObject = {};      //方便点击年月时，快速索引
      /*将日期列表转为{ 2016:
                           { 1: [{start:xxxx-xx-xx,end:xxx,week:xx，weekFromStart},{start:xxxx-xx-xx,end:xxx,week:xx}]
                             2: [{start:xxxx-xx-xx,end:xxx,week:xx},{start:xxxx-xx-xx,end:xxx,week:xx}]
                             ……
                           },
                     2017:
                          { 1: [{start:xxxx-xx-xx,end:xxx,week:xx},{start:xxxx-xx-xx,end:xxx,week:xx}]
                            2: [{start:xxxx-xx-xx,end:xxx,week:xx},{start:xxxx-xx-xx,end:xxx,week:xx}]
                             ……
                           },
                   }
      */

      let oneYearMonth = {};       //方便切换年份面板时，快速确定当年的开始月份和结束月份
      /*确定每年的开始月份和结束月份  {  2017:{oneYearMonthStart:xxxx-xx-xx, oneYearMonthEnd:xxxx-xx-xx}
                                   2016:{oneYearMonthStart:xxxx-xx-xx, oneYearMonthEnd:xxxx-xx-xx}
                                 }
      * */

      for (let i = 0; i < yearList.length; i++) {
        let obj = {};
        let month = '';
        let oneYearMonthStart = '';
        let oneYearMonthEnd = '';
        let oneYearMonthList = [];
        for (let j = 0; j < listLength; j++) {
          //找到年份
          if (yearList[i] === newDuarationList[j].start.split('-')[0]) {
            oneYearMonthList.push(newDuarationList[j]);
            //找到月份，月份要去0
            if (month === parseInt(newDuarationList[j].start.split('-')[1]).toString()) {
              obj[month].push(newDuarationList[j]);
            } else {
              month = parseInt(newDuarationList[j].start.split('-')[1]).toString();
              obj[month] = [];
              obj[month].push(newDuarationList[j]);
            }
          }
        }
        oneYearMonthStart = parseInt(oneYearMonthList[0].start.split('-')[1]).toString();
        oneYearMonthEnd = parseInt(oneYearMonthList[oneYearMonthList.length - 1].start.split('-')[1]).toString();
        oneYearMonth[yearList[i]] = {oneYearMonthStart: oneYearMonthStart, oneYearMonthEnd: oneYearMonthEnd};
        duarationObject[yearList[i]] = obj;
      }

      /*//将新列表的第一个的开始时间和项目开始时间对比，取较大值
      newDuarationList[0].start = projStartTime >= newDuarationList[0].start?
        projStartTime:newDuarationList[0].start;
      //将新列表的最后一个的结束时间和项目的结束时间(以及当前时间)对比，取较小值
      newDuarationList[listLength-1].end = projEndTime <= newDuarationList[listLength-1].end?
        projEndTime:newDuarationList[listLength-1].end;*/

      let firstTime = projStartTime >= newDuarationList[0].start ?
        projStartTime : newDuarationList[0].start;

      let projEndTimeOriginal = query.end_time;//timeDuration.projEndTime;
      let lastTime = projEndTimeOriginal <= newDuarationList[listLength - 1].end ?
        projEndTimeOriginal : newDuarationList[listLength - 1].end;

      let projStartYear = newDuarationList[0].start.split('-')[0];
      let projStartMonth = parseInt(newDuarationList[0].start.split('-')[1]).toString();

      //let currentTime = moment().format(dataFormat);
      /*let lastTime = projEndTime <= newDuarationList[listLength-1].end?
        projEndTime:newDuarationList[listLength-1].end;*/
      let projEndYear = newDuarationList[listLength - 1].start.split('-')[0];
      let projEndMonth = parseInt(newDuarationList[listLength - 1].start.split('-')[1]).toString();
      let lastDurationList = duarationObject[projEndYear][projEndMonth];
      duarationObject[projStartYear][projStartMonth][0].start = firstTime;
      duarationObject[projEndYear][projEndMonth][lastDurationList.length - 1].end = lastTime;

      yield put({
        type: 'save',
        payload: {
          collapsePanelList: yearList,
          duarationObject: duarationObject,
          yearPaneIndex: yearList[0],
          oneYearMonth: oneYearMonth,
          oneYearMonthStart: oneYearMonth[yearList[0]].oneYearMonthStart,
          oneYearMonthEnd: oneYearMonth[yearList[0]].oneYearMonthEnd,
          monthTabIndex: oneYearMonth[yearList[0]].oneYearMonthEnd
        }
      });

      //判断新增月报按钮是否可见
      yield put({ type:'judgeAddReport'});
      //临时时间列表
      let timeListTemp = duarationObject[yearList[0]][oneYearMonth[yearList[0]].oneYearMonthEnd];
      //判断并返回周报情况
      yield put({
        type:'judgeWeekReportIsSubmit',
        timeListTemp:timeListTemp
      });
    },

    /**
     * 作者：邓广晖
     * 创建日期：2017-12-07
     * 功能：判断周报的状态是 已提交 还是 未提交 ，未提交显示上传，已提交显示文件，并下载
     * @param timeListTemp 判断是否有状态之前的时间列表，即只有开始时间和结束时间
     * @param call 请求服务
     * @param put 返回reducer
     * @param select 获取model的state
     */
    *judgeWeekReportIsSubmit({timeListTemp},{call,put,select}){
      //只要涉及到表格数据变化，初始表格为旋转状态
      yield put({
        type: 'save',
        payload: {tableDataLoadSpin:true}
      });
      const { proj_id } = yield select(state => state.projReportInfo);
      let timeList = [];
      for (let i = 0; i < timeListTemp.length; i++) {
        /*let postData = {
          transjsonarray:JSON.stringify({
            condition:{proj_id:proj_id,proj_week:timeListTemp[i].weekFromStart.toString()}
          })
        };*/
        let postData = {
          arg_proj_id:proj_id,
          arg_proj_week:timeListTemp[i].weekFromStart.toString()
        };
        let data = yield call(projServices.queryWeekReportState,postData);
        if(data.DataRows.length > 0) {
          timeList.push({
            startTime: timeListTemp[i].start,
            endTime: timeListTemp[i].end,
            key: i,
            state:'1',
            state_show:'已提交',
            week: timeListTemp[i].week,
            creat_time:'creat_time' in data.DataRows[0] ? data.DataRows[0].creat_time : '',
            fileName:data.DataRows[0].file_name,
            relativePath:data.DataRows[0].rel_url,
            weekFromStart:timeListTemp[i].weekFromStart
          });
        }else {
          timeList.push({
            startTime: timeListTemp[i].start,
            endTime: timeListTemp[i].end,
            key: i,
            state:'0',
            state_show:'待提交',
            week: timeListTemp[i].week,
            creat_time:'',
            weekFromStart:timeListTemp[i].weekFromStart
          });
        }
      }//end for
      yield put({
        type: 'save',
        payload: {
          tableDataLoadSpin:false,
          dateTableList: timeList.reverse()
        }
      });
    },

    /**
     * 作者：邓广晖
     * 创建日期：2017-12-04
     * 功能：上传周报
     * @param fileParams 文件上传所需要的参数
     * @param call 请求服务
     * @param put 返回reducer
     * @param select 获取model里面的state
     */
    *addWeekReport({fileParams},{call,put,select}){
      let postData = [];
      postData.push(fileParams);
      const {duarationObject,yearPaneIndex,monthTabIndex} = yield select(state => state.projReportInfo);
      const data = yield call(projServices.addWeekReport,{transjsonarray:JSON.stringify(postData)});
      if(data.RetCode === '1'){
        //临时时间列表
        let timeListTemp = duarationObject[yearPaneIndex][monthTabIndex];
        //判断并返回周报情况
        yield put({
          type:'judgeWeekReportIsSubmit',
          timeListTemp:timeListTemp
        });
      }
    },

    /**
     * 作者：邓广晖
     * 创建日期：2017-12-04
     * 功能：更新周报
     * @param fileParams 文件上传所需要的参数
     * @param preFileUrl 前一个文件的相对地址
     * @param call 请求服务
     * @param put 返回reducer
     * @param select 获取model里面的state
     */
    *updateWeekReport({fileParams,preFileUrl},{call,put,select}){
      let postData = [];
      postData.push(fileParams);
      const {duarationObject,yearPaneIndex,monthTabIndex} = yield select(state => state.projReportInfo);
      const data = yield call(projServices.updateWeekReport,{transjsonarray:JSON.stringify(postData)});
      if(data.RetCode === '1'){
        //删除之前的周报
        const delData = yield call(projServices.deleteOldWeekReport,{RelativePath:preFileUrl});
        if(delData.RetCode === '1'){
          //临时时间列表
          let timeListTemp = duarationObject[yearPaneIndex][monthTabIndex];
          //判断并返回周报情况
          yield put({
            type:'judgeWeekReportIsSubmit',
            timeListTemp:timeListTemp
          });
        }
      }
    },

    /**
     * 作者：邓广晖
     * 创建日期：2017-12-04
     * 功能：判断新增月报是否可用，主要针对第一个星期，第一个星期有可能属于上一个月，甚至上一年
     *      同时将实际月份转为 从 项目开始时间算起的 月份
     *      同时判断月报是否提交
     * @param monthIndex 月份索引
     * @param call 请求服务
     * @param put 返回reducer
     * @param select 获取model里面的state
     */
    *judgeAddReport({},{call,put,select}){
      const {yearPaneIndex,monthTabIndex,begin_time,end_time,proj_id,serverCurrentTime} = yield select(state => state.projReportInfo);
      let monthIndex = Number(monthTabIndex) <= 9?'0' + monthTabIndex : monthTabIndex;
      let yearMonth = yearPaneIndex + '-' + monthIndex;
      let beginTimeMonth = begin_time.split('-')[0] + '-' + begin_time.split('-')[1];
      let endTimeMonth = end_time.split('-')[0] + '-' + end_time.split('-')[1];
      //判断月报按钮是否可见，主要针对开始第一周
      if(yearMonth >= beginTimeMonth && yearMonth <= endTimeMonth){
        yield put({
          type:'save',
          payload:{addReportVisible:true}
        });
      }else{
        yield put({
          type:'save',
          payload:{addReportVisible:false}
        });
      }

      //判断新增月报是否可新增
      /*已经过了项目结束时间时，可添加  或者  当月以前的可新增，当月项目还结束时，不可新增*/
      let canAddReport = false;
      //let nowTime = moment().format(dataFormat);
      let nowTime = serverCurrentTime;
      if(end_time <= nowTime){
        canAddReport = true;
      }else{
        canAddReport = yearMonth < nowTime.substring(0,7);
      }
      yield put({
        type:'save',
        payload:{
          canAddReport:canAddReport
        }
      });

      //转换月份
      let currentTime = yearPaneIndex + '-' + monthTabIndex;
      let monthFromProjStart = getMidMonths(begin_time,currentTime).toString();
      yield put({
        type:'save',
        payload:{
          monthFromProjStart:monthFromProjStart
        }
      });

      //确定月份的开始时间和结束时间
      let monthStartTime = moment().year(yearPaneIndex).month(Number(monthTabIndex)-1).startOf('month').format(dataFormat);
      let monthEndTime = moment().year(yearPaneIndex).month(Number(monthTabIndex)-1).endOf('month').format(dataFormat);
      //如果月份开始时间小于项目开始时间，取项目开始时间
      if(monthStartTime <= begin_time){
        monthStartTime = begin_time;
      }
      //如果月份结束时间大于项目结束时间，取项目结束时间
      if(monthEndTime >= end_time){
        monthEndTime = end_time;
      }
      yield put({
        type:'save',
        payload:{
          monthStartTime:monthStartTime,
          monthEndTime:monthEndTime
        }
      });

      //判断月报是否提交
      let postData = {
        transjsonarray:JSON.stringify({
          condition:{
            proj_id:proj_id,
            proj_month:monthFromProjStart,
            tag:'1'
          }
        })
      };
      //判断是否有月报
      const data = yield call(projServices.queryWorkPlanAndDeviation,postData);
      if(data.RetCode === '1'){
        if(Number(data.RowCount) > 0){
          yield put({
            type:'save',
            payload:{
              monthHaveReport:true
            }
          });
        }else{
          yield put({
            type:'save',
            payload:{
              monthHaveReport:false
            }
          });
        }
      }
    },

    /**
     * 作者：邓广晖
     * 创建日期：2017-11-10
     * 功能：切换月份tab，改变时间表格
     * @param monthIndex 月份索引
     * @param put 返回reducer
     * @param select 获取model里面的state
     */
    *switchMonthTabTable({monthIndex}, {put, select}) {
      const {duarationObject,yearPaneIndex} = yield select(state => state.projReportInfo);
      let timeListTemp = duarationObject[yearPaneIndex][monthIndex];
      yield put({
        type: 'save',
        payload: { monthTabIndex: monthIndex}
      });
      //判断新增月报按钮是否可见
      yield put({ type:'judgeAddReport'});
      //判断并返回周报情况
      yield put({
        type:'judgeWeekReportIsSubmit',
        timeListTemp:timeListTemp
      });
    },

    /**
     * 作者：邓广晖
     * 创建日期：2017-11-10
     * 功能：切换年份pane
     * @param yearIndex 年份索引
     * @param put 返回reducer
     * @param select 获取model的state
     */
    *switchPane({yearIndex}, {put, select}) {
      const {duarationObject,oneYearMonth} = yield select(state => state.projReportInfo);
      //切换折叠面板时，默认获取所选年的最后一个月的时间
      let timeListTemp = duarationObject[yearIndex][oneYearMonth[yearIndex].oneYearMonthEnd];
      yield put({
        type: 'save',
        payload: {
          yearPaneIndex: yearIndex,
          oneYearMonthStart: oneYearMonth[yearIndex].oneYearMonthStart,
          oneYearMonthEnd: oneYearMonth[yearIndex].oneYearMonthEnd,
          monthTabIndex: oneYearMonth[yearIndex].oneYearMonthEnd,
        }
      });
      //判断新增月报按钮是否可见
      yield put({ type:'judgeAddReport'});
      //判断并返回周报情况
      yield put({
        type:'judgeWeekReportIsSubmit',
        timeListTemp:timeListTemp
      });
    },

    /**
     * 作者：邓广晖
     * 创建日期：2017-11-10
     * 功能：点击返回时，将传进去的参数返回到原页面
     * @param query url的请求参数
     * @param put 返回reducer
     */
    *setQueryData({query}, {put}) {
      yield put({
        type: 'save',
        payload: {queryData: query}
      });
    },

  },

  subscriptions: {
    setup({dispatch, history}) {
      return history.listen(({pathname, query}) => {
        if (pathname === '/projectApp/projExecute/report/projReportInfo') {
          dispatch({type: 'converDataAndInit', query});
          dispatch({type: "setQueryData", query});
        }
      });
    },
  }
}
