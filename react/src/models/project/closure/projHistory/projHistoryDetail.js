/**
 * 作者：仝飞
 * 创建日期：2017-10-11.
 * 邮箱：tongf5@chinaunicom.cn
 * 文件说明：已立项项目信息的查询
 */
import Cookie from 'js-cookie';
import { message } from 'antd';
import moment from 'moment';
import * as projServices from '../../../../services/project/projHistoryService';
import { getReplaceMoney , projApproveFullcostPmsListQuery} from '../../../../services/project/projService';
import config from '../../../../utils/config';
import * as publicFunc from './publicFunc';
import riskTrack from '../../../../routes/project/closure/projHistory/module/riskTrack';

/**
 * 作者：邓广晖
 * 创建日期：2017-11-24
 * 功能：判断元素是否在数组中
 * @param arr 原数组
 * @param value 输入值
 */
function isInArray(arr, value) {
    for (let i = 0; i < arr.length; i++) {
        if (value === arr[i]) {
            return true;
        }
    }
    return false;
}
moment.locale('zh-cn');
const dataFormat = 'YYYY-MM-DD';

// 每年每月的第一个周一时间列表，可以通过moment对象来计算时间，但是如果出现闰年情况，时间会错位
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
    // 获取年,月数
    let dateStartSplit = dateStart.split('-');
    let dateEndSplit = dateEnd.split('-');
    // 通过年,月差计算月份差
    return (parseInt(dateEndSplit[0]) - (dateStartSplit[0])) * 12 + (parseInt(dateEndSplit[1]) - parseInt(dateStartSplit[1])) + 1;
}

export default {
    namespace: 'projHistoryDetail',
    state: {
        squareTabKey: 'projInfo', // 默认第一个显示 项目信息
        // 公共
        projId: '', // 项目id
        projUid: '', // 项目uid
        beginTime: '', // 项目开始时间
        endTime: '', // 项目结束时间
        replaceMoney: '',
        query: '',

        // 项目信息
        projectInfo: {}, // 基本信息
        pms_list:[], // 基本信息-pms信息
        mileInfoList: [], // 里程碑
        fore_workload: '',
        display: false, // 根据TMO项目权限判断是否展示【修改附件】
        attachmentList: [], // 附件
        // 项目信息-全成本
        fullCostPmsTab: {},        //显示高亮的pms的tab数据
        coorpDeptList: [],
        deptBudgetTableData: [],
        allDeptList: [],
        predictTimeTotal: [],
        fullCostPmsListData:[],

        teamList: [], // 团队查询
        projPlanList: [], // 项目计划
        projPlanDoc: [], // 项目计划-所有文档类型列表
        arg_ppd_doc_type: '', // 项目计划-文档类型
        riskTrackList: [], // 风险跟踪
        riskTrackDetail: [], // 风险跟踪详情
        problemTrackList: [], // 问题跟踪
        problemTrackDetail: [], // 问题跟踪详情
        projDeliveryList: [], // 项目结项

        // 周报月报-周报
        weekOrMonth: true, // 判断显示周报页面或是月报页面，默认true现在周报页面

        monthTabIndex: '', /* 月份索引 */
        yearPaneIndex: '',            /* 年份索引 */

        collapsePanelList: [],        /* 折叠面板列表，其实也是年份列表 */
        oneYearMonthStart: '',        /* 某一年的开始月份 */
        oneYearMonthEnd: '',          /* 某一年的结束月份 */
        monthHaveReport: false,       /* 月份有无月报，提交的才有 */
        dateTableList: [],            /* 时间表格列表，所有tab共用一张表格 */

        tableDataLoadSpin: false,     /* 表格数据加载是否有旋转 */

        monthFromProjStart: '',       /* 从项目开始算起的月份 */
        monthStartTime: '',           /* 月份开始时间 */
        monthEndTime: '',             /* 月份结束时间 */
        serverCurrentTime: '',        /* 服务器当前时间 */

        duarationObject: {},          /* 时间段的对象 */
        oneYearMonth: {},             /* 每一年的月份时间段索引对象 */

        // 周报月报-月报
        earnData: [],             /* 挣值数据 */
        workPlanThisMonth: '',    /* 本月工作计划 */
        workPlanNextMonth: '',    /* 下个月工作计划 */
        progressOffset: '',       /* 进度偏差分析 */
        costOffset: '',           /* 成本偏差分析 */
        shareCostThis: '',        /* 本期分摊成本 */
        shareCostAll: '',         /* 累计分摊成本 */
        staffTotalLast: '',       /* 上期人员数量 */
        staffTotalThis: '',       /* 本期人员数量 */
        staffTotalChange: '',     /* 本期人员变化 */
        mark: '',                 /* 备注 */
        mileStoneList: [],        /* 里程碑列表 */
        mileStoneFinishState: '', /* 里程碑完成情况 */
        purchaseCostTypeList: [], /* 采购成本类型列表 */
        purchaseCostTableData: [], /* 采购成本表格数据 */
        operateCostTypeList: [],  /* 运行成本类型列表 */
        operateCostTableData: [], /* 运行成本表格数据 */
        carryOutCostTypeList: [], /* 实施成本类型列表 */
        carryOutCostTableData: [], /* 实施成本表格数据 */
        humanCostData: [],        /* 人工成本数据,一般只有一条数据 */
        // mileStoneState: 'notChange', /*里程碑变更状态*/
        // mileStoneTagVal: '',         /*里程碑提示语*/
        mileDataLoading: false,      /* 里程碑加载状态 */

        mileStoneProgressIsEmpty: false,  // 里程碑权重是否为空
        currentAC: '',             /* 当月ac值 */
        allPvDataList: [],         /* 所有pv值 */
        currentPv: '',             /* 当月pv值 */
        allCostList: [],           /* 所有费用（四种成本）的列表 */
        mileInitFail: false,       /* 里程碑初始化是否失败 */
        hasFullCostCount: false,   /* 全成本是否出账，没有出账不让新增 */
        fullCostVal: '',           /* 全成本出账时的提示语句 */
    },
    reducers: {
        save(state, action) {
            return { ...state, ...action.payload };
        },
        initProjInfoData(state) {
            return {
                ...state,
                fullCostPmsTab: {},
                projectInfo: {}, // 基本信息
                mileInfoList: [], // 里程碑
                fore_workload: '',
                display: false, // 根据TMO项目权限判断是否展示【修改附件】
                attachmentList: [], // 附件
                coorpDeptList: [],
                deptBudgetTableData: [],
                allDeptList: [],
                fullCostPmsListData:[],
                predictTimeTotal: [],
            };
        },
    },
    effects: {
        /**
        * 作者：邓广晖
        * 创建日期：2018-07-26
        * 功能：tab变化
        * @params key tab的key
        */
        *changeSquareTabs({ key }, { put }) {
            if (key === 'projInfo') {
                yield put({ type: 'projectInfoQuery' });
                yield put({ type: 'mileInfoQuery' });
                yield put({ type: 'searchHistoryFullcost' });
                yield put({ type: 'searchNewAddAttachment' });
                yield put({ type: 'searchProjFullcostTab'})
            } else if (key === 'teamQuery') {
                yield put({ type: 'teamQuery' });
            } else if (key === 'projPlan') {
                yield put({ type: 'projPlanDocQuery' });
                yield put({ type: 'projPlanQuery' });
            } else if (key === 'weekMonth') {
                yield put({
                    type: 'save',
                    payload: {
                        weekOrMonth: true,
                    },
                })
                yield put({ type: 'converDataAndInit' });
            } else if (key === 'riskTrack') {
                yield put({ type: 'riskTrackQuery' });
            } else if (key === 'problemTrack') {
                yield put({ type: 'problemTrackQuery' });
            } else if (key === 'projDelivery') {
                yield put({ type: 'projDeliveryListQuery' });
            }
            yield put({
                type: 'save',
                payload: {
                    squareTabKey: key,
                },
            });
        },


        /**
         * 功能：初始化
         */
        *mainProjQuery({ query }, { put }) {
            yield put({
                type: 'save',
                payload: {
                    squareTabKey: 'projInfo',
                    projId: query.proj_id,
                    beginTime: query.begin_time,
                    endTime: query.end_time,
                    replaceMoney: query.replace_money,
                    query,
                },
            });
            yield put({ type: 'projectInfoQuery' });
            yield put({ type: 'mileInfoQuery' });
            yield put({ type: 'searchHistoryFullcost' });
            yield put({ type: 'searchProjFullcostTab' });
            yield put({ type: 'searchNewAddAttachment' });
            yield put({ type: 'replaceMoneyQuery'})
        },
        // ========================项目信息=============  start==jump==
        /**
         * 功能：项目基本信息查询
         */
        *projectInfoQuery({ }, { call, put, select }) {
            const { projId } = yield select(state => state.projHistoryDetail);
            const postData = {
                arg_proj_id: projId,
                arg_flag: 1,
            };
            const data = yield call(projServices.getprojectInfo, postData);
            if (data.RetCode === '1' && 'replace_money' in data.DataRows[0]) {
                data.DataRows[0].replace_money = Number((Number(data.DataRows[0].replace_money) / 10000).toFixed(6));
                // 添加pms字段
                if (data.pms_list === undefined || data.pms_list === 'NaN') {
                    data.pms_list = [];
                } else {
                    let pms_list = JSON.parse(data.pms_list);
                    pms_list.forEach((item,index)=>{
                        if (item.pms_stage_num === 'NaN') {
                            item.pms_stage_num = '0';
                        }
                        item.opt_type = 'search';
                        item.key = index;
                    });
                    data.pms_list = pms_list;
                }

                
                yield put({
                    type: 'save',
                    payload: {
                        projectInfo: data.DataRows[0],
                        pms_list: data.pms_list,
                        projUid: data.DataRows[0].proj_uid,
                    },
                });
            }
        },

         /**
         * 作者：胡月
         * 创建日期：2018-1-22
         * 功能：项目基本信息tab中，底下的预估投资替代额查询
         */
        *replaceMoneyQuery({}, {call, put, select}) {
            const {projId,beginTime,endTime} = yield select(state => state.projHistoryDetail);
            let postData = {
                arg_proj_id: projId
            };
            const data = yield call(getReplaceMoney, postData);
            if (data.RetCode === '1') {
                //将投资替代额组成表格

                //确定投资替代额的年份
                let yearList = [];
                //年的索引，先从开始时间的年份开始算起
                let yearIndex = parseInt(beginTime.split('-')[0]);
                //将结束时间作为结束标志
                let yearEndTagIndex = parseInt(endTime.split('-')[0]);
                //如果年份索引不超过开始年份，进行添加
                while (yearIndex <= yearEndTagIndex) {
                    yearList.push(yearIndex.toString());
                    yearIndex++;
                }
                yearList = yearList.sort();   //年份需要排序
            
                let replaceMoneyList = [];
                if (yearList.length && data.DataRows.length) {
                    let obj = {};
                    let findObj = false;
                    for (let i = 0; i < yearList.length; i++) {
                        //添加  投资替代额
                        obj = {};
                        findObj = false;
                        for (let j = 0; j < data.DataRows.length; j++) {
                            if (yearList[i] === data.DataRows[j].rm_year && data.DataRows[j].fee_name === "投资替代额") {
                                obj.year = yearList[i];
                                obj.yearRowSpan = 2;
                                obj.yearColSpan = 1;
                                obj.feeName = '投资替代额';
                                obj.seasonOne = data.DataRows[j].season_one;
                                obj.seasonOneRowSpan = 1;
                                obj.seasonOneColSpan = 1;
                                obj.seasonTwo = data.DataRows[j].season_two;
                                obj.seasonTwoRowSpan = 1;
                                obj.seasonTwoColSpan = 1;
                                obj.seasonThree = data.DataRows[j].season_three;
                                obj.seasonThreeRowSpan = 1;
                                obj.seasonThreeColSpan = 1;
                                obj.seasonFour = data.DataRows[j].season_four;
                                obj.seasonFourRowSpan = 1;
                                obj.seasonFourColSpan = 1;
                                obj.totalSeason = data.DataRows[j].total_season;
                                obj.totalSeasonRowSpan = 1;
                                obj.totalSeasonColSpan = 1;
                                replaceMoneyList.push(obj);
                                findObj = true;
                                break;
                            }
                        }
                        if (findObj === false) {
                            obj.year = yearList[i];
                            obj.yearRowSpan = 2;
                            obj.yearColSpan = 1;
                            obj.feeName = '投资替代额';
                            obj.seasonOne = '0';
                            obj.seasonOneRowSpan = 1;
                            obj.seasonOneColSpan = 1;
                            obj.seasonTwo = '0';
                            obj.seasonTwoRowSpan = 1;
                            obj.seasonTwoColSpan = 1;
                            obj.seasonThree = '0';
                            obj.seasonThreeRowSpan = 1;
                            obj.seasonThreeColSpan = 1;
                            obj.seasonFour = '0';
                            obj.seasonFourRowSpan = 1;
                            obj.seasonFourColSpan = 1;
                            obj.totalSeason = '0';
                            obj.totalSeasonRowSpan = 1;
                            obj.totalSeasonColSpan = 1;
                            replaceMoneyList.push(obj);
                        }
                        //添加  虚拟收入
                        obj = {};
                        findObj = false;
                        for (let j = 0; j < data.DataRows.length; j++) {
                            if (yearList[i] === data.DataRows[j].rm_year && data.DataRows[j].fee_name === "虚拟收入") {
                                obj.year = yearList[i];
                                obj.yearRowSpan = 0;
                                obj.yearColSpan = 1;
                                obj.feeName = '虚拟收入';
                                obj.seasonOne = data.DataRows[j].season_one;
                                obj.seasonOneRowSpan = 1;
                                obj.seasonOneColSpan = 1;
                                obj.seasonTwo = data.DataRows[j].season_two;
                                obj.seasonTwoRowSpan = 1;
                                obj.seasonTwoColSpan = 1;
                                obj.seasonThree = data.DataRows[j].season_three;
                                obj.seasonThreeRowSpan = 1;
                                obj.seasonThreeColSpan = 1;
                                obj.seasonFour = data.DataRows[j].season_four;
                                obj.seasonFourRowSpan = 1;
                                obj.seasonFourColSpan = 1;
                                obj.totalSeason = data.DataRows[j].total_season;
                                obj.totalSeasonRowSpan = 1;
                                obj.totalSeasonColSpan = 1;
                                replaceMoneyList.push(obj);
                                findObj = true;
                                break;
                            }
                        }
                        if (findObj === false) {
                            obj.year = yearList[i];
                            obj.yearRowSpan = 0;
                            obj.yearColSpan = 1;
                            obj.feeName = '虚拟收入';
                            obj.seasonOne = '0';
                            obj.seasonOneRowSpan = 1;
                            obj.seasonOneColSpan = 1;
                            obj.seasonTwo = '0';
                            obj.seasonTwoRowSpan = 1;
                            obj.seasonTwoColSpan = 1;
                            obj.seasonThree = '0';
                            obj.seasonThreeRowSpan = 1;
                            obj.seasonThreeColSpan = 1;
                            obj.seasonFour = '0';
                            obj.seasonFourRowSpan = 1;
                            obj.seasonFourColSpan = 1;
                            obj.totalSeason = '0';
                            obj.totalSeasonRowSpan = 1;
                            obj.totalSeasonColSpan = 1;
                            replaceMoneyList.push(obj);
                        }
                    }

                    //添加  投资替代额  总计
                    obj = {};
                    findObj = false;
                    for (let j = 0; j < data.DataRows.length; j++) {
                        if (data.DataRows[j].rm_year === "total" && data.DataRows[j].fee_name === "投资替代额") {
                            obj.year = '总计';
                            obj.yearRowSpan = 2;
                            obj.yearColSpan = 1;
                            obj.feeName = '投资替代额';
                            obj.seasonOne = data.DataRows[j].season_one;
                            obj.seasonOneRowSpan = 1;
                            obj.seasonOneColSpan = 5;
                            obj.seasonTwo = data.DataRows[j].season_two;
                            obj.seasonTwoRowSpan = 1;
                            obj.seasonTwoColSpan = 0;
                            obj.seasonThree = data.DataRows[j].season_three;
                            obj.seasonThreeRowSpan = 1;
                            obj.seasonThreeColSpan = 0;
                            obj.seasonFour = data.DataRows[j].season_four;
                            obj.seasonFourRowSpan = 1;
                            obj.seasonFourColSpan = 0;
                            obj.totalSeason = data.DataRows[j].total_season;
                            obj.totalSeasonRowSpan = 1;
                            obj.totalSeasonColSpan = 0;
                            replaceMoneyList.push(obj);
                            findObj = true;
                            break;
                        }
                    }
                    if (findObj === false) {
                        obj.year = '总计';
                        obj.yearRowSpan = 2;
                        obj.yearColSpan = 1;
                        obj.feeName = '投资替代额';
                        obj.seasonOne = '0';
                        obj.seasonOneRowSpan = 1;
                        obj.seasonOneColSpan = 5;
                        obj.seasonTwo = '0';
                        obj.seasonTwoRowSpan = 1;
                        obj.seasonTwoColSpan = 0;
                        obj.seasonThree = '0';
                        obj.seasonThreeRowSpan = 1;
                        obj.seasonThreeColSpan = 0;
                        obj.seasonFour = '0';
                        obj.seasonFourRowSpan = 1;
                        obj.seasonFourColSpan = 0;
                        obj.totalSeason = '0';
                        obj.totalSeasonRowSpan = 1;
                        obj.totalSeasonColSpan = 0;
                        replaceMoneyList.push(obj);
                    }

                    //添加  虚拟收入   总计
                    obj = {};
                    findObj = false;
                    for (let j = 0; j < data.DataRows.length; j++) {
                        if (data.DataRows[j].rm_year === "total" && data.DataRows[j].fee_name === "虚拟收入") {
                            obj.year = '总计';
                            obj.yearRowSpan = 0;
                            obj.yearColSpan = 1;
                            obj.feeName = '虚拟收入';
                            obj.seasonOne = data.DataRows[j].season_one;
                            obj.seasonOneRowSpan = 1;
                            obj.seasonOneColSpan = 5;
                            obj.seasonTwo = data.DataRows[j].season_two;
                            obj.seasonTwoRowSpan = 1;
                            obj.seasonTwoColSpan = 0;
                            obj.seasonThree = data.DataRows[j].season_three;
                            obj.seasonThreeRowSpan = 1;
                            obj.seasonThreeColSpan = 0;
                            obj.seasonFour = data.DataRows[j].season_four;
                            obj.seasonFourRowSpan = 1;
                            obj.seasonFourColSpan = 0;
                            obj.totalSeason = data.DataRows[j].total_season;
                            obj.totalSeasonRowSpan = 1;
                            obj.totalSeasonColSpan = 0;
                            replaceMoneyList.push(obj);
                            findObj = true;
                            break;
                        }
                    }
                    if (findObj === false) {
                        obj.year = '总计';
                        obj.yearRowSpan = 0;
                        obj.yearColSpan = 1;
                        obj.feeName = '虚拟收入';
                        obj.seasonOne = '0';
                        obj.seasonOneRowSpan = 1;
                        obj.seasonOneColSpan = 5;
                        obj.seasonTwo = '0';
                        obj.seasonTwoRowSpan = 1;
                        obj.seasonTwoColSpan = 0;
                        obj.seasonThree = '0';
                        obj.seasonThreeRowSpan = 1;
                        obj.seasonThreeColSpan = 0;
                        obj.seasonFour = '0';
                        obj.seasonFourRowSpan = 1;
                        obj.seasonFourColSpan = 0;
                        obj.totalSeason = '0';
                        obj.totalSeasonRowSpan = 1;
                        obj.totalSeasonColSpan = 0;
                        replaceMoneyList.push(obj);
                    }
                }
                yield put({
                    type: 'save',
                    payload: {
                        replaceMoneyList: replaceMoneyList
                    }
                });
            }
        },

               /**
         * 作者：邓广晖
         * 创建日期：2018-12-04
         * 功能：全成本tab中点击PMS
         * @param value 点中的tab的value
         */
        *fullCostPmsTabClick({value},{put,select}) {
            const { fullCostPmsListData } = yield select(state => state.projHistoryDetail);
            let clickFullcostPmsTab = fullCostPmsListData.filter(item => item.tabConvertName === value);
            
            yield put({
                type: 'save',
                payload: {
                    fullCostPmsTab: clickFullcostPmsTab[0],
                }
            });
            yield put({
                type:'searchHistoryFullcost'
            });
        },

        /**
         * 作者：仝飞
         * 创建日期：2017-10-11
         * 邓广晖 2018-05-04 修改 ，替换里程碑查询服务，并加入交付物信息
         * 功能：里程碑信息查询
         * @param query url的请求参数
         * @param call 请求服务
         * @param put 返回reducer
         */
        *mileInfoQuery({ query }, { call, put, select }) {
            const { projId } = yield select(state => state.projHistoryDetail);
            const milestonePostData = {
                arg_flag: '1',         //
                arg_mile_flag: '3',
                arg_proj_id: projId,
            };
            const mileData = yield call(projServices.queryProjMilestoneInfo, milestonePostData);
            if (mileData.RetCode === '1') {
                // 首先对数据进行处理，尤其是NaN的数据，将NaN的数据用[]空数组代替
                for (let i = 0; i < mileData.DataRows.length; i++) {
                    // 为每一条里程碑添加一个key
                    mileData.DataRows[i].key = i;
                    let deliverables = mileData.DataRows[i].deliverables;
                    if (deliverables !== 'NaN' && deliverables !== undefined) {
                        // 将字符串中 [] 前后的引号去掉
                        deliverables = deliverables.replace(/\:\"\[+/g, ':[');
                        deliverables = deliverables.replace(/\]\"\}/g, ']}');
                        deliverables = JSON.parse(deliverables);
                        for (let j = 0; j < deliverables.length; j++) {
                            // 为每一条交付物类别添加一个key
                            deliverables[j].key = j;
                            if (deliverables[j].files !== 'NaN' && deliverables[j].files !== undefined) {
                                let files = deliverables[j].files;
                                for (let k = 0; k < files.length; k++) {
                                    // 为每一个附件添加一个key
                                    files[k].key = k;
                                }
                                deliverables[j].files = files;
                            } else {
                                deliverables[j].files = [];
                            }
                        }
                    } else {
                        deliverables = [];
                    }
                    mileData.DataRows[i].deliverables = deliverables;
                }
                yield put({
                    type: 'save',
                    payload: {
                        mileInfoList: mileData.DataRows,
                        fore_workload: mileData.fore_workload,
                    },
                });
            }
        },

                /**
         * 作者：邓广晖
         * 创建日期：2018-12-04
         * 功能：已立项项目的全成本,PMS的tab列表查询
         */
        *searchProjFullcostTab({},{call,put,select}) {
            const {  projId } = yield select(state => state.projHistoryDetail);
            let pmsListPostData = {
                arg_proj_id:projId,         //项目id，必传
                //arg_flag：查询标志，待定
                arg_userid: Cookie.get('userid'),       //登录用id，必传
            };
            const pmsListData = yield call(projApproveFullcostPmsListQuery, pmsListPostData);
            let fullCostPmsTab = {
                pms_code: '',
                tab_name: '',
                tab_flag: '0',
                tabConvertName:'',
            };
            if (pmsListData.RetCode === '1') {
                if (pmsListData.DataRows.length) {
                    pmsListData.DataRows.forEach((item,index)=>{
                        item.tabConvertName =  item.tab_name;
                        if (item.tab_flag === '1') {
                            item.tabConvertName = 'PMS' + index + '预算';
                        }
                    });
                    fullCostPmsTab = {...pmsListData.DataRows[0]};
                }
                yield put({
                    type: 'save',
                    payload: {
                        fullCostPmsTab: fullCostPmsTab,
                        fullCostShowPmsTab: pmsListData.isShowTab,
                        fullCostPmsListData: pmsListData.DataRows,
                        fullCostEditFlag: pmsListData.isEditFlag,
                        fullCostEditVal: pmsListData.isEditVal,
                        fullCostChgModal: false
                    }
                });
                yield put({
                    type:'searchHistoryFullcost'
                });
            } else if (pmsListData.RetCode === '-1') {
                message.error(pmsListData.RetVal);
            }
        },



        /**
         * 作者：邓广晖
         * 创建日期：2018-01-16
         * 功能：已立项项目的全成本
         * @param call 请求服务
         * @param put 返回reducer
         * @param select 获取model的state
         */
        *searchHistoryFullcost({ }, { call, put, select }) {
            const { projId, beginTime, endTime, fullCostPmsTab } = yield select(state => state.projHistoryDetail);
            // 查询配合部门列表
            const coorpDeptPostData = {
                arg_proj_id: projId,
                arg_tag: '2',                        /* 2代表已立项项目 */
                arg_tab_flag: fullCostPmsTab.tab_flag,
                arg_pms_code: fullCostPmsTab.pms_code,
            };
            const coorpDeptData = yield call(projServices.projApproveCoorDeptQueryNew, coorpDeptPostData);
            if (coorpDeptData.RetCode === '1') {
                coorpDeptData.DataRows.map((i, index) => {
                    if ('mgr_name' in i) {
                        i.key = index;           // 为没一条记录添加一个 key
                    } else {
                        i.key = index;
                        i.mgr_name = '';       // 配合部门没有字段时，设置为空
                    }
                    return i;
                });
            }

            // 查询所有部门列表,第一个为主责部门
            let allDeptPostData = {
                arg_proj_id: projId,
                arg_tenantid: Cookie.get('tenantid'),
                arg_tab_flag: fullCostPmsTab.tab_flag,
                arg_pms_code: fullCostPmsTab.pms_code,
            };
            const allDeptData = yield call(projServices.projApproveEditFullCostAllDeptQuery, allDeptPostData);
            // const allDeptData = yield call(projServices.queryAllDept,{arg_proj_id:queryData.arg_proj_id});
            // 查询每个部门的预算
            let budgetPostData = {
                arg_proj_id: projId,
                arg_tab_flag: fullCostPmsTab.tab_flag,
                arg_pms_code: fullCostPmsTab.pms_code,
            };
            const deptBudgetData = yield call(projServices.projApproveBudgetQuery, budgetPostData);
            // const deptBudgetData = yield call(projServices.querydeptBudgetData,{arg_proj_id:queryData.arg_proj_id});

            yield put({
                type: 'save',
                payload: {
                    coorpDeptList: coorpDeptData.DataRows,
                    allDeptList: allDeptData.DataRows,
                },
            });
            let allDeptList = allDeptData.DataRows;
            let deptBudgetList = deptBudgetData.DataRows;

            // 确定返回的预算中的年份
            let yearList = [];
            // 年的索引，先从开始时间的年份开始算起
            let yearIndex = parseInt(beginTime.split('-')[0]);
            // 将结束时间作为结束标志
            let yearEndTagIndex = parseInt(endTime.split('-')[0]);
            // 如果年份索引不超过开始年份，进行添加
            while (yearIndex <= yearEndTagIndex) {
                yearList.push(yearIndex.toString());
                yearIndex++;
            }
            yearList = yearList.sort();   // 年份需要排序

            // 计算所有工时之和
            let predictTimeTotal = 0;
            for (let indexp = 0; indexp < deptBudgetList.length; indexp++) {
                if (deptBudgetList[indexp].fee_type === '0' && deptBudgetList[indexp].fee_subtype === '-1') {
                    predictTimeTotal += Number(deptBudgetList[indexp].fee);
                }
            }
            yield put({
                type: 'save',
                payload: { predictTimeTotal: predictTimeTotal.toFixed(1) }
            });
            // 查询每一个年份下的费用类型个数，首先要确定三级目录的个数
            let yearListRowSpan = {};
            if (yearList.length) {
                // 计算年份的rowspan
                for (let yearIndex = 0; yearIndex < yearList.length; yearIndex++) {
                    // 预计工时，直接成本，项目采购成本，项目运行成本，项目实施成本，项目人工成本默认存在，yearRowSpan 默认加 6
                    let yearRowSpan = 0;
                    let purchaseCostList = [];   // 项目采购成本列表
                    let operateCostList = [];    // 项目运行成本列表
                    let carryOutCostList = [];   // 项目实施成本列表
                    for (let cellDataIndex1 = 0; cellDataIndex1 < deptBudgetList.length; cellDataIndex1++) {
                        // 先判断年
                        if (yearList[yearIndex] === deptBudgetList[cellDataIndex1].year) {
                            // 判断是否为直接成本，即fee_type = 1
                            if (deptBudgetList[cellDataIndex1].fee_type === '1') {
                                // 判断是不是属于直接成本中的采购成本、运行成本或者实施成本，即fee_subtype = 0 ，3 或者 1
                                if (deptBudgetList[cellDataIndex1].fee_subtype === '0') {
                                    // 如果不在列表里面才添加
                                    if (!isInArray(purchaseCostList, deptBudgetList[cellDataIndex1].fee_name.trim())) {
                                        purchaseCostList.push(deptBudgetList[cellDataIndex1].fee_name.trim());
                                    }
                                } else if (deptBudgetList[cellDataIndex1].fee_subtype === '3') {
                                    if (!isInArray(operateCostList, deptBudgetList[cellDataIndex1].fee_name.trim())) {
                                        operateCostList.push(deptBudgetList[cellDataIndex1].fee_name.trim());
                                    }
                                } else if (deptBudgetList[cellDataIndex1].fee_subtype === '1') {
                                    if (!isInArray(carryOutCostList, deptBudgetList[cellDataIndex1].fee_name.trim())) {
                                        carryOutCostList.push(deptBudgetList[cellDataIndex1].fee_name.trim());
                                    }
                                }
                            }
                        }
                    } //end for
                    let purchaseDeptTotal = [];  // 每个部门的所有xxxx费用之和的列表
                    let operateDeptTotal = [];   // 每个部门的所有zzzz费用之和的列表
                    let carryOutDeptTotal = [];  // 每个部门的所有yyyy费用之和的列表
                    let humanCostTotal = [];          // 项目人工成本列表（每个部门）
                    for (let deptIndexx = 0; deptIndexx < allDeptList.length; deptIndexx++) {
                        let purchaseDeptValue = 0;
                        let operateDeptValue = 0;
                        let carryOutDeptValue = 0;
                        let humanCostValue = 0;
                        for (let cellDataIndexx = 0; cellDataIndexx < deptBudgetList.length; cellDataIndexx++) {
                            // 首先判断单元格中的年份
                            if (yearList[yearIndex] === deptBudgetList[cellDataIndexx].year &&
                                allDeptList[deptIndexx].dept_name === deptBudgetList[cellDataIndexx].dept_name) {
                                // 判断是否为直接成本，即fee_type = 1
                                if (deptBudgetList[cellDataIndexx].fee_type === '1') {
                                    if (deptBudgetList[cellDataIndexx].fee_subtype === '0') {
                                        // 判断是不是属于直接成本中的采购成本，即fee_subtype = 0
                                        purchaseDeptValue += Number(deptBudgetList[cellDataIndexx].fee);
                                    } else if (deptBudgetList[cellDataIndexx].fee_subtype === '3') {
                                        // 判断是不是属于直接成本中的运行成本，即fee_subtype = 3
                                        operateDeptValue += Number(deptBudgetList[cellDataIndexx].fee);
                                    } else if (deptBudgetList[cellDataIndexx].fee_subtype === '1') {
                                        // 判断是不是属于直接成本中的实施成本，即fee_subtype = 1
                                        carryOutDeptValue += Number(deptBudgetList[cellDataIndexx].fee);
                                    } else if (deptBudgetList[cellDataIndexx].fee_subtype === '2') {
                                        // 判断是不是属于直接成本中的人工成本，即fee_subtype =2
                                        humanCostValue += Number(deptBudgetList[cellDataIndexx].fee);
                                    }
                                }
                            }
                        }
                        purchaseDeptTotal.push(purchaseDeptValue.toFixed(2));
                        operateDeptTotal.push(operateDeptValue.toFixed(2));
                        carryOutDeptTotal.push(carryOutDeptValue.toFixed(2));
                        humanCostTotal.push(humanCostValue.toFixed(2));
                    }
                    yearRowSpan = purchaseCostList.length + operateCostList.length + carryOutCostList.length + 6;
                    yearListRowSpan[yearList[yearIndex]] = {
                        yearRowSpan: yearRowSpan,
                        purchaseCostList: purchaseCostList,
                        purchaseDeptTotal: purchaseDeptTotal,
                        operateCostList: operateCostList,
                        operateDeptTotal: operateDeptTotal,
                        carryOutCostList: carryOutCostList,
                        carryOutDeptTotal: carryOutDeptTotal,
                        humanCostTotal: humanCostTotal,
                    };
                }// end for year
            }

            /* 将返回的预算数据转变成表格数据
            * */
            let deptBudgetTableData = [];
            let obj = {};
            let allTableTotal = 0;
            if (yearList.length) {
                for (let yearIndex2 = 0; yearIndex2 < yearList.length; yearIndex2++) {
                    obj = {};
                    // 每一年的每一个费用项，要添加所有部门的数据
                    // 1.添加预计工时 fee_type =0 , fee_subtype = -1
                    obj.year = yearList[yearIndex2];
                    obj.yearRowSpan = yearListRowSpan[yearList[yearIndex2]].yearRowSpan;
                    obj.fee_name = config.PREDICT_TIME;
                    obj.padLeft = '0px';
                    obj.feeType = '0';         //  0 代表预计工时，1 代表 预算
                    let predictTime = 0;
                    for (let i = 0; i < allDeptList.length; i++) {
                        let findPredictTime = false;
                        for (let cellDataIndex2 = 0; cellDataIndex2 < deptBudgetList.length; cellDataIndex2++) {
                            // 年相同就添加一条数据
                            if (yearList[yearIndex2] === deptBudgetList[cellDataIndex2].year) {
                                if (deptBudgetList[cellDataIndex2].fee_type === '0' &&
                                    deptBudgetList[cellDataIndex2].fee_subtype === '-1') {
                                    if (allDeptList[i].dept_name === deptBudgetList[cellDataIndex2].dept_name) {
                                        obj['dept' + i.toString()] = Number(deptBudgetList[cellDataIndex2].fee).toFixed(1);
                                        predictTime += Number(deptBudgetList[cellDataIndex2].fee);
                                        findPredictTime = true;
                                        break;
                                    }
                                }
                            }
                        }// end for
                        // 如果没有这种类型的数据，数据源加一条
                        if (findPredictTime === false) {
                            // 如果查询出来的没有预计工时，则新增0
                            obj['dept' + i.toString()] = '0.0';
                        }
                    }// end for
                    obj.total = predictTime.toFixed(1);
                    deptBudgetTableData.push(obj);
                    // 添加预计工时end

                    // 2.添加直接成本
                    obj = {};
                    obj.year = yearList[yearIndex2];
                    obj.yearRowSpan = 0;
                    obj.fee_name = config.DIRECT_COST;
                    obj.padLeft = '0px';
                    obj.feeType = '1';         //  0 代表预计工时，1 代表 预算
                    let directCostTotal = 0;
                    for (let j = 0; j < allDeptList.length; j++) {
                        let directCost = Number(yearListRowSpan[yearList[yearIndex2]].purchaseDeptTotal[j]) +
                            Number(yearListRowSpan[yearList[yearIndex2]].operateDeptTotal[j]) +
                            Number(yearListRowSpan[yearList[yearIndex2]].carryOutDeptTotal[j]) +
                            Number(yearListRowSpan[yearList[yearIndex2]].humanCostTotal[j]);
                        directCostTotal += directCost;
                        obj['dept' + j.toString()] = directCost.toFixed(2);
                    }// end for
                    obj.total = directCostTotal.toFixed(2);
                    deptBudgetTableData.push(obj);

                    // 2.1添加项目采购成本
                    obj = {};
                    obj.year = yearList[yearIndex2];
                    obj.yearRowSpan = 0;
                    obj.fee_name = config.PURCHASE_COST;
                    obj.padLeft = '10px';
                    obj.feeType = '1';         //  0 代表预计工时，1 代表 预算
                    let purchaseAllTotal = 0;
                    for (let k = 0; k < allDeptList.length; k++) {
                        obj['dept' + k.toString()] = yearListRowSpan[yearList[yearIndex2]].purchaseDeptTotal[k];
                        purchaseAllTotal += Number(yearListRowSpan[yearList[yearIndex2]].purchaseDeptTotal[k]);
                    }// end for
                    obj.total = purchaseAllTotal.toFixed(2);
                    deptBudgetTableData.push(obj);

                    // 2.1. 添加项目采购成本-子费用
                    let purchaseCostTypeList = yearListRowSpan[yearList[yearIndex2]].purchaseCostList;
                    for (let purchaseIndex = 0; purchaseIndex < purchaseCostTypeList.length; purchaseIndex++) {
                        obj = {};
                        obj.year = yearList[yearIndex2];
                        obj.yearRowSpan = 0;
                        obj.fee_name = '2.1.' + (purchaseIndex + 1).toString() + purchaseCostTypeList[purchaseIndex];
                        obj.no_pre_fee_name = purchaseCostTypeList[purchaseIndex];
                        obj.padLeft = '30px';
                        obj.feeType = '1';         //  0 代表预计工时，1 代表 预算
                        let purchaseTotal = 0;
                        for (let p = 0; p < allDeptList.length; p++) {
                            let findPurchase = false;
                            for (let cellDataIndex3 = 0; cellDataIndex3 < deptBudgetList.length; cellDataIndex3++) {
                                if (yearList[yearIndex2] === deptBudgetList[cellDataIndex3].year &&
                                    purchaseCostTypeList[purchaseIndex].trim() === deptBudgetList[cellDataIndex3].fee_name.trim()) {
                                    if (deptBudgetList[cellDataIndex3].fee_type === '1' &&
                                        deptBudgetList[cellDataIndex3].fee_subtype === '0') {
                                        if (allDeptList[p].dept_name === deptBudgetList[cellDataIndex3].dept_name) {
                                            obj['dept' + p.toString()] = Number(deptBudgetList[cellDataIndex3].fee).toFixed(2);
                                            purchaseTotal += Number(deptBudgetList[cellDataIndex3].fee);
                                            findPurchase = true;
                                            break;
                                        }
                                    }
                                }
                            }// end for
                            if (findPurchase === false) {
                                obj['dept' + p.toString()] = '0.00';
                            }
                        }// end for
                        obj.total = purchaseTotal.toFixed(2);
                        deptBudgetTableData.push(obj);
                    }

                    // 2.2添加项目运行成本
                    obj = {};
                    obj.year = yearList[yearIndex2];
                    obj.yearRowSpan = 0;
                    obj.fee_name = config.OPERATE_COST;
                    obj.padLeft = '10px';
                    obj.feeType = '1';         //  0 代表预计工时，1 代表 预算
                    let operateAllTotal = 0;
                    for (let ii = 0; ii < allDeptList.length; ii++) {
                        obj['dept' + ii.toString()] = yearListRowSpan[yearList[yearIndex2]].operateDeptTotal[ii];
                        operateAllTotal += Number(yearListRowSpan[yearList[yearIndex2]].operateDeptTotal[ii]);
                    }// end for
                    obj.total = operateAllTotal.toFixed(2);
                    deptBudgetTableData.push(obj);

                    // 2.2. 添加项目运行成本-子费用
                    let operateCostTypeList = yearListRowSpan[yearList[yearIndex2]].operateCostList;
                    for (let operateIndex = 0; operateIndex < operateCostTypeList.length; operateIndex++) {
                        obj = {};
                        obj.year = yearList[yearIndex2];
                        obj.yearRowSpan = 0;
                        obj.fee_name = '2.2.' + (operateIndex + 1).toString() + operateCostTypeList[operateIndex];
                        obj.no_pre_fee_name = operateCostTypeList[operateIndex];
                        obj.padLeft = '30px';
                        obj.feeType = '1';         //  0 代表预计工时，1 代表 预算
                        let operateTotal = 0;
                        for (let jj = 0; jj < allDeptList.length; jj++) {
                            let findOperate = false;
                            for (let cellDataIndex44 = 0; cellDataIndex44 < deptBudgetList.length; cellDataIndex44++) {
                                if (yearList[yearIndex2] === deptBudgetList[cellDataIndex44].year &&
                                    operateCostTypeList[operateIndex] === deptBudgetList[cellDataIndex44].fee_name.trim()) {
                                    if (deptBudgetList[cellDataIndex44].fee_type === '1' &&
                                        deptBudgetList[cellDataIndex44].fee_subtype === '3') {
                                        if (allDeptList[jj].dept_name === deptBudgetList[cellDataIndex44].dept_name) {
                                            obj['dept' + jj.toString()] = Number(deptBudgetList[cellDataIndex44].fee).toFixed(2);
                                            operateTotal += Number(deptBudgetList[cellDataIndex44].fee);
                                            findOperate = true;
                                            break;
                                        }
                                    }
                                }
                            }// end for
                            if (findOperate === false) {
                                obj['dept' + jj.toString()] = '0.00';
                            }
                        }// end for
                        obj.total = operateTotal.toFixed(2);
                        deptBudgetTableData.push(obj);
                    }


                    // 2.3添加项目实施成本
                    obj = {};
                    obj.year = yearList[yearIndex2];
                    obj.yearRowSpan = 0;
                    obj.fee_name = config.CARRYOUT_COST;
                    obj.padLeft = '10px';
                    obj.feeType = '1';         //  0 代表预计工时，1 代表 预算
                    let carryOutAllTotal = 0;
                    for (let ii = 0; ii < allDeptList.length; ii++) {
                        obj['dept' + ii.toString()] = yearListRowSpan[yearList[yearIndex2]].carryOutDeptTotal[ii];
                        carryOutAllTotal += Number(yearListRowSpan[yearList[yearIndex2]].carryOutDeptTotal[ii]);
                    }// end for
                    obj.total = carryOutAllTotal.toFixed(2);
                    deptBudgetTableData.push(obj);

                    // 2.3. 添加项目采购成本-子费用
                    let carryOutCostTypeList = yearListRowSpan[yearList[yearIndex2]].carryOutCostList;
                    for (let carryOutIndex = 0; carryOutIndex < carryOutCostTypeList.length; carryOutIndex++) {
                        obj = {};
                        obj.year = yearList[yearIndex2];
                        obj.yearRowSpan = 0;
                        obj.fee_name = '2.3.' + (carryOutIndex + 1).toString() + carryOutCostTypeList[carryOutIndex];
                        obj.no_pre_fee_name = carryOutCostTypeList[carryOutIndex];
                        obj.padLeft = '30px';
                        obj.feeType = '1';         //  0 代表预计工时，1 代表 预算
                        let carryOutTotal = 0;
                        for (let jj = 0; jj < allDeptList.length; jj++) {
                            let findCarryOut = false;
                            for (let cellDataIndex4 = 0; cellDataIndex4 < deptBudgetList.length; cellDataIndex4++) {
                                if (yearList[yearIndex2] === deptBudgetList[cellDataIndex4].year &&
                                    carryOutCostTypeList[carryOutIndex] === deptBudgetList[cellDataIndex4].fee_name.trim()) {
                                    if (deptBudgetList[cellDataIndex4].fee_type === '1' &&
                                        deptBudgetList[cellDataIndex4].fee_subtype === '1') {
                                        if (allDeptList[jj].dept_name === deptBudgetList[cellDataIndex4].dept_name) {
                                            obj['dept' + jj.toString()] = Number(deptBudgetList[cellDataIndex4].fee).toFixed(2);
                                            carryOutTotal += Number(deptBudgetList[cellDataIndex4].fee);
                                            findCarryOut = true;
                                            break;
                                        }
                                    }
                                }
                            }// end for
                            if (findCarryOut === false) {
                                obj['dept' + jj.toString()] = '0.00';
                            }
                        }// end for
                        obj.total = carryOutTotal.toFixed(2);
                        deptBudgetTableData.push(obj);
                    }

                    // 2.4添加项目人工成本
                    obj = {};
                    obj.year = yearList[yearIndex2];
                    obj.yearRowSpan = 0;
                    obj.fee_name = config.HUMAN_COST;
                    obj.padLeft = '10px';
                    obj.feeType = '1';         //  0 代表预计工时，1 代表 预算
                    let humanCostTotal = 0;
                    for (let b = 0; b < allDeptList.length; b++) {
                        let findHumanCost = false;
                        for (let cellDataIndex5 = 0; cellDataIndex5 < deptBudgetList.length; cellDataIndex5++) {
                            if (yearList[yearIndex2] === deptBudgetList[cellDataIndex5].year) {
                                if (deptBudgetList[cellDataIndex5].fee_type === '1' &&
                                    deptBudgetList[cellDataIndex5].fee_subtype === '2') {
                                    if (allDeptList[b].dept_name === deptBudgetList[cellDataIndex5].dept_name) {
                                        obj['dept' + b.toString()] = Number(deptBudgetList[cellDataIndex5].fee).toFixed(2);
                                        humanCostTotal += Number(deptBudgetList[cellDataIndex5].fee);
                                        findHumanCost = true;
                                        break;
                                    }
                                }
                            }
                        }// end for
                        if (findHumanCost === false) {
                            obj['dept' + b.toString()] = '0.00';
                        }
                    }// end for
                    obj.total = humanCostTotal.toFixed(2);
                    deptBudgetTableData.push(obj);
                }// end for year

                // 添加最后一行总计
                obj = {};
                obj.year = config.COST_ALL_TOTAL;
                obj.yearRowSpan = 1;
                obj.fee_name = '';
                obj.padLeft = '0px';
                obj.feeType = '1';         //  0 代表预计工时，1 代表 预算
                obj.yearOptType = 'total';
                for (let de = 0; de < allDeptList.length; de++) {
                    let allYearTotal = 0;
                    for (let yi = 0; yi < yearList.length; yi++) {
                        allYearTotal += Number(yearListRowSpan[yearList[yi]].purchaseDeptTotal[de]) +
                            Number(yearListRowSpan[yearList[yi]].operateDeptTotal[de]) +
                            Number(yearListRowSpan[yearList[yi]].carryOutDeptTotal[de]) +
                            Number(yearListRowSpan[yearList[yi]].humanCostTotal[de]);
                    }
                    obj['dept' + de.toString()] = allYearTotal.toFixed(2);
                    allTableTotal += allYearTotal;
                }// end for
                obj.total = allTableTotal.toFixed(2);
                deptBudgetTableData.push(obj);
            }
            // deptBudgetTableData.map((i,index)=>{ i.key=index;return i});
            for (let indexd = 0; indexd < deptBudgetTableData.length; indexd++) {
                deptBudgetTableData[indexd].key = indexd;
            }
            yield put({
                type: 'save',
                payload: {
                    deptBudgetTableData,
                },
            });
        },
        /**
         * 作者：仝飞
         * 创建日期：2017-10-11
         * 功能：判断是否是TMO权限
         * @param call 请求服务
         * @param put 返回reducer
         */
        *tmoRoleSearch({ }, { call, put }) {
            const argVrName = {
                arg_vr_name: '项目管理-TMO',
            };
            const staffId = Cookie.get('staff_id');
            let display = false;
            const argVrNameList = yield call(projServices.projTMOQuery, argVrName);
            if (argVrNameList.RetCode === '1' && argVrNameList.DataRows.length) {
                for (let i = 0; i < argVrNameList.DataRows.length; i++) {
                    if (argVrNameList.DataRows[i].staff_id === staffId) {
                        display = true;
                    }
                }
            }
            yield put({
                type: 'save',
                payload: {
                    display,
                },
            });
        },
        /**
         * 作者：仝飞
         * 创建日期：2017-10-11
         * 功能：项目启动时项目信息页面的查询已上传附件列表
         * @param call 请求服务
         * @param put 返回reducer
         */
        *searchNewAddAttachment({ }, { call, put, select }) {
            const { projId } = yield select(state => state.projHistoryDetail);
            let postData = {};
            postData.arg_flag = 1; // arg_flag：固定传0（0，项目启动-项目新增立项；1，项目启动-项目基本信息查询）
            postData.arg_proj_id = projId;

            const data = yield call(projServices.searchNewAddAttachment, postData);
            if (data.RetCode === '1') {
                if (data.DataRows.length && data.DataRows[0].file_list) {
                    // 将字符串转为json对象
                    let attachmentListTemp = JSON.parse(data.DataRows[0].file_list);
                    attachmentListTemp.map((i, index) => {
                        i.opt_type = 'search';   // 查询出来的附件标记为 search
                        i.key = index;           // 为没一条记录添加一个 key
                    });
                    // 此处重写一遍的原因是因为使用同一个时修改attachmentList时也修改了attachmentListOriginal
                    let attachmentListOriginal = JSON.parse(data.DataRows[0].file_list);
                    attachmentListOriginal.map((i, index) => {
                        i.opt_type = 'search';   // 查询出来的附件标记为 search
                        i.key = index;           // 为没一条记录添加一个 key
                    });
                    yield put({
                        type: 'save',
                        payload: {
                            attachmentList: attachmentListTemp,
                            attachmentListOriginal: attachmentListOriginal,
                        },
                    });
                } else {
                    yield put({
                        type: 'save',
                        payload: {
                            attachmentList: [],
                            attachmentListOriginal: [],
                        },
                    });
                }
            }
        },
        /**
         * 作者：仝飞
         * 创建日期：2017-10-11
         * 功能：项目启动时新增页面新增附件列表
         * @param attachmentList 附件列表
         * @param objFile 添加的文件
         * @param text 编辑时的文本值
         * @param put 返回reducer
         */
        *addAttachment({ attachmentList, objFile }, { put, select }) {
            let fileNameIsRepeat = false;
            if (attachmentList.length > 0) {
                for (let i = 0; i < attachmentList.length; i++) {
                    if (objFile.file_name === attachmentList[i].file_name) {
                        fileNameIsRepeat = true;
                        break;
                    }
                }
            }
            if (fileNameIsRepeat) {
                message.error(config.FILE_NAME_IS_REPEAT);
            } else {
                attachmentList.push(objFile);
                yield put({
                    type: 'save',
                    payload: {
                        attachmentList,
                    },
                });
                // 此处放真正的增加add服务
                const { projId } = yield select(state => state.projHistoryDetail);
                const transjson = {
                    opt: 'insert',
                    data: {
                        proj_id: projId,
                        file_byname: objFile.file_byname,
                        att_opt: objFile.opt_type,
                        file_name: objFile.file_name,
                        file_url: objFile.url,
                        file_relativepath: objFile.file_relativepath,
                        file_tag: '0',
                        att_create_by: Cookie.get('userid'),
                        att_id: objFile.att_id,
                    },
                };
                const editMessage = {
                    opt: 'update',
                    data: {
                        update: {
                            att_change_item: objFile.file_name + '：新增一条附件信息\n',
                            att_update_by: Cookie.get('userid'),
                        },
                        condition: {
                            proj_id: projId,
                        },
                    },
                };
                // 调用保存方法，传入数据库
                yield put({
                    type: 'projAttachmentSave',
                    transjson,
                    editMessage,
                });

            }
        },
        /**
        * 作者：仝飞
        * 创建日期：2017-10-11
        * 功能：项目启动时新增页面编辑附件列表
        * @param key 附件的key
        * @param attachmentList 附件列表
        * @param text 编辑时的文本值
        * @param put 返回reducer
        * @param select 获取model里面state
        */
        *editAttachment({ key, attachmentList }, { put, select }) {
            // 此处是放真正修改update的操作
            // 传入update的正确参数
            const { projId } = yield select(state => state.projHistoryDetail);
            const transjson = {
                opt: 'update',
                data: {
                    update: {
                        file_byname: attachmentList[key].file_byname,
                        att_update_by: Cookie.get('userid'),
                        att_opt: 'update',
                    },
                    condition: {
                        att_id: attachmentList[key].att_id,
                        proj_id: projId,
                    },
                },
            };
            const editMessage = {
                opt: 'update',
                data: {
                    update: {
                        att_change_item: attachmentList[key].file_name + '：修改附件别名信息\n',
                        att_update_by: Cookie.get('userid'),
                    },
                    condition: {
                        proj_id: projId,
                    },
                },
            };
            // 调用保存方法，传入数据库
            yield put({
                type: 'projAttachmentSave',
                transjson,
                editMessage,
            });
        },
        /**
         * 作者：仝飞
         * 创建日期：2017-10-11
         * 功能：项目启动时新增页面删除附件列表
         * @param key 附件的key
         * @param attachmentList 附件列表
         * @param put 返回reducer
         * @param select 获取model里面state
         */
        *deleteAttachment({ key, attachmentList }, { put, select }) {
            // 删除delete操作
            // 传入delete的正确参数
            const { projId } = yield select(state => state.projHistoryDetail);
            const transjson = {
                opt: 'update',
                data: {
                    update: {
                        att_state: '1',
                        att_update_by: Cookie.get('userid'),
                        att_opt: 'delete',
                    },
                    condition: {
                        att_id: attachmentList[key].att_id,
                        proj_id: projId,
                    },
                },
            };
            const editMessage = {
                opt: 'update',
                data: {
                    update: {
                        att_change_item: attachmentList[key].file_name + '：删除一条附件信息\n',
                        att_update_by: Cookie.get('userid'),
                    },
                    condition: {
                        proj_id: projId,
                    },
                },
            };
            // 调用保存方法，传入数据库
            yield put({
                type: 'projAttachmentSave',
                transjson,
                editMessage,
            });
        },
        /**
        *Author: 仝飞
        *Date: 2017-11-25 11:12
        *Email: tongf5@chinaunicom.cn
        *功能：项目管理》项目收尾》历史项目》
        */
        *projAttachmentSave({ transjson, editMessage }, { select, call, put }) {
            // ????????============?????这是哪里取得的值？？
            let transjsonarray = [];
            transjsonarray.push(transjson, editMessage);
            // 真正的save动作
            // tag 0 保存，2 提交
            const retData = yield call(projServices.projFileUpdate, {
                transjsonarray: JSON.stringify(transjsonarray)
            });
            if (retData.RetCode === '1') {
                message.success('数据操作成功!');
                yield put({
                    type: 'searchNewAddAttachment',
                });
            } else if (retData.RetCode === '-1') {
                message.error(retData.RetVal);
            }
        },
        // ========================项目信息============= end==jump==
        // ========================团队查询============= start==jump==
        /**
         *功能：团队查询
         */
        *teamQuery({ }, { call, put, select }) {
            const { projId, projUid } = yield select(state => state.projHistoryDetail);
            const postData = {
                arg_req_userid: publicFunc.getUserId(),
                arg_proj_id: projId,
                arg_proj_uid: projUid,
                arg_req_moduleurl: publicFunc.getModuleUrlIndex(),
            };
            const data = yield call(projServices.teamQuery, postData);
            if (data.RetCode === '1') {
                yield put({
                    type: 'save',
                    payload: {
                        teamList: data.DataRows,
                    },
                });
            }
        },
        // ========================团队查询============= end==jump==
        // ========================项目计划============= start==jump==
        /**
         *功能：项目计划-文档类型查询
         */
        *projPlanDocQuery({ }, { call, put, select }) {
            const { projId, projUid } = yield select(state => state.projHistoryDetail);
            const postData = {
                arg_req_userid: publicFunc.getUserId(),
                arg_proj_id: projId,
                arg_proj_uid: projUid,
                arg_req_moduleurl: publicFunc.getModuleUrlIndex(),
            };
            const data = yield call(projServices.projPlanDocQuery, postData);
            if (data.RetCode === '1') {
                yield put({
                    type: 'save',
                    payload: {
                        projPlanDoc: data.DataRows,
                    },
                });
            }
        },
        /**
         *功能：项目计划查询
         */
        *projPlanQuery({ }, { call, put, select }) {
            const { projId, projUid, arg_ppd_doc_type } = yield select(state => state.projHistoryDetail);
            const postData = {
                arg_req_userid: publicFunc.getUserId(),
                arg_proj_id: projId,
                arg_proj_uid: projUid,
                arg_req_moduleurl: publicFunc.getModuleUrlIndex(),
                arg_ppd_doc_type: arg_ppd_doc_type,
            };
            const data = yield call(projServices.projPlanQuery, postData);
            if (data.RetCode === '1') {
                yield put({
                    type: 'save',
                    payload: {
                        projPlanList: data.DataRows,
                    },
                });
            }
        },
        *setSelectShow({ value }, { put }) {
            yield put({
                type: 'save',
                payload: {
                    arg_ppd_doc_type: value,
                }
            });
            yield put({
                type: 'projPlanQuery',
            })
        },
        // ========================项目计划============= end==jump==
        // ========================周报月报-周报============= start==jump==
        /**
         * 作者：邓广晖
         * 创建日期：2017-11-10
         * 功能：转换数据并初始化
         * @param put 返回reducer
         * @param call 请求服务
         */
        *converDataAndInit({ }, { put, call, select }) {
            const { beginTime, endTime } = yield select(state => state.projHistoryDetail);
            // 开始时首先获取服务器当前时间
            const serverData = yield call(projServices.getServerCurrentTime);
            const serverCurrentTime = serverData.date_time.split(' ')[0];
            // 初始化基本显示信息,标题头部门
            yield put({
                type: 'save',
                payload: {
                    serverCurrentTime,
                },
            });

            // 将所有日期存入一个数组里，数组每一项里面是{start:'2015-04-02',end:'2015-04-08',week:1}
            // start是一周的开始时间，end是一周的结束时间，week是当月第几周
            let duarationList = [];
            for (let yearIndex in yearMonthWeek) {
                for (let month in yearMonthWeek[yearIndex]) {
                    let momentStart = moment(yearMonthWeek[yearIndex][month]);
                    let momentEnd = moment(yearMonthWeek[yearIndex][month]).add(6, 'days');
                    let weekIndex = 1;
                    // 如果是当月的，就push进去
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

            // 确定好日期列表后，根据项目的开始时间和结束时间截取列表，同时增加字段 weekFromStart 代表从项目开始的第几周
            let newDuarationList = [];
            let projStartTime = beginTime; // timeDuration.projStartTime;
            let projEndTime = endTime;   // timeDuration.projEndTime;
            // let currentTime = moment().format(dataFormat);
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
            for (let n = 0; n < listLength; n++) {
                newDuarationList[n].weekFromStart = n + 1;
            }

            // 年份列表
            let yearList = [];
            // 年的索引，先从结束时间的年份往回开始算起
            let yearIndex = parseInt(newDuarationList[listLength - 1].start.split('-')[0]);
            // 将开始时间作为结束标志
            let yearEndTagIndex = parseInt(newDuarationList[0].start.split('-')[0]);
            // 如果年份索引不超过开始年份，进行添加
            while (yearIndex >= yearEndTagIndex) {
                yearList.push(yearIndex.toString());
                yearIndex--;
            }

            let duarationObject = {};      // 方便点击年月时，快速索引
            /* 将日期列表转为{ 2016:
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

            let oneYearMonth = {};       // 方便切换年份面板时，快速确定当年的开始月份和结束月份
            /* 确定每年的开始月份和结束月份  {  2017:{oneYearMonthStart:xxxx-xx-xx, oneYearMonthEnd:xxxx-xx-xx}
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
                    // 找到年份
                    if (yearList[i] === newDuarationList[j].start.split('-')[0]) {
                        oneYearMonthList.push(newDuarationList[j]);
                        // 找到月份，月份要去0
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
                oneYearMonth[yearList[i]] = { oneYearMonthStart: oneYearMonthStart, oneYearMonthEnd: oneYearMonthEnd };
                duarationObject[yearList[i]] = obj;
            }

            /* //将新列表的第一个的开始时间和项目开始时间对比，取较大值
            newDuarationList[0].start = projStartTime >= newDuarationList[0].start?
              projStartTime:newDuarationList[0].start;
            //将新列表的最后一个的结束时间和项目的结束时间(以及当前时间)对比，取较小值
            newDuarationList[listLength-1].end = projEndTime <= newDuarationList[listLength-1].end?
              projEndTime:newDuarationList[listLength-1].end; */

            let firstTime = projStartTime >= newDuarationList[0].start ?
                projStartTime : newDuarationList[0].start;

            let projEndTimeOriginal = endTime;//timeDuration.projEndTime;
            let lastTime = projEndTimeOriginal <= newDuarationList[listLength - 1].end ?
                projEndTimeOriginal : newDuarationList[listLength - 1].end;

            let projStartYear = newDuarationList[0].start.split('-')[0];
            let projStartMonth = parseInt(newDuarationList[0].start.split('-')[1]).toString();

            // let currentTime = moment().format(dataFormat);
            /* let lastTime = projEndTime <= newDuarationList[listLength-1].end?
              projEndTime:newDuarationList[listLength-1].end; */
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

            // 判断新增月报按钮是否可见
            yield put({ type: 'judgeAddReport' });
            // 临时时间列表
            let timeListTemp = duarationObject[yearList[0]][oneYearMonth[yearList[0]].oneYearMonthEnd];
            // 判断并返回周报情况
            yield put({
                type: 'judgeWeekReportIsSubmit',
                timeListTemp: timeListTemp
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
        *judgeWeekReportIsSubmit({ timeListTemp }, { call, put, select }) {
            // 只要涉及到表格数据变化，初始表格为旋转状态
            yield put({
                type: 'save',
                payload: { tableDataLoadSpin: true }
            });
            const { projId } = yield select(state => state.projHistoryDetail);
            let timeList = [];
            for (let i = 0; i < timeListTemp.length; i++) {
                let postData = {
                    transjsonarray: JSON.stringify({
                        condition: { proj_id: projId, proj_week: timeListTemp[i].weekFromStart.toString() }
                    }),
                };
                let data = yield call(projServices.queryWeekReportState, postData);
                if (Number(data.RowCount) > 0) {
                    timeList.push({
                        startTime: timeListTemp[i].start,
                        endTime: timeListTemp[i].end,
                        key: i,
                        state: '1',
                        state_show: '已提交',
                        week: timeListTemp[i].week,
                        fileName: data.DataRows[0].file_name,
                        relativePath: data.DataRows[0].rel_url,
                    });
                } else {
                    timeList.push({
                        startTime: timeListTemp[i].start,
                        endTime: timeListTemp[i].end,
                        key: i,
                        state: '0',
                        state_show: '待提交',
                        week: timeListTemp[i].week,
                    });
                }
            }// end for
            yield put({
                type: 'save',
                payload: {
                    tableDataLoadSpin: false,
                    dateTableList: timeList.reverse(),
                },
            });
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
        *judgeAddReport({ }, { call, put, select }) {
            const {
                yearPaneIndex,
                monthTabIndex,
                beginTime,
                endTime,
                projId,
            } = yield select(state => state.projHistoryDetail);
            // 转换月份
            let currentTime = yearPaneIndex + '-' + monthTabIndex;
            let monthFromProjStart = getMidMonths(beginTime, currentTime).toString();
            yield put({
                type: 'save',
                payload: {
                    monthFromProjStart: monthFromProjStart,
                },
            });

            //确定月份的开始时间和结束时间
            let monthStartTime = moment().year(yearPaneIndex).month(Number(monthTabIndex) - 1).startOf('month').format(dataFormat);
            let monthEndTime = moment().year(yearPaneIndex).month(Number(monthTabIndex) - 1).endOf('month').format(dataFormat);
            //如果月份开始时间小于项目开始时间，取项目开始时间
            if (monthStartTime <= beginTime) {
                monthStartTime = beginTime;
            }
            //如果月份结束时间大于项目结束时间，取项目结束时间
            if (monthEndTime >= endTime) {
                monthEndTime = endTime;
            }
            yield put({
                type: 'save',
                payload: {
                    monthStartTime: monthStartTime,
                    monthEndTime: monthEndTime,
                },
            });

            // 判断月报是否提交
            let postData = {
                transjsonarray: JSON.stringify({
                    condition: {
                        proj_id: projId,
                        proj_month: monthFromProjStart,
                        tag: '1',
                    },
                }),
            };
            // 判断是否有月报
            const data = yield call(projServices.queryWorkPlanAndDeviation, postData);
            if (data.RetCode === '1') {
                if (Number(data.RowCount) > 0) {
                    yield put({
                        type: 'save',
                        payload: {
                            monthHaveReport: true
                        }
                    });
                } else {
                    yield put({
                        type: 'save',
                        payload: {
                            monthHaveReport: false
                        }
                    });
                }
            }
        },

        /**
         * 作者：邓广晖keep
         * 创建日期：2017-11-10
         * 功能：切换月份tab，改变时间表格
         * @param monthIndex 月份索引
         * @param put 返回reducer
         * @param select 获取model里面的state
         */
        *switchMonthTabTable({ monthIndex }, { put, select }) {
            const { duarationObject, yearPaneIndex } = yield select(state => state.projHistoryDetail);
            let timeListTemp = duarationObject[yearPaneIndex][monthIndex];
            yield put({
                type: 'save',
                payload: { monthTabIndex: monthIndex }
            });
            //判断月报按钮状态
            yield put({ type: 'judgeAddReport' });
            //判断并返回周报情况
            yield put({
                type: 'judgeWeekReportIsSubmit',
                timeListTemp: timeListTemp
            });
        },

        /**
         * 作者：邓广晖keep
         * 创建日期：2017-11-10
         * 功能：切换年份pane
         * @param yearIndex 年份索引
         * @param put 返回reducer
         * @param select 获取model的state
         */
        *switchPane({ yearIndex }, { put, select }) {
            const { duarationObject, oneYearMonth } = yield select(state => state.projHistoryDetail);
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
            yield put({ type: 'judgeAddReport' });
            //判断并返回周报情况
            yield put({
                type: 'judgeWeekReportIsSubmit',
                timeListTemp: timeListTemp
            });
        },
        // ========================周报月报-周报============= end==jump==
        // ========================周报月报-月报============= start==jump==
        // 月报初始化
        *initMonthReport({ }, { put }) {
            yield put({
                type: 'save',
                payload: {
                    weekOrMonth: false,
                }
            });
            yield put({ type: 'queryWorkPlanAndDeviation' });
            yield put({ type: 'earnDataStatistic' });
            yield put({ type: 'queryDirectCostManage' });
            yield put({ type: 'queryMileStoneHistory' });
        },
        /**
         * 作者：邓广晖
         * 创建日期：2017-11-10
         * 功能：挣值数据统计
         * @param call 请求服务
         * @param put 返回reducer
         */
        *earnDataStatistic({ query }, { call, put, select }) {
            const { projId } = yield select(state => state.projHistoryDetail);
            let postData = {
                transjsonarray: JSON.stringify({
                    condition: {
                        proj_id: projId,
                        tag: '2'
                    },
                    sequence: [{ "year": "0" }, { "month": "0" }]
                })
            };
            let data = yield call(projServices.earnDataStatistic, postData);
            if (data.DataRows.length) {
                for (let i = 0; i < data.DataRows.length; i++) {
                    data.DataRows[i].key = i;
                    data.DataRows[i].pv = (Number(data.DataRows[i].pv) / 10000).toFixed(2);
                    data.DataRows[i].ev = (Number(data.DataRows[i].ev) / 10000).toFixed(2);
                    data.DataRows[i].ac = (Number(data.DataRows[i].ac) / 10000).toFixed(2);
                    data.DataRows[i].spi = Number(data.DataRows[i].spi).toFixed(2);
                    data.DataRows[i].cpi = Number(data.DataRows[i].cpi).toFixed(2);
                }
                yield put({
                    type: 'save',
                    payload: { earnData: data.DataRows }
                });
            } else {
                yield put({
                    type: 'save',
                    payload: { earnData: [] }
                });
            }
        },

        /**
         * 作者：邓广晖
         * 创建日期：2017-12-04
         * 功能：工作计划查询和偏差分析查询
         * @param call 请求服务
         * @param put 返回reducer
         */
        *queryWorkPlanAndDeviation({ }, { call, put, select }) {
            const { projId, monthFromProjStart } = yield select(state => state.projHistoryDetail);
            let postData = {
                transjsonarray: JSON.stringify({
                    condition: {
                        proj_id: projId,
                        proj_month: monthFromProjStart,
                    }
                })
            };
            const data = yield call(projServices.queryWorkPlanAndDeviation, postData);
            if (data.RetCode === '1' && data.DataRows.length) {
                yield put({
                    type: 'save',
                    payload: {
                        workPlanThisMonth: data.DataRows[0].this_month,    /*本月主要工作*/
                        workPlanNextMonth: data.DataRows[0].next_month,    /*下个月工作计划*/
                        progressOffset: data.DataRows[0].progress_offset,  /*进度偏差分析*/
                        costOffset: data.DataRows[0].cost_offset,          /*成本偏差分析*/
                        shareCostThis: data.DataRows[0].share_cost_this,   /*本期分摊成本*/
                        shareCostAll: data.DataRows[0].share_cost_all,     /*累计分摊成本*/
                        staffTotalLast: data.DataRows[0].staff_total_last, /*上期人员数量*/
                        staffTotalThis: data.DataRows[0].staff_total_this, /*本期人员数量*/
                        staffTotalChange: data.DataRows[0].staff_total_change,/*本期人员变化*/
                        mileStoneFinishState: data.DataRows[0].ev,            /*里程碑完成度*/
                        mark: data.DataRows[0].mark,                          /*备注*/
                    }
                });
            }
        },

        /**
         * 作者：邓广晖
         * 创建日期：2017-12-04
         * 功能：查询里程碑历史
         * @param call 请求服务
         * @param put 返回reducer
         */
        *queryMileStoneHistory({ }, { call, put, select }) {
            const { projId, yearPaneIndex, monthTabIndex } = yield select(state => state.projHistoryDetail);
            let actualMonth = parseInt(monthTabIndex);
            let standardMonth = actualMonth < 10 ? '0' + monthTabIndex : monthTabIndex;
            let postData = {
                transjsonarray: JSON.stringify({
                    property: {
                        proj_id: "proj_id",
                        mile_name: "mile_name",
                        progress: "initVal"
                    },
                    condition: {
                        proj_id: projId,
                        year: yearPaneIndex,
                        month: standardMonth,
                        tag: '1'
                    }
                })
            };
            //里程碑加载数据旋转
            yield put({
                type: 'save',
                payload: {
                    mileDataLoading: true
                }
            });
            const data = yield call(projServices.queryMileStoneHistory, postData);
            if (data.RetCode === '1') {
                yield put({
                    type: 'save',
                    payload: {
                        mileStoneList: data.DataRows
                    }
                });
                yield put({
                    type: 'save',
                    payload: {
                        mileDataLoading: false
                    }
                });
            }
        },

        /**
         * 作者：邓广晖
         * 创建日期：2017-12-04
         * 功能：查询新增里程碑的信息
         * @param call 请求服务
         * @param select 获取model的state
         * @param put 返回reducer
         */
        *queryMileStone({ }, { select, call, put }) {
            let { projId, monthTabIndex, yearPaneIndex } = yield select(state => state.projHistoryDetail);
            //arg_flag=2&arg_proj_id=55
            //里程碑加载数据旋转
            yield put({
                type: 'save',
                payload: {
                    mileDataLoading: true
                }
            });
            //首先查询里程碑状态
            const data = yield call(projServices.queryMileStoneState, { arg_flag: '2', arg_proj_id: projId });
            if (data.tag === '1' || data.tag === '3') {
                yield put({
                    type: 'save',
                    payload: {
                        mileStoneState: 'change',
                        mileStoneTagVal: data.tagVal,
                    }
                });
                //message.error('项目里程碑信息正在变更，请等待里程碑审核通过后再填写月报!');
            } else {
                yield put({
                    type: 'save',
                    payload: {
                        mileStoneState: 'notChange',
                        mileStoneTagVal: '',
                    }
                });
            }

            //查询里程碑
            let actualMonth = parseInt(monthTabIndex);
            let standardMonth = actualMonth < 10 ? '0' + monthTabIndex : monthTabIndex;
            let milePostData = {
                //arg_month=09&arg_proj_id=55&arg_year=2017
                arg_month: standardMonth,
                arg_proj_id: projId,
                arg_year: yearPaneIndex,
            };
            const mileData = yield call(projServices.queryAddReportMileStone, milePostData);
            if (mileData.RetCode === '1') {
                yield put({
                    type: 'save',
                    payload: {
                        mileStoneList: mileData.DataRows,
                        mileInitFail: false
                    }
                });
            } else {
                yield put({
                    type: 'save',
                    payload: { mileInitFail: true }
                });
                //message.error("里程碑信息初始化失败，请检查该项目是否添加里程碑信息！");
            }
            //关闭里程碑旋转
            yield put({
                type: 'save',
                payload: {
                    mileDataLoading: false
                }
            });

            //所有pv值
            let pvPostData = {
                transjsonarray: JSON.stringify({
                    condition: {
                        proj_id: projId,
                        tag: '0'
                    },
                    sequence: [{ "year": "0" }, { "month": "0" }]
                })
            };
            const pvRestData = yield call(projServices.allPvDataQuery, pvPostData);
            let currentPv = '0';
            for (let i = 0; i < pvRestData.DataRows.length; i++) {
                if (pvRestData.DataRows[i].year === yearPaneIndex && pvRestData.DataRows[i].month === monthTabIndex) {
                    currentPv = pvRestData.DataRows[i].pv;
                    break;
                }
            }
            yield put({
                type: 'save',
                payload: {
                    allPvDataList: pvRestData.DataRows,
                    currentPv: currentPv
                }
            });

            //计算里程碑完成度和添加当月的挣值数据
            yield put({
                type: 'changeMileAndEarnData',
                opt_type: 'search'
            });
        },

        /**
         * 作者：邓广晖
         * 创建日期：2017-12-19
         * 功能：计算里程碑完成度和添加当月的挣值数据
         * @param opt_type 里程碑编辑时，挣值数据操作类型 （search,edit）,search代表初始化查询的计算操作，edit代表编辑时的计算操作
         * @param put 返回reducer
         * @param select 获取model的state
         */
        *changeMileAndEarnData({ opt_type }, { select, put }) {
            let mileStoneProgressIsEmpty = false;
            let { mileStoneList, monthTabIndex, yearPaneIndex, replaceMoney, earnData, currentAC, currentPv } = yield select(state => state.projHistoryDetail);
            let mileStoneFinishState = 0;
            for (let i = 0; i < mileStoneList.length; i++) {
                if (mileStoneList[i].progress === null || mileStoneList[i].progress === undefined) {
                    //message.error('里程碑权重为空，请先补全里程碑信息再填写月报！');
                    mileStoneFinishState = 0;
                    mileStoneProgressIsEmpty = true;
                    break;
                }
                mileStoneFinishState += Number(mileStoneList[i].initVal) * Number(mileStoneList[i].progress);
            }

            yield put({
                type: 'save',
                payload: {
                    mileStoneFinishState: (mileStoneFinishState / 100).toFixed(2),
                    mileStoneProgressIsEmpty: mileStoneProgressIsEmpty
                }
            });
            //添加挣值数据
            let obj = {
                year: yearPaneIndex,
                month: monthTabIndex,
                pv: (Number(currentPv) / 10000).toFixed(2),
                ev: ((mileStoneFinishState / 100 * replaceMoney) / 100 / 10000).toFixed(2),
                ac: (Number(currentAC) / 10000).toFixed(2),
                spi: ((mileStoneFinishState / 100 * replaceMoney) / 100 / Number(currentPv)).toFixed(2),
                cpi: ((mileStoneFinishState / 100 * replaceMoney) / 100 / Number(currentAC)).toFixed(2),
            };

            //如果是末尾月份，添加到末尾
            if (opt_type === 'search') {
                earnData.push(obj);
            } else if (opt_type === 'edit') {
                earnData.pop();
                earnData.push(obj);
            }

            for (let j = 0; j < earnData.length; j++) {
                earnData[j].key = j;
            }
            yield put({
                type: 'save',
                payload: {
                    earnData: JSON.parse(JSON.stringify(earnData))
                }
            });
        },
        /**
         * 作者：邓广晖
         * 创建日期：2017-12-04
         * 功能：查询直接成本管理数据
         * @param call 请求服务
         * @param put 返回reducer
         */
        *queryDirectCostManage({ }, { call, put, select }) {
            const { projId, yearPaneIndex, monthTabIndex } = yield select(state => state.projHistoryDetail);
            let postData = {};
            let data = {};
            postData = {
                transjsonarray: JSON.stringify({
                    condition: {
                        proj_id: projId,
                        year: yearPaneIndex,
                        month: monthTabIndex,
                    }
                })
            };
            data = yield call(projServices.queryDirectCostManageView, postData);
            //const data =  yield call(projServices.queryDirectCostManage,postData);
            //查看月报和新增共用
            if (data.RetCode === '1') {
                let purchaseCostTypeList = [];  //采购成本类型列表
                let purchaseCostTableData = []; //采购成本表格数据
                let operateCostTypeList = [];   //运行成本类型列表
                let operateCostTableData = [];  //运行成本表格数据
                let carryOutCostTypeList = [];  //实施成本类型列表
                let carryOutCostTableData = []; //实施成本表格数据
                let humanCostData = [];         //人工成本数据,一般只有一条数据
                if (data.DataRows.length) {
                    let purchaseFeeIndex = 0;
                    let purchaseObj1 = { intro: '本月', key: '0' };
                    let purchaseObj2 = { intro: '累计', key: '1' };
                    let operateFeeIndex = 0;
                    let operateObj1 = { intro: '本月', key: '0' };
                    let operateObj2 = { intro: '累计', key: '1' };
                    let carryOutFeeIndex = 0;
                    let carryOutObj1 = { intro: '本月', key: '0' };
                    let carryOutObj2 = { intro: '累计', key: '1' };
                    for (let i = 0; i < data.DataRows.length; i++) {
                        if (data.DataRows[i].fee_subtype === '0') {
                            //判断是否为采购成本
                            purchaseCostTypeList.push(data.DataRows[i].fee_name);
                            purchaseObj1['fee' + purchaseFeeIndex.toString()] = data.DataRows[i].month_fee;  //本月费用
                            purchaseObj2['fee' + purchaseFeeIndex.toString()] = data.DataRows[i].fee;        //累计费用
                            purchaseFeeIndex++;
                        } else if (data.DataRows[i].fee_subtype === '3') {
                            //判断是否为运行成本
                            operateCostTypeList.push(data.DataRows[i].fee_name);
                            operateObj1['fee' + operateFeeIndex.toString()] = data.DataRows[i].month_fee;  //本月费用
                            operateObj2['fee' + operateFeeIndex.toString()] = data.DataRows[i].fee;        //累计费用
                            operateFeeIndex++;
                        } else if (data.DataRows[i].fee_subtype === '1') {
                            //判断是否为实施成本
                            carryOutCostTypeList.push(data.DataRows[i].fee_name);
                            carryOutObj1['fee' + carryOutFeeIndex.toString()] = data.DataRows[i].month_fee;  //本月费用
                            carryOutObj2['fee' + carryOutFeeIndex.toString()] = data.DataRows[i].fee;        //累计费用
                            carryOutFeeIndex++;
                        } else if (data.DataRows[i].fee_subtype === '2') {
                            //判断是否为人工成本
                            humanCostData.push(data.DataRows[i]);
                        }
                    }
                    purchaseCostTableData.push(purchaseObj1, purchaseObj2);
                    operateCostTableData.push(operateObj1, operateObj2);
                    carryOutCostTableData.push(carryOutObj1, carryOutObj2);
                    yield put({
                        type: 'save',
                        payload: {
                            purchaseCostTypeList: purchaseCostTypeList,
                            purchaseCostTableData: purchaseCostTableData,
                            operateCostTypeList: operateCostTypeList,
                            operateCostTableData: operateCostTableData,
                            carryOutCostTypeList: carryOutCostTypeList,
                            carryOutCostTableData: carryOutCostTableData,
                            humanCostData: humanCostData
                        }
                    });
                } else {
                    yield put({
                        type: 'save',
                        payload: {
                            purchaseCostTypeList: purchaseCostTypeList,
                            purchaseCostTableData: purchaseCostTableData,
                            operateCostTypeList: operateCostTypeList,
                            operateCostTableData: operateCostTableData,
                            carryOutCostTypeList: carryOutCostTypeList,
                            carryOutCostTableData: carryOutCostTableData,
                            humanCostData: humanCostData
                        }
                    });
                }

            }
        },
        // 返回周报页面
        *goToWeek({ }, { put }) {
            yield put({
                type: 'save',
                payload: {
                    weekOrMonth: true,
                }
            });
        },
        // ========================周报月报-月报============= end==jump==
        // ========================风险跟踪============= start==jump==
        // 风险跟踪查询
        *riskTrackQuery({ }, { call, put, select }) {
            const { projId, projUid } = yield select(state => state.projHistoryDetail);
            const postData = {
                arg_req_userid: publicFunc.getUserId(),
                arg_proj_id: projId,
                arg_proj_uid: projUid,
                arg_req_moduleurl: publicFunc.getModuleUrlIndex(),
            };
            const data = yield call(projServices.queryRiskTrack, postData);
            if (data.RetCode === '1') {
                yield put({
                    type: 'save',
                    payload: {
                        riskTrackList: data.DataRows,
                    },
                });
            }
        },
        // 风险跟踪详情查询
        *riskDetailQuery({ argId }, { call, put, select }) {
            const { projId, projUid } = yield select(state => state.projHistoryDetail);
            const postData = {
                arg_req_userid: publicFunc.getUserId(),
                arg_proj_id: projId,
                arg_proj_uid: projUid,
                arg_req_moduleurl: publicFunc.getModuleUrlIndex(),
                arg_id: argId,
            };
            const data = yield call(projServices.riskDetailQuery, postData);
            if (data.RetCode === '1') {
                yield put({
                    type: 'save',
                    payload: {
                        riskTrackDetail: data.DataRows,
                    },
                });
            }
        },
        // ========================风险跟踪============= end==jump==
        // ========================问题跟踪============= start==jump==
        // 问题跟踪查询
        *problemTrackQuery({ }, { call, put, select }) {
            const { projId, projUid } = yield select(state => state.projHistoryDetail);
            const postData = {
                arg_req_userid: publicFunc.getUserId(),
                arg_proj_id: projId,
                arg_proj_uid: projUid,
                arg_req_moduleurl: publicFunc.getModuleUrlIndex(),
            };
            const data = yield call(projServices.queryProblemTrack, postData);
            if (data.RetCode === '1') {
                yield put({
                    type: 'save',
                    payload: {
                        problemTrackList: data.DataRows,
                    },
                });
            }
        },
        // 问题跟踪详情查询
        *queryProblemDetail({ argId }, { call, put, select }) {
            const { projId, projUid } = yield select(state => state.projHistoryDetail);
            const postData = {
                arg_req_userid: publicFunc.getUserId(),
                arg_proj_id: projId,
                arg_proj_uid: projUid,
                arg_req_moduleurl: publicFunc.getModuleUrlIndex(),
                arg_id: argId,
            };
            const data = yield call(projServices.queryProblemDetail, postData);
            if (data.RetCode === '1') {
                yield put({
                    type: 'save',
                    payload: {
                        problemTrackDetail: data.DataRows,
                    },
                });
            }
        },
        // ========================问题跟踪============= end==jump==
        // ========================项目结项============= start==jump==

        // 项目结项列表查询
        *projDeliveryListQuery({ }, { call, put, select }) {
            const { projId, projUid } = yield select(state => state.projHistoryDetail);
            const postData = {
                arg_req_userid: publicFunc.getUserId(),
                arg_proj_id: projId,
                arg_proj_uid: projUid,
                arg_req_moduleurl: publicFunc.getModuleUrlIndex(),
            };
            const data = yield call(projServices.projDeliveryListQuery, postData);
            if (data.RetCode === '1') {
                yield put({
                    type: 'save',
                    payload: {
                        projDeliveryList: data.DataRows,
                    },
                });
            }
        },
        // ========================项目结项============= end==jump==
    },
    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, query }) => {
                if (pathname === '/projectApp/projClosure/historyProject/projHistoryEdit') {
                    dispatch({ type: 'mainProjQuery', query });
                }
            });
        },
    },
};
