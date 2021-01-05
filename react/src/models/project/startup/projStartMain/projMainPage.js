/**
 * 作者：胡月
 * 创建日期：2017-10-11.
 * 邮箱：huy61@chinaunicom.cn
 * 文件说明：已立项项目信息的查询
 */
import * as projServices from '../../../../services/project/projService';
import config from '../../../../utils/config';
import Cookie from 'js-cookie';
import {getUuid} from '../../../../components/commonApp/commonAppConst.js';
import {message} from 'antd';
import {getOuBussinessId} from '../../../../routes/project/projConst';

/**
 * 作者：邓广晖
 * 创建日期：2017-11-24
 * 功能：改变OU值，主要是将 联通软件研究院  改为  联通软件研究院本部
 * @param name ou名
 */
function changeOuName(name) {
    return name === config.OU_NAME_CN ? config.OU_HQ_NAME_CN : name;
}

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

export default {
    namespace: 'projStartMainPage',
    state: {
        pms_list:[],             //pms列表
        mainProjList: [],
        projTypeList: [],
        projRelation: [],                         //关联项目列表
        projectInfo: {},
        replaceMoneyList: [],
        mileInfoList: [],        //里程碑信息列表，可变化
        fore_workload: '',       //里程碑总工作量*/
        remainWorkLoad: undefined,//里程碑剩余工作量，或者待分配工作量*/
        begin_time: '',           //里程碑里面项目开始时间*/
        end_time: '',             //里程碑里面项目结束时间*/
        attachmentList: [],
        checkLogList: [],
        queryData: {},
        /*以下为对已立项的项目进行修改时，新添加的数据*/
        tab1IsDisabled: false,     //tab是否被禁止*/
        tab2IsDisabled: false,
        tab3IsDisabled: false,
        tab4IsDisabled: false,
        tab5IsDisabled: false,
        tab6IsDisabled: false,

        projInfoEditFlag: '0',     //项目基本信息是否可编辑标志
        projInfoEditVal: '',       //项目基本信息编辑图标上显示的文字
        projInfoShow: 'view',      //项目基本信息是查看页面（view）还是编辑页面(edit)
        projInfoChgModal: false,   //切换到基本信息编辑时，弹出的模态框是否可见
        projOldInfo: {},
        projInfoLimit: {},         //基本信息的修改限制项
        basicInfoUuid: '',         //基本信息页面显示唯一id

        mileInfoEditFlag: '0',     //里程碑是否可编辑标志
        mileInfoEditVal: '',       //里程碑编辑图标上显示的文字
        mileInfoShow: 'view',      //里程碑是查看页面（view）还是编辑页面(edit)
        mileInfoChgModal: false,   //切换到里程碑编辑时，弹出的模态框是否可见
        mileInfoListOriginal: [],  //里程碑页面最原始数据
        deliverableCategoryList: [],//里程碑交付物类别列表
        mileProjUid: '',            //里程碑中使用到项目uid

        fullCostEditFlag: '0',     //全成本是否可编辑的标志，默认为 ‘0’
        fullCostEditVal: '',       //全成本编辑图标上显示的文字
        fullCostShow: 'view',      //全成本页面是查看页面（view）还是编辑页面(edit)
        fullCostChgModal: false,   //切换到全成本编辑时，弹出的模态框是否可见

        attachEditFlag: '',        //附件页面是否可编辑的标志
        attachEditVal: '',         //附件编辑图标上显示的文字
        attachShow: 'view',        //附件页面是查看页面（view）还是编辑页面(edit)
        attachmentListOriginal: [],//附件页面最原始数据
        /*以下为全成本数据*/
        fullCostPmsTab: {},        //显示高亮的pms的tab数据
        fullCostShowPmsTab: '0',   //是否显示PMS的tab组件
        fullCostPmsListData: [],   //pms的tab总数据
        yearListRowSpan: {},
        coorpDeptList: [],         //配合部门列表
        coorpDeptListOriginal: [],
        allDeptList: [],           //所有部门列表，第一个为主责部门
        deptBudgetList: [],        //返回的部门预算数据
        deptBudgetListOriginal: [],
        deptBudgetTableData: [],   //部门预算信息表格数据
        yearList: [],              //显示的年份列表
        yearListOriginal: [],
        purchaseAllCostList: [],   //采购成本类型列表
        operateAllCostList: [],    //运行成本类型列表
        carryOutAllCostList: [],   //实施成本类型列表
        fullCostYearList: [],      //可添加的年份列表
        predictTimeTotal: '0',     //预计工时综合
        allTableTotal: 0,          //预算合计
        verifierData: {},          //审核时需要的数据
        verifierDataRet: false,    //审核人列表数据是否已经返回
        /*以下为历史记录数据*/
        searchModule: '1',         //查询模块，分为 全部(0),基本信息（1），里程碑（2），全成本/配合部门（3-1），全成本/预算（3-2），附件（4）*/
        searchDeptValue: '',       //搜索时部门值
        searchDeptList: [],        //搜索时部门列表
        searchChangeItemValue: '', //搜索时变化项的值
        searchChangeItemList: [],  //搜索时变化项列表
        historyPage: 1,            //历史记录页码
        historyRowCount: '0',      //历史记录总条数
        historyList: [],           //历史记录列表
        historyTableLoad: false,   //历史记录表格加载旋转
        startOrderId: '',          //开始查询时的顺序ID,后台返回
    },
    reducers: {
        initData(state) {
            return {
                ...state,
                pms_list:[],             //pms列表
                mainProjList: [],
                projTypeList: [],
                projRelation: [],                         //关联项目列表
                projectInfo: {},
                replaceMoneyList: [],
                mileInfoList: [],        //里程碑信息列表，可变化
                fore_workload: '',       //里程碑总工作量*/
                remainWorkLoad: undefined,//里程碑剩余工作量，或者待分配工作量*/
                begin_time: '',           //里程碑里面项目开始时间*/
                end_time: '',             //里程碑里面项目结束时间*/
                attachmentList: [],
                checkLogList: [],
                queryData: {},
                /*以下为对已立项的项目进行修改时，新添加的数据*/
                tab1IsDisabled: false,     //tab是否被禁止*/
                tab2IsDisabled: false,
                tab3IsDisabled: false,
                tab4IsDisabled: false,
                tab5IsDisabled: false,
                tab6IsDisabled: false,

                projInfoEditFlag: '0',     //项目基本信息是否可编辑标志
                projInfoEditVal: '',       //项目基本信息编辑图标上显示的文字
                projInfoShow: 'view',      //项目基本信息是查看页面（view）还是编辑页面(edit)
                projInfoChgModal: false,   //切换到基本信息编辑时，弹出的模态框是否可见
                projOldInfo: {},
                projInfoLimit: {},         //基本信息的修改限制项
                basicInfoUuid: '',         //基本信息页面显示唯一id

                mileInfoEditFlag: '0',     //里程碑是否可编辑标志
                mileInfoEditVal: '',       //里程碑编辑图标上显示的文字
                mileInfoShow: 'view',      //里程碑是查看页面（view）还是编辑页面(edit)
                mileInfoChgModal: false,   //切换到里程碑编辑时，弹出的模态框是否可见
                mileInfoListOriginal: [],  //里程碑页面最原始数据
                deliverableCategoryList: [],//里程碑交付物类别列表
                mileProjUid: '',            //里程碑中使用到项目uid

                fullCostEditFlag: '0',     //全成本是否可编辑的标志，默认为 ‘0’
                fullCostEditVal: '',       //全成本编辑图标上显示的文字
                fullCostShow: 'view',      //全成本页面是查看页面（view）还是编辑页面(edit)
                fullCostChgModal: false,   //切换到全成本编辑时，弹出的模态框是否可见

                attachEditFlag: '',        //附件页面是否可编辑的标志
                attachEditVal: '',         //附件编辑图标上显示的文字
                attachShow: 'view',        //附件页面是查看页面（view）还是编辑页面(edit)
                attachmentListOriginal: [],//附件页面最原始数据
                /*以下为全成本数据*/
                fullCostPmsTab: {},        //显示高亮的pms的tab数据
                fullCostShowPmsTab: '0',   //是否显示PMS的tab组件
                fullCostPmsListData: [],   //pms的tab总数据
                yearListRowSpan: {},
                coorpDeptList: [],         //配合部门列表
                coorpDeptListOriginal: [],
                allDeptList: [],           //所有部门列表，第一个为主责部门
                deptBudgetList: [],        //返回的部门预算数据
                deptBudgetListOriginal: [],
                deptBudgetTableData: [],   //部门预算信息表格数据
                yearList: [],              //显示的年份列表
                yearListOriginal: [],
                purchaseAllCostList: [],   //采购成本类型列表
                operateAllCostList: [],    //运行成本类型列表
                carryOutAllCostList: [],   //实施成本类型列表
                fullCostYearList: [],      //可添加的年份列表
                predictTimeTotal: '0',     //预计工时综合
                allTableTotal: 0,          //预算合计
                verifierData: {},          //审核时需要的数据
                verifierDataRet: false,    //审核人列表数据是否已经返回
                /*以下为历史记录数据*/
                searchModule: '1',         //查询模块，分为 全部(0),基本信息（1），里程碑（2），全成本/配合部门（3-1），全成本/预算（3-2），附件（4）*/
                searchDeptValue: '',       //搜索时部门值
                searchDeptList: [],        //搜索时部门列表
                searchChangeItemValue: '', //搜索时变化项的值
                searchChangeItemList: [],  //搜索时变化项列表
                historyPage: 1,            //历史记录页码
                historyRowCount: '0',      //历史记录总条数
                historyList: [],           //历史记录列表
                historyTableLoad: false,   //历史记录表格加载旋转
                startOrderId: '',          //开始查询时的顺序ID,后台返回
            }
        },

        save(state, action) {
            return {...state, ...action.payload};
        }
    },
    effects: {
        /**
         * 作者：胡月
         * 创建日期：2018-1-25
         * 功能：主项目信息查询
         * @param query url的请求参数
         */
        *mainProjQuery({}, {call, put}) {
            const data = yield call(projServices.getPrimaryProj);
            if (data.RetCode === '1' && data.DataRows.length) {
                //将主项目列表数据中的所有 投资替代额 除以 1000 ，以 万元 为单位
                for (let i = 0; i < data.DataRows.length; i++) {
                    if ('replace_money' in data.DataRows[i]) {
                        data.DataRows[i].replace_money = Number((Number(data.DataRows[i].replace_money) / 10000).toFixed(6));
                    }
                }
            }
            yield put({
                type:'save',
                payload: {
                    mainProjList: data.DataRows,
                }
            });
        },

        /**
         * 作者：胡月
         * 创建日期：2018-1-25
         * 功能：查询项目类型的列表
         */
        *projTypeQuery({}, {call, put}) {
            const data = yield call(projServices.getProjType, {
                transjsonarray: JSON.stringify({
                    condition: {type_state: "0"}, sequence: [{type_order: "0"}]
                })
            });
            if (data.RetCode === '1') {
                yield put({
                    type: 'save',
                    payload: {
                        projTypeList: data.DataRows,
                    }
                });
            }
        },

        /**
         * 作者：胡月
         * 创建日期：2017-10-11
         * 功能：项目基本信息查询
         * 邓广晖  2018-01-19  修改，查询添加 arg_userid
         * 邓广晖  2018-01-21  修改，将query改为queryData
         * @param query url的请求参数
         */
        *projectInfoQuery({}, {call, put, select}) {
            const { queryData } = yield select(state => state.projStartMainPage);
            let postData = {
                arg_proj_id: queryData.proj_id,
                arg_flag: 1,
                arg_userid: Cookie.get('userid')
            };
            const data = yield call(projServices.getprojectInfo, postData);
            if (data.RetCode === '1' && data.DataRows.length && 'replace_money' in data.DataRows[0]) {
                data.DataRows[0].replace_money = Number((Number(data.DataRows[0].replace_money) / 10000).toFixed(6));
            }
            if (data.RetCode === '1' && data.DataRows.length) {
                //添加Pms字段
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
                        projInfoEditFlag: data.isEditFlag,
                        projInfoEditVal: data.isEditVal,
                        pms_list: data.pms_list,
                    }
                });
            }
            yield put({
                type: 'replaceMoneyQuery',
            });
        },

        /**
         * 作者：胡月
         * 创建日期：2018-1-22
         * 功能：项目基本信息tab中，底下的预估投资替代额查询
         */
        *replaceMoneyQuery({}, {call, put, select}) {
            const {queryData} = yield select(state => state.projStartMainPage);
            let postData = {
                arg_proj_id: queryData.proj_id,
            };
            const data = yield call(projServices.getReplaceMoney, postData);
         
            if (data.RetCode === '1') {
                //将投资替代额组成表格

                //确定投资替代额的年份
                let yearList = [];
                //年的索引，先从开始时间的年份开始算起
                let yearIndex = parseInt(queryData.begin_time.split('-')[0]);
                //将结束时间作为结束标志
                let yearEndTagIndex = parseInt(queryData.end_time.split('-')[0]);
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

        //========================================================有关已立项的基本信息页面修改   start

        /**
         * 作者：胡月
         * 创建日期：2018-01-25
         * 功能：基本信息页面点击编辑图标时，判断是否有权限修改
         */
        *clickProjInfoEditIcon({}, {call, put, select}) {
            //切换到 编辑 页面时，先走权限的服务判断
            const {queryData, projectInfo} = yield select(state => state.projStartMainPage);
            let allPostData = {
                arg_proj_id: queryData.proj_id,         //项目id，必传
                arg_proj_uid: projectInfo.proj_uid,     //项目uuid，必传
                arg_userid: Cookie.get('userid'),       //登录用id，必传
            };
            const data = yield call(projServices.projectInitiationUpdateProjInfo, allPostData);
            if (data.RetCode === '1') {
                //状态为 2 和 3 的，显示模态框
                if (data.isEditFlag === '2' || data.isEditFlag === '3') {
                    yield put({
                        type: 'save',
                        payload: {
                            projInfoChgModal: true
                        }
                    });
                } else if (data.isEditFlag === '1') {
                    //状态为1 时 ，可直接跳转到编辑页面
                    yield put({
                        type: 'changeProjInfoShow',
                        pageToType: 'edit'
                    });
                }
                yield put({
                    type: 'save',
                    payload: {
                        projInfoEditFlag: data.isEditFlag,
                        projInfoEditVal: data.isEditVal,
                    }
                });
            } else if (data.RetCode === '-1') {
                message.error(data.RetVal);
            }
        },

        /**
         * 作者：胡月
         * 创建日期：2018-01-25
         * 功能：改变基本信息页面的显示，查看页面（view）和编辑页面（edit）
         * @param pageToType 想要切换成的页面
         */
        *changeProjInfoShow({pageToType}, {call, put, select}) {
            //切换为编辑状态后，查询对应的的基本信息需要的数据
            if (pageToType === 'edit') {
                yield put({
                    type: 'editProjInfoQuery'
                });
                yield put({
                    type: 'save',
                    payload: {
                        tab1IsDisabled: false,  //只有基本信息页面可点击
                        tab2IsDisabled: true,
                        tab3IsDisabled: true,
                        tab4IsDisabled: true,
                        tab5IsDisabled: true,
                        tab6IsDisabled: true,
                        projInfoShow: pageToType,
                    }
                });
            } else if (pageToType === 'view') {
                yield put({
                    type: 'projectInfoQuery'
                });
                //所有tab页面可点击
                yield put({
                    type: 'save',
                    payload: {
                        tab1IsDisabled: false,
                        tab2IsDisabled: false,
                        tab3IsDisabled: false,
                        tab4IsDisabled: false,
                        tab5IsDisabled: false,
                        tab6IsDisabled: false,
                        projInfoShow: pageToType,
                    }
                });
            }
        },

        /**
         * 作者：邓广晖
         * 创建日期：2018-01-29
         * 功能：编辑基本信息时初始化查询
         */
        *editProjInfoQuery({}, {call, put, select}) {
            const {queryData, projectInfo} = yield select(state => state.projStartMainPage);
            let allPostData = {
                arg_proj_id: queryData.proj_id,         //项目id，必传
                arg_proj_uid: projectInfo.proj_uid,     //项目uuid，必传
                arg_userid: Cookie.get('userid'),       //登录用id，必传
            };
            const data = yield call(projServices.projectInitiationUpdateProjInfo, allPostData);
            if (data.RetCode === '1') {
                let projInfoLimit = JSON.parse(JSON.stringify(data));
                delete projInfoLimit.DataRows;
                //将投资替代额由 单位 元  转到  万元
                if ('replace_money' in data.DataRows[0]) {
                    data.DataRows[0].replace_money = (Number(data.DataRows[0].replace_money) / 10000).toString();
                }
                if ('minReplaceMoney' in projInfoLimit) {
                    projInfoLimit.minReplaceMoney = (Number(projInfoLimit.minReplaceMoney) / 10000).toString();
                }
                //添加Pms字段
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
                //console.log('================projInfoLimit');
                //console.log(projInfoLimit);
                yield put({
                    type: 'save',
                    payload: {
                        projOldInfo: data.DataRows[0],
                        projInfoLimit: projInfoLimit,
                        pms_list: data.pms_list,
                        basicInfoUuid: getUuid(32,64),         //每一次查询给基本信息表单一个唯一key，保证数据填充
                    }
                });
            }
            //查询所有主项目
            yield put({
                type: 'mainProjQuery',
            });
            //查询项目类型
            yield put({
                type: 'projTypeQuery',
            });
        },

        /**
         * 作者：邓广晖
         * 创建日期：2018-02-01
         * 功能：关闭基本信息页面点击编辑图标时弹出的对话框
         */
        *closeProjInfoModal({}, {put}) {
            yield put({
                type: 'save',
                payload: {
                    projInfoChgModal: false
                }
            });
        },

        /**
         * 作者：邓广晖
         * 创建日期：2018-01-29
         * 功能：基本信息修改提交
         * @param params 传入的参数，包括 changeReason,projInfoJson,projParentInfoJson,puInfoJson
         */
        *submitProjInfo({params}, {call, put, select}) {
            const {queryData, projectInfo} = yield select(state => state.projStartMainPage);
            let postData = {
                arg_proj_id: queryData.proj_id,         //项目id，必传
                arg_proj_uid: projectInfo.proj_uid,     //uuid,必传
                arg_opt_byid: Cookie.get('userid'),     //登陆人id，必传
                arg_opt_byname: Cookie.get('username'), //登陆人姓名，必传
                arg_change_reason: params.changeReason,
                arg_proj_info_json: JSON.stringify(params.arg_proj_info_json),
                arg_proj_parent_info_json: JSON.stringify(params.arg_proj_parent_info_json),
                arg_pu_info_json: JSON.stringify(params.arg_pu_info_json),
                arg_pms_code_json: JSON.stringify(params.arg_pms_code_json),
                arg_proj_relation_json :JSON.stringify(payload.arg_proj_relation_json )
            };
            //console.log('=================postData');
            //console.log(postData);
            const data = yield call(projServices.projApproveEditProjInfoSubmit, postData);
            if (data.RetCode === '1') {
                message.success('修改成功');
                yield put({
                    type: 'changeProjInfoShow',
                    pageToType: 'view'
                });
            } else if (data.RetCode === '-1') {
                message.error(data.RetVal);
            } else if (data.RetCode === '2') {
                message.info(data.RetVal);
                yield put({
                    type: 'changeProjInfoShow',
                    pageToType: 'view'
                });
            }
        },

        //========================================================有关已立项的基本信息页面修改   end

        /**
         * 作者：胡月
         * 创建日期：2017-10-11
         * 功能：里程碑信息查询
         * 邓广晖  2018-01-21  修改，将query改为queryData
         * 备注，该方法是在里程碑页面使用卡片呈现时使用的方法，
         *      在已立项的查询里面已经停用（2018-02-28）
         * @param query url的请求参数
         */
        *mileInfoQuery({}, {call, put, select}) {
            const {queryData} = yield select(state => state.projStartMainPage);
            let postData = {
                arg_flag: 1,
                arg_proj_id: queryData.proj_id,
                arg_mile_flag: 0
            };
            const data = yield call(projServices.getMileInfo, postData);
            if (data.RetCode === '1') {
                yield put({
                    type: 'save',
                    payload: {
                        mileInfoList: data.DataRows,
                        fore_workload: data.fore_workload
                    }
                });
            }
        },

        //========================================================有关已立项的里程碑页面修改   start
        /**
         * 作者：邓广晖
         * 创建日期：2018-02-24
         * 功能：里程碑信息查询（新版），包含交付物信息
         */
        *searchProjMilestone({}, {call, put, select}) {
            const {queryData} = yield select(state => state.projStartMainPage);
            let milestonePostData = {
                arg_flag: '1',         //
                arg_mile_flag: '3',
                arg_proj_id: queryData.proj_id,
                arg_userid: Cookie.get('userid')
            };
            const mileData = yield call(projServices.queryProjMilestoneInfo, milestonePostData);
            if (mileData.RetCode === '1') {
                //首先对数据进行处理，尤其是NaN的数据，将NaN的数据用[]空数组代替
                for (let i = 0; i < mileData.DataRows.length; i++) {
                    //为每一条里程碑添加一个key
                    mileData.DataRows[i].key = i;
                    let deliverables = mileData.DataRows[i].deliverables;
                    if (deliverables !== 'NaN' && deliverables !== undefined) {
                        //将字符串中 [] 前后的引号去掉
                        deliverables = deliverables.replace(/\:\"\[+/g, ':[');
                        deliverables = deliverables.replace(/\]\"\}/g, ']}');
                        deliverables = JSON.parse(deliverables);
                        for (let j = 0; j < deliverables.length; j++) {
                            //为每一条交付物类别添加一个key
                            deliverables[j].key = j;
                            if (deliverables[j].files !== 'NaN' && deliverables[j].files !== undefined) {
                                let files = deliverables[j].files;
                                for (let k = 0; k < files.length; k++) {
                                    //为每一个附件添加一个key
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

                //编辑按钮的权限
                yield put({
                    type: 'save',
                    payload: {
                        mileInfoEditFlag: mileData.isEditFlag,
                        mileInfoEditVal: mileData.isEditVal,
                        mileInfoChgModal: false
                    }
                });
                yield put({
                    type: 'save',
                    payload: {
                        mileInfoList: mileData.DataRows,
                        fore_workload: mileData.fore_workload
                    }
                });
                //console.log('=============mileData.DataRows');
                //console.log(mileData.DataRows);
            }
        },

        /**
         * 作者：邓广晖
         * 创建日期：2018-02-28
         * 功能：里程碑页面点击编辑图标时，判断是否有权限修改
         */
        *clickMilestoneEditIcon({}, {call, put, select}) {
            const {queryData} = yield select(state => state.projStartMainPage);
            let milestonePostData = {
                arg_flag: '1',         //
                arg_mile_flag: '3',
                arg_proj_id: queryData.proj_id,
                arg_userid: Cookie.get('userid')
            };
            const mileData = yield call(projServices.queryProjMilestoneInfo, milestonePostData);
            if (mileData.RetCode === '1') {
                //对数据进行处理，尤其是NaN的数据，将NaN的数据用[]空数组代替
                for (let i = 0; i < mileData.DataRows.length; i++) {
                    //为每一条里程碑添加一个key
                    mileData.DataRows[i].key = i;
                    //初始化的里程碑，每一条的操作类型为 search
                    mileData.DataRows[i].opt_type = 'search';

                    let deliverables = mileData.DataRows[i].deliverables;
                    if (deliverables !== 'NaN' && deliverables !== undefined) {
                        //将字符串中 [] 前后的引号去掉
                        deliverables = deliverables.replace(/\:\"\[+/g, ':[');
                        deliverables = deliverables.replace(/\]\"\}/g, ']}');
                        deliverables = JSON.parse(deliverables);
                        for (let j = 0; j < deliverables.length; j++) {
                            //为每一条交付物类别添加一个key
                            deliverables[j].key = j;
                            //为每一条交付物添加操作类型 search
                            deliverables[j].opt_type = 'search';
                            if (deliverables[j].files !== 'NaN' && deliverables[j].files !== undefined) {
                                let files = deliverables[j].files;
                                for (let k = 0; k < files.length; k++) {
                                    //为每一个附件添加一个key
                                    files[k].key = k;
                                    //为每一个附件添加操作类型 search
                                    files[k].opt_type = 'search';
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

                //状态为 2 和 3 的，显示模态框
                if (mileData.isEditFlag === '2' || mileData.isEditFlag === '3') {
                    yield put({
                        type: 'save',
                        payload: {
                            mileInfoChgModal: true
                        }
                    });
                } else if (mileData.isEditFlag === '1') {
                    //状态为1 时 ，可直接跳转到编辑页面
                    yield put({
                        type: 'changeMilestoneShow',
                        pageToType: 'edit'
                    });
                }

                //判断里程碑编辑状态 canEdit,
                // 0:隐藏编辑，1：有文件时置灰，没有文件时可编辑，
                // 2：任何时候可编辑，删除里程碑时将交付物和文件设置为search,3:任何时候可编辑，删除里程碑时，直接去掉这条记录
                //初始化时，有文件，mileUpdateAuth = ‘0’时 ，canEdit = ‘0’
                //初始化时，有文件，mileUpdateAuth = ‘1’时 ，canEdit = ‘1’，页面上需要判断有没有文件
                //初始化时，无文件，canEdit = '2' ,
                //新增里程碑时，canEdit = '3'

                for (let m = 0; m < mileData.DataRows.length; m++) {
                    let deliverables = mileData.DataRows[m].deliverables;
                    //判断有没有文件
                    let mileHaveFiles = false;
                    if (deliverables.length > 0) {
                        for (let d = 0; d < deliverables.length; d++) {
                            if (deliverables[d].files.length > 0) {
                                mileHaveFiles = true;
                                break;
                            }
                        }
                    }
                    //如果有文件
                    if (mileHaveFiles === true) {
                        if (mileData.mileUpdateAuth === '0') {
                            mileData.DataRows[m].canEdit = '0';
                        } else if (mileData.mileUpdateAuth === '1') {
                            mileData.DataRows[m].canEdit = '1';
                        }
                    } else {
                        mileData.DataRows[m].canEdit = '2';
                    }
                }
                yield put({
                    type: 'save',
                    payload: {
                        mileInfoEditFlag: mileData.isEditFlag,
                        mileInfoEditVal: mileData.isEditVal,
                        mileProjUid: mileData.proj_uid,
                    }
                });

                //计算剩余工作量
                let mileStoneWorkLoad = 0;
                let remainWorkLoad = undefined;
                //如果有里程碑
                if (mileData.DataRows.length > 0) {
                    mileData.DataRows.map((item, index) => {
                        mileStoneWorkLoad += Number(item.plan_workload);
                    });
                    remainWorkLoad = mileData.fore_workload - mileStoneWorkLoad;
                } else if (mileData.fore_workload) {
                    //如果没有里程碑，但有预计工作量
                    remainWorkLoad = mileData.fore_workload;
                }
                yield put({
                    type: 'save',
                    payload: {
                        mileInfoList: mileData.DataRows,
                        mileInfoListOriginal: JSON.parse(JSON.stringify(mileData.DataRows)),
                        fore_workload: mileData.fore_workload,
                        remainWorkLoad: remainWorkLoad,
                        begin_time: mileData.begin_time,
                        end_time: mileData.end_time,
                    }
                });
                //console.log('=============mileData.DataRows');
                //console.log(mileData.DataRows);
            } else if (mileData.RetCode === '-1') {
                message.error(mileData.RetVal);
            }

            //查询交付物类别
            const deliverableData = yield call(projServices.queryMilestoneDeliverableCategory, {
                transjsonarray: JSON.stringify({property: {del_name: 'del_name', del_id: 'del_id'}})
            });
            if (deliverableData.RetCode === '1') {
                yield put({
                    type: 'save',
                    payload: {
                        deliverableCategoryList: deliverableData.DataRows
                    }
                });
            }
        },

        /**
         * 作者：邓广晖
         * 创建日期：2018-02-28
         * 功能：关闭里程碑页面点击编辑图标时弹出的对话框
         */
        *closeMilestoneModal({}, {put}) {
            yield put({
                type: 'save',
                payload: {
                    mileInfoChgModal: false
                }
            });
        },

        /**
         * 作者：邓广晖
         * 创建日期：2018-02-28
         * 功能：改变里程碑页面的显示，查看页面（view）和编辑页面（edit）
         * @param pageToType 想要切换成的页面
         */
        *changeMilestoneShow({pageToType}, {call, put, select}) {
            //切换为编辑状态后，查询对应的的里程碑需要的数据
            if (pageToType === 'edit') {
                //此处不用再次查询，使用弹出框时查询的数据
                /*yield put({
          type:'editFullCostQuery'
        });*/
                yield put({
                    type: 'save',
                    payload: {
                        tab1IsDisabled: true,
                        tab2IsDisabled: false,   //只有里程碑页面可点击
                        tab3IsDisabled: true,
                        tab4IsDisabled: true,
                        tab5IsDisabled: true,
                        tab6IsDisabled: true,
                        mileInfoShow: pageToType,
                    }
                });
            } else if (pageToType === 'view') {
                yield put({
                    type: 'searchProjMilestone'
                });
                //所有tab页面可点击
                yield put({
                    type: 'save',
                    payload: {
                        tab1IsDisabled: false,
                        tab2IsDisabled: false,
                        tab3IsDisabled: false,
                        tab4IsDisabled: false,
                        tab5IsDisabled: false,
                        tab6IsDisabled: false,
                        mileInfoShow: pageToType,
                    }
                });
            }
        },

        /**
         * 作者：邓广晖
         * 创建日期：2018-03-01
         * 功能：里程碑编辑功能
         * @param values 当前里程碑变化数据
         * @param index 里程碑索引值
         * @param mileStoneList 里程碑列表数据
         * @param remainWorkLoad 剩余工作量
         * @param select 用于获取model里面的state
         * @param put 返回reducer
         */
        *editMilestone({values, index}, {put, select}) {
            let {mileInfoList, remainWorkLoad, mileInfoListOriginal} = yield select(state => state.projStartMainPage);
            //编辑的时候，状态的改变主要针对已经从数据库查询出来的数据，新增的里程碑的编辑不用考虑，因为其状态永远为insert
            if (mileInfoList[index].opt_type === "search" || mileInfoList[index].opt_type === "update") {
                //如果编辑的数据和原始数据相比较，没有发生变化，则状态为 search
                if (mileInfoListOriginal[index].mile_name === values.mile_name &&
                    mileInfoListOriginal[index].plan_begin_time === values.plan_begin_time.format("YYYY-MM-DD") &&
                    mileInfoListOriginal[index].plan_end_time === values.plan_end_time.format("YYYY-MM-DD") &&
                    Number(mileInfoListOriginal[index].plan_workload) === Number(values.plan_workload)
                ) {
                    mileInfoList[index].opt_type = 'search';
                } else {
                    mileInfoList[index].opt_type = 'update';     //设置状态标识为 update
                }
            }
            mileInfoList[index].mile_name = values.mile_name;
            mileInfoList[index].plan_begin_time = values.plan_begin_time.format("YYYY-MM-DD");
            mileInfoList[index].plan_end_time = values.plan_end_time.format("YYYY-MM-DD");
            //更新剩余量
            remainWorkLoad += Number(mileInfoList[index].plan_workload);  //先还原修改前一个状态
            remainWorkLoad -= Number(values.plan_workload);  //减去新的值
            mileInfoList[index].plan_workload = Number(values.plan_workload);  //更新列表中的值

            yield put({
                type: 'save',
                payload: {
                    mileInfoList: mileInfoList,
                    remainWorkLoad: remainWorkLoad
                }
            });
        },

        /**
         * 作者：邓广晖
         * 创建日期：2018-03-01
         * 功能：里程碑删除功能
         * @param index 里程碑索引值
         */
        *deleteMilestone({index}, {put, select}) {
            let {mileInfoList, remainWorkLoad} = yield select(state => state.projStartMainPage);
            remainWorkLoad += Number(mileInfoList[index].plan_workload);
            if (mileInfoList[index].opt_type !== 'insert') {
                mileInfoList[index].opt_type = 'delete';
                //此时的canEdit必等于 1 或者 2，因为canEdit=0时，是没有删除操作的
                //此时如何删除里程碑，则将交付物和文件的状态设置为search,增删改的操作都设置成search,这样最后就不会传值
                let deliverables = mileInfoList[index].deliverables;
                if (deliverables.length > 0) {
                    for (let d = 0; d < deliverables.length; d++) {
                        deliverables[d].opt_type = 'search';
                        let files = deliverables[d].files;
                        if (files.length > 0) {
                            for (let f = 0; f < files.length; f++) {
                                files[f].opt_type = 'search';
                            }
                        }
                    }
                }
            } else {
                //此时的canEdit必等于3
                mileInfoList.splice(index, 1);
            }
            //处理之后将key值重排
            for (let i = 0; i < mileInfoList.length; i++) {
                mileInfoList[i].key = i;
            }
            yield put({
                type: 'save',
                payload: {
                    mileInfoList: JSON.parse(JSON.stringify(mileInfoList)),
                    remainWorkLoad: remainWorkLoad
                }
            });
        },

        /**
         * 作者：邓广晖
         * 创建日期：2018-03-01
         * 功能：里程碑添加功能
         * @param data 当前里程碑数据
         */
        *addMilestone({data}, {put, select}) {
            let {mileInfoList, remainWorkLoad} = yield select(state => state.projStartMainPage);
            remainWorkLoad -= Number(data.plan_workload);
            data.key = mileInfoList.length;
            data.opt_type = 'insert';
            data.mile_uid = getUuid(32, 62);
            // 0:隐藏编辑，1：有文件时置灰，没有文件时可编辑，
            // 2：任何时候可编辑，删除里程碑时将交付物和文件设置为search,3:任何时候可编辑，删除里程碑时，直接去掉这条记录
            data.canEdit = '3';
            data.mile_month_progress = '0.0';
            data.deliverables = [];
            mileInfoList.push(data);
            yield put({
                type: 'save',
                payload: {
                    mileInfoList: JSON.parse(JSON.stringify(mileInfoList)),
                    remainWorkLoad: Number(remainWorkLoad.toFixed(1))
                }
            });
        },

        /**
         * 作者：邓广晖
         * 创建日期：2018-03-02
         * 功能：项目启动，TMO修改里程碑中的交付物文件别名
         * @param mileIndex 里程碑索引值
         * @param deliverableIndex 交付物索引值
         * @param fileIndex 文件索引值
         * @param text 编辑时的文本值
         */
        *editDeliverableFile({mileIndex, deliverableIndex, fileIndex, text}, {put, select}) {
            let {mileInfoList, mileInfoListOriginal} = yield select(state => state.projStartMainPage);
            let fileList = mileInfoList[mileIndex].deliverables[deliverableIndex].files;
            //如果编辑的是查询出来的文件
            if (fileList[fileIndex].opt_type !== 'insert') {
                let fileListOriginal = mileInfoListOriginal[mileIndex].deliverables[deliverableIndex].files;
                //如果文件别名于最原始查出来的文件别名不一样，将标志设置为 update
                if (text !== fileListOriginal[fileIndex].pmdf_file_byname) {
                    fileList[fileIndex].opt_type = 'update';
                } else {
                    fileList[fileIndex].opt_type = 'search';
                }
            }
            //不管是查询的文件还是新增的文件，文件别名修改了，就修改内容
            if (fileList[fileIndex].pmdf_file_byname !== text) {
                fileList[fileIndex].pmdf_file_byname = text;
            }
            mileInfoList[mileIndex].deliverables[deliverableIndex].files = fileList;
            yield put({
                type: 'save',
                payload: {
                    mileInfoList: JSON.parse(JSON.stringify(mileInfoList))
                }
            });
        },

        /**
         * 作者：邓广晖
         * 创建日期：2018-03-02
         * 功能：项目启动，TMO修改里程碑交付物文件，删除交付物文件
         * @param mileIndex 里程碑索引值
         * @param deliverableIndex 交付物索引值
         * @param fileIndex 文件索引值
         */
        *deleteDeliverableFile({mileIndex, deliverableIndex, fileIndex}, {put, select}) {
            let {mileInfoList} = yield select(state => state.projStartMainPage);
            let fileList = mileInfoList[mileIndex].deliverables[deliverableIndex].files;
            //如果删除的附件不是新增的，将状态改为delete
            if (fileList[fileIndex].opt_type !== 'insert') {
                fileList[fileIndex].opt_type = 'delete';
            } else {
                //如果删除的附件是新增的，直接删除这条记录
                fileList.splice(fileIndex, 1);
            }
            //处理之后将key值重排
            for (let i = 0; i < fileList.length; i++) {
                fileList[i].key = i;
            }
            mileInfoList[mileIndex].deliverables[deliverableIndex].files = fileList;
            yield put({
                type: 'save',
                payload: {mileInfoList: JSON.parse(JSON.stringify(mileInfoList))}
            });
        },

        /**
         * 作者：邓广晖
         * 创建日期：2018-03-02
         * 功能：项目启动，TMO修改里程碑交付物，新增交付物
         * @param mileIndex 里程碑索引值
         * @param deliverableIndex 交付物索引值
         * @param objFile 添加的文件
         * @param text 编辑时的文本值
         */
        *addDeliverableFile({mileIndex, deliverableIndex, objFile}, {put, select}) {
            let {mileInfoList} = yield select(state => state.projStartMainPage);
            let fileList = mileInfoList[mileIndex].deliverables[deliverableIndex].files;
            fileList.push(objFile);
            mileInfoList[mileIndex].deliverables[deliverableIndex].files = fileList;
            yield put({
                type: 'save',
                payload: {mileInfoList: JSON.parse(JSON.stringify(mileInfoList))}
            });
        },

        /**
         * 作者：邓广晖
         * 创建日期：2018-03-05
         * 功能：项目启动，TMO修改里程碑交付物，新增里程碑下的交付物
         * @param selectedDeliCategory 勾选弹出的交付物类别时，缓存勾选的类别的id 列表
         * @param newAddDeliverable 新添加的交付物类别列表，{del_name:xxx,del_id:yyy}
         * @param mileIndex 点击交付类别时，当前里程碑索引值
         */
        *addMilestoneDeliverable({selectedDeliCategory, newAddDeliverable, mileIndex}, {put, select}) {
            let {mileInfoList, deliverableCategoryList} = yield select(state => state.projStartMainPage);
            const currentMileDeliverLength = mileInfoList[mileIndex].deliverables.length;
            //处理新添加的可选择的交付物类别
            if (newAddDeliverable.length) {
                for (let i = 0; i < newAddDeliverable.length; i++) {
                    deliverableCategoryList.push({
                        del_id: newAddDeliverable[i].del_id,
                        del_name: newAddDeliverable[i].del_name,
                        opt_type: 'insert'
                    });
                }
            }
            //处理里程碑里面新添加的交付物,selectedDeliCategory在前面判断过，所以此处的长度比大于0
            for (let i = 0; i < selectedDeliCategory.length; i++) {
                //首先通过del_id 去寻找 对应的del_name
                let del_name = '';
                for (let j = 0; j < deliverableCategoryList.length; j++) {
                    if (selectedDeliCategory[i] === deliverableCategoryList[j].del_id) {
                        del_name = deliverableCategoryList[j].del_name;
                        break;
                    }
                }
                mileInfoList[mileIndex].deliverables.push({
                    pmd_delid: selectedDeliCategory[i],
                    pmd_id: getUuid(32, 62),
                    del_name: del_name,
                    files: [],
                    opt_type: 'insert',
                    key: currentMileDeliverLength + i
                });
            }
            yield put({
                type: 'save',
                payload: {
                    mileInfoList: JSON.parse(JSON.stringify(mileInfoList)),
                    deliverableCategoryList: JSON.parse(JSON.stringify(deliverableCategoryList)),
                }
            });
        },

        /**
         * 作者：邓广晖
         * 创建日期：2018-03-05
         * 功能：项目启动，TMO修改里程碑交付物，删除里程碑的交付物
         * @param mileIndex 里程碑索引值
         * @param deliverableIndex 交付物索引值
         */
        *deleteMileDeliverable({mileIndex, deliverableIndex}, {put, select}) {
            let {mileInfoList} = yield select(state => state.projStartMainPage);
            let deliverables = mileInfoList[mileIndex].deliverables;
            //如果删除的附件不是新增的，将状态改为delete
            if (deliverables[deliverableIndex].opt_type !== 'insert') {
                deliverables[deliverableIndex].opt_type = 'delete';
            } else {
                //如果删除的附件是新增的，直接删除这条记录
                deliverables.splice(deliverableIndex, 1);
            }
            //处理之后将key值重排
            for (let i = 0; i < deliverables.length; i++) {
                deliverables[i].key = i;
            }
            mileInfoList[mileIndex].deliverables = deliverables;
            yield put({
                type: 'save',
                payload: {mileInfoList: JSON.parse(JSON.stringify(mileInfoList))}
            });
        },

        /**
         * 作者：邓广晖
         * 创建日期：2018-03-06
         * 功能：项目启动，TMO修改里程碑，提交
         * @param object_milestone 变化的里程碑数据
         * @param reasonValue 修改原因
         */
        *submitMilestone({object_milestone, reasonValue}, {put, call, select}) {
            let {queryData, mileProjUid, mileInfoList} = yield select(state => state.projStartMainPage);
            let postData = {};
            postData.arg_proj_id = queryData.proj_id;
            /*项目id,必传*/
            postData.arg_proj_uid = mileProjUid;
            /*proj_uid必传*/
            postData.arg_opt_byid = Cookie.get('userid');
            /*登陆人id，必传*/
            postData.arg_opt_byname = Cookie.get('username');
            /*登陆人姓名，必传*/
            postData.arg_change_reason = reasonValue;
            /*修改原因，提交必传*/

            //里程碑的交付物类别或者交付物文件改变时，传里程碑uid
            let milesDeliOrFileChgList = [];
            for (let m = 0; m < mileInfoList.length; m++) {
                let deliverables = mileInfoList[m].deliverables;
                let findDeliOrFileChange = false;
                if (deliverables.length > 0) {
                    for (let d = 0; d < deliverables.length; d++) {
                        //先判断交付物是否发生变化
                        if (deliverables[d].opt_type !== 'search') {
                            findDeliOrFileChange = true;
                            break;
                        }
                        //判断交付物文件是否发生变化
                        let files = deliverables[d].files;
                        let findFileChange = false;
                        if (files.length > 0) {
                            for (let f = 0; f < files.length; f++) {
                                if (files[f].opt_type !== 'search') {
                                    findFileChange = true;
                                    break;
                                }
                            }
                            if (findFileChange === true) {
                                findDeliOrFileChange = true;
                                break;
                            }
                        }
                    }
                }
                if (findDeliOrFileChange === true) {
                    milesDeliOrFileChgList.push(mileInfoList[m].mile_uid);
                }
            }
            postData.arg_miles_del_change = JSON.stringify(milesDeliOrFileChgList);

            //里程碑预估工作量是否改变标志：0未改变，1已改变
            let planworkload_change_flag = '0';
            let mileData = object_milestone.array_milestone;
            for (let i = 0; i < mileData.length; i++) {
                if (mileData[i].opt_type === 'insert' || mileData[i].opt_type === 'delete' ||
                    (mileData[i].opt_type === 'update' && 'plan_workload' in mileData[i])
                ) {
                    planworkload_change_flag = '1';
                    break;
                }
            }
            postData.arg_planworkload_change_flag = planworkload_change_flag;

            postData.arg_object_milestone = JSON.stringify(object_milestone);
            const mileSubmitData = yield call(projServices.projApproveEditMilestoneSubmit, postData);
            if (mileSubmitData.RetCode === '1') {
                message.success('修改成功');
                yield put({
                    type: 'changeMilestoneShow',
                    pageToType: 'view'
                });
            } else if (mileSubmitData.RetCode === '-1') {
                message.error(mileSubmitData.RetVal);
            } else if (mileSubmitData.RetCode === '2') {
                message.info(mileSubmitData.RetVal);
                yield put({
                    type: 'changeMilestoneShow',
                    pageToType: 'view'
                });
            }
        },

        //========================================================有关已立项的里程碑页面修改   end

        /**
         * 作者：邓广晖
         * 创建日期：2018-12-04
         * 功能：已立项项目的全成本,PMS的tab列表查询
         */
        *searchProjFullcostTab({},{call,put,select}) {
            const { queryData } = yield select(state => state.projStartMainPage);
            let pmsListPostData = {
                arg_proj_id: queryData.proj_id,         //项目id，必传
                //arg_flag：查询标志，待定
                arg_userid: Cookie.get('userid'),       //登录用id，必传
            };
            const pmsListData = yield call(projServices.projApproveFullcostPmsListQuery, pmsListPostData);
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
                    type:'searchProjFullcost'
                });
            } else if (pmsListData.RetCode === '-1') {
                message.error(pmsListData.RetVal);
            }
        },

        /**
         * 作者：邓广晖
         * 创建日期：2017-11-24
         * 功能：已立项项目的全成本
         */
        *searchProjFullcost({}, {call, put, select}) {
            const { queryData, fullCostPmsTab } = yield select(state => state.projStartMainPage);
            //在查询之前判断全成本页面是否能编辑,走可编辑时的所有部门的查询
            let allDeptPostData = {
                arg_proj_id: queryData.proj_id,         //项目id，必传
                arg_tenantid: Cookie.get("tenantid"),     //部门归属标志10010
                //arg_userid: Cookie.get('userid'),       //登录用id，必传
                arg_tab_flag: fullCostPmsTab.tab_flag,
                arg_pms_code: fullCostPmsTab.pms_code,
            };
            //if (fullCostPmsTab.tab_flag === '1') {}
            const allDeptData = yield call(projServices.projApproveEditFullCostAllDeptQuery, allDeptPostData);
            /*if (allDeptData.RetCode === '1') {
                yield put({
                    type: 'save',
                    payload: {
                        fullCostEditFlag: allDeptData.isEditFlag,
                        fullCostEditVal: allDeptData.isEditVal,
                        fullCostChgModal: false
                    }
                });
            } else if (allDeptData.RetCode === '-1') {
                message.error(allDeptData.RetVal);
            }*/

            //查询配合部门列表
            let coorpDeptPostData = {
                arg_proj_id: queryData.proj_id,
                //arg_tag: '2', /*2代表已立项项目*/
                arg_tenantid: Cookie.get("tenantid"),     //部门归属标志10010
                arg_tab_flag: fullCostPmsTab.tab_flag,
                arg_pms_code: fullCostPmsTab.pms_code,
            };
            const coorpDeptData = yield call(projServices.projApproveCoorDeptQueryNew, coorpDeptPostData);
            if (coorpDeptData.RetCode === '1') {
                coorpDeptData.DataRows.map((i, index) => {
                    if ('mgr_name' in i) {
                        i.key = index;           //为没一条记录添加一个 key
                    } else {
                        i.key = index;
                        i.mgr_name = '';       //配合部门没有字段时，设置为空
                    }
                    return i;
                });
            }
            //查询每个部门的预算
            let budgetPostData = {
                arg_proj_id: queryData.proj_id,
                arg_tab_flag: fullCostPmsTab.tab_flag,
                arg_pms_code: fullCostPmsTab.pms_code,
            };
            const deptBudgetData = yield call(projServices.projApproveBudgetQuery, budgetPostData);
            yield put({
                type: 'save',
                payload: {
                    coorpDeptList: coorpDeptData.DataRows,
                    allDeptList: allDeptData.DataRows
                }
            });
            let allDeptList = allDeptData.DataRows;
            let deptBudgetList = deptBudgetData.DataRows;


            //确定返回的预算中的年份
            let bugetYearList = [];
            for (let i = 0; i < deptBudgetData.DataRows.length; i++) {
                if (!isInArray(bugetYearList, deptBudgetData.DataRows[i].year)) {
                    bugetYearList.push(deptBudgetData.DataRows[i].year);
                }
            }

            /*计算项目本身的年份*/
            let fullCostYearList = [];
            //年的索引，先从开始时间的年份开始算起
            let yearIndex = parseInt(queryData.begin_time.split('-')[0]);
            //将结束时间作为结束标志
            let yearEndTagIndex = parseInt(queryData.end_time.split('-')[0]);
            //如果年份索引不超过开始年份，进行添加
            while (yearIndex <= yearEndTagIndex) {
                fullCostYearList.push(yearIndex.toString());
                yearIndex++;
            }

            //显示的年份，取预算和所有年份的并集
            let yearList = [];
            for (let bi = 0; bi < bugetYearList.length; bi++) {
                if (!isInArray(yearList, bugetYearList[bi])) {
                    yearList.push(bugetYearList[bi]);
                }
            }
            for (let fi = 0; fi < fullCostYearList.length; fi++) {
                if (!isInArray(yearList, fullCostYearList[fi])) {
                    yearList.push(fullCostYearList[fi]);
                }
            }
            yearList = yearList.sort();   //年份需要排序


            //计算所有工时之和
            let predictTimeTotal = 0;
            for (let indexp = 0; indexp < deptBudgetList.length; indexp++) {
                if (deptBudgetList[indexp].fee_type === '0' && deptBudgetList[indexp].fee_subtype === '-1') {
                    predictTimeTotal += Number(deptBudgetList[indexp].fee);
                }
            }
            yield put({
                type: 'save',
                payload: {predictTimeTotal: predictTimeTotal.toFixed(1)}
            });
            //查询每一个年份下的费用类型个数，首先要确定三级目录的个数
            let yearListRowSpan = {};
            //yearListRowSpan = {2016:{yearRowSpan:x,
            //                         purchaseCostList:['xxxx费用1'，‘xxxx费用2’],
            //                         purchaseDeptTotal:[12,35]  //每个部门的所有xxxx(采购)费用之和
            //                         operateCostList:['zzz费用1'，‘zzzz费用2’]，
            //                         operateDeptTotal:[78,10]   //每个部门的所有zzzz（运行）费用之和
            //                         carryOutCostList:['yyyy费用1'，‘yyyy费用2’]},
            //                         carryOutDeptTotal:[38,68]  //每个部门的所有yyyy（实施）费用之和
            //                         humanCostTotal:[12,67]         // 每个部门的人工成本
            //                   2017:{yearRowSpan:x,
            //                         purchaseCostList:['xxxx费用1'，‘xxxx费用2’],
            //                         purchaseDeptTotal:[12,35]  //每个部门的所有xxxx费用之和
            //                         operateCostList:['zzz费用1'，‘zzzz费用2’]，
            //                         operateDeptTotal:[78,10]   //每个部门的所有zzzz（运行）费用之和
            //                         carryOutCostList:['yyyy费用1'，‘yyyy费用2’]},
            //                         carryOutDeptTotal:[38,68]  //每个部门的所有yyyy费用之和
            //                         humanCostTotal:[12,67]         // 每个部门的人工成本
            //                  }
            if (yearList.length) {
                //计算年份的rowspan
                for (let yearIndex = 0; yearIndex < yearList.length; yearIndex++) {
                    //预计工时，直接成本，项目采购成本，项目运行成本，项目实施成本，项目人工成本默认存在，yearRowSpan 默认加 6
                    let yearRowSpan = 0;
                    let purchaseCostList = [];   //项目采购成本列表
                    let operateCostList = [];    //项目运行成本列表
                    let carryOutCostList = [];   //项目实施成本列表
                    for (let cellDataIndex1 = 0; cellDataIndex1 < deptBudgetList.length; cellDataIndex1++) {
                        //先判断年
                        if (yearList[yearIndex] === deptBudgetList[cellDataIndex1].year) {
                            //判断是否为直接成本，即fee_type = 1
                            if (deptBudgetList[cellDataIndex1].fee_type === '1') {
                                //判断是不是属于直接成本中的采购成本、运行成本或者实施成本，即fee_subtype = 0 ，3 或者 1
                                if (deptBudgetList[cellDataIndex1].fee_subtype === '0') {
                                    //如果不在列表里面才添加
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
                    let purchaseDeptTotal = [];  //每个部门的所有xxxx费用之和的列表
                    let operateDeptTotal = [];   //每个部门的所有zzzz费用之和的列表
                    let carryOutDeptTotal = [];  //每个部门的所有yyyy费用之和的列表
                    let humanCostTotal = [];          //项目人工成本列表（每个部门）
                    for (let deptIndexx = 0; deptIndexx < allDeptList.length; deptIndexx++) {
                        let purchaseDeptValue = 0;
                        let operateDeptValue = 0;
                        let carryOutDeptValue = 0;
                        let humanCostValue = 0;
                        for (let cellDataIndexx = 0; cellDataIndexx < deptBudgetList.length; cellDataIndexx++) {
                            //首先判断单元格中的年份
                            if (yearList[yearIndex] === deptBudgetList[cellDataIndexx].year &&
                                allDeptList[deptIndexx].dept_name === deptBudgetList[cellDataIndexx].dept_name) {
                                //判断是否为直接成本，即fee_type = 1
                                if (deptBudgetList[cellDataIndexx].fee_type === '1') {
                                    if (deptBudgetList[cellDataIndexx].fee_subtype === '0') {
                                        //判断是不是属于直接成本中的采购成本，即fee_subtype = 0
                                        purchaseDeptValue += Number(deptBudgetList[cellDataIndexx].fee);
                                    } else if (deptBudgetList[cellDataIndexx].fee_subtype === '3') {
                                        //判断是不是属于直接成本中的运行成本，即fee_subtype = 3
                                        operateDeptValue += Number(deptBudgetList[cellDataIndexx].fee);
                                    } else if (deptBudgetList[cellDataIndexx].fee_subtype === '1') {
                                        //判断是不是属于直接成本中的实施成本，即fee_subtype = 1
                                        carryOutDeptValue += Number(deptBudgetList[cellDataIndexx].fee);
                                    } else if (deptBudgetList[cellDataIndexx].fee_subtype === '2') {
                                        //判断是不是属于直接成本中的人工成本，即fee_subtype =2
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
                        humanCostTotal: humanCostTotal
                    };
                }//end for year
            }

            /*将返回的预算数据转变成表格数据
      * */
            let deptBudgetTableData = [];
            let obj = {};
            let allTableTotal = 0;
            if (yearList.length) {
                for (let yearIndex2 = 0; yearIndex2 < yearList.length; yearIndex2++) {
                    obj = {};
                    //每一年的每一个费用项，要添加所有部门的数据
                    //1.添加预计工时 fee_type =0 , fee_subtype = -1
                    obj.year = yearList[yearIndex2];
                    obj.yearRowSpan = yearListRowSpan[yearList[yearIndex2]].yearRowSpan;
                    obj.fee_name = config.PREDICT_TIME;
                    obj.padLeft = '0px';
                    obj.feeType = '0';         //  0 代表预计工时，1 代表 预算
                    let predictTime = 0;
                    for (let i = 0; i < allDeptList.length; i++) {
                        let findPredictTime = false;
                        for (let cellDataIndex2 = 0; cellDataIndex2 < deptBudgetList.length; cellDataIndex2++) {
                            //年相同就添加一条数据
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
                        }//end for
                        //如果没有这种类型的数据，数据源加一条
                        if (findPredictTime === false) {
                            //如果查询出来的没有预计工时，则新增0
                            obj['dept' + i.toString()] = '0.0';
                        }
                    }//end for
                    obj.total = predictTime.toFixed(1);
                    deptBudgetTableData.push(obj);
                    //添加预计工时end

                    //2.添加直接成本
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
                    }//end for
                    obj.total = directCostTotal.toFixed(2);
                    deptBudgetTableData.push(obj);

                    //2.1添加项目采购成本
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
                    }//end for
                    obj.total = purchaseAllTotal.toFixed(2);
                    deptBudgetTableData.push(obj);

                    //2.1. 添加项目采购成本-子费用
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
                            }//end for
                            if (findPurchase === false) {
                                obj['dept' + p.toString()] = '0.00';
                            }
                        }//end for
                        obj.total = purchaseTotal.toFixed(2);
                        deptBudgetTableData.push(obj);
                    }

                    //2.2添加项目运行成本
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
                    }//end for
                    obj.total = operateAllTotal.toFixed(2);
                    deptBudgetTableData.push(obj);

                    //2.2. 添加项目运行成本-子费用
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
                            }//end for
                            if (findOperate === false) {
                                obj['dept' + jj.toString()] = '0.00';
                            }
                        }//end for
                        obj.total = operateTotal.toFixed(2);
                        deptBudgetTableData.push(obj);
                    }

                    //2.3添加项目实施成本
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
                    }//end for
                    obj.total = carryOutAllTotal.toFixed(2);
                    deptBudgetTableData.push(obj);

                    //2.3. 添加项目采购成本-子费用
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
                            }//end for
                            if (findCarryOut === false) {
                                obj['dept' + jj.toString()] = '0.00';
                            }
                        }//end for
                        obj.total = carryOutTotal.toFixed(2);
                        deptBudgetTableData.push(obj);
                    }

                    //2.4添加项目人工成本
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
                        }//end for
                        if (findHumanCost === false) {
                            obj['dept' + b.toString()] = '0.00';
                        }
                    }//end for
                    obj.total = humanCostTotal.toFixed(2);
                    deptBudgetTableData.push(obj);
                }//end for year

                //添加最后一行总计
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
                }//end for
                obj.total = allTableTotal.toFixed(2);
                deptBudgetTableData.push(obj);
            }
            //deptBudgetTableData.map((i,index)=>{ i.key=index;return i});
            for (let indexd = 0; indexd < deptBudgetTableData.length; indexd++) {
                deptBudgetTableData[indexd].key = indexd;
            }
            yield put({
                type: 'save',
                payload: {
                    deptBudgetTableData: deptBudgetTableData
                }
            });
        },

        /**
         * 作者：邓广晖
         * 创建日期：2018-12-04
         * 功能：全成本tab中点击PMS
         * @param value 点中的tab的value
         */
        *fullCostPmsTabClick({value},{put,select}) {
            const { fullCostPmsListData } = yield select(state => state.projStartMainPage);
            let clickFullcostPmsTab = fullCostPmsListData.filter(item => item.tabConvertName === value);
            yield put({
                type: 'save',
                payload: {
                    fullCostPmsTab: clickFullcostPmsTab[0],
                }
            });
            yield put({
                type:'searchProjFullcost'
            });
        },

        //========================================================有关已立项的全成本页面修改   start

        /**
         * 作者：邓广晖
         * 创建日期：2018-01-24
         * 功能：全成本页面点击编辑图标时，判断是否有权限修改
         */
        *clickFullCostEditIcon({}, {call, put, select}) {
            //切换到 编辑 页面时，先走权限的服务（查询所有部门的服务）判断
            const {queryData} = yield select(state => state.projStartMainPage);
            let allDeptPostData = {
                arg_proj_id: queryData.proj_id,         //项目id，必传
                arg_tenantid: Cookie.get("tenantid"),   //部门归属标志10010
                arg_userid: Cookie.get('userid'),       //登录用id，必传
            };
            const authorityData = yield call(projServices.projApproveEditFullCostAllDeptQuery, allDeptPostData);
            if (authorityData.RetCode === '1') {
                //状态为 2 和 3 的，显示模态框
                if (authorityData.isEditFlag === '2' || authorityData.isEditFlag === '3') {
                    yield put({
                        type: 'save',
                        payload: {
                            fullCostChgModal: true
                        }
                    });
                } else if (authorityData.isEditFlag === '1') {
                    //状态为1 时 ，可直接跳转到编辑页面
                    yield put({
                        type: 'changeFullCostShow',
                        pageToType: 'edit'
                    });
                }
                yield put({
                    type: 'save',
                    payload: {
                        fullCostEditFlag: authorityData.isEditFlag,
                        fullCostEditVal: authorityData.isEditVal,
                    }
                });
            } else if (authorityData.RetCode === '-1') {
                message.error(authorityData.RetVal);
            }
        },

        /**
         * 作者：邓广晖
         * 创建日期：2018-01-24
         * 功能：关闭全成本页面点击编辑图标时弹出的对话框
         * @param put 返回reducer
         */
        *closeFullCostModal({}, {put}) {
            yield put({
                type: 'save',
                payload: {
                    fullCostChgModal: false
                }
            });
        },

        /**
         * 作者：邓广晖
         * 创建日期：2018-01-21
         * 功能：改变全成本页面的显示，查看页面（view）和编辑页面（edit）
         * @param pageToType 想要切换成的页面
         */
        *changeFullCostShow({pageToType}, {call, put, select}) {
            //切换为编辑状态后，查询对应的的全成本需要的数据
            if (pageToType === 'edit') {
                yield put({
                    type: 'editFullCostQuery'
                });
                yield put({
                    type: 'save',
                    payload: {
                        tab1IsDisabled: true,
                        tab2IsDisabled: true,
                        tab3IsDisabled: false,     //只有全成本页面可点击
                        tab4IsDisabled: true,
                        tab5IsDisabled: true,
                        tab6IsDisabled: true,
                        fullCostShow: pageToType,
                    }
                });
            } else if (pageToType === 'view') {
                yield put({
                    type: 'searchProjFullcost'
                });
                //所有tab页面可点击
                yield put({
                    type: 'save',
                    payload: {
                        tab1IsDisabled: false,
                        tab2IsDisabled: false,
                        tab3IsDisabled: false,
                        tab4IsDisabled: false,
                        tab5IsDisabled: false,
                        tab6IsDisabled: false,
                        fullCostShow: pageToType,
                    }
                });
            }

        },

        /**
         * 作者：邓广晖
         * 创建日期：2018-01-03
         * 功能：编辑全成本时初始化查询
         */
        *editFullCostQuery({}, {call, put, select}) {
            //对已立项的编辑时的全成本查询主要分为三个，配合部门，所有部门和预算，这里
            //只有所有部门的服务不一样，其他的和查询已立项的服务一样
            const {queryData, projectInfo} = yield select(state => state.projStartMainPage);
            //查询配合部门列表
            let coorpDeptPostData = {
                arg_proj_id: queryData.proj_id,
                arg_tag: '2', /*2代表已立项项目*/
            };
            const coorpDeptData = yield call(projServices.projApproveCoorDeptQuery, coorpDeptPostData);
            if (coorpDeptData.RetCode === '1') {
                coorpDeptData.DataRows.map((i, index) => {
                    if ('mgr_name' in i) {
                        i.opt_type = 'search';   //查询出来的配合部门标记为 search
                        i.key = index;           //为没一条记录添加一个 key
                    } else {
                        i.opt_type = 'search';
                        i.key = index;
                        i.mgr_name = '';       //配合部门没有字段时，设置为空
                    }
                    return i;
                });
                yield put({
                    type: 'save',
                    payload: {
                        coorpDeptList: coorpDeptData.DataRows,
                        coorpDeptListOriginal: JSON.parse(JSON.stringify(coorpDeptData.DataRows))
                    }
                });
            }

            //查询所有部门列表,第一个为主责部门,同时，这个服务里面包含项目的开始年份和结束年份，以及是否可以修改全成本的标志
            let allDeptPostData = {
                arg_proj_id: queryData.proj_id,           //项目id，必传
                arg_tenantid: Cookie.get("tenantid"),     //部门归属标志10010
                arg_userid: Cookie.get('userid'),         //登录用id，必传
            };
            const allDeptData = yield call(projServices.projApproveEditFullCostAllDeptQuery, allDeptPostData);

            //查询每个部门的预算
            let budgetPostData = {
                arg_proj_id: queryData.proj_id
            };
            /*let budgetPostData = {
        transjsonarray:JSON.stringify({
          condition:{
            proj_id:queryData.proj_id
          }
        })
      };*/
            const deptBudgetData = yield call(projServices.projApproveBudgetQuery, budgetPostData);

            //确定返回的预算中的年份
            let bugetYearList = [];
            for (let i = 0; i < deptBudgetData.DataRows.length; i++) {
                if (!isInArray(bugetYearList, deptBudgetData.DataRows[i].year)) {
                    bugetYearList.push(deptBudgetData.DataRows[i].year);
                }
            }

            //数据存储的项目采购成本总列表
            let purchasePostData = {
                transjsonarray: JSON.stringify({
                    "condition": {"fee_subtype": "0"},
                    "sequence": [{"index_num": "0"}]
                })
            };
            let purchaseAllCostData = yield call(projServices.queryCostList, purchasePostData);
            //数据存储的项目实施成本总列表
            let carryOutPostData = {
                transjsonarray: JSON.stringify({
                    "condition": {"fee_subtype": "1"},
                    "sequence": [{"index_num": "0"}]
                })
            };
            let carryOutAllCostData = yield call(projServices.queryCostList, carryOutPostData);
            //数据存储的项目运行成本总列表
            let operatePostData = {
                transjsonarray: JSON.stringify({
                    "condition": {"fee_subtype": "3"},
                    "sequence": [{"index_num": "0"}]
                })
            };
            let operateAllCostData = yield call(projServices.queryCostList, operatePostData);

            allDeptData.DataRows.map((i) => {
                i.opt_type = 'search';
                return i
            });
            for (let budgeIndex = 0; budgeIndex < deptBudgetData.DataRows.length; budgeIndex++) {
                deptBudgetData.DataRows[budgeIndex].opt_type = 'search';
                deptBudgetData.DataRows[budgeIndex].proj_uid = projectInfo.proj_uid;
            }
            //deptBudgetData.DataRows.map((i)=>{i.opt_type='search';i.proj_uid=uuid;return i});
            //purchaseAllCostData.DataRows.map((i)=>{i.opt_type='search';return i});
            //carryOutAllCostData.DataRows.map((i)=>{i.opt_type='search';return i});

            /*计算可添加的年份*/
            let fullCostYearList = [];
            //年的索引，先从开始时间的年份开始算起
            let yearIndex = parseInt(allDeptData.projBeginYear);
            //将结束时间作为结束标志
            let yearEndTagIndex = parseInt(allDeptData.projEndYear);
            //如果年份索引不超过开始年份，进行添加
            while (yearIndex <= yearEndTagIndex) {
                fullCostYearList.push(yearIndex.toString());
                yearIndex++;
            }
            //console.log('====================allDeptData.DataRows');
            //console.log(allDeptData.DataRows);  //.primary_proj_id

            //显示的年份，取预算和所有年份的并集
            let yearList = [];
            for (let bi = 0; bi < bugetYearList.length; bi++) {
                if (!isInArray(yearList, bugetYearList[bi])) {
                    yearList.push(bugetYearList[bi]);
                }
            }
            for (let fi = 0; fi < fullCostYearList.length; fi++) {
                if (!isInArray(yearList, fullCostYearList[fi])) {
                    yearList.push(fullCostYearList[fi]);
                }
            }

            yield put({
                type: 'save',
                payload: {
                    allDeptList: allDeptData.DataRows,
                    deptBudgetList: deptBudgetData.DataRows,
                    deptBudgetListOriginal: JSON.parse(JSON.stringify(deptBudgetData.DataRows)),
                    yearList: yearList,
                    yearListOriginal: JSON.parse(JSON.stringify(yearList)),
                    purchaseAllCostList: purchaseAllCostData.DataRows,
                    carryOutAllCostList: carryOutAllCostData.DataRows,
                    operateAllCostList: operateAllCostData.DataRows,
                    fullCostYearList: fullCostYearList
                }
            });
            //转变数据
            yield put({
                type: 'convertFullCostData',
                isFirstTime: true
            });
        },

        /**
         * 作者：邓广晖
         * 创建日期：2017-11-21
         * 功能：转变数据
         * @param put 返回reducer
         * @param select 获取model的state
         * @param isFirstTime 是否是第一次转换
         */* convertFullCostData({isFirstTime}, {put, select}) {
            let {yearList, allDeptList, deptBudgetList, projectInfo} = yield select(state => state.projStartMainPage);
            yearList = yearList.sort();   //年份需要排序
            allDeptList = allDeptList.filter(item => item.opt_type !== 'delete');
            deptBudgetList = deptBudgetList.filter(item => item.opt_type !== 'delete');
            //计算所有工时之和
            let predictTimeTotal = 0;
            for (let indexp = 0; indexp < deptBudgetList.length; indexp++) {
                if (deptBudgetList[indexp].fee_type === '0' && deptBudgetList[indexp].fee_subtype === '-1') {
                    predictTimeTotal += Number(deptBudgetList[indexp].fee);
                }
            }
            //查询每一个年份下的费用类型个数，首先要确定三级目录的个数
            let yearListRowSpan = {};
            //yearListRowSpan = {2016:{yearRowSpan:x,
            //                         purchaseCostList:['xxxx费用1'，‘xxxx费用2’],
            //                         purchaseDeptTotal:[12,35]  //每个部门的所有xxxx(采购)费用之和
            //                         operateCostList:['zzz费用1'，‘zzzz费用2’]，
            //                         operateDeptTotal:[78,10]   //每个部门的所有zzzz（运行）费用之和
            //                         carryOutCostList:['yyyy费用1'，‘yyyy费用2’]},
            //                         carryOutDeptTotal:[38,68]  //每个部门的所有yyyy（实施）费用之和
            //                         humanCostTotal:[12,67]         // 每个部门的人工成本
            //                         predictTimeTotal:[3,7]         //每个部门的预计工时
            //                   2017:{yearRowSpan:x,
            //                         purchaseCostList:['xxxx费用1'，‘xxxx费用2’],
            //                         purchaseDeptTotal:[12,35]  //每个部门的所有xxxx费用之和
            //                         operateCostList:['zzz费用1'，‘zzzz费用2’]，
            //                         operateDeptTotal:[78,10]   //每个部门的所有zzzz（运行）费用之和
            //                         carryOutCostList:['yyyy费用1'，‘yyyy费用2’]},
            //                         carryOutDeptTotal:[38,68]  //每个部门的所有yyyy费用之和
            //                         humanCostTotal:[12,67]         // 每个部门的人工成本
            //                         predictTimeTotal:[3,7]         //每个部门的预计工时
            //                  }
            if (yearList.length) {
                //计算年份的rowspan
                for (let yearIndex = 0; yearIndex < yearList.length; yearIndex++) {
                    //预计工时，直接成本，项目采购成本，项目运行成本，项目实施成本，项目人工成本默认存在，yearRowSpan 默认加 6
                    let yearRowSpan = 0;
                    let purchaseCostList = [];   //项目采购成本列表
                    let operateCostList = [];    //项目运行成本列表
                    let carryOutCostList = [];   //项目实施成本列表
                    for (let cellDataIndex1 = 0; cellDataIndex1 < deptBudgetList.length; cellDataIndex1++) {
                        //先判断年
                        if (yearList[yearIndex] === deptBudgetList[cellDataIndex1].year) {
                            //判断是否为直接成本，即fee_type = 1
                            if (deptBudgetList[cellDataIndex1].fee_type === '1') {
                                //判断是不是属于直接成本中的采购成本、运行成本或者实施成本，即fee_subtype = 0 ，3 或者 1
                                if (deptBudgetList[cellDataIndex1].fee_subtype === '0') {
                                    //如果不在列表里面才添加
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
                    let purchaseDeptTotal = [];  //每个部门的所有xxxx费用之和的列表
                    let operateDeptTotal = [];   //每个部门的所有zzzz费用之和的列表
                    let carryOutDeptTotal = [];  //每个部门的所有yyyy费用之和的列表
                    let humanCostTotal = [];          //项目人工成本列表（每个部门）
                    let predictTimeTotal = [];         //每个部门的预计工时
                    for (let deptIndexx = 0; deptIndexx < allDeptList.length; deptIndexx++) {
                        let purchaseDeptValue = 0;
                        let operateDeptValue = 0;
                        let carryOutDeptValue = 0;
                        let humanCostValue = 0;
                        let predictTimeValue = 0;
                        for (let cellDataIndexx = 0; cellDataIndexx < deptBudgetList.length; cellDataIndexx++) {
                            //首先判断单元格中的年份
                            if (yearList[yearIndex] === deptBudgetList[cellDataIndexx].year &&
                                allDeptList[deptIndexx].dept_name === deptBudgetList[cellDataIndexx].dept_name) {
                                //判断是否为直接成本，即fee_type = 1
                                if (deptBudgetList[cellDataIndexx].fee_type === '1') {
                                    if (deptBudgetList[cellDataIndexx].fee_subtype === '0') {
                                        //判断是不是属于直接成本中的采购成本，即fee_subtype = 0
                                        purchaseDeptValue += Number(deptBudgetList[cellDataIndexx].fee);
                                    } else if (deptBudgetList[cellDataIndexx].fee_subtype === '3') {
                                        //判断是不是属于直接成本中的运行成本，即fee_subtype = 3
                                        operateDeptValue += Number(deptBudgetList[cellDataIndexx].fee);
                                    } else if (deptBudgetList[cellDataIndexx].fee_subtype === '1') {
                                        //判断是不是属于直接成本中的实施成本，即fee_subtype = 1
                                        carryOutDeptValue += Number(deptBudgetList[cellDataIndexx].fee);
                                    } else if (deptBudgetList[cellDataIndexx].fee_subtype === '2') {
                                        //判断是不是属于直接成本中的人工成本，即fee_subtype =2
                                        humanCostValue += Number(deptBudgetList[cellDataIndexx].fee);
                                    }
                                } else if (deptBudgetList[cellDataIndexx].fee_type === '0') {
                                    if (deptBudgetList[cellDataIndexx].fee_subtype === '-1') {
                                        predictTimeValue += Number(deptBudgetList[cellDataIndexx].fee);
                                    }
                                }
                            }
                        }
                        purchaseDeptTotal.push(purchaseDeptValue.toFixed(2));
                        operateDeptTotal.push(operateDeptValue.toFixed(2));
                        carryOutDeptTotal.push(carryOutDeptValue.toFixed(2));
                        humanCostTotal.push(humanCostValue.toFixed(2));
                        predictTimeTotal.push(predictTimeValue.toFixed(1));
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
                        predictTimeTotal: predictTimeTotal
                    };
                }//end for year
            }

            /*将返回的预算数据转变成表格数据
      * */
            let deptBudgetTableData = [];
            let obj = {};
            let allTableTotal = 0;
            if (yearList.length) {
                for (let yearIndex2 = 0; yearIndex2 < yearList.length; yearIndex2++) {
                    obj = {};
                    //每一年的每一个费用项，要添加所有部门的数据
                    //1.添加预计工时 fee_type =0 , fee_subtype = -1
                    obj.year = yearList[yearIndex2];
                    obj.yearRowSpan = yearListRowSpan[yearList[yearIndex2]].yearRowSpan;
                    obj.fee_name = config.PREDICT_TIME;
                    obj.no_pre_fee_name = config.NO_PREFIX_PREDICT;
                    obj.padLeft = '0px';
                    obj.feeType = '0';         //  0 代表预计工时，1 代表 预算
                    obj.feeNameLevel = '1';    //  费用项的目录级别  1 2 3
                    let predictTime = 0;
                    for (let i = 0; i < allDeptList.length; i++) {
                        let findPredictTime = false;
                        for (let cellDataIndex2 = 0; cellDataIndex2 < deptBudgetList.length; cellDataIndex2++) {
                            //年相同就添加一条数据
                            if (yearList[yearIndex2] === deptBudgetList[cellDataIndex2].year) {
                                if (deptBudgetList[cellDataIndex2].fee_type === '0' &&
                                    deptBudgetList[cellDataIndex2].fee_subtype === '-1') {
                                    if (allDeptList[i].dept_name === deptBudgetList[cellDataIndex2].dept_name) {
                                        if (isFirstTime === true) {
                                            obj['dept' + i.toString()] = Number(deptBudgetList[cellDataIndex2].fee).toFixed(1);
                                        } else {
                                            obj['dept' + i.toString()] = deptBudgetList[cellDataIndex2].fee;
                                        }
                                        predictTime += Number(deptBudgetList[cellDataIndex2].fee);
                                        findPredictTime = true;
                                        break;
                                    }
                                }
                            }
                        }//end for
                        //如果没有这种类型的数据，数据源加一条
                        if (findPredictTime === false) {
                            deptBudgetList.push({
                                year: yearList[yearIndex2],
                                fee_type: '0',
                                fee_subtype: '-1',
                                fee: '0.0',
                                fee_name: config.NO_PREFIX_PREDICT,
                                ou: changeOuName(allDeptList[i].dept_name.split('-')[0]),
                                dept_name: allDeptList[i].dept_name,
                                budget_uid: getUuid(32, 62),
                                opt_type: 'insert',
                                proj_uid: projectInfo.proj_uid,
                                dept_uid: allDeptList[i].dept_id,
                            });
                            //如果查询出来的没有预计工时，则新增0
                            obj['dept' + i.toString()] = '0.0';
                        }
                    }//end for
                    obj.total = predictTime.toFixed(1);
                    deptBudgetTableData.push(obj);
                    //添加预计工时end

                    //2.添加直接成本
                    obj = {};
                    obj.year = yearList[yearIndex2];
                    obj.yearRowSpan = 0;
                    obj.fee_name = config.DIRECT_COST;
                    obj.no_pre_fee_name = config.NO_PREFIX_DIRECT_COST;
                    obj.not_edit = 'not_edit';
                    obj.padLeft = '0px';
                    obj.feeType = '1';         //  0 代表预计工时，1 代表 预算
                    obj.feeNameLevel = '1';    //  费用项的目录级别  1 2 3
                    let directCostTotal = 0;
                    for (let j = 0; j < allDeptList.length; j++) {
                        let directCost = Number(yearListRowSpan[yearList[yearIndex2]].purchaseDeptTotal[j]) +
                            Number(yearListRowSpan[yearList[yearIndex2]].operateDeptTotal[j]) +
                            Number(yearListRowSpan[yearList[yearIndex2]].carryOutDeptTotal[j]) +
                            Number(yearListRowSpan[yearList[yearIndex2]].humanCostTotal[j]);
                        obj['dept' + j.toString()] = directCost.toFixed(2);
                        directCostTotal += directCost;
                    }//end for
                    obj.total = directCostTotal.toFixed(2);
                    deptBudgetTableData.push(obj);

                    //2.1添加项目采购成本
                    obj = {};
                    obj.year = yearList[yearIndex2];
                    obj.yearRowSpan = 0;
                    obj.fee_name = config.PURCHASE_COST;
                    obj.no_pre_fee_name = config.NO_PREFIX_PURCHASE_COST;
                    obj.not_edit = 'not_edit';
                    obj.can_add = 'can_add';
                    obj.add_type = 'purchase';
                    obj.padLeft = '10px';
                    obj.feeType = '1';         //  0 代表预计工时，1 代表 预算
                    obj.feeNameLevel = '1';    //  费用项的目录级别  1 2 3
                    let purchaseAllTotal = 0;
                    for (let k = 0; k < allDeptList.length; k++) {
                        obj['dept' + k.toString()] = yearListRowSpan[yearList[yearIndex2]].purchaseDeptTotal[k];
                        purchaseAllTotal += Number(yearListRowSpan[yearList[yearIndex2]].purchaseDeptTotal[k]);
                    }//end for
                    obj.total = purchaseAllTotal.toFixed(2);
                    deptBudgetTableData.push(obj);

                    //2.1. 添加项目采购成本-子费用
                    let purchaseCostTypeList = yearListRowSpan[yearList[yearIndex2]].purchaseCostList;
                    for (let purchaseIndex = 0; purchaseIndex < purchaseCostTypeList.length; purchaseIndex++) {
                        obj = {};
                        obj.year = yearList[yearIndex2];
                        obj.yearRowSpan = 0;
                        obj.fee_name = '2.1.' + (purchaseIndex + 1).toString() + purchaseCostTypeList[purchaseIndex];
                        obj.no_pre_fee_name = purchaseCostTypeList[purchaseIndex];
                        obj.padLeft = '30px';
                        obj.feeType = '1';         //  0 代表预计工时，1 代表 预算
                        obj.feeNameLevel = '3';    //  费用项的目录级别  1 2 3
                        let purchaseTotal = 0;
                        for (let p = 0; p < allDeptList.length; p++) {
                            let findPurchase = false;
                            for (let cellDataIndex3 = 0; cellDataIndex3 < deptBudgetList.length; cellDataIndex3++) {
                                if (yearList[yearIndex2] === deptBudgetList[cellDataIndex3].year &&
                                    purchaseCostTypeList[purchaseIndex].trim() === deptBudgetList[cellDataIndex3].fee_name.trim()) {
                                    if (deptBudgetList[cellDataIndex3].fee_type === '1' &&
                                        deptBudgetList[cellDataIndex3].fee_subtype === '0') {
                                        if (allDeptList[p].dept_name === deptBudgetList[cellDataIndex3].dept_name) {
                                            if (isFirstTime === true) {
                                                obj['dept' + p.toString()] = Number(deptBudgetList[cellDataIndex3].fee).toFixed(2);
                                            } else {
                                                obj['dept' + p.toString()] = deptBudgetList[cellDataIndex3].fee;
                                            }
                                            purchaseTotal += Number(deptBudgetList[cellDataIndex3].fee);
                                            findPurchase = true;
                                            break;
                                        }
                                    }
                                }
                            }//end for
                            if (findPurchase === false) {
                                deptBudgetList.push({
                                    year: yearList[yearIndex2],
                                    fee_type: '1',
                                    fee_subtype: '0',
                                    fee: '0.00',
                                    fee_name: purchaseCostTypeList[purchaseIndex],
                                    ou: changeOuName(allDeptList[p].dept_name.split('-')[0]),
                                    dept_name: allDeptList[p].dept_name,
                                    budget_uid: getUuid(32, 62),
                                    opt_type: 'insert',
                                    proj_uid: projectInfo.proj_uid,
                                    dept_uid: allDeptList[p].dept_id,
                                });
                                obj['dept' + p.toString()] = '0.00';
                            }
                        }//end for
                        obj.total = purchaseTotal.toFixed(2);
                        deptBudgetTableData.push(obj);
                    }

                    //2.2添加项目运行成本
                    obj = {};
                    obj.year = yearList[yearIndex2];
                    obj.yearRowSpan = 0;
                    obj.fee_name = config.OPERATE_COST;
                    obj.no_pre_fee_name = config.NO_PREFIX_OPERATE_COST;
                    obj.not_edit = 'not_edit';
                    obj.can_add = 'can_add';
                    obj.add_type = 'operate';
                    obj.padLeft = '10px';
                    obj.feeType = '1';         //  0 代表预计工时，1 代表 预算
                    obj.feeNameLevel = '1';    //  费用项的目录级别  1 2 3
                    let operateAllTotal = 0;
                    for (let m = 0; m < allDeptList.length; m++) {
                        obj['dept' + m.toString()] = yearListRowSpan[yearList[yearIndex2]].operateDeptTotal[m];
                        operateAllTotal += Number(yearListRowSpan[yearList[yearIndex2]].operateDeptTotal[m]);
                    }//end for
                    obj.total = operateAllTotal.toFixed(2);
                    deptBudgetTableData.push(obj);

                    //2.2. 添加项目运行成本-子费用
                    let operateCostTypeList = yearListRowSpan[yearList[yearIndex2]].operateCostList;
                    for (let operateIndex = 0; operateIndex < operateCostTypeList.length; operateIndex++) {
                        obj = {};
                        obj.year = yearList[yearIndex2];
                        obj.yearRowSpan = 0;
                        obj.fee_name = '2.2.' + (operateIndex + 1).toString() + operateCostTypeList[operateIndex];
                        obj.no_pre_fee_name = operateCostTypeList[operateIndex];
                        obj.padLeft = '30px';
                        obj.feeType = '1';         //  0 代表预计工时，1 代表 预算
                        obj.feeNameLevel = '3';    //  费用项的目录级别  1 2 3
                        let operateTotal = 0;
                        for (let p = 0; p < allDeptList.length; p++) {
                            let findOperate = false;
                            for (let cellDataIndex33 = 0; cellDataIndex33 < deptBudgetList.length; cellDataIndex33++) {
                                if (yearList[yearIndex2] === deptBudgetList[cellDataIndex33].year &&
                                    operateCostTypeList[operateIndex].trim() === deptBudgetList[cellDataIndex33].fee_name.trim()) {
                                    if (deptBudgetList[cellDataIndex33].fee_type === '1' &&
                                        deptBudgetList[cellDataIndex33].fee_subtype === '3') {
                                        if (allDeptList[p].dept_name === deptBudgetList[cellDataIndex33].dept_name) {
                                            if (isFirstTime === true) {
                                                obj['dept' + p.toString()] = Number(deptBudgetList[cellDataIndex33].fee).toFixed(2);
                                            } else {
                                                obj['dept' + p.toString()] = deptBudgetList[cellDataIndex33].fee;
                                            }
                                            operateTotal += Number(deptBudgetList[cellDataIndex33].fee);
                                            findOperate = true;
                                            break;
                                        }
                                    }
                                }
                            }//end for
                            if (findOperate === false) {
                                deptBudgetList.push({
                                    year: yearList[yearIndex2],
                                    fee_type: '1',
                                    fee_subtype: '3',
                                    fee: '0.00',
                                    fee_name: operateCostTypeList[operateIndex],
                                    ou: changeOuName(allDeptList[p].dept_name.split('-')[0]),
                                    dept_name: allDeptList[p].dept_name,
                                    budget_uid: getUuid(32, 62),
                                    opt_type: 'insert',
                                    proj_uid: projectInfo.proj_uid,
                                    dept_uid: allDeptList[p].dept_id,
                                });
                                obj['dept' + p.toString()] = '0.00';
                            }
                        }//end for
                        obj.total = operateTotal.toFixed(2);
                        deptBudgetTableData.push(obj);
                    }

                    //2.3添加项目实施成本
                    obj = {};
                    obj.year = yearList[yearIndex2];
                    obj.yearRowSpan = 0;
                    obj.fee_name = config.CARRYOUT_COST;
                    obj.no_pre_fee_name = config.NO_PREFIX_CARRYOUT_COST;
                    obj.not_edit = 'not_edit';
                    obj.can_add = 'can_add';
                    obj.add_type = 'carryOut';
                    obj.padLeft = '10px';
                    obj.feeType = '1';         //  0 代表预计工时，1 代表 预算
                    obj.feeNameLevel = '2';    //  费用项的目录级别  1 2 3
                    let carryOutAllTotal = 0;
                    for (let ii = 0; ii < allDeptList.length; ii++) {
                        obj['dept' + ii.toString()] = yearListRowSpan[yearList[yearIndex2]].carryOutDeptTotal[ii];
                        carryOutAllTotal += Number(yearListRowSpan[yearList[yearIndex2]].carryOutDeptTotal[ii]);
                    }//end for
                    obj.total = carryOutAllTotal.toFixed(2);
                    deptBudgetTableData.push(obj);

                    //2.2. 添加项目采购成本-子费用
                    let carryOutCostTypeList = yearListRowSpan[yearList[yearIndex2]].carryOutCostList;
                    for (let carryOutIndex = 0; carryOutIndex < carryOutCostTypeList.length; carryOutIndex++) {
                        obj = {};
                        obj.year = yearList[yearIndex2];
                        obj.yearRowSpan = 0;
                        obj.fee_name = '2.3.' + (carryOutIndex + 1).toString() + carryOutCostTypeList[carryOutIndex];
                        obj.no_pre_fee_name = carryOutCostTypeList[carryOutIndex];
                        obj.padLeft = '30px';
                        obj.feeType = '1';         //  0 代表预计工时，1 代表 预算
                        obj.feeNameLevel = '3';    //  费用项的目录级别  1 2 3
                        let carryOutTotal = 0;
                        for (let jj = 0; jj < allDeptList.length; jj++) {
                            let findCarryOut = false;
                            for (let cellDataIndex4 = 0; cellDataIndex4 < deptBudgetList.length; cellDataIndex4++) {
                                if (yearList[yearIndex2] === deptBudgetList[cellDataIndex4].year &&
                                    carryOutCostTypeList[carryOutIndex] === deptBudgetList[cellDataIndex4].fee_name.trim()) {
                                    if (deptBudgetList[cellDataIndex4].fee_type === '1' &&
                                        deptBudgetList[cellDataIndex4].fee_subtype === '1') {
                                        if (allDeptList[jj].dept_name === deptBudgetList[cellDataIndex4].dept_name) {
                                            if (isFirstTime === true) {
                                                obj['dept' + jj.toString()] = Number(deptBudgetList[cellDataIndex4].fee).toFixed(2);
                                            } else {
                                                obj['dept' + jj.toString()] = deptBudgetList[cellDataIndex4].fee;
                                            }
                                            carryOutTotal += Number(deptBudgetList[cellDataIndex4].fee);
                                            findCarryOut = true;
                                            break;
                                        }
                                    }
                                }
                            }//end for
                            if (findCarryOut === false) {
                                deptBudgetList.push({
                                    year: yearList[yearIndex2],
                                    fee_type: '1',
                                    fee_subtype: '1',
                                    fee: '0.00',
                                    fee_name: carryOutCostTypeList[carryOutIndex],
                                    ou: changeOuName(allDeptList[jj].dept_name.split('-')[0]),
                                    dept_name: allDeptList[jj].dept_name,
                                    budget_uid: getUuid(32, 62),
                                    opt_type: 'insert',
                                    proj_uid: projectInfo.proj_uid,
                                    dept_uid: allDeptList[jj].dept_id,
                                });
                                obj['dept' + jj.toString()] = '0.00';
                            }
                        }//end for
                        obj.total = carryOutTotal.toFixed(2);
                        deptBudgetTableData.push(obj);
                    }

                    //2.4添加项目人工成本
                    obj = {};
                    obj.year = yearList[yearIndex2];
                    obj.yearRowSpan = 0;
                    obj.fee_name = config.HUMAN_COST;
                    obj.no_pre_fee_name = config.NO_PREFIX_HUMAN_COST;
                    obj.padLeft = '10px';
                    obj.feeType = '1';         //  0 代表预计工时，1 代表 预算
                    obj.feeNameLevel = '2';    //  费用项的目录级别  1 2 3
                    let humanCostTotal = 0;
                    for (let b = 0; b < allDeptList.length; b++) {
                        let findHumanCost = false;
                        for (let cellDataIndex5 = 0; cellDataIndex5 < deptBudgetList.length; cellDataIndex5++) {
                            if (yearList[yearIndex2] === deptBudgetList[cellDataIndex5].year) {
                                if (deptBudgetList[cellDataIndex5].fee_type === '1' &&
                                    deptBudgetList[cellDataIndex5].fee_subtype === '2') {
                                    if (allDeptList[b].dept_name === deptBudgetList[cellDataIndex5].dept_name) {
                                        if (isFirstTime === true) {
                                            obj['dept' + b.toString()] = Number(deptBudgetList[cellDataIndex5].fee).toFixed(2);
                                        } else {
                                            obj['dept' + b.toString()] = deptBudgetList[cellDataIndex5].fee;
                                        }
                                        humanCostTotal += Number(deptBudgetList[cellDataIndex5].fee);
                                        findHumanCost = true;
                                        break;
                                    }
                                }
                            }
                        }//end for
                        if (findHumanCost === false) {
                            deptBudgetList.push({
                                year: yearList[yearIndex2],
                                fee_type: '1',
                                fee_subtype: '2',
                                fee: '0.00',
                                fee_name: config.NO_PREFIX_HUMAN_COST,
                                ou: changeOuName(allDeptList[b].dept_name.split('-')[0]),
                                dept_name: allDeptList[b].dept_name,
                                budget_uid: getUuid(32, 62),
                                opt_type: 'insert',
                                proj_uid: projectInfo.proj_uid,
                                dept_uid: allDeptList[b].dept_id,
                            });
                            obj['dept' + b.toString()] = '0.00';
                        }
                    }//end for
                    obj.total = humanCostTotal.toFixed(2);
                    deptBudgetTableData.push(obj);
                }//end for year

                //添加最后一行总计
                obj = {};
                obj.year = config.COST_ALL_TOTAL;
                obj.yearRowSpan = 1;
                obj.fee_name = '';
                obj.yearOptType = 'total';
                obj.not_input = 'not_input';
                obj.padLeft = '0px';
                obj.feeType = '1';         //  0 代表预计工时，1 代表 预算
                obj.feeNameLevel = '1';    //  费用项的目录级别  1 2 3
                for (let de = 0; de < allDeptList.length; de++) {
                    let allYearTotal = 0;
                    for (let yi = 0; yi < yearList.length; yi++) {
                        allYearTotal += Number(yearListRowSpan[yearList[yi]].purchaseDeptTotal[de]) +
                            Number(yearListRowSpan[yearList[yi]].operateDeptTotal[de]) +
                            Number(yearListRowSpan[yearList[yi]].carryOutDeptTotal[de]) +
                            Number(yearListRowSpan[yearList[yi]].humanCostTotal[de]);
                    }
                    allTableTotal += allYearTotal;
                    obj['dept' + de.toString()] = allYearTotal.toFixed(2);
                }//end for
                obj.total = allTableTotal.toFixed(2);
                deptBudgetTableData.push(obj);
            }
            //deptBudgetTableData.map((i,index)=>{ i.key=index;return i});
            for (let indexd = 0; indexd < deptBudgetTableData.length; indexd++) {
                deptBudgetTableData[indexd].key = indexd;
            }
            //如果是第一次查询，保存
            if (isFirstTime === true) {
                yield put({
                    type: 'save',
                    payload: {deptBudgetList: JSON.parse(JSON.stringify(deptBudgetList))}
                });
            }

            yield put({
                type: 'save',
                payload: {
                    deptBudgetTableData: JSON.parse(JSON.stringify(deptBudgetTableData)),
                    yearList: JSON.parse(JSON.stringify(yearList)),
                    //allDeptList:JSON.parse(JSON.stringify(allDeptList)),
                    predictTimeTotal: predictTimeTotal.toFixed(1),
                    yearListRowSpan: JSON.parse(JSON.stringify(yearListRowSpan)),
                    allTableTotal: allTableTotal
                }
            });
        },

        /**
         * 作者：邓广晖
         * 创建日期：2018-01-03
         * 功能：添加配合部门
         * @param deptSelectData 已选中的部门
         * @param put 返回reducer
         * @param select 获取model的state
         */
        *addCoorpDept({deptSelectData}, {put, select}) {
            let coorpDeptListTemp = [];
            let {projectInfo, coorpDeptList, allDeptList, deptBudgetList, yearList, yearListRowSpan} = yield select(state => state.projStartMainPage);
            //如果选了更多的配合部门，将新添加的配合部门添加到列表
            if (deptSelectData.length) {
                let deptIsRepeated = false;
                //首先判断是否有与存在的部门重复，包括主责部门和配合部门
                for (let i = 0; i < deptSelectData.length; i++) {
                    if (deptSelectData[i].dept_name === allDeptList[0].dept_name) {
                        deptIsRepeated = true;
                        message.error(deptSelectData[i].dept_name + '为主责部门，请重新添加');  //添加的配合部门不能为主责部门
                        break;
                    }
                    //如果有配合部门，还需要和已经添加的配合进行对比，不能重复,同时需要去除类型为delete的
                    if (coorpDeptList.length) {
                        for (let j = 0; j < coorpDeptList.length; j++) {
                            if (deptSelectData[i].dept_name === coorpDeptList[j].dept_name && coorpDeptList[j].opt_type !== 'delete') {
                                deptIsRepeated = true;
                                message.error(deptSelectData[i].dept_name + '已经存在，请重新添加');
                                break;
                            }
                        }
                        if (deptIsRepeated === true) {
                            break;
                        }
                    }
                }
                //如果没有重复的再进行添加
                if (deptIsRepeated === false) {
                    for (let i = 0; i < deptSelectData.length; i++) {
                        coorpDeptListTemp.push({
                                dept_name: deptSelectData[i].dept_name,
                                dept_uid: getUuid(32, 62),
                                key: coorpDeptList.length + i,
                                proj_uid: projectInfo.proj_uid,
                                opt_type: 'insert',
                                mgr_name: '',
                                ou: changeOuName(deptSelectData[i].dept_name.split('-')[0])
                            }
                        );
                        //对于选中的每一个部门，将其添加到deptBudgetList
                        for (let yi = 0; yi < yearList.length; yi++) {
                            //对于每一年，需要添加预计工时和各项直接成本，默认值都为0
                            //1.添加预计工时
                            deptBudgetList.push({
                                year: yearList[yi],
                                fee_type: '0',
                                fee_subtype: '-1',
                                fee: '0',
                                fee_name: config.NO_PREFIX_PREDICT,
                                dept_name: deptSelectData[i].dept_name,
                                ou: changeOuName(deptSelectData[i].dept_name.split('-')[0]),
                                budget_uid: getUuid(32, 62),
                                opt_type: 'insert',
                                proj_uid: projectInfo.proj_uid,
                                dept_uid: deptSelectData[i].dept_id,
                            });

                            //2.添加直接成本中的采购成本
                            let purchaseCostList = yearListRowSpan[yearList[yi]].purchaseCostList;
                            for (let pi = 0; pi < purchaseCostList.length; pi++) {
                                deptBudgetList.push({
                                    year: yearList[yi],
                                    fee_type: '1',
                                    fee_subtype: '0',
                                    fee: '0',
                                    fee_name: purchaseCostList[pi],
                                    dept_name: deptSelectData[i].dept_name,
                                    ou: changeOuName(deptSelectData[i].dept_name.split('-')[0]),
                                    budget_uid: getUuid(32, 62),
                                    opt_type: 'insert',
                                    proj_uid: projectInfo.proj_uid,
                                    dept_uid: deptSelectData[i].dept_id,
                                });
                            }

                            //3.添加直接成本中的运行成本
                            let operateCostList = yearListRowSpan[yearList[yi]].operateCostList;
                            for (let oi = 0; oi < operateCostList.length; oi++) {
                                deptBudgetList.push({
                                    year: yearList[yi],
                                    fee_type: '1',
                                    fee_subtype: '3',
                                    fee: '0',
                                    fee_name: operateCostList[oi],
                                    dept_name: deptSelectData[i].dept_name,
                                    ou: changeOuName(deptSelectData[i].dept_name.split('-')[0]),
                                    budget_uid: getUuid(32, 62),
                                    opt_type: 'insert',
                                    proj_uid: projectInfo.proj_uid,
                                    dept_uid: deptSelectData[i].dept_id,
                                });
                            }
                            //4.添加直接成本中的实施成本
                            let carryOutCostList = yearListRowSpan[yearList[yi]].carryOutCostList;
                            for (let ci = 0; ci < carryOutCostList.length; ci++) {
                                deptBudgetList.push({
                                    year: yearList[yi],
                                    fee_type: '1',
                                    fee_subtype: '1',
                                    fee: '0',
                                    fee_name: carryOutCostList[ci],
                                    dept_name: deptSelectData[i].dept_name,
                                    ou: changeOuName(deptSelectData[i].dept_name.split('-')[0]),
                                    budget_uid: getUuid(32, 62),
                                    opt_type: 'insert',
                                    proj_uid: projectInfo.proj_uid,
                                    dept_uid: deptSelectData[i].dept_id,
                                });
                            }
                            //5.添加人工成本
                            deptBudgetList.push({
                                year: yearList[yi],
                                fee_type: '1',
                                fee_subtype: '2',
                                fee: '0',
                                fee_name: config.NO_PREFIX_HUMAN_COST,
                                dept_name: deptSelectData[i].dept_name,
                                ou: changeOuName(deptSelectData[i].dept_name.split('-')[0]),
                                budget_uid: getUuid(32, 62),
                                opt_type: 'insert',
                                proj_uid: projectInfo.proj_uid,
                                dept_uid: deptSelectData[i].dept_id,
                            });
                        }//end for year
                    }
                    coorpDeptList = coorpDeptList.concat(coorpDeptListTemp);
                    allDeptList = allDeptList.concat(coorpDeptListTemp);
                    yield put({
                        type: 'save',
                        payload: {
                            coorpDeptList: coorpDeptList,
                            allDeptList: allDeptList,
                            deptBudgetList: deptBudgetList
                        }
                    });
                    //转变数据
                    yield put({
                        type: 'convertFullCostData',
                        isFirstTime: false
                    });
                }
            }
        },

        /**
         * 作者：邓广晖
         * 创建日期：2018-01-05
         * 功能：删除配合部门
         * @param deptSelectData 已选中的部门
         */
        *deleteCoorpDept({index}, {call, put, select}) {
            let {coorpDeptList, allDeptList, deptBudgetList, projectInfo} = yield select(state => state.projStartMainPage);
            //先判断是否可以删除(1,该项目中已产生成本,2,该项目中尚有启用成员)
            if (coorpDeptList[index].opt_type !== 'insert') {
                let costPostData = {
                    arg_proj_id: projectInfo.proj_id,
                    arg_ou: coorpDeptList[index].ou,
                    arg_proj_code: projectInfo.proj_code,
                    arg_dept_name: coorpDeptList[index].dept_name,
                };
                const costData = yield call(projServices.queryCostData, costPostData);
                if (costData.cos_delete_flag !== 'true') {
                    message.error(coorpDeptList[index].dept_name + '在该项目中已产生成本，不能删除该部门！');
                    return;
                } else {
                    let memberPostData = {
                        arg_proj_id: projectInfo.proj_id,
                        arg_dept_name: coorpDeptList[index].dept_name,
                        arg_tenantid: Cookie.get('tenantid')
                    };
                    const memberData = yield call(projServices.queryMemberData, memberPostData);
                    if (memberData.RowCount !== '0') {
                        message.error(coorpDeptList[index].dept_name + '在该项目中尚有启用成员，不能删除该部门！');
                        return;
                    }
                }
            }
            /*都没有问题，处理部门预算列表*/
            let deptBudgetListNew = [];
            for (let di = 0; di < deptBudgetList.length; di++) {
                if (deptBudgetList[di].dept_name !== coorpDeptList[index].dept_name) {
                    //如果部门不相等，将其加入新列表
                    deptBudgetListNew.push(deptBudgetList[di]);
                } else {
                    //如果部门相等，查询出来的部门数据(search,delete,update)，将其加入New,将标志改为delete，如果是新加入的(insert)，不加入
                    if (deptBudgetList[di].opt_type !== 'insert') {
                        deptBudgetList[di].opt_type = 'delete';
                        deptBudgetListNew.push(deptBudgetList[di]);
                    }
                }
            }
            //处理配合部门
            if (coorpDeptList[index].opt_type !== 'insert') {
                coorpDeptList[index].opt_type = 'delete';
            } else {
                coorpDeptList.splice(index, 1);
            }
            //处理所有部门
            if (allDeptList[index + 1].opt_type !== 'insert') {
                allDeptList[index + 1].opt_type = 'delete';
            } else {
                allDeptList.splice(index + 1, 1);
            }
            //处理之后将key值重排
            //coorpDeptList.map((item,indexc) => {item.key = indexc;return item});
            for (let i = 0; i < coorpDeptList.length; i++) {
                coorpDeptList[i].key = i;
            }
            yield put({
                type: 'save',
                payload: {
                    deptBudgetList: JSON.parse(JSON.stringify(deptBudgetListNew)),
                    coorpDeptList: JSON.parse(JSON.stringify(coorpDeptList)),
                    allDeptList: JSON.parse(JSON.stringify(allDeptList))
                }
            });

            //转变数据
            yield put({
                type: 'convertFullCostData',
                isFirstTime: false
            });
        },

        /**
         * 作者：邓广晖
         * 创建日期：2018-01-05
         * 功能：删除配合部门
         * @param index 配合部门索引值
         * @param text 配合部门联系人文本
         * @param put 返回reducer
         * @param select 获取model的state
         */* editCoorpMgrName({index, text}, {put, select}) {
            let {coorpDeptList, coorpDeptListOriginal} = yield select(state => state.projStartMainPage);
            //如果编辑的是查询出来的配合部门
            if (coorpDeptList[index].opt_type !== 'insert') {
                //如果配合部门联系人于最原始查出来的联系人不一样，将标志设置为 update
                if (text !== coorpDeptListOriginal[index].mgr_name) {
                    coorpDeptList[index].opt_type = 'update';
                } else {
                    //如果改过后，又改回原来的值
                    coorpDeptList[index].opt_type = 'search';
                }
            }
            //不管是查询的配合部门还是新增的配合部门，修改了，就修改内容
            if (coorpDeptList[index].mgr_name !== text) {
                coorpDeptList[index].mgr_name = text;
            }
            yield put({
                type: 'save',
                payload: {coorpDeptList: JSON.parse(JSON.stringify(coorpDeptList))}
            });
        },

        /**
         * 作者：邓广晖
         * 创建日期：2018-01-05
         * 功能：编辑表格单元格数据
         * @param value 单元格数据
         * @param year 年份
         * @param deptName 部门
         * @param noPreFeeName 没有前缀的费用名
         * @param put 返回reducer
         * @param select 获取model的state
         */* editCellData({value, year, deptName, noPreFeeName}, {put, select}) {
            let {deptBudgetList, deptBudgetListOriginal} = yield select(state => state.projStartMainPage);
            for (let i = 0; i < deptBudgetList.length; i++) {
                if (deptBudgetList[i].year === year &&
                    deptBudgetList[i].dept_name === deptName &&
                    deptBudgetList[i].fee_name.trim() === noPreFeeName.trim()) {
                    //如果编辑的是查询出来的单元格
                    if (deptBudgetList[i].opt_type !== 'insert') {
                        if (Number(deptBudgetListOriginal[i].fee) !== Number(value)) {
                            deptBudgetList[i].opt_type = 'update';
                        } else {
                            deptBudgetList[i].opt_type = 'search';
                        }
                    }
                    //不管是查询的单元格还是新增的单元格，内容修改了，就修改内容(包括 5.  5.0  5)
                    if (deptBudgetList[i].fee !== value) {
                        deptBudgetList[i].fee = value;
                    }
                    break;
                }
            }
            yield put({
                type: 'save',
                payload: {
                    deptBudgetList: JSON.parse(JSON.stringify(deptBudgetList))
                }
            });
            //转变数据
            yield put({
                type: 'convertFullCostData',
                isFirstTime: false
            });
        },

        /**
         * 作者：邓广晖
         * 创建日期：2018-01-05
         * 功能：增加费用项
         * @param value 费用项的值
         * @param fee_type 费用主类型
         * @param fee_subtype 费用子类型
         * @param year 年份
         * @param put 返回reducer
         * @param select 获取model的state
         */* addCostType({value, fee_type, fee_subtype, year}, {put, select}) {
            let {projectInfo, deptBudgetList, allDeptList} = yield select(state => state.projStartMainPage);
            allDeptList = allDeptList.filter(item => item.opt_type !== 'delete');
            for (let i = 0; i < allDeptList.length; i++) {
                deptBudgetList.push({
                    year: year,
                    fee_type: fee_type,
                    fee_subtype: fee_subtype,
                    fee: '0',
                    fee_name: value,
                    dept_name: allDeptList[i].dept_name,
                    ou: changeOuName(allDeptList[i].dept_name.split('-')[0]),
                    budget_uid: getUuid(32, 62),
                    opt_type: 'insert',
                    proj_uid: projectInfo.proj_uid,
                    dept_uid: allDeptList[i].deptid,
                });
            }

            yield put({
                type: 'save',
                payload: {
                    deptBudgetList: JSON.parse(JSON.stringify(deptBudgetList)),
                }
            });
            //转变数据
            yield put({
                type: 'convertFullCostData',
                isFirstTime: false
            });
        },

        /**
         * 作者：邓广晖
         * 创建日期：2018-01-05
         * 功能：删除费用项
         * @param value 费用项
         * @param year 年份
         * @param put 返回reducer
         * @param select 获取model的state
         */* deleteCostType({value, year}, {put, select}) {
            let {deptBudgetList} = yield select(state => state.projStartMainPage);
            let deptBudgetListNew = [];
            //如果删除的是新增的费用项，直接删除,即不添加到新的里面
            for (let i = 0; i < deptBudgetList.length; i++) {
                if (deptBudgetList[i].year === year && deptBudgetList[i].fee_name.trim() === value) {
                    if (deptBudgetList[i].opt_type !== 'insert') {
                        //如果删除的是查询出来的，opt_type 设为 delete
                        deptBudgetList[i].opt_type = 'delete';
                        deptBudgetListNew.push(deptBudgetList[i]);
                    }
                } else {
                    deptBudgetListNew.push(deptBudgetList[i]);
                }
            }
            yield put({
                type: 'save',
                payload: {
                    deptBudgetList: JSON.parse(JSON.stringify(deptBudgetListNew)),
                }
            });
            //转变数据
            yield put({
                type: 'convertFullCostData',
                isFirstTime: false
            });
        },

        /**
         * 作者：邓广晖
         * 创建日期：2018-01-05
         * 功能：添加年份费用项
         * @param value 费用项
         * @param year 年份
         * @param put 返回reducer
         * @param select 获取model的state
         */* addYear({year}, {put, select}) {
            let {projectInfo, deptBudgetList, allDeptList, yearList} = yield select(state => state.projStartMainPage);
            yearList.push(year);
            allDeptList = allDeptList.filter(item => item.opt_type !== 'delete');
            //添加年份时，只添加1.预计工时  和  2.3项目人工成本
            for (let i = 0; i < allDeptList.length; i++) {
                //添加预计工时
                deptBudgetList.push({
                    year: year,
                    fee_type: '0',
                    fee_subtype: '-1',
                    fee: '0',
                    fee_name: config.NO_PREFIX_PREDICT,
                    dept_name: allDeptList[i].dept_name,
                    ou: changeOuName(allDeptList[i].dept_name.split('-')[0]),
                    budget_uid: getUuid(32, 62),
                    opt_type: 'insert',
                    proj_uid: projectInfo.proj_uid,
                    dept_uid: allDeptList[i].deptid,
                });
                //添加项目人工成本
                deptBudgetList.push({
                    year: year,
                    fee_type: '1',
                    fee_subtype: '2',
                    fee: '0',
                    fee_name: config.NO_PREFIX_HUMAN_COST,
                    dept_name: allDeptList[i].dept_name,
                    ou: changeOuName(allDeptList[i].dept_name.split('-')[0]),
                    budget_uid: getUuid(32, 62),
                    opt_type: 'insert',
                    proj_uid: projectInfo.proj_uid,
                    dept_uid: allDeptList[i].deptid,
                });
            }//end for
            yield put({
                type: 'save',
                payload: {
                    yearList: yearList,
                    deptBudgetList: JSON.parse(JSON.stringify(deptBudgetList))
                }
            });
            //转变数据
            yield put({
                type: 'convertFullCostData',
                isFirstTime: false
            });
        },

        /**
         * 作者：邓广晖
         * 创建日期：2018-01-05
         * 功能：删除年份费用项
         * @param value 费用项
         * @param year 年份
         * @param put 返回reducer
         * @param select 获取model的state
         */* deleteYear({year}, {put, select}) {
            let {deptBudgetList, yearList} = yield select(state => state.projStartMainPage);
            yearList = yearList.filter(item => item !== year);
            let deptBudgetListNew = [];
            //如果删除的是新增的年份，直接删除,即不添加到新的里面
            for (let i = 0; i < deptBudgetList.length; i++) {
                if (deptBudgetList[i].year === year) {
                    if (deptBudgetList[i].opt_type !== 'insert') {
                        //如果删除的是查询出来的，opt_type 设为 delete
                        deptBudgetList[i].opt_type = 'delete';
                        deptBudgetListNew.push(deptBudgetList[i]);
                    }
                } else {
                    deptBudgetListNew.push(deptBudgetList[i]);
                }
            }
            yield put({
                type: 'save',
                payload: {
                    yearList: yearList,
                    deptBudgetList: JSON.parse(JSON.stringify(deptBudgetListNew))
                }
            });
            //转变数据
            yield put({
                type: 'convertFullCostData',
                isFirstTime: false
            });
        },

        /**
         * 作者：邓广晖
         * 创建日期：2018-01-05
         * 功能：修改配合部门联系人名字时的提交全成本
         * @param object_cos 配合部门和预算变化的数据
         * @param reasonValue 修改原因
         * @param put 返回reducer
         * @param call 请求服务
         * @param select 获取model的state
         */* submitFullCostDept({object_cos, reasonValue}, {call, put, select}) {
            let {projectInfo} = yield select(state => state.projStartMainPage);
            let fullCostSubmitPostData = {
                arg_proj_id: projectInfo.proj_id,        //项目id,必传
                arg_proj_uid: projectInfo.proj_uid,      //uuid,必传
                arg_opt_byid: Cookie.get('userid'),      //登陆人id，必传
                arg_opt_byname: Cookie.get('username'),  //登陆人姓名，必传
                arg_change_reason: reasonValue,          //修改原因，必传
                object_cos: JSON.stringify(object_cos)                  //修改项
            };
            //console.log('===================fullCostSubmitPostData');
            //console.log(fullCostSubmitPostData);
            const fullCostSubmitData = yield call(projServices.projApproveEditFullCostAllSubmitDept, fullCostSubmitPostData);
            if (fullCostSubmitData.RetCode === '1') {
                message.success('修改成功');
                yield put({
                    type: 'changeFullCostShow',
                    pageToType: 'view'
                });
            } else if (fullCostSubmitData.RetCode === '-1') {
                message.error(fullCostSubmitData.RetVal);
            } else if (fullCostSubmitData.RetCode === '2') {
                message.info(fullCostSubmitData.RetVal);
                yield put({
                    type: 'changeFullCostShow',
                    pageToType: 'view'
                });
            }
        },

        /**
         * 作者：邓广晖
         * 创建日期：2018-04-08
         * 功能：提交时，预算数据发生变化后，选择审核人
         * @param put 返回reducer
         * @param call 请求服务
         * @param select 获取model的state
         */* submitGetVerifierData({}, {call, put, select}) {
            let {projectInfo} = yield select(state => state.projStartMainPage);
            yield put({
                type: 'save',
                payload: {
                    verifierDataRel: false
                }
            });
            //选择审核人列表
            let verifierPostData = {
                arg_proj_id: projectInfo.proj_id,        //项目id,必传
                arg_proj_uid: projectInfo.proj_uid,      // uuid,必传
                arg_opt_byid: Cookie.get('userid'),      //登陆人id，必传
                arg_opt_byname: Cookie.get('username'),  //登陆人姓名，必传
                arg_business_id: getOuBussinessId(projectInfo.ou), //必传，00001总院，00002哈院，00003济院,00004西安，00005广州
                arg_page_type: '0', //必传，此页面必传0（0是项目启动-项目基本信息-全成本，1是待办中全成本修改）
            };

            const verifierData = yield call(projServices.getVerifierData, verifierPostData);
            if (verifierData.RetCode === '1') {
                yield put({
                    type: 'save',
                    payload: {
                        verifierData: verifierData,
                        verifierDataRel: true
                    }
                });
            }
        },

        /**
         * 作者：邓广晖
         * 创建日期：2018-01-05
         * 功能：修改预算数据的提交全成本
         * @param object_cos 配合部门和预算变化的数据
         * @param reasonValue 修改原因
         * @param verifierValue 审核人id
         * @param emaileValue 是否发送邮件
         */
        *submitFullCostBudget({object_cos, reasonValue, verifierValue, emailValue}, {call, put, select}) {
            let {projectInfo, verifierData} = yield select(state => state.projStartMainPage);
            let fullCostSubmitPostData = {
                arg_proj_id: projectInfo.proj_id,        //项目id,必传
                arg_proj_uid: projectInfo.proj_uid,      //uuid,必传
                arg_proj_name: projectInfo.proj_name,    //必传，项目名称
                arg_opt_byid: Cookie.get('userid'),      //登陆人id，必传
                arg_opt_byname: Cookie.get('username'),  //登陆人姓名，必传
                arg_change_reason: reasonValue,          //修改原因，必传
                object_cos: JSON.stringify(object_cos),  //修改项
                arg_business_id: getOuBussinessId(projectInfo.ou),
            };
            let verifierInfo = {};
            for (let i = 0; i < verifierData.DataRows.length; i++) {
                if (verifierValue === verifierData.DataRows[i].userid) {
                    verifierInfo = verifierData.DataRows[i];
                    break;
                }
            }
            fullCostSubmitPostData.arg_is_email = emailValue;               //是否发送邮件给审核人
            fullCostSubmitPostData.arg_checker_id = verifierInfo.userid;    //用户选择的审核人id，必传
            fullCostSubmitPostData.arg_checker_name = verifierInfo.username;//用户选择的审核人名称，必传
            fullCostSubmitPostData.arg_checker_email = verifierInfo.email;  //用户选择的审核人email

            fullCostSubmitPostData.arg_exe_id = verifierData.current_exe_id;
            fullCostSubmitPostData.arg_wf_task_id = verifierData.current_wf_task_id;
            fullCostSubmitPostData.arg_link_name = verifierData.current_link_name;   //当前环节名称
            fullCostSubmitPostData.arg_link_id = verifierData.current_link_id;       //当前环节id
            fullCostSubmitPostData.arg_role_id = verifierData.current_role_id;       //当前角色id


            //console.log('===================fullCostSubmitPostData');
            //console.log(fullCostSubmitPostData);
            const fullCostSubmitData = yield call(projServices.projApproveFullCostSubmitBudget, fullCostSubmitPostData);
            if (fullCostSubmitData.RetCode === '1') {
                message.success('修改成功');
                yield put({
                    type: 'changeFullCostShow',
                    pageToType: 'view'
                });
            } else if (fullCostSubmitData.RetCode === '-1') {
                message.error(fullCostSubmitData.RetVal);
            } else if (fullCostSubmitData.RetCode === '2') {
                message.info(fullCostSubmitData.RetVal);
                yield put({
                    type: 'changeFullCostShow',
                    pageToType: 'view'
                });
            }
        },

        //========================================================有关已立项的全成本页面修改   end

        /**
         * 作者：邓广晖
         * 创建日期：2017-10-11
         * 功能：项目启动时项目信息页面的查询已上传附件列表
         * @param query url的请求参数
         */
        *searchNewAddAttachment({}, {call, put, select}) {
            const {queryData} = yield select(state => state.projStartMainPage);
            let postData = {};
            postData['arg_flag'] = 1;//arg_flag：固定传0（0，项目启动-项目新增立项；1，项目启动-项目基本信息查询）
            postData['arg_proj_id'] = queryData.proj_id;
            postData['arg_userid'] = Cookie.get('userid');

            const data = yield call(projServices.searchNewAddAttachment, postData);
            if (data.RetCode === '1') {
                if (data.DataRows[0].file_list) {
                    yield put({
                        type: 'save',
                        payload: {
                            attachmentList: JSON.parse(data.DataRows[0].file_list),
                            attachEditFlag: data.isEditFlag,
                            attachEditVal: data.isEditVal
                        }
                    });
                } else {
                    yield put({
                        type: 'save',
                        payload: {
                            attachmentList: [],
                            attachEditFlag: data.isEditFlag,
                            attachEditVal: data.isEditVal
                        }
                    });
                }
            }
        },

        //========================================================有关已立项的附件页面的修改  start

        /**
         * 作者：胡月
         * 创建日期：2018-01-23
         * 功能：改变附件页面的显示，查看页面（view）和编辑页面（edit）
         * @param pageToType 想要切换成的页面
         */
        *changeAttachShow({pageToType}, {put}) {
            yield put({
                type: 'save',
                payload: {
                    attachShow: pageToType
                }
            });
            //切换为编辑状态后，先查询对应的的附件需要的数据
            if (pageToType === 'edit') {
                yield put({
                    type: 'editAttachmentQuery'
                });
                yield put({
                    type: 'save',
                    payload: {
                        tab1IsDisabled: true,
                        tab2IsDisabled: true,
                        tab3IsDisabled: true,
                        tab4IsDisabled: false, /*只有附件可点击*/
                        tab5IsDisabled: true,
                        tab6IsDisabled: true,
                    }
                });
            } else if (pageToType === 'view') {
                yield put({
                    type: 'searchNewAddAttachment'
                });
                //所有tab页面可点击
                yield put({
                    type: 'save',
                    payload: {
                        tab1IsDisabled: false,
                        tab2IsDisabled: false,
                        tab3IsDisabled: false,
                        tab4IsDisabled: false,
                        tab5IsDisabled: false,
                        tab6IsDisabled: false,
                    }
                });
            }
        },

        /**
         * 作者：胡月
         * 创建日期：2018-1-24
         * 功能：项目启动，TMO修改附件，点击修改按钮之后的查询
         */
        *editAttachmentQuery({}, {call, put, select}) {
            const {queryData} = yield select(state => state.projStartMainPage);
            let postData = {};
            postData['arg_flag'] = 1;//arg_flag：固定传0（0，项目启动-项目新增立项；1，项目启动-项目基本信息查询）
            postData['arg_proj_id'] = queryData.proj_id;
            postData['arg_userid'] = Cookie.get('userid');

            const data = yield call(projServices.searchNewAddAttachment, postData);
            if (data.RetCode === '1') {
                if (data.DataRows.length && data.DataRows[0].file_list) {
                    //将字符串转为json对象
                    let attachmentListTemp = JSON.parse(data.DataRows[0].file_list);
                    attachmentListTemp.map((i, index) => {
                        i.opt_type = 'search';   //查询出来的附件标记为 search
                        i.key = index;           //为没一条记录添加一个 key
                    });
                    //此处重写一遍的原因是因为使用同一个时修改attachmentList时也修改了attachmentListOriginal
                    let attachmentListOriginal = JSON.parse(data.DataRows[0].file_list);
                    attachmentListOriginal.map((i, index) => {
                        i.opt_type = 'search';   //查询出来的附件标记为 search
                        i.key = index;           //为没一条记录添加一个 key
                    });
                    yield put({
                        type: 'save',
                        payload: {
                            attachmentList: attachmentListTemp,
                            attachmentListOriginal: attachmentListOriginal
                        }
                    });
                } else {
                    yield put({
                        type: 'save',
                        payload: {
                            attachmentList: [],
                            attachmentListOriginal: []
                        }
                    });
                }
            }
        },

        /**
         * 作者：胡月
         * 创建日期：2018-1-23
         * 功能：项目启动，TMO修改附件，删除附件列表
         * @param key 附件的key
         * @param attachmentList 附件列表
         */
        *deleteAttachment({key, attachmentList}, {put}) {
            //如果删除的附件不是新增的，将状态改为delete
            if (attachmentList[key].opt_type !== 'insert') {
                attachmentList[key].opt_type = 'delete';
            } else {
                //如果删除的附件是新增的，直接删除这条记录
                attachmentList.splice(key, 1);
            }
            //处理之后将key值重排
            for (let i = 0; i < attachmentList.length; i++) {
                attachmentList[i].key = i;
            }
            yield put({
                type: 'save',
                payload: {attachmentList: attachmentList}
            });
        },

        /**
         * 作者：胡月
         * 创建日期：2018-1-23
         * 功能：项目启动，TMO修改附件，编辑附件列表
         * @param key 附件的key
         * @param attachmentList 附件列表
         * @param text 编辑时的文本值
         */
        *editAttachment({key, attachmentList, text}, {put, select}) {
            let oldAttach = yield select(state => state.projStartMainPage.attachmentListOriginal);
            //如果编辑的是查询出来的文件
            if (attachmentList[key].opt_type !== 'insert') {
                //如果文件别名于最原始查出来的文件别名不一样，将标志设置为 update
                if (text !== oldAttach[key].file_byname) {
                    attachmentList[key].opt_type = 'update';
                } else {
                    attachmentList[key].opt_type = 'search';
                }
            }
            //不管是查询的文件还是新增的文件，文件别名修改了，就修改内容
            if (attachmentList[key].file_byname !== text) {
                attachmentList[key].file_byname = text;
            }
            yield put({
                type: 'save',
                payload: {attachmentList: attachmentList}
            });
        },

        /**
         * 作者：胡月
         * 创建日期：2018-1-23
         * 功能：项目启动，TMO修改附件，新增附件列表
         * @param attachmentList 附件列表
         * @param objFile 添加的文件
         * @param text 编辑时的文本值
         */
        *addAttachment({attachmentList, objFile}, {put}) {
            attachmentList.push(objFile);
            yield put({
                type: 'save',
                payload: {attachmentList: attachmentList}
            });
        },

        /**
         * 作者：胡月
         * 创建日期：2018-01-24
         * 功能：提交附件
         * @param projAttachment 附件数据
         * @param reasonValue 修改原因
         */
        *submitAttachment({projAttachment, reasonValue}, {call, put, select}) {
            let {projectInfo} = yield select(state => state.projStartMainPage);
            let attachmentSubmitPostData = {
                arg_proj_id: projectInfo.proj_id,        //项目id,必传
                arg_proj_uid: projectInfo.proj_uid,      //uuid,必传
                arg_opt_byid: Cookie.get('userid'),      //登陆人id，必传
                arg_opt_byname: Cookie.get('username'),  //登陆人姓名，必传
                arg_change_reason: reasonValue,          //修改原因，必传
                arg_proj_attachment_json: JSON.stringify(projAttachment)     //附件修改项
            };
            //console.log('===================attachmentSubmitPostData');
            //console.log(attachmentSubmitPostData);
            const data = yield call(projServices.projectInitiationUpdateProjAttachment, attachmentSubmitPostData);
            if (data.RetCode === '1') {
                message.success('修改成功');
                yield put({
                    type: 'changeAttachShow',
                    pageToType: 'view'
                });
            } else if (data.RetCode === '-1') {
                message.error(data.RetVal);
            } else if (data.RetCode === '2') {
                message.info(data.RetVal);
                yield put({
                    type: 'changeAttachShow',
                    pageToType: 'view'
                });
            } else if (data.RetCode === '0') {
                message.error('提交失败');
            }
        },
        //========================================================有关已立项的附件页面的修改  end

        /**
         * 作者：邓广晖
         * 创建日期：2017-10-11
         * 功能：查询审核日志
         * @param query url的请求参数
         */
        *searchCheckLogList({}, {call, put, select}) {
            const {queryData} = yield select(state => state.projStartMainPage);
            const data = yield call(projServices.searchCheckLogList, {arg_proj_id: queryData.proj_id});
            if (data.RetCode === '1') {
                if (data.DataRows.length > 0) {
                    for (let i = 0; i < data.DataRows.length; i++) {
                        data.DataRows[i].key = i;
                    }
                    yield put({
                        type: 'save',
                        payload: {checkLogList: data.DataRows}
                    });
                } else {
                    yield put({
                        type: 'save',
                        payload: {checkLogList: []}
                    });
                }
            }
        },

        /**
         * 作者：邓广晖
         * 创建日期：2018-01-25
         * 功能：设置条件参数
         * @param value 参数值
         * @param condType 条件类型，具体的参数对应值
         */
        *setHistoryCondParam({value, condType}, {call, put, select}) {
            const {queryData} = yield select(state => state.projStartMainPage);
            if (condType === 'searchModule') {
                yield put({
                    type: 'save',
                    payload: {
                        searchModule: value,
                        searchDeptValue: '',
                        searchChangeItemValue: '',
                        historyPage: 1
                    }
                });
                //如果点击的是 基本信息 ，查询修改项列表
                if (value === '1') {
                    const basicData = yield call(projServices.searchBasicModuleChangeItemList, {arg_proj_id: queryData.proj_id});
                    if (basicData.RetCode === '1') {
                        yield put({
                            type: 'save',
                            payload: {
                                searchChangeItemList: basicData.DataRows
                            }
                        });
                    }
                } else if (value === '2') {
                    //如果点击的是  里程碑 ，查询修改项列表
                    const mileData = yield call(projServices.searchMileModuleChangeItemList, {arg_proj_id: queryData.proj_id});
                    if (mileData.RetCode === '1') {
                        yield put({
                            type: 'save',
                            payload: {
                                searchChangeItemList: mileData.DataRows
                            }
                        });
                    }
                } else if (value === '3_1') {
                    //如果点击的是  全成本/配合部门 ，查询修改项列表
                    const coorpData = yield call(projServices.searchCoorpModuleChangeItemList, {arg_proj_id: queryData.proj_id});
                    if (coorpData.RetCode === '1') {
                        yield put({
                            type: 'save',
                            payload: {
                                searchChangeItemList: coorpData.DataRows
                            }
                        });
                    }
                } else if (value === '3_2') {
                    //如果点击的是  全成本/预算 ，查询部门列表 以及 查询修改项列表
                    const changeDeptData = yield call(projServices.searchBudgetModuleDeptList, {arg_proj_id: queryData.proj_id});
                    if (changeDeptData.RetCode === '1') {
                        yield put({
                            type: 'save',
                            payload: {
                                searchDeptList: changeDeptData.DataRows
                            }
                        });
                    }
                    const changeFeeData = yield call(projServices.searchBudgetModuleChangeItemList, {arg_proj_id: queryData.proj_id});
                    if (changeFeeData.RetCode === '1') {
                        yield put({
                            type: 'save',
                            payload: {
                                searchChangeItemList: changeFeeData.DataRows
                            }
                        });
                    }
                } else if (value === '4') {
                    //如果点击的是  附件 ，查询修改项列表
                    const attachData = yield call(projServices.searchAttachModuleChangeItemList, {arg_proj_id: queryData.proj_id});
                    if (attachData.RetCode === '1') {
                        yield put({
                            type: 'save',
                            payload: {
                                searchChangeItemList: attachData.DataRows
                            }
                        });
                    }
                }
            } else if (condType === 'searchDeptValue') {
                yield put({
                    type: 'save',
                    payload: {
                        searchDeptValue: value,
                        historyPage: 1
                    }
                });
            } else if (condType === 'searchChangeItemValue') {
                yield put({
                    type: 'save',
                    payload: {
                        searchChangeItemValue: value,
                        historyPage: 1
                    }
                });
            } else if (condType === 'historyPage') {
                yield put({
                    type: 'save',
                    payload: {
                        historyPage: value
                    }
                });
            }
            //参数设置好后，查询表格数据
            yield put({type: 'historyRecordSearch'});
        },


        /**
         * 作者：邓广晖
         * 创建日期：2018-01-25
         * 功能：历史记录条件查询
         */
        *historyRecordSearch({}, {call, put, select}) {
            const {queryData, searchModule, searchDeptValue, searchChangeItemValue, historyPage, startOrderId} = yield select(state => state.projStartMainPage);
            let postData = {};
            //如果变化项不为空
            if (searchChangeItemValue !== '') {
                if (searchModule === '0') {
                    //这个只针对 所有 模块
                    if (startOrderId !== '') {
                        postData.arg_startorderid = startOrderId;
                    }
                } else if (searchModule === '1') {
                    //基本信息变化项传值
                    postData.arg_tbfield = searchChangeItemValue;
                } else if (searchModule === '2') {
                    //里程碑变化项传值
                    postData.arg_querytype = searchChangeItemValue.split('##')[0];
                    postData.arg_queryfield = searchChangeItemValue.split('##')[1];
                } else if (searchModule === '3_1') {
                    //配合部门变化项传值
                    postData.arg_tbfield = searchChangeItemValue;
                } else if (searchModule === '3_2') {
                    //全成本、预算变化项传值
                    postData.arg_tbfield = searchChangeItemValue;
                } else if (searchModule === '4') {
                    //附件变化项传值
                    postData.arg_querytype = searchChangeItemValue;
                }
            }
            //如果 部门 不为空 这个只针对 3_2部门变化项
            if (searchDeptValue !== '') {
                postData.arg_deptname = searchDeptValue;
            }
            postData.arg_page_current = historyPage;
            postData.arg_page_size = 10;
            postData.arg_proj_id = queryData.proj_id;
            let data = {};
            //请求服务前开始旋转
            yield put({
                type: 'save',
                payload: {
                    historyTableLoad: true
                }
            });
            if (searchModule === '0') {
                //所有模块表格数据
                data = yield call(projServices.searchAllModuleTableData, postData);
                if (data.RetCode === '1') {
                    //只有在（非第一次）查询 全部 模块时，传StartOrderId
                    if ('StartOrderId' in data) {
                        yield put({
                            startOrderId: data.StartOrderId
                        });
                    } else {
                        yield put({
                            startOrderId: ''
                        });
                    }
                }
            } else if (searchModule === '1') {
                //基本信息模块表格数据
                data = yield call(projServices.searchBasicModuleTableData, postData);
            } else if (searchModule === '2') {
                //里程碑模块表格数据
                data = yield call(projServices.searchMileModuleTableData, postData);
            } else if (searchModule === '3_1') {
                //全成本/配合部门模块表格数据
                data = yield call(projServices.searchCoorpModuleTableData, postData);
            } else if (searchModule === '3_2') {
                //全成本/预算模块表格数据
                data = yield call(projServices.searchBudgetModuleTableData, postData);
            } else if (searchModule === '4') {
                //附件模块表格数据
                data = yield call(projServices.searchAttachModuleTableData, postData);
            }
            if (data.RetCode === '1') {
                yield put({
                    type: 'save',
                    payload: {
                        historyList: data.DataRows,
                        historyRowCount: data.RowCount
                    }
                });
            }
            //请求服务后关闭旋转
            yield put({
                type: 'save',
                payload: {
                    historyTableLoad: false
                }
            });
        },

        /**
         * 作者：邓广晖
         * 创建日期：2018-01-25
         * 功能：历史记录初始化查询
         */
        *searchHistoryInit({}, {call, put, select}) {
            const {queryData} = yield select(state => state.projStartMainPage);
            yield put({
                type: 'save',
                payload: {
                    searchModule: '1', /*查询模块，分为 全部(0),基本信息（1），里程碑（2），全成本/配合部门（3-1），全成本/预算（3-2），附件（4）*/
                    searchDeptValue: '', /*搜索时部门值*/
                    searchDeptList: [], /*搜索时部门列表*/
                    searchChangeItemValue: '', /*搜索时变化项的值*/
                    historyPage: 1, /*历史记录页码*/
                    historyRowCount: '0', /*历史记录总条数*/
                    startOrderId: '', /*开始查询时的顺序ID,后台返回*/
                }
            });
            const basicData = yield call(projServices.searchBasicModuleChangeItemList, {arg_proj_id: queryData.proj_id});
            if (basicData.RetCode === '1') {
                yield put({
                    type: 'save',
                    payload: {
                        searchChangeItemList: basicData.DataRows
                    }
                });
            }
            //参数设置好后，查询表格数据
            yield put({type: 'historyRecordSearch'});
        },

        /**
         * 作者：邓广晖
         * 创建日期：2017-10-11
         * 功能：点击返回时，将传进去的参数返回到原页面
         * @param query url的请求参数
         */
            *setQueryData({query}, {put}) {
            yield put({
                type: 'save',
                payload: {queryData: query}
            });
        }
    },
    subscriptions: {
        setup({dispatch, history}) {
            return history.listen(({pathname, query}) => {
                if (pathname === '/projectApp/projStartUp/projList/projStartEdit') {
                    dispatch({type: 'initData'});
                    dispatch({type: "setQueryData", query});
                    dispatch({type: "projectInfoQuery"});
                }
            });
        },
    },
};
