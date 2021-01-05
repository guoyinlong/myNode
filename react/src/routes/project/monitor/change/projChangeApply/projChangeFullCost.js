/**
 * 作者：邓广晖
 * 创建日期：2017-11-16
 * 邮件：denggh6@chinaunicom.cn
 * 文件说明：实现项目变更里面的全成本功能
 */
import {Modal, Table, Icon, Button, Input, Select, message, TreeSelect, Spin} from 'antd';
import AssignDept from '../../../../../components/commonApp/assignDept.js';
import styles from './projChangeFullCost.less';
import config from '../../../../../utils/config';
import {getuuid, isInArray} from '../../../../../routes/project/projConst.js';
import SquareTab from './squareTab';
import FourDeptThreeCenterNoLimit from "../../../fourDeptThreeCenterNoLimit";
import ChildTabChangeModal from './childTabChangeModal'
import SelectCoopDeptPerson from './selectCoopDeptPerson'
import Cookie from "js-cookie";
import * as projServices from "../../../../../services/project/projService";
import request from "../../../../../utils/request";

const Option = Select.Option;
const confirm = Modal.confirm;
const TreeNode = TreeSelect.TreeNode;

/**
 * 作者：邓广晖
 * 创建日期：2018-01-17
 * 功能：转变为千分位
 * @param value 输入的值
 */
function change2Thousands(value) {
    if (value !== undefined) {
        return value.replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
    } else {
        return '';
    }
}

/**
 * 作者：邓广晖
 * 创建日期：2017-11-16
 * 功能：实现项目变更全程本
 */
class ProjChangeFullCost extends React.PureComponent {

    state = {
        // deptModalVisible: false,
        purchaseVisible: false,
        purchaseValue: '',
        operateVisible: false,
        operateValue: '',
        carryOutVisible: false,
        carryOutValue: '',
        year: '', /*点击表格行时确定的年份*/
        yearVisible: false,
        yearValue: '', /*下拉框中的年份*/
        selectPersonList: [],// 配合部门联系人列表
    };

    // 弹出modal的之后执行跳转 并查询
    directChildTabChangeClick = (key, flag) => {
        this.props.dispatch({
            type: 'projChangeApply/childTabChangeClick',
            key: key,
            flag,
        });
    };

    /**
     * 圆角tab切换区分数据是都变化
     */
    childTabChangeClick = (key) => {
        const squareTabKey = this.props.squareTabKey; // 圆角tab
        //如果是审核中的，直接切换
        if (this.props.projChangeCheckFlag === '1' || squareTabKey === '合计预算') {
            this.directChildTabChangeClick(key, 'cancel'); // 直接切换
        } else {
            //如果点击的是当前tab不起作用
            const array_proj_dept = this.getCoorDeptData();
            const array_proj_budget = this.getdeptBudgetData();
            const fullcostIsSave = this.judgeFullcostIsSave('tabChange');
            if (fullcostIsSave === '1') {
                if (array_proj_dept.length === 0 && array_proj_budget.length === 0) {
                    this.directChildTabChangeClick(key, 'cancel');
                } else {
                    this.refs.ChildTabChangeModal.showModal(squareTabKey, key); // 显示tab框
                }
            } else {
                this.directChildTabChangeClick(key, 'cancel');
            }
        }

    }

    /**
     * 作者：邓广晖
     * 创建日期：2017-11-16
     * 功能：模态框显示
     * @param type 模态框类型
     */
    showModal = (type) => {
        this.setState({[type]: true})
    };

    // 选择配合部门人员 标题 圈+ 图标
    willGetDeptPerson = () => {
        // 走服务获得数据
        this.props.dispatch({
            type: 'projChangeApply/showDeptModal',
            showORnot: true,
        })

    }

    /**
     * 作者：邓广晖
     * 创建日期：2017-11-23
     * 功能：改变下拉框的值
     * @param value 下拉框的值
     * @param type 下拉框类型
     */
    changeSelectValue = (value, type) => {
        this.state[type] = value
    };

    initSelectData = () => {
        this.setState({
            purchaseValue: '',
            operateValue: '',
            carryOutValue: '',
            year: '',
        });
    };
    /**
     * 作者：邓广晖
     * 创建日期：2017-11-16
     * 功能：选择部门模态框关闭
     * @param flag 关闭模态框时的标志，为confirm，cancel
     */
    hideDeptModal = (flag) => {
        if (flag === 'confirm') {
            let deptSelectData = this.refs.assignDeptComp.getData(true);
            if(deptSelectData[0].dept_id){ // 组件返回的是包含一个元素的数组，组件选了人之后才做处理
                //新增配合部门信息
                this.props.dispatch({
                    type: 'projChangeApply/addCoorpDept',
                    deptSelectData: deptSelectData
                });
                //关闭选择配合部门联系人弹窗
                this.props.dispatch({
                    type: 'projChangeApply/showDeptModal',
                    showORnot: false,
                });
            }else{
                message.info('请选择配合部门联系人！')
            }

        }else{
            //关闭选择配合部门联系人弹窗
            this.props.dispatch({
                type: 'projChangeApply/showDeptModal',
                showORnot: false,
            });
        }

    };

    /**
     * 部门联系人模态框
     * @param flag
     */
    hideDeptPersonModal = (flag) => {
        /*if (flag === 'confirm') {
          let deptSelectData = this.refs.assignDeptComp.getData(true);
          //新增配合部门信息
          this.props.dispatch({
            type: 'projChangeApply/addCoorpDept',
            deptSelectData: deptSelectData
          });
        }*/
        this.setState({deptPersonModalVisible: false});
    };

    /**
     * 作者：邓广晖
     * 创建日期：2017-11-23
     * 功能：隐藏采购成本模态框
     * @param flag 关闭模态的标志
     */
    hidePurchaseModal = (flag) => {
        if (flag === 'confirm') {
            if (this.state.purchaseValue === '') {
                message.error('选项不能为空');
                return;
            }
            if (isInArray(this.props.yearListRowSpan[this.state.year].purchaseCostList, this.state.purchaseValue)) {
                message.error(config.FEE_IS_REPEATED);
                return;
            } else {
                this.props.dispatch({
                    type: 'projChangeApply/addCostType',
                    value: this.state.purchaseValue,
                    fee_type: '1',
                    fee_subtype: '0',
                    year: this.state.year
                });
            }
        }
        this.setState({purchaseVisible: false});
        this.initSelectData();
    };

    /**
     * 作者：邓广晖
     * 创建日期：2018-01-18
     * 功能：隐藏运行成本模态框
     * @param flag 关闭模态的标志
     */
    hideOperateModal = (flag) => {
        if (flag === 'confirm') {
            if (this.state.operateValue === '') {
                message.error('选项不能为空');
                return;
            }
            if (isInArray(this.props.yearListRowSpan[this.state.year].operateCostList, this.state.operateValue)) {
                message.error(config.FEE_IS_REPEATED);
                return;
            } else {
                this.props.dispatch({
                    type: 'projChangeApply/addCostType',
                    value: this.state.operateValue,
                    fee_type: '1',
                    fee_subtype: '3',
                    year: this.state.year
                });
            }
        }
        this.setState({operateVisible: false});
        this.initSelectData();
    };

    /**
     * 作者：邓广晖
     * 创建日期：2017-11-23
     * 功能：隐藏执行成本模态框
     * @param flag 关闭模态的标志
     */
    hideCarryOutModal = (flag) => {
        if (flag === 'confirm') {
            if (this.state.carryOutValue === '') {
                message.error('选项不能为空');
                return;
            }
            if (isInArray(this.props.yearListRowSpan[this.state.year].carryOutCostList, this.state.carryOutValue)) {
                message.error(config.FEE_IS_REPEATED);
                return;
            } else {
                this.props.dispatch({
                    type: 'projChangeApply/addCostType',
                    value: this.state.carryOutValue,
                    fee_type: '1',
                    fee_subtype: '1',
                    year: this.state.year
                });
            }
        }
        this.setState({carryOutVisible: false});
        this.initSelectData();
    };

    /**
     * 作者：邓广晖
     * 创建日期：2017-11-23
     * 功能：显示年份模态框
     */
    showYearModal = () => {
        if (this.props.yearList.length === this.props.fullCostYearList.length) {
            message.error(config.NO_ADD_YEAR);
        } else {
            this.setState({yearVisible: true})
        }
    };

    /**
     * 作者：邓广晖
     * 创建日期：2017-11-23
     * 功能：隐藏年份模态框
     * @param flag 关闭模态的标志
     */
    hideYearModal = (flag) => {
        if (flag === 'confirm') {
            if (this.state.yearValue === '') {
                message.error('选项不能为空');
                return;
            }
            if (isInArray(this.props.yearList, this.state.yearValue)) {
                message.error(config.YEAR_IS_REPEATED);
                return;
            } else {
                this.props.dispatch({
                    type: 'projChangeApply/addYear',
                    year: this.state.yearValue
                });
            }
        }
        this.setState({yearVisible: false});
        this.initSelectData();
    };

    /**
     * 作者：邓广晖
     * 创建日期：2017-11-20
     * 功能：删除一个配合部门
     * @param index 配合部门的索引值
     */
    deleteCoorpDept = (index) => {
        this.props.dispatch({
            type: 'projChangeApply/deleteCoorpDept',
            index: index
        });
    };

    /**
     * 作者：邓广晖
     * 创建日期：2017-11-20
     * 功能：编辑配合部门联系人
     * @param e 事件
     * @param index 配合部门的索引值
     */
    editCoorpMgrName = (e, index) => {
        this.props.dispatch({
            type: 'projChangeApply/editCoorpMgrName',
            index: index,
            text: e.target.value
        });
    };

    //精确计算浮点数
    multiplication = (a,b) => {
        var c = 0,
        d = a.toString(),
        e = b.toString();
        try {
            c += d.split(".")[1].length;
        } catch (f) {}
        try {
            c += e.split(".")[1].length;
        } catch (f) {}
        return Number(d.replace(".", "")) * Number(e.replace(".", "")) / Math.pow(10, c);
    }
    //生成联动传递的数据
    setParameter = (deptName) => {
        let realDeptName =  "";
        if(!!deptName) {
            realDeptName = deptName.split("-")[0] == "联通软件研究院" ? "联通软件研究院本部" : deptName.split("-")[0];
        }
        const {oubudgetList, deptBudgetTableData,allDeptList} = this.props;
        let arr = [];
        let yearList = [];
        oubudgetList.forEach((v) => {
            if(!yearList.includes(v.year)) {
                yearList.push(v.year)
            }
        });
        //求出距离指定年份最近的一年
        let priorityMatching = (year,value) => {
            if(!!Number(year)) {
                let arr1 = yearList.map((v,) => {
                    return Math.abs(v-year)
                })
                arr1.sort((a,b) => {return a-b})
                if(year > value) {
                    if(Number(year)-Number(arr1[0]) == value) {
                        return  year
                    }
                } else {
                    if(Number(year)+Number(arr1[0]) == value) {
                        return  year
                    }
                }  
            }
        }
        for(let j = 0; j < allDeptList.length; j++) {
            for(let i = 0; i < deptBudgetTableData.length; i++) {
                let obj = {}
                oubudgetList.forEach((value) => {
                    if(
                        value.ou_name == allDeptList[j].ou && 
                        value.ou_name == realDeptName &&
                        // value.year == deptBudgetTableData[i].year &&
                        deptBudgetTableData[i].year &&
                        priorityMatching(deptBudgetTableData[i].year,value.year) == deptBudgetTableData[i].year &&
                        deptBudgetTableData[i].no_pre_fee_name &&
                        deptBudgetTableData[i].no_pre_fee_name != "差旅费" &&
                        deptBudgetTableData[i].no_pre_fee_name != "差旅费_资本化" &&
                        deptBudgetTableData[i].no_pre_fee_name != "项目实施成本" && 
                        (deptBudgetTableData[i].no_pre_fee_name == value.ou_sort_name || 
                        deptBudgetTableData[i].no_pre_fee_name.split("（")[0].trim() == value.ou_sort_name.trim())  
                      )
                      { 
                          obj.value = value.ou_budget
                          obj.year = deptBudgetTableData[i].year
                          obj.dept_name = allDeptList[j].dept_name
                          obj.fee_name = deptBudgetTableData[i].no_pre_fee_name
                          arr.push(obj)
                      }
                })
            }
        }
        return arr
    }
    //编辑单元格数据
    newEditCellData = (e,year,deptName, noPreFeeName,array) => {
        this.editCellData(e,year,deptName,noPreFeeName)
        array.forEach((v) => {
            if(v.year == year && v.dept_name == deptName ) {
                //先将非数值去掉
                // let realValue = String(v.value * (e.target.value)) 
                let realValue = String(this.multiplication(v.value,e.target.value))
                let value = realValue.replace(/[^\d.]/g, '');
                //如果以小数点开头，或空，改为0
                if (value === '.') {
                    value = '0'
                }
                //如果输入两个小数点，去掉一个
                if (value.indexOf('.') !== value.lastIndexOf('.')) {
                    value = value.substring(0, value.lastIndexOf('.'))
                }
                //如果有小数点
                if (value.indexOf('.') >= 1 && value.indexOf('.') !== value.length - 1) {
                    if (noPreFeeName === config.NO_PREFIX_PREDICT) {
                        //预计工时，最多1位小数
                        value = value.substring(0, value.indexOf('.') + 2);
                    } else {
                        //费用项，最多2位小数
                        value = value.substring(0, value.indexOf('.') + 3);
                    }
                }
                //数字如果大于13位，第一位去掉
                if (value.length >= 13) {
                    value = value.substring(1, value.length)
                }
                this.props.dispatch({
                    type: 'projChangeApply/editCellData',
                    value: value,
                    year: v.year,
                    deptName: v.dept_name,
                    noPreFeeName: v.fee_name
                });
            }
        })
    }
    /**
     * 作者：邓广晖
     * 创建日期：2017-11-23
     * 功能：编辑表格单元格数据
     * @param e 输入事件
     * @param year 年份
     * @param deptName 部门
     * @param noPreFeeName 没有前缀的费用名
     */
    editCellData = (e, year, deptName, noPreFeeName) => {
        //先将非数值去掉
        let value = e.target.value.replace(/[^\d.]/g, '');
        //如果以小数点开头，或空，改为0
        if (value === '.') {
            value = '0'
        }
        //如果输入两个小数点，去掉一个
        if (value.indexOf('.') !== value.lastIndexOf('.')) {
            value = value.substring(0, value.lastIndexOf('.'))
        }
        //如果有小数点
        if (value.indexOf('.') >= 1 && value.indexOf('.') !== value.length - 1) {
            if (noPreFeeName === config.NO_PREFIX_PREDICT) {
                //预计工时，最多1位小数
                value = value.substring(0, value.indexOf('.') + 2);
            } else {
                //费用项，最多2位小数
                value = value.substring(0, value.indexOf('.') + 3);
            }
        }
        //最多十位数
        if(Number(value)>=10000000000){
            value = value.substring(0,10)
        }
        this.props.dispatch({
            type: 'projChangeApply/editCellData',
            value: value,
            year: year,
            deptName: deptName,
            noPreFeeName: noPreFeeName
        });
    };

    /**
     * 作者：邓广晖
     * 创建日期：2017-11-23
     * 功能：添加成本费用类型
     * @param row 表格一行数据
     */
    addCostType = (row) => {
        if ('add_type' in row && row.add_type === 'purchase') {
            if (this.props.yearListRowSpan[row.year].purchaseCostList.length === this.props.purchaseAllCostList.length) {
                message.error(config.NO_ADD_COST_TYPE);
            } else {
                this.showModal('purchaseVisible');
            }
        } else if ('add_type' in row && row.add_type === 'carryOut') {  // 实施
            if (this.props.yearListRowSpan[row.year].carryOutCostList.length === this.props.carryOutAllCostList.length) {
                message.error(config.NO_ADD_COST_TYPE);
            } else {
                this.showModal('carryOutVisible');
            }
        } else if ('add_type' in row && row.add_type === 'operate') {
            if (this.props.yearListRowSpan[row.year].operateCostList.length === this.props.operateAllCostList.length) {
                message.error(config.NO_ADD_COST_TYPE);
            } else {
                this.showModal('operateVisible');
            }
        }
        this.state.year = row.year;
    };

    /**
     * 作者：邓广晖
     * 创建日期：2017-11-23
     * 功能：删除成本费用类型
     * @param row 表格一行数据
     */
    deleteCostType = (row) => {
        this.props.dispatch({
            type: 'projChangeApply/deleteCostType',
            value: row.no_pre_fee_name,
            year: row.year
        });
    };

    /**
     * 鼠标移到选择配合部门联系人框
     */
    onSelectBox = (dept_name) => {
        let {squareTabKey, isShowTabINFullCost, tabListArr} = this.props;
        let postData = {
            arg_proj_id: this.props.queryData.arg_proj_id, // 项目id
            arg_dept_name: dept_name, // 修改主责部门需要项目uid,
        }
        if (isShowTabINFullCost === '1') {  // 有子tab
            let tabItem = tabListArr.filter(item => item.tab_name === squareTabKey)[0];
            postData.arg_tab_flag = tabItem.tab_flag; // 有tab就要传
            if (tabItem.tab_flag === '1') {
                postData.arg_pms_code = tabItem.pms_code;
            }
        }

        let infoData = request('/microservice/project/project_proj_change_query_cos_coopdept_user', postData)
        infoData.then(data => {
            if (data.RetCode === '1') {
                this.setState({
                    selectPersonList: data.DataRows,
                })
            }
        })
    }

    /**
     * 作者：邓广晖
     * 创建日期：2017-11-24
     * 功能：删除年份费用项
     * @param year 删除的年份
     */
    deleteYear = (year) => {
        let thisMe = this;
        confirm({
            title: config.DELETE_YEAR_TIP + year + '吗？',
            onOk() {
                thisMe.props.dispatch({
                    type: 'projChangeApply/deleteYear',
                    year: year
                });
            },
            onCancel() {
            },
        });
    };

    /**
     * 作者：邓广晖
     * 创建日期：2017-11-24
     * 功能：获取配合部门表格变化的数据
     */
    getCoorDeptData = () => {
        let {coorpDeptList} = this.props;
        let array_proj_dept = [];
        for (let i = 0; i < coorpDeptList.length; i++) {
            let obj = {};
            if (coorpDeptList[i].opt_type === 'insert') {
                obj.flag = 'insert';
                obj.ou = coorpDeptList[i].ou;
                obj.dept_name = coorpDeptList[i].dept_name;
                obj.mgr_name = coorpDeptList[i].mgr_name;
                obj.dept_uid = coorpDeptList[i].dept_uid;
                obj.proj_id = coorpDeptList[i].proj_id;
                obj.mgr_id = coorpDeptList[i].mgr_id; // 新加参数  配合联系人
                array_proj_dept.push(obj);
            } else if (coorpDeptList[i].opt_type === 'update') {
                obj.flag = 'update';
                obj.dept_uid = coorpDeptList[i].dept_uid;
                obj.mgr_name = coorpDeptList[i].mgr_name;
                obj.mgr_id = coorpDeptList[i].mgr_id; // 新加参数  配合联系人
                array_proj_dept.push(obj);
            } else if (coorpDeptList[i].opt_type === 'delete') {
                obj.flag = 'delete';
                obj.dept_uid = coorpDeptList[i].dept_uid;
                array_proj_dept.push(obj);
            }
        }
        return array_proj_dept;
    };

    /**
     * 作者：邓广晖
     * 创建日期：2017-11-24
     * 功能：获取部门预算表格变化的数据
     */
    getdeptBudgetData = () => {
        let {deptBudgetList} = this.props;
        let array_proj_budget = [];
        for (let j = 0; j < deptBudgetList.length; j++) {
            let obj = {};
            if (deptBudgetList[j].opt_type === 'insert') {
                obj.flag = 'insert';
                obj.budget_uid = deptBudgetList[j].budget_uid;
                obj.ou = deptBudgetList[j].ou;
                obj.dept_name = deptBudgetList[j].dept_name;
                obj.fee_type = deptBudgetList[j].fee_type;
                obj.fee_subtype = deptBudgetList[j].fee_subtype;
                obj.fee_name = deptBudgetList[j].fee_name;
                obj.fee = Number(deptBudgetList[j].fee).toString();
                obj.year = deptBudgetList[j].year;
                array_proj_budget.push(obj);
            } else if (deptBudgetList[j].opt_type === 'update') {
                obj.flag = 'update';
                obj.budget_uid = deptBudgetList[j].budget_uid;
                obj.fee = Number(deptBudgetList[j].fee).toString();
                array_proj_budget.push(obj);
            } else if (deptBudgetList[j].opt_type === 'delete') {
                obj.flag = 'delete';
                obj.budget_uid = deptBudgetList[j].budget_uid;
                array_proj_budget.push(obj);
            }
        }
        return array_proj_budget;
    };

    /**
     * 作者：邓广晖
     * 创建日期：2018-01-05
     * 功能：判断全成本是否可以保存
     * @param isTabChange tab切换的标志
     */
    judgeFullcostIsSave = (isTabChange) => {
        return '1'; // 将函数屏蔽  新需求不检测工时数
        /*const {yearListRowSpan, allDeptList, yearList} = this.props;
        if (isTabChange !== 'tabChange') {
            /!*if (JSON.stringify(yearList.sort()) !== JSON.stringify(fullCostYearList.sort())) {
                message.error('项目的预算必须在项目的时间段内，且所有年份必须有预算');
                return '0';
            }
            for (let yi = 0; yi < yearList.length; yi++) {
                //对于每一个部门
                for (let di = 0; di < allDeptList.length; di++) {
                    //每一年，每个部门的工时不能为0
                    if (Number(yearListRowSpan[yearList[yi]].predictTimeTotal[di]) === 0) {
                        message.error(yearList[yi] + '年的' + allDeptList[di].dept_name + '的预计工时不能为0');
                        return '0';
                    }
                    //每一年，每一个部门的预算和
                    let yearDeptBudgetSum = Number(yearListRowSpan[yearList[yi]].purchaseDeptTotal[di]) +
                        Number(yearListRowSpan[yearList[yi]].operateDeptTotal[di]) +
                        Number(yearListRowSpan[yearList[yi]].carryOutDeptTotal[di]) +
                        Number(yearListRowSpan[yearList[yi]].humanCostTotal[di]);
                    if (yearDeptBudgetSum === 0) {
                        message.error(yearList[yi] + '年的' + allDeptList[di].dept_name + '的预算和不能为0');
                        return '0';
                    }
                }
            }*!/

            //const { yearListRowSpan, allDeptList, yearList } = this.props;
            for (let di = 0; di < allDeptList.length; di++) {
                let deptPredictSum = 0;
                let deptBudgetSum = 0;
                for (let yi = 0; yi < yearList.length; yi++) {
                    //每一部门工时和
                    deptPredictSum += Number(yearListRowSpan[yearList[yi]].predictTimeTotal[di]);
                    //每一个部门的预算和
                    deptBudgetSum += Number(yearListRowSpan[yearList[yi]].purchaseDeptTotal[di]) +
                        Number(yearListRowSpan[yearList[yi]].operateDeptTotal[di]) +
                        Number(yearListRowSpan[yearList[yi]].carryOutDeptTotal[di]) +
                        Number(yearListRowSpan[yearList[yi]].humanCostTotal[di]);
                }
                if (deptPredictSum === 0) {
                    message.error(allDeptList[di].dept_name + '的所有工时之和不能为0');
                    return '0';
                }
                // 此条件不再需要
                /!* if (deptBudgetSum === 0) {
                   message.error(allDeptList[di].dept_name + '的所有预算之和不能为0');
                   return '0';
                 }*!/
            }
        }
        return '1';*/
    };


    /**
     * 更换配合部门联系人员  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~未完成
     * @param value select控件传回来的用户id
     */
    handleChange = (index, selectvalue) => {
        // console.log(selectvalue)
        //新增配合部门信息
        this.props.dispatch({
            type: 'projChangeApply/editCoorpMgrName',
            index: index,
            text: selectvalue
        });

    }


    render() {
        let {isShowTabINFullCost, tabListArr, squareTabKey} = this.props;
        let tabListItem = {};
        if (isShowTabINFullCost === '1') {
            tabListItem = tabListArr.filter(item => item.tab_name === squareTabKey)[0]
        } else {
            tabListItem = tabListArr[0]; // 没有多个pms时，tabListItem表示第一项 团队预算
        }
        // 全成本子tab
        let tabListDiv = []; // 子tab的各个标签div
        if (isShowTabINFullCost === '1') {
            tabListDiv = tabListArr.map((item, index) => {
                if (item.tab_flag === '0' || item.tab_flag === '2') {
                    return <div name={item.tab_name} value={item.tab_name} key={item.tab_name}/>
                } else if (item.tab_flag === '1') {
                    return <div name={`PMS${index}预算`} value={item.tab_name} key={item.tab_name}>
                        <span>PMS编码：{item.pms_code} （ {item.pms_name} ） </span>
                    </div>
                }
            })
        }
        /*// 生成配合联系人的下拉列表
        let personOption = deptPersonList.filter(item => item.is_user==='1'&&item.deptid===row.deptid).map(
          item2 => (<Option value={item2.userid}>{item2.username} </Option>)
        )*/


        let columns = [
            {
                title: '序号',
                dataIndex: '',
                render: (value, row, index) => {
                    return (index + 1);
                }
            },
            {
                title: '配合部门',
                dataIndex: 'dept_name',
                render: (value, row, index) => {
                    return <div style={{textAlign: 'left'}}>{value + row.NewOldFlag}</div>
                }
            },
            {
                title: '配合方联系人',
                dataIndex: 'mgr_name',
                render: (value, row, index) => {
                    let {selectPersonList} = this.state;
                    let showValue = '';
                    // 在合计时，联系人字段叫mgr
                    if ('tab_flag' in tabListItem && tabListItem.tab_flag === '2') {
                        showValue = row.mgr;
                    } else {
                        showValue = `${value}(${row.mgr_id})`
                    }

                    if (this.props.projChangeCheckFlag === '1' ||
                        ('tab_flag' in tabListItem && tabListItem.tab_flag === '2')) {
                        return showValue;
                    } else {
                        let selectValue ='';
                        // 有列表选项时，显示id自动匹配选项
                        if (selectPersonList.some(item =>item.userid===row.mgr_id)){
                            selectValue=row.mgr_id;
                        }else{ // 没选项时拼接显示数据
                            selectValue = `${value}(${row.mgr_id})`;
                        }
                        return (
                            <div>
                                <Select showSearch
                                        optionFilterProp="children"
                                        disabled={squareTabKey === '合计预算'}
                                        value={selectValue} style={{width: 180}}
                                        onFocus={() => this.onSelectBox(row.dept_name)}
                                        onChange={(selectvalue) => this.handleChange(index, selectvalue)}>
                                    {selectPersonList ? selectPersonList.map(
                                        item2 => (<Option value={item2.userid}
                                                          key={item2.userid}>{`${item2.username}(${item2.userid})`} </Option>)
                                    ) : ''}
                                </Select>
                            </div>

                        );
                    }
                }
            },
            {
                title: <div>{this.props.projChangeCheckFlag === '1' || squareTabKey === '合计预算' ?
                    <Icon type="plus-circle-o" className={styles.addIconBig}
                          style={{color: 'grey', cursor: 'default'}}/>
                    :
                    <Icon type="plus-circle-o" className={styles.addIconBig}
                          onClick={(e) => this.willGetDeptPerson()}/>
                }</div>,
                dataIndex: 'ts_handle',
                render: (value, row, index) => {
                    if (this.props.projChangeCheckFlag === '1' || row.NewOldFlag === "（旧）" || squareTabKey === '合计预算') {
                        return (<Button type="primary" disabled={true}><a>删除</a></Button>);
                    } else {
                        return (
                            <Button type="primary" onClick={() => this.deleteCoorpDept(row.key)}><a>删除</a></Button>);
                    }

                }
            }
        ];


        // 全成本预算表格的样式
        let budgetColumns = [
            {
                title: <div>{this.props.projChangeCheckFlag === '1' || squareTabKey === '合计预算' ?
                    <Icon type="plus-circle-o" className={styles.addIconBig}
                          style={{color: 'grey', cursor: 'default'}}/>
                    :
                    <Icon type="plus-circle-o" className={styles.addIconBig} onClick={this.showYearModal}/>
                }
                </div>,
                dataIndex: 'year',
                fixed: 'left',
                width: 100,
                render: (value, row, index) => {
                    if ('yearOptType' in row && row.yearOptType === 'total') {
                        return value;
                    } else {
                        return {
                            children: <div>
                                <span>{value}</span>
                                {this.props.projChangeCheckFlag === '1' || squareTabKey === '合计预算' ?
                                    <Icon type="delete"
                                          className={styles.deleteIcon}
                                          style={{color: 'grey', cursor: 'default'}}/>
                                    :
                                    <Icon type="delete"
                                          className={styles.deleteIcon}
                                          onClick={() => this.deleteYear(row.year)}/>
                                }

                            </div>,
                            props: {rowSpan: row.yearRowSpan},
                        };
                    }
                },
            },
            {
                title: '费用类别',
                dataIndex: 'fee_name',
                fixed: 'left',
                width: 380,
                render: (value, row, index) => {
                    if (squareTabKey === '合计预算') {
                        return <div style={{textAlign: 'left', paddingLeft: row.padLeft}}>{value}</div>
                    } else if ('can_add' in row && row.can_add === 'can_add') {
                        return (<div style={{textAlign: 'left', paddingLeft: row.padLeft}}>
                            <span>{value}</span>
                            {this.props.projChangeCheckFlag === '1' ?
                                <Icon type="plus-circle-o"
                                      className={styles.costAdd}
                                      style={{color: 'grey', cursor: 'default'}}/>
                                :
                                <Icon type="plus-circle-o" className={styles.costAdd}
                                      onClick={() => this.addCostType(row)}/>
                            }

                        </div>);
                    } else if (row.feeNameLevel === '3') { // 第三级
                        if ('fee_class' in row && row.fee_class === '1') { //feeclass等于1,不能编辑
                            return <div style={{textAlign: 'left', paddingLeft: row.padLeft}}>{value}</div>;
                        } else {
                            return (<div style={{textAlign: 'left', paddingLeft: row.padLeft}}>{value}
                                {

                                    this.props.projChangeCheckFlag === '1' || ('not_edit' in row && row.not_edit === 'not_edit') ?
                                        <Icon type="delete"
                                              className={styles.deleteIcon}
                                              style={{color: 'grey', cursor: 'default'}}/>
                                        :
                                        <Icon type="delete"
                                              className={styles.deleteIcon}
                                              onClick={() => this.deleteCostType(row)}/>
                                }
                            </div>);
                        }

                    } else {
                        return <div style={{textAlign: 'left', paddingLeft: row.padLeft}}>{value}</div>;
                    }
                },
            },
        ];
        for (let i = 0; i < this.props.allDeptList.length; i++) {
            budgetColumns.push({
                title: this.props.allDeptList[i].dept_name + this.props.allDeptList[i].NewOldFlag,
                dataIndex: 'dept' + i.toString(),
                render: (value, row, index) => {
                    if (this.props.projChangeCheckFlag === '1' || squareTabKey === '合计预算') {
                        return <div style={{textAlign: 'right'}}>{change2Thousands(value)}</div>;
                    } else {
                        if ('not_edit' in row && row.not_edit === 'not_edit') {
                            return (<Input value={change2Thousands(value)} disabled={true}/>);
                        } else if (('not_input' in row && row.not_input === 'not_input') || ('fee_class' in row && row.fee_class === '1')) {
                            return (<div style={{textAlign: 'left', paddingLeft: 7}}>{change2Thousands(value)}</div>);
                        } else {
                            if( row.fee_name == "1.预计工时（人月）") {
                                return (<Input value={value}
                                    disabled={false}
                                    onChange={(e) => this.newEditCellData(e, row.year, this.props.allDeptList[i].dept_name, row.no_pre_fee_name,this.setParameter(this.props.allDeptList[i].dept_name))}/>);
                            } 
                            // else if (row.no_pre_fee_name == "办公费" || row.no_pre_fee_name == "通信费" || row.no_pre_fee_name == "车辆使用费" || row.no_pre_fee_name == "   项目人工成本（元）") {
                            //     return (<Input value={value}
                            //         disabled={true}
                            //         onChange={(e) => this.editCellData(e, row.year, this.props.allDeptList[i].dept_name, row.no_pre_fee_name)}/>);
                            // }
                            else {
                                return (<Input value={value}
                                    disabled={false}
                                    onChange={(e) => this.editCellData(e, row.year, this.props.allDeptList[i].dept_name, row.no_pre_fee_name)}
                                    />);
                            }
                            // return (<Input value={value}
                            //                disabled={false}
                            //                onChange={(e) => this.editCellData(e, row.year, this.props.allDeptList[i].dept_name, row.no_pre_fee_name)}/>);
                        }
                    }
                },
            });
        }
        budgetColumns.push({
            title: '小计',
            dataIndex: 'total',
            fixed: 'right',
            width: config.FULLCOST_TOTAL,
            render: (value, row, index) => {
                //如果是预算项，保留千分位，并且为两位小数
                if (row.feeType === '1') {
                    return (<div style={{textAlign: 'right'}}>{change2Thousands(value)}</div>);
                } else {
                    return (<div style={{textAlign: 'right'}}>{value}</div>);
                }
            }
        });
        const purchaseList = this.props.purchaseAllCostList.map((item) => {
            return (<Option key={item.fee_name}>{item.fee_name}</Option>)
        });
        const operateList = this.props.operateAllCostList.map((item) => {
            return (<Option key={item.fee_name}>{item.fee_name}</Option>)
        });
        const carryOutList = this.props.carryOutAllCostList.map((item) => {
            return (<Option key={item.fee_name}>{item.fee_name}</Option>)
        });
        const fullCostYearList = this.props.fullCostYearList.map((item) => {
            return (<Option key={item}>{item}</Option>)
        });

        // 拼接获取部门联系人的列表-------start
        let getPersonListPostData = {};
        getPersonListPostData.arg_proj_id = this.props.queryData.arg_proj_id;
        getPersonListPostData.arg_tenantid = Cookie.get('tenantid');

        if (isShowTabINFullCost === '1') {  // 有子tab
            let tabItem = tabListArr.filter(item => item.tab_name === squareTabKey)[0];
            getPersonListPostData.arg_tab_flag = tabItem.tab_flag; // 有tab就要传
            if (tabItem.tab_flag === '1') {
                getPersonListPostData.arg_pms_code = tabItem.pms_code;
            }
        }
        // 拼接获取部门联系人的列表-------end


        return (
            <div >
                {
                    isShowTabINFullCost === '0' ? ''
                        :
                        <SquareTab
                            activeKey={this.props.squareTabKey}
                            onTabsClick={this.childTabChangeClick}
                        >
                            {tabListDiv}
                        </SquareTab>
                }
                {/*切换子tab的弹窗*/}
                <ChildTabChangeModal
                    ref='ChildTabChangeModal'
                    directChildTabChangeClick={(key, flag) => this.directChildTabChangeClick(key, flag)}
                    saveOrSubmitCostBudget={(optName, isTab, nextTab, childTab) => this.props.saveOrSubmitCostBudget(optName, isTab, nextTab, childTab)}
                />


                <div style={{marginTop: '10px'}}>
                    <div className={styles.predictTime}>
                        <span>{config.PREDICT_TIME_TOTAL}</span><span>{this.props.predictTimeTotal}</span>{'人月'}</div>
                    <h2 className={styles.headerName}>{config.COORP_DEPT_INFO}</h2>
                    <Table columns={columns}
                           dataSource={this.props.coorpDeptList.filter(item => item.opt_type !== 'delete')}
                           pagination={false}
                           className={styles.fcTable + ' ' + styles.deptsTable}
                    />
                    {/*添加配合部门的模态框*/}
                    <Modal visible={this.props.deptModalShow}
                           key={getuuid(20, 62)}
                           style={{top: 20}}
                           width={'500px'}
                           title={'选择配合方联系人'}
                           onOk={() => this.hideDeptModal('confirm')}
                           onCancel={() => this.hideDeptModal('cancel')}
                    >
                        <div>
                            {/*<AssignDept flag={true} ref='assignDeptComp' defaultDept={this.props.coorpDeptList}/>*/}
                            <SelectCoopDeptPerson
                                ref='assignDeptComp'
                                // deptPersonList={deptPersonList}
                                postData={getPersonListPostData}
                                searchUrl={'/microservice/project/project_proj_change_query_cos_coopdept'}
                            />
                        </div>
                    </Modal>
                    {/*添加配合方联系人的模态框*/}
                    <Modal visible={this.state.deptPersonModalVisible}
                           key={getuuid(20, 62)}
                           width={config.DEPT_MODAL_WIDTH}
                           title={config.SELECT_DEPT}
                           onOk={() => this.hideDeptPersonModal('confirm')}
                           onCancel={() => this.hideDeptPersonModal('cancel')}
                    >
                        <div>
                            选择配合方联系人
                        </div>
                    </Modal>

                    <br/>
                    <h2 className={styles.headerName}>{config.DEPT_BUDGET_INFO}</h2>
                    <Table columns={budgetColumns}
                           dataSource={this.props.deptBudgetTableData}
                           pagination={false}
                           loading={this.props.loading}
                           className={styles.fcTable + ' ' + styles.deptsTable}
                           scroll={{x: 300 * this.props.allDeptList.length}}
                    />

                    {/*添加项目采购成本类型的模态框*/}
                    <Modal
                        title={config.NO_PREFIX_PURCHASE_COST}
                        key={getuuid(20, 62)}
                        visible={this.state.purchaseVisible}
                        onOk={() => this.hidePurchaseModal('confirm')}
                        onCancel={() => this.hidePurchaseModal('cancel')}
                    >
                        <Select onSelect={(value) => this.changeSelectValue(value, 'purchaseValue')}
                                style={{width: 300, marginLeft: '20%'}}>
                            {purchaseList}
                        </Select>
                    </Modal>

                    {/*添加项目运行成本类型的模态框*/}
                    <Modal
                        title={config.NO_PREFIX_OPERATE_COST}
                        key={getuuid(20, 62)}
                        visible={this.state.operateVisible}
                        onOk={() => this.hideOperateModal('confirm')}
                        onCancel={() => this.hideOperateModal('cancel')}
                    >
                        <Select onSelect={(value) => this.changeSelectValue(value, 'operateValue')}
                                style={{width: 200, marginLeft: '30%'}}>
                            {operateList}
                        </Select>
                    </Modal>
                    {/*添加项目实施成本类型的模态框*/}
                    <Modal
                        title={config.NO_PREFIX_CARRYOUT_COST}
                        key={getuuid(20, 62)}
                        visible={this.state.carryOutVisible}
                        onOk={() => this.hideCarryOutModal('confirm')}
                        onCancel={() => this.hideCarryOutModal('cancel')}
                    >
                        <Select onSelect={(value) => this.changeSelectValue(value, 'carryOutValue')}
                                style={{width: 200, marginLeft: '30%'}}>
                            {carryOutList}
                        </Select>
                    </Modal>

                    {/*添加年份的模态框*/}
                    <Modal
                        title={config.SELECT_YEAR}
                        key={getuuid(20, 62)}
                        visible={this.state.yearVisible}
                        onOk={() => this.hideYearModal('confirm')}
                        onCancel={() => this.hideYearModal('cancel')}
                    >
                        <Select onSelect={(value) => this.changeSelectValue(value, 'yearValue')}
                                style={{width: 150, marginLeft: '35%'}}>
                            {fullCostYearList}
                        </Select>
                    </Modal>
                </div>
            </div>

        );
    }
}

export default ProjChangeFullCost;
