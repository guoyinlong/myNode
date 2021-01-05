/**
 * 作者：彭东洋
 * 创建日期：2020-04-14
 * 邮件：pengdy@itnova.com.cn
 * 文件说明：项目配置-全成本标准 所有model数据
 */
import * as deptSetServices from "../../../../services/project/config/projCheck";
import {message} from 'antd';
export default {
    namespace: "fullCostStandard",
    state: {
        oubudgetList: [],
        costList: [], //全成本标准列表
        titleColumns:[], //表头列表
        typeList: [], //默认显示的费用类别列表
        inputFlag: false, //输入框的可编辑状态
        searchYear: new Date().getFullYear(),
        carryOutAllCostList: [], //项目实施成本子类列表
        midCostList: [], //全成本中间数据列表
        expenseCategory: [], //默认不显示的费用类别
        dataStatus: "0" //后端返回的数据的状态  0:"保存"，1:"提交"
    },
    reducers: {
        save (state,action) {
            return {
                ...state,
                ...action.payload
            }
        }
    },
    effects: {
        //修改年份时保存年份
        *saveYear({postDtat},{put}){
            yield put({
                type:"save",
                payload:{
                    searchYear: postDtat.arg_year
                }
            })
        },
        //增加费用项目
        *addCostType({postDtat},{put,select}) {
            let {midCostList,expenseCategory,typeList} = yield select(state => state.fullCostStandard)
            let object = {} 
            expenseCategory.forEach((v) => {
                if(postDtat.subclassName == v.sort_name) {
                    typeList.push(v)
                    object.edit = "edit"
                    object.sort_level = "2"
                    object.sort_name = v.sort_name
                    object.visible = true
                    object.sort_paruuid = v.sort_paruuid
                    object.sort_uuid = v.sort_uuid
                    object.key = v.sort_uuid
                }
            })
            midCostList.forEach((v) => {
                if(object.sort_paruuid == v.sort_uuid && !v.children.some((item)=> {return item.sort_uuid == object.sort_uuid})) {
                    v.children.push(object)
                } else if(v.children.some((item)=> {return item.sort_uuid == object.sort_uuid}) && object.sort_paruuid == v.sort_uuid) {
                    message.error("费用项目不可重复添加")
                }
            })
            yield put({
                type: "save",
                payload: {
                   midCostList,
                   typeList 
                }
            })
        },
        //删除费用项目
        *deleteCostType({postDtat},{put,select}) {
            let {midCostList} = yield select(state => state.fullCostStandard)
            midCostList.forEach((v) => {
                v.children.forEach((value) => {
                    if(value.sort_name == postDtat.subclassName) {
                        value.visible = false
                    }
                })
            })
        },
        //默认不显示的费用类别的查询
        *expenseCategoryQuery({},{put,call}) {
            const postDtat = {
                arg_state: "1"
            }
            const {DataRows,RetCode} = yield call (deptSetServices.autocalcu_cost_budget_sort_params_query,postDtat) 
            if(RetCode == "1") {
                yield put({
                    type:"save",
                    payload: {
                        expenseCategory:DataRows
                    }
                })
            }
        },
        //提交oubudge数据
        *autocalcu_cost_budget_sort_oubudget_add ({},{select,put,call}) {
            const {titleColumns,searchYear,midCostList} = yield select(state => state.fullCostStandard)
            let getFullCostDataSource = (newArray,intermediateData,year) => {
                if(intermediateData.length == 0) {
                    return []
                }
                let titleList = newArray.map((v,i) => "dept"+i)
                let fullCostDataSource = [] //生成表格的数据源
                intermediateData.forEach((v,i) => {
                    let obj = {}
                    titleList.forEach((value,i) => {
                        obj[value] = v[value] 
                    })
                    fullCostDataSource.push({
                        year,
                        yearRowSpan: 0,
                        padLeft: "0px",
                        sort_name: v.sort_name,
                        sort_name_Company: v.sort_name + "（元/人月）",
                        key: v.sort_uuid,
                        sort_uuid:v.sort_uuid,
                        Remarks: v.Remarks,
                        ...obj
                    })
                    if(v.children.length > 0 ) {
                        v.children.forEach((value) => {
                            let object = {}
                            titleList.forEach((text) => {
                                object[text] = value[text] 
                            })
                            if(value.visible) {
                                fullCostDataSource.push({
                                    year,
                                    yearRowSpan: 0,
                                    padLeft: "30px",
                                    sort_name: value.sort_name,
                                    sort_name_Company: value.sort_name + "（元/人月）",
                                    key: value.sort_uuid,
                                    sort_uuid: value.sort_uuid,
                                    Remarks: value.Remarks,
                                    ...object
                                })
                            }
                        })
                    }
                })
                fullCostDataSource[0].yearRowSpan = fullCostDataSource.length
                return fullCostDataSource
            }
            let FullCostDataSource = getFullCostDataSource(titleColumns,midCostList,searchYear)
            let arg_ouid = []
            let arg_ouname = []
            let arg_ou_short_name = []
            let arg_ou_sort_uuid = []
            let arg_ou_sort_name = []
            let arr = []
            let arg_sort_uuid = [];
            let arg_remake = [];
            for(let i = 0; i < FullCostDataSource.length; i++) {
                arg_ouid[i] = []
                arg_ouname[i] = []
                arg_ou_short_name[i] = []
                titleColumns.forEach((v,j) => {
                    arg_ouid[i][j] = v.ou_deptid
                    arg_ouname[i][j] = v.ou_remarks
                    arg_ou_short_name[i][j] = v.ou_short_name
                })
            }
            FullCostDataSource.forEach((v,i) => {
                arg_ou_sort_uuid[i] = []
                arg_ou_sort_name[i] = []
                arg_sort_uuid[i] = v.sort_uuid
                arg_remake[i] = v.Remarks
                arr[i] = [];
                for(let j =0; j < titleColumns.length; j++) {
                    arg_ou_sort_uuid[i][j] = v.sort_uuid
                    arg_ou_sort_name[i][j] = v.sort_name
                    if(!!v["dept"+j]) {
                        arr[i][j] = v["dept"+j]
                    } 
                    else {
                        arr[i][j] = "0"
                    }
                }
            })
            let data = {
                arg_year:searchYear,
                arg_sort_uuid: arg_sort_uuid.join(),
                arg_remake: arg_remake.join()
            }
            const {RetCode} = yield call(deptSetServices.autocalcu_cost_budget_sort_oubudget_remake_add,data)
            if(RetCode == "1") {
                let postDtat = {
                    arg_year:searchYear,
                    arg_ou_sort_uuid:arg_ou_sort_uuid.join(),
                    arg_ou_sort_name: arg_ou_sort_name.join(),
                    arg_ou_budget: arr.join(),
                    arg_ouid: arg_ouid.join(),
                    arg_ouname: arg_ouname.join(),
                    arg_ou_short_name: arg_ou_short_name.join(),
                }
                const {RetCode} = yield call(deptSetServices.autocalcu_cost_budget_sort_oubudget_add,postDtat)
                if(RetCode == "1") {
                    const postDtat = {
                        arg_year:searchYear,
                        arg_submit: "1"
                    }
                    const {RetCode} = yield call(deptSetServices.autocalcu_cost_budget_sort_oubudget_submit,postDtat)
                    if(RetCode == "1") {
                        let postDtat = {
                            arg_year:searchYear,
                        }
                        yield put ({
                            type:"autocalcu_cost_budget_sort_params_query",
                            postDtat
                        })
                        yield put({
                            type:"save",
                            payload: {
                                inputFlag: true,
                            }
                        });
                        message.success("添加成功")
                    }  
                }
            }
        },
        //删除oubudget数据
        *autocalcu_cost_budget_sort_oubudget_delete ({postDtat},{put,call}) {
            const {RetCode} = yield call(deptSetServices.autocalcu_cost_budget_sort_oubudget_delete,postDtat)
            if(RetCode == "1") {
                message.success("删除成功")
            }
        },
        // 备注修改
        *autocalcu_cost_budget_sort_oubudget_remake_update ({postDtat},{put,call}) {
            const {RetCode} = yield call(deptSetServices.autocalcu_cost_budget_sort_oubudget_remake_update,postDtat)
            if(RetCode == "1") {
                message.success("修改成功")
            }

        },
        //修改ou budget数据
        *autocalcu_cost_budget_sort_oubudget_update ({},{select,put,call}) {
            const {costList, titleColumns } =yield select (state => state.fullCostStandard)
            let arg_ouid = [];
            let arg_ou_sort_uuid = [];
            // let arg_ou_budget = [];
            titleColumns.forEach((v,i) => {
                arg_ouid[i] = []
                for(let j = 0; j < costList.length; j++) {
                    arg_ouid[i][j] = v.ou_deptid
                }
            })
            costList.forEach((v,i) => {
                arg_ou_sort_uuid[i] = []
                for(let j =0; j < titleColumns.length; j++) {
                    arg_ou_sort_uuid[i][j] = v.sort_uuid
                }
            })
            costList.forEach((v,i) => {
                arr[i] = [];
                for(let j = 0 ; j< titleColumns.length; j++) { 
                    if(!!v["dept"+j]) {
                        arr[i][j] = v["dept"+j]
                    } else {
                        arr[i][j] = "0"
                    }
                }
            })
            const {RetCode} = yield call(deptSetServices.autocalcu_cost_budget_sort_oubudget_update,postDtat)
            if(RetCode == "1") {
                message.success("修改成功")
            } 
        },
        //构建表格显示的数据列表
        *autocalcu_cost_budget_sort_params_query ({},{put,call,select}) {
            const {searchYear} = yield select(state => state.fullCostStandard)
            const postDtat = {
                arg_year: searchYear
            }
            const {DataRows,RetCode} = yield call(deptSetServices.autocalcu_cost_budget_sort_oubudget_query,postDtat)
            let dataList = DataRows;
            let hash = {};
            let midTypeList = dataList.reduce(function(item, next) {
                hash[next.ou_sort_name] ? '' : hash[next.ou_sort_name] = true && item.push(next);
                return item
                }, [])
            let type_list = midTypeList.map((v,i) => {
                let obj = {}
                obj.sort_level = v.sort_level
                obj.sort_name = v.ou_sort_name
                obj.sort_uuid = v.ou_sort_uuid
                if(v.sort_paruuid){
                    obj.sort_paruuid = v.sort_paruuid
                }
                return obj
            })
            let getIntermediateData = (DataRows) =>{
                let intermediateData = [];
                DataRows.forEach((v) => {
                    if(v.sort_level == 1) {
                        let obj = {};
                        obj.children = []
                        DataRows.forEach((value) => {
                            if(value.sort_level == 2 && v.sort_uuid == value.sort_paruuid ) {
                                let object = {}
                                if(value.sort_name == "差旅费" || value.sort_name == "差旅费_资本化") {
                                    object.visible = true
                                    object.edit = "edit"
                                } else {
                                    object.visible = true
                                    object.edit = "no_edit"
                                }
                                obj.children.push({
                                    ...value,
                                    ...object
                                })
                            }
                        })
                        intermediateData.push({
                            ...v,
                            ...obj
                        }) 
                    }
                })
                return intermediateData
            }
            let getFinalIntermediateData = (intermediateData,dataList,newArray) => {
                intermediateData.forEach((v) => {
                    for(let value of dataList){
                        if(v.sort_name == value.ou_sort_name) {
                            v.Remarks = value.remake
                        }
                        if(v.sort_name == value.ou_sort_name) {
                            newArray.forEach((text,j) => {
                                if(text.ou_name == value.ou_name) {
                                    v["dept" + j.toString()] = value.ou_budget

                                }
                            })
                        }
                    }
                    v.children.forEach((v) => {
                        for(let value of dataList){
                            if(v.sort_name == value.ou_sort_name) {
                                v.Remarks = value.remake
                            }
                            if(v.sort_name == value.ou_sort_name) {
                                newArray.forEach((text,j) => {
                                    if(text.ou_name == value.ou_name) {
                                        v["dept" + j.toString()] = value.ou_budget
                                    }
                                })
                            }
                        }
                    })
                })
                return intermediateData
            }
            let getFullCostDataSource = (newArray,intermediateData,year) => {
                let titleList = newArray.map((v,i) => "dept"+i)
                let fullCostDataSource = [] //生成表格的数据源
                intermediateData.forEach((v,i) => {
                    let obj = {}
                    titleList.forEach((value,i) => {
                        obj[value] = v[value] 
                    })
                    fullCostDataSource.push({
                        year,
                        yearRowSpan: 0,
                        padLeft: "0px",
                        sort_name: v.sort_name,
                        sort_name_Company: v.sort_name + "（元/人月）",
                        key: v.sort_uuid,
                        sort_uuid:v.sort_uuid,
                        Remarks: v.Remarks,
                        ...obj
                    })
                    if(v.children.length > 0 ) {
                        v.children.forEach((value) => {
                            let object = {}
                            titleList.forEach((text) => {
                                object[text] = value[text] 
                            })
                            if(value.visible) {
                                fullCostDataSource.push({
                                    year: postDtat.arg_year,
                                    yearRowSpan: 0,
                                    padLeft: "30px",
                                    sort_name: value.sort_name,
                                    sort_name_Company: value.sort_name + "（元/人月）",
                                    key: value.sort_uuid,
                                    sort_uuid: value.sort_uuid,
                                    Remarks: value.Remarks,
                                    ...object
                                })
                            }
                        })
                    }
                })
                fullCostDataSource[0].yearRowSpan =  fullCostDataSource.length
                return fullCostDataSource
            }
            if(RetCode == "1") {
                const postDtat = {
                    arg_state:"0"
                }
                const {DataRows,RetCode,DataRows1} = yield call(deptSetServices.autocalcu_cost_budget_sort_params_query,postDtat)
                if(RetCode == "1") {
                    let newArray = [0,0,0,0,0];
                    //按照指定的顺序返回表头数组
                    let finalTypeList = midTypeList.length > 0 ? JSON.parse(JSON.stringify(type_list))  : JSON.parse(JSON.stringify(DataRows))
                    DataRows1.forEach((v) => {
                        switch(v.ou_short_name) {
                            case "总院":
                                newArray[0] = v;
                                break;
                            case "哈院":
                                newArray[1] = v;
                                break;
                            case "济院":
                                newArray[2] = v;
                                break;
                            case "广院":
                                newArray[3] = v;
                                break;
                            case "西院":
                                newArray[4] = v;
                                break;
                            case "南京院":
                                newArray[5] = v;
                                break;
                            default:
                                newArray = newArray.concat([v])
                        }
                    })
                    // let realDataRows = getFullCostDataSource(newArray,getFinalIntermediateData(getIntermediateData(DataRows),dataList,newArray));
                    let realDataRows = getFullCostDataSource(newArray,getFinalIntermediateData(getIntermediateData(DataRows),dataList,newArray));
                    let flag = realDataRows.some((item,index)=>{
                       return !!item["dept"+index]
                    })
                    let flag1 =  dataList.some((item) =>{
                        return item.is_sub == "1"
                    })
                    if(flag && flag1) {
                        yield put({
                            type:"save",
                            payload:{
                                inputFlag: true
                            }
                        })
                    } else {
                        yield put({
                            type:"save",
                            payload:{
                                inputFlag: false
                            }
                        })
                    }
                    yield put({
                        type:"save",
                        payload:{
                            // midCostList:getFinalIntermediateData(getIntermediateData(DataRows),dataList,newArray),
                            midCostList:getFinalIntermediateData(getIntermediateData(finalTypeList),dataList,newArray),
                            costList:realDataRows,
                            titleColumns: JSON.parse(JSON.stringify(newArray)),
                            typeList: JSON.parse(JSON.stringify(DataRows)),
                            finaDataTypeList: finalTypeList //返回的最终数据类型
                        }
                    })
                } 
            }
        },
        //点击保存保存用户输入的数据，保存之后还可修改
        *autocalcu_cost_budget_sort_oubudget_submit ({},{select,put,call}) {
            const {titleColumns,searchYear,midCostList} = yield select(state => state.fullCostStandard)
            let getFullCostDataSource = (newArray,intermediateData,year) => {
                if(intermediateData.length == 0) {
                    return []
                }
                let titleList = newArray.map((v,i) => "dept"+i)
                let fullCostDataSource = [] //生成表格的数据源
                intermediateData.forEach((v,i) => {
                    let obj = {}
                    titleList.forEach((value,i) => {
                        obj[value] = v[value] 
                    })
                    fullCostDataSource.push({
                        year,
                        yearRowSpan: 0,
                        padLeft: "0px",
                        sort_name: v.sort_name,
                        sort_name_Company: v.sort_name + "（元/人月）",
                        key: v.sort_uuid,
                        sort_uuid:v.sort_uuid,
                        Remarks: v.Remarks,
                        ...obj
                    })
                    if(v.children.length > 0 ) {
                        v.children.forEach((value) => {
                            let object = {}
                            titleList.forEach((text) => {
                                object[text] = value[text] 
                            })
                            if(value.visible) {
                                fullCostDataSource.push({
                                    year,
                                    yearRowSpan: 0,
                                    padLeft: "30px",
                                    sort_name: value.sort_name,
                                    sort_name_Company: value.sort_name + "（元/人月）",
                                    key: value.sort_uuid,
                                    sort_uuid: value.sort_uuid,
                                    Remarks: value.Remarks,
                                    ...object
                                })
                            }
                        })
                    }
                })
                fullCostDataSource[0].yearRowSpan = fullCostDataSource.length
                return fullCostDataSource
            }
            let FullCostDataSource = getFullCostDataSource(titleColumns,midCostList,searchYear)
            let arg_ouid = []
            let arg_ouname = []
            let arg_ou_short_name = []
            let arg_ou_sort_uuid = []
            let arg_ou_sort_name = []
            let arr = []
            let arg_sort_uuid = [];
            let arg_remake = [];
            for(let i = 0; i < FullCostDataSource.length; i++) {
                arg_ouid[i] = []
                arg_ouname[i] = []
                arg_ou_short_name[i] = []
                titleColumns.forEach((v,j) => {
                    arg_ouid[i][j] = v.ou_deptid
                    arg_ouname[i][j] = v.ou_remarks
                    arg_ou_short_name[i][j] = v.ou_short_name
                })
            }
            FullCostDataSource.forEach((v,i) => {
                arg_ou_sort_uuid[i] = []
                arg_ou_sort_name[i] = []
                arg_sort_uuid[i] = v.sort_uuid
                arg_remake[i] = v.Remarks
                arr[i] = [];
                for(let j =0; j < titleColumns.length; j++) {
                    arg_ou_sort_uuid[i][j] = v.sort_uuid
                    arg_ou_sort_name[i][j] = v.sort_name
                    if(!!v["dept"+j]) {
                        arr[i][j] = v["dept"+j]
                    } 
                    else {
                        arr[i][j] = "0"
                    }
                }
            })
            let data = {
                arg_year:searchYear,
                arg_sort_uuid: arg_sort_uuid.join(),
                arg_remake: arg_remake.join()
            }
            const {RetCode} = yield call(deptSetServices.autocalcu_cost_budget_sort_oubudget_remake_add,data)
            if(RetCode == "1") {
                let postDtat = {
                    arg_year:searchYear,
                    arg_ou_sort_uuid:arg_ou_sort_uuid.join(),
                    arg_ou_sort_name: arg_ou_sort_name.join(),
                    arg_ou_budget: arr.join(),
                    arg_ouid: arg_ouid.join(),
                    arg_ouname: arg_ouname.join(),
                    arg_ou_short_name: arg_ou_short_name.join(),
                }
                const {RetCode} = yield call(deptSetServices.autocalcu_cost_budget_sort_oubudget_add,postDtat)
                if(RetCode == "1") {
                    let postDtat = {
                        arg_year:searchYear,
                        arg_submit: "0"
                    }
                    const {RetCode} = yield call(deptSetServices.autocalcu_cost_budget_sort_oubudget_submit,postDtat)
                    if(RetCode == "1") {
                        yield put ({
                            type:"autocalcu_cost_budget_sort_params_query",
                            postDtat
                        })
                        message.success("保存成功")
                    }
                }
            }
        }
    },
    subscriptions:{
        setup({ dispatch,history }) {
            return history.listen(({ pathname,query}) =>{
                if (pathname === '/projectApp/projConfig/fullCostStandard') {
                    dispatch({
                        type:"autocalcu_cost_budget_sort_params_query",
                    })
                    dispatch({type:"expenseCategoryQuery"})
                }
            })
        }
    }
}