/**
 * 作者：崔晓林
 * 创建日期：2020-5-5.
 * 邮箱：cuixl@itnova.com.cn
 * 文件说明：已立项项目信息的查询
 */
import Cookie from 'js-cookie';
import { message } from 'antd';
import * as projDetail from "../../../../services/project/projDetail";
import { getReplaceMoney } from '../../../../services/project/projService';
import config from '../../../../utils/config';



export default {
    namespace: 'projDetail',
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
        
    },
    reducers: {                       //同步方法
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
        * 作者: 崔晓林
        *  创建日期: 2020-5-5
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
            const {projId } = yield select(state => state.projDetail);
            const postData = {
                arg_flag:1,
                arg_proj_id:projId,
            };
            const data = yield call(projDetail.projDetailBasic,postData);
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
                    type: 'save',   //type里给的save是自定义函数的名称,需要提前定义,type是调用这个函数. 被调用的函数可以是同步可以是异步,此处的save是同步函数
                    payload: {       //payload作为参数被传给了save函数
                        projectInfo: data.DataRows[0],
                        pms_list: data.pms_list,
                        projUid: data.DataRows[0].proj_uid,
                    },
                });
            }
        },

        
        
         /**
         *  作者: 崔晓林
         *  创建日期: 2020-5-5
         * 功能：项目基本信息tab中，底下的预估投资替代额查询
         */
        *replaceMoneyQuery({}, {call, put, select}) {
            const {projId,beginTime,endTime} = yield select(state => state.projDetail);
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
         *  作者: 崔晓林
         *  创建日期: 2020-5-5
         *  崔晓林 2020-05-04 修改 ，替换里程碑查询服务，并加入交付物信息
         * 功能：里程碑信息查询
         * @param query url的请求参数
         * @param call 请求服务
         * @param put 返回reducer
         */
        *mileInfoQuery({ query }, { call, put, select }) {
            const { projId } = yield select(state => state.projDetail);
            const milestonePostData = {
                arg_flag: '1',         
                arg_mile_flag: '3',
                arg_proj_id: projId,
            };
            const mileData = yield call(projDetail.projDetailMiles, milestonePostData);
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
         *  作者: 崔晓林
         *  创建日期: 2020-5-5
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
         *  作者: 崔晓林
         *  创建日期: 2020-5-5
         * 功能：项目启动时项目信息页面的查询已上传附件列表
         * @param call 请求服务
         * @param put 返回reducer
         */
        *searchNewAddAttachment({ }, { call, put, select }) {
            const { projId } = yield select(state => state.projDetail);
            let postData = {};
            postData.arg_flag = 1; // arg_flag：固定传0（0，项目启动-项目新增立项；1，项目启动-项目基本信息查询）
            postData.arg_proj_id = projId;

            const data = yield call(projDetail.projDetailAttach, postData);
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
         *  作者: 崔晓林
         *  创建日期: 2020-5-5
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
                const { projId } = yield select(state => state.projDetail);
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
        * 作者: 崔晓林
        * 创建日期: 2020-5-5
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
            const { projId } = yield select(state => state.projDetail);
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
         *  作者: 崔晓林
         *  创建日期: 2020-5-5
         * 功能：项目启动时新增页面删除附件列表
         * @param key 附件的key
         * @param attachmentList 附件列表
         * @param put 返回reducer
         * @param select 获取model里面state
         */
        *deleteAttachment({ key, attachmentList }, { put, select }) {
            // 删除delete操作
            // 传入delete的正确参数
            const { projId } = yield select(state => state.projDetail);
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
        * 作者: 崔晓林
        * 创建日期: 2020-5-5
        *Email: cuixl@itnova.com.cn
        *功能：项目管理》项目收尾》历史项目》
        */
        *projAttachmentSave({ transjson, editMessage }, { select, call, put }) {
            // ????????============?????这是哪里取得的值？？
            let transjsonarray = [];
            transjsonarray.push(transjson, editMessage);
            // 真正的save动作
            // tag 0 保存，2 提交
            const retData = yield call(projDetail.projFileUpdate, {
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
        /**
        * 作者: 崔晓林
        * 创建日期: 2020-5-5
        *Email: cuixl@itnova.com.cn
        *功能：一键推送按钮触发的事件
        */
        *projDetailPush({query},{put,call,select}){ 
          //从models中的state中取值,取出projId         
           const { projId } = yield select(state => state.projDetail);
          //定义参数
            let postData = {
              // arg_flag:1,
              arg_proj_id :projId,
            };
          //将访问服务的返回值赋值给data, yield call(server中的函数,自定义参数)
          const data = yield call(projDetail.projDetailPush,postData);
        //   const data= {RetCode:1}
          //根据访问服务结果是否成功来分别执行不同的动作
          if(data.RetCode==1){
            window.history.back()
            message.success('数据操作成功!'); 
          
          }else{
            message.error('数据推送失败');
          }
        }



        // ========================项目信息============= end==jump==    
    },
    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, query }) => {
                if (pathname === '/projectApp/projRecord/projChild/projDetail') {
                    dispatch({ type: 'mainProjQuery', query });
                }
            });
        },
    },
};
