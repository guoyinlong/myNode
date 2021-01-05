/**
 * 作者：邓广晖
 * 创建日期：2018-01-03
 * 邮件：denggh6@chinaunicom.cn
 * 文件说明：实现项目启动里面的全成本功能
 */
import {Modal, Table, Icon, Button, Input, Select, message} from 'antd';
import AssignDept from '../../../../components/commonApp/assignDept.js';
import styles from './projStartFullCost.less';
import config from '../../../../utils/config';
import request from '../../../../utils/request';
import Cookie from 'js-cookie';
import {getuuid, isInArray} from '../../projConst.js';
import SquareTab from '../../monitor/change/projChangeApply/squareTab';
import TabChangeModal from './tabChangeModal';

import SelectCoopDeptPerson from '../../monitor/change/projChangeApply/selectCoopDeptPerson'
import { number } from 'echarts/lib/export';

const Option = Select.Option;
const confirm = Modal.confirm;

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
 * 创建日期：2018-01-03
 * 功能：实现项目启动全程本
 */
class ProjStartFullCost extends React.PureComponent {

    state = {
        deptModalVisible: false,
        purchaseVisible: false,
        purchaseValue: '',
        operateVisible: false,
        operateValue: '',
        carryOutVisible: false,
        carryOutValue: '',
        year: '', /*点击表格行时确定的年份*/
        yearVisible: false,
        yearValue: '', /*下拉框中的年份*/
        fullCostPmsNextTabValue: '',          //用来缓存点击全成本的 PMS的tab时的 值
        deptPersonList: []                    //部门的人员列表, 每次下拉是刷新此值
    };

    /**
     * 作者：邓广晖
     * 创建日期：2018-01-05
     * 功能：模态框显示
     * @param type 模态框类型
     */
    showModal = (type) => {
        this.setState({[type]: true})
    };

    /**
     * 作者：邓广晖
     * 创建日期：2018-01-05
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
     * 创建日期：2018-01-05
     * 功能：选择部门模态框关闭
     * @param flag 关闭模态框时的标志，为confirm，cancel
     */
    hideDeptModal = (flag) => {
        if (flag === 'confirm') {
            let deptSelectData = this.refs.startSelectCoorpDeptPerson.getData();
            //新增配合部门信息
            this.props.dispatch({
                type: 'projectInfo/addCoorpDept',
                deptSelectData: deptSelectData
            });
        }
        this.setState({deptModalVisible: false});
    };

    /**
     * 作者：邓广晖
     * 创建日期：2018-01-05
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
                    type: 'projectInfo/addCostType',
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
                    type: 'projectInfo/addCostType',
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
     * 创建日期：2018-01-05
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
                    type: 'projectInfo/addCostType',
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
     * 创建日期：2018-01-05
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
     * 创建日期：2018-01-05
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
                    type: 'projectInfo/addYear',
                    year: this.state.yearValue
                });
            }
        }
        this.setState({yearVisible: false});
        this.initSelectData();
    };

    /**
     * 作者：邓广晖
     * 创建日期：2018-01-05
     * 功能：删除一个配合部门
     * @param index 配合部门的索引值
     */
    deleteCoorpDept = (index) => {
        this.props.dispatch({
            type: 'projectInfo/deleteCoorpDept',
            index: index
        });
    };

    /**
     * 作者：邓广晖
     * 创建日期：2018-01-05
     * 功能：编辑配合部门联系人
     * @param selectValue 选中的值
     * @param index 配合部门的索引值
     */
    editCoorpMgrName = (selectValue, index) => {
        let { deptPersonList } = this.state;
        let findDeptPerson = deptPersonList.find(item => item.userid === selectValue);
        this.props.dispatch({
            type: 'projectInfo/editCoorpMgrName',
            index: index,
            selectPerson: findDeptPerson
        });
    };

    /**
     * 作者：邓广晖
     * 创建日期：2018-01-05
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
        //数字如果大于13位，第一位去掉
        if (value.length >= 13) {
            value = value.substring(1, value.length)
        }
        this.props.dispatch({
            type: 'projectInfo/editCellData',
            value: value,
            year: year,
            deptName: deptName,
            noPreFeeName: noPreFeeName
        });
    };
    // editCellData1 = (value,year,deptName,noPreFeeName) => {
    //     //如果以小数点开头，或空，改为0
    //     if (value === '.') {
    //         value = '0'
    //     }
    //     //如果输入两个小数点，去掉一个
    //     if (value.indexOf('.') !== value.lastIndexOf('.')) {
    //         value = value.substring(0, value.lastIndexOf('.'))
    //     }
    //     //如果有小数点
    //     if (value.indexOf('.') >= 1 && value.indexOf('.') !== value.length - 1) {
    //         if (noPreFeeName === config.NO_PREFIX_PREDICT) {
    //             //预计工时，最多1位小数
    //             value = value.substring(0, value.indexOf('.') + 2);
    //         } else {
    //             //费用项，最多2位小数
    //             value = value.substring(0, value.indexOf('.') + 3);
    //         }
    //     }
    //     //数字如果大于13位，第一位去掉
    //     if (value.length >= 13) {
    //         value = value.substring(1, value.length)
    //     }
    //     this.props.dispatch({
    //         type: 'projectInfo/editCellData',
    //         value: value,
    //         year: year,
    //         deptName: deptName,
    //         noPreFeeName: noPreFeeName
    //     });
    // }
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
                    type: 'projectInfo/editCellData',
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
     * 创建日期：2018-01-05
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
        } else if ('add_type' in row && row.add_type === 'carryOut') {
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
     * 创建日期：2018-01-05
     * 功能：删除成本费用类型
     * @param row 表格一行数据
     */
    deleteCostType = (row) => {
        this.props.dispatch({
            type: 'projectInfo/deleteCostType',
            value: row.no_pre_fee_name,
            year: row.year
        });
    };

    /**
     * 作者：邓广晖
     * 创建日期：2018-01-05
     * 功能：删除年份费用项
     * @param year 删除的年份
     */
    deleteYear = (year) => {
        let thisMe = this;
        confirm({
            title: config.DELETE_YEAR_TIP + year + '吗？',
            onOk() {
                thisMe.props.dispatch({
                    type: 'projectInfo/deleteYear',
                    year: year
                });
            },
            onCancel() {
            },
        });
    };

    /**
     * 作者：邓广晖
     * 创建日期：2018-01-05
     * 功能：获取配合部门表格变化的数据
     */
    getCoorDeptData = () => {
        let { coorpDeptList, fullCostPmsTab } = this.props;
        let array_proj_dept = [];
        for (let i = 0; i < coorpDeptList.length; i++) {
            if (coorpDeptList[i].opt_type !== 'search') {
                let obj = {};
                // 新增，修改，删除 共用部门
                obj.dept_uid = coorpDeptList[i].dept_uid;
                obj.proj_uid = coorpDeptList[i].proj_uid;
                obj.ou = coorpDeptList[i].ou;
                obj.dept_name = coorpDeptList[i].dept_name;
                obj.mgr_name = coorpDeptList[i].mgr_name;
                obj.mgr_id = coorpDeptList[i].mgr_id;
                obj.pms_uid = fullCostPmsTab.pms_uid;
                obj.tab_flag = fullCostPmsTab.tab_flag;

                //不同部门,flag不同，dept_form_id 只有在修改和删除时传
                if (coorpDeptList[i].opt_type === 'insert') {
                    obj.flag = 'insert';
                } else if (coorpDeptList[i].opt_type === 'update') {
                    obj.flag = 'update';
                    obj.dept_form_id = coorpDeptList[i].dept_form_id;
                } else if (coorpDeptList[i].opt_type === 'delete') {
                    obj.flag = 'delete';
                    obj.dept_form_id = coorpDeptList[i].dept_form_id;
                }
                array_proj_dept.push(obj);
            }
        }
        return array_proj_dept;
    };

    /**
     * 作者：邓广晖
     * 创建日期：2018-01-05
     * 功能：获取部门预算表格变化的数据
     */
    getdeptBudgetData = () => {
        let { deptBudgetList, fullCostPmsTab } = this.props;
        let array_proj_budget = [];
        for (let j = 0; j < deptBudgetList.length; j++) {
            if (deptBudgetList[j].opt_type !== 'search') {
                let obj = {};
                // 新增，修改，删除 共用部门
                obj.budget_uid = deptBudgetList[j].budget_uid;
                obj.proj_uid = deptBudgetList[j].proj_uid;
                obj.ou = deptBudgetList[j].ou;
                obj.dept_name = deptBudgetList[j].dept_name;
                obj.fee_type = deptBudgetList[j].fee_type;
                obj.fee_subtype = deptBudgetList[j].fee_subtype;
                obj.fee_name = deptBudgetList[j].fee_name;
                obj.fee = Number(deptBudgetList[j].fee).toString();
                obj.year = deptBudgetList[j].year;
                obj.pms_uid = fullCostPmsTab.pms_uid;
                obj.tab_flag = fullCostPmsTab.tab_flag;

                //不同部门,flag不同，dept_form_id 只有在修改和删除时传
                if (deptBudgetList[j].opt_type === 'insert') {
                    obj.flag = 'insert';
                } else if (deptBudgetList[j].opt_type === 'update') {
                    obj.flag = 'update';
                    obj.budget_form_id = deptBudgetList[j].budget_form_id;
                } else if (deptBudgetList[j].opt_type === 'delete') {
                    obj.flag = 'delete';
                    obj.budget_form_id = deptBudgetList[j].budget_form_id;
                }
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
        /*const {yearListRowSpan, allDeptList, yearList, fullCostYearList} = this.props;
        if (isTabChange !== 'tabChange') {
            if (JSON.stringify(yearList.sort()) !== JSON.stringify(fullCostYearList.sort())) {
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
            }
        }*/
        return '1';
    };

    /**
     * 作者：邓广晖
     * 创建日期：2018-12-04
     * 功能：全成本tab中点击PMS
     * @param value 点中的tab的value
     */
    tabChangeClick = (value) => {
        this.setState({
            fullCostPmsNextTabValue: value
        });
        //如果是在  合计预算 里面， 直接切换，不管是上面的tab，还是下面的tab
        if (this.props.fullCostPmsTab.tab_flag === '2') {
            if (value !== this.props.fullCostPmsTab.tabConvertName) {
                this.props.dispatch({
                    type:'projectInfo/fullCostPmsTabClickDirectSwitch',
                    nextPmsTabValue: value
                });
            }
        } else {
            //如果不是在  合计预算，
            if (value !== this.props.fullCostPmsTab.tabConvertName) {
                const array_proj_dept = this.getCoorDeptData();
                const array_proj_budget = this.getdeptBudgetData();
                const fullcostIsSave = this.judgeFullcostIsSave('tabChange');
                if (fullcostIsSave === '1') {
                    if ( array_proj_dept.length === 0  && array_proj_budget.length === 0) {
                        this.props.dispatch({
                            type:'projectInfo/fullCostPmsTabClickDirectSwitch',
                            nextPmsTabValue: value
                        });
                    } else {
                        this.refs.fullcostChangeModal.showModal('t3','t3');
                    }
                } else {
                    this.props.dispatch({
                        type:'projectInfo/fullCostPmsTabClickDirectSwitch',
                        nextPmsTabValue: value
                    });
                }
            }
        }
    };

    /**
     * 作者：邓广晖
     * 创建日期：2018-12-07
     * 功能：点击下拉是，获取配合部门人员信息
     * @param record 表格一行记录
     */
    getDeptUserData = (record) => {
        let postData = {
            arg_tenantid: Cookie.get('tenantid'),
            arg_proj_uid: this.props.projNewUid,
            arg_dept_name: record.dept_name,
            arg_tab_flag: this.props.fullCostPmsTab.tab_flag,
            arg_pms_code: this.props.fullCostPmsTab.pms_code
        };
        let oudata = request('/microservice/project/project_proj_start_add_cos_query_coopdept_user',postData);
        oudata.then((data)=> {
            if (data.RetCode === '1') {
                this.setState({
                    deptPersonList: [...data.DataRows]
                });
            }
        })
    };

    /**
     * 作者：邓广晖
     * 创建日期：2018-12-07
     * 功能：离开焦点时，清空配合部门人员信息
     */
    clearDeptUserData = () => {
        this.setState({
            deptPersonList: []
        });
    };

    //生成联动传递的参数
    setParameter = (deptName) => {
        let realDeptName = "";
        if(!!deptName) {
            realDeptName =  deptName.split("-")[0] == "联通软件研究院" ? "联通软件研究院本部" : deptName.split("-")[0];
        }
        const {oubudgetList, deptBudgetTableData,allDeptList} = this.props;
        let arr = [];
        let yearList = [];
        oubudgetList.forEach((v) =>{ 
            if(!yearList.includes(v.year)) {
                yearList.push(v.year)
            }
        })
        //求出距离指定年份最近的一年
        let priorityMatching = (year,value) => {
            if(!!Number(year)) {
                let arr1 = yearList.map((v,) => {
                    return Math.abs(v-year)
                })
                arr1.sort((a,b) => {return a-b})
                if(Number(year)-Number(arr1[0]) == value) {
                    return  year
                }
            }
        }
        for(let j = 0; j < allDeptList.length; j++) {
            for(let i = 0; i < deptBudgetTableData.length; i++) {
                let obj = {}
                oubudgetList.forEach((value) => {
                    if(value.ou_name == allDeptList[j].ou && 
                        value.ou_name == realDeptName &&
                        // value.year == deptBudgetTableData[i].year &&
                        deptBudgetTableData[i].year &&
                        priorityMatching(deptBudgetTableData[i].year,value.year) == deptBudgetTableData[i].year &&
                        deptBudgetTableData[i].no_pre_fee_name &&
                        deptBudgetTableData[i].no_pre_fee_name != "差旅费" &&
                        deptBudgetTableData[i].no_pre_fee_name != "差旅费_资本化" &&
                        deptBudgetTableData[i].no_pre_fee_name != "项目实施成本" && 
                        (deptBudgetTableData[i].no_pre_fee_name == value.ou_sort_name || 
                        deptBudgetTableData[i].no_pre_fee_name.split("（")[0].trim() == value.ou_sort_name.trim())) 
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
    render() {
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
                    return (<div style={{textAlign: 'left'}}>{value}</div>);
                }
            },
            {
                title: '配合方联系人',
                dataIndex: 'mgr_name',
                render: (value, row, index) => {
                    // 在合计预算里面，配合方联系人可能返回多个，用 mgr 代表多个人
                    if (this.props.fullCostPmsTab.tab_flag === '2') {
                        return (<div style={{textAlign: 'left'}}>{row.mgr}</div>);
                    } else {
                        let { deptPersonList } = this.state;
                        let showValue = row.mgr_id;
                        if (deptPersonList.some(item=>item.userid === row.mgr_id) === false) {
                            showValue = row.mgr_name + '(' + row.mgr_id + ')'
                        }
                        return (
                            <div>
                                <Select
                                    showSearch
                                    optionFilterProp="children"
                                    value={showValue}
                                    style={{ width: 180 }}
                                    onFocus={()=>this.getDeptUserData(row)}
                                    onBlur={this.clearDeptUserData}
                                    onSelect={(selectValue)=>this.editCoorpMgrName(selectValue,row.key)}
                                >
                                    {
                                        deptPersonList.map((item)=>{
                                            return (
                                                <Option value={item.userid} key={item.userid}>
                                                    {item.username + '(' + item.userid + ')'}
                                                </Option>
                                            )
                                        })
                                    }

                                </Select>
                            </div>
                        );
                    }

                    //return (<Input value={value} onChange={(e) => this.editCoorpMgrName(e, row.key)}/>);
                }
            },
        ];
        if (this.props.fullCostPmsTab.tab_flag !== '2') {
            columns.push(
                {
                    title: <Icon type="plus-circle-o" className={styles.addIconBig}
                                 onClick={() => this.showModal('deptModalVisible')}/>,
                    dataIndex: 'ts_handle',
                    render: (value, row, index) => {
                        return (<Button type="primary" onClick={() => this.deleteCoorpDept(row.key)}><a>删除</a></Button>);
                    }
                }
            );
        }

        let budgetColumns = [
            {
                title: this.props.fullCostPmsTab.tab_flag !== '2'
                        ?
                        <Icon type="plus-circle-o" className={styles.addIconBig} onClick={this.showYearModal}/>
                        :
                        '年度',
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
                                {
                                    this.props.fullCostPmsTab.tab_flag !== '2'
                                        ?
                                        <Icon type="delete"
                                              className={styles.deleteIcon}
                                              onClick={() => this.deleteYear(row.year)}
                                        />
                                        :
                                        null
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
                    if ('can_add' in row && row.can_add === 'can_add' && this.props.fullCostPmsTab.tab_flag !== '2') {
                        return (<div style={{textAlign: 'left', paddingLeft: row.padLeft}}>
                            <span>{value}</span>
                            <Icon type="plus-circle-o" className={styles.costAdd}
                                  onClick={() => this.addCostType(row)}/>
                        </div>);
                    } else if (row.feeNameLevel === '3' && row.fee_class !== '1' && this.props.fullCostPmsTab.tab_flag !== '2') {
                        if(row.no_pre_fee_name == "车辆使用费" ||  row.no_pre_fee_name == "通信费" || row.no_pre_fee_name == "办公费") {
                            return <div style={{textAlign: 'left', paddingLeft: row.padLeft}}>{value}</div>;
                        } else {
                            return (<div style={{textAlign: 'left', paddingLeft: row.padLeft}}>{value}
                            <Icon type="delete"
                                  className={styles.deleteIcon}
                                  onClick={() => this.deleteCostType(row)}/>

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
                title: this.props.allDeptList[i].dept_name,
                dataIndex: 'dept' + i.toString(),
                render: (value, row, index) => {
                    if (this.props.fullCostPmsTab.tab_flag === '2') {
                        return (<div style={{textAlign: 'right'}}>{change2Thousands(value)}</div>);
                    } else {
                        if ('not_edit' in row && row.not_edit === 'not_edit') {
                            return (<Input value={change2Thousands(value)} disabled={true}/>);
                        } else if ('not_input' in row && row.not_input === 'not_input') {
                            return (<div style={{textAlign: 'left', paddingLeft: 7}}>{change2Thousands(value)}</div>);
                        } else {
                            if( row.fee_name == "1.预计工时（人月）") {
                                return (<Input value={value}
                                    disabled={false}
                                    onChange={(e) => this.newEditCellData(e, row.year, this.props.allDeptList[i].dept_name, row.no_pre_fee_name,this.setParameter(this.props.allDeptList[i].dept_name))}/>);
                            } 
                            // else if (row.no_pre_fee_name == "办公费" || row.no_pre_fee_name == "通信费" || row.no_pre_fee_name == "车辆使用费" || row.no_pre_fee_name == "   项目人工成本（元）") {
                            //     return (<Input value={value}
                            //         // disabled={true}
                            //         onChange={(e) => this.editCellData(e, row.year, this.props.allDeptList[i].dept_name, row.no_pre_fee_name)}/>);
                            // }
                            else {
                                return (<Input value={value}
                                    // disabled={true}
                                    onChange={(e) => this.editCellData(e, row.year, this.props.allDeptList[i].dept_name, row.no_pre_fee_name)}/>);
                            }
                            // return (<Input value={value}
                            //                disabled={false}
                            //             //    disabled={true}
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
        const pmsTabsList = this.props.fullCostPmsListData.map((item,index)=>{
            let pmsInfo = '';
            if (item.tab_flag === '1') {
                pmsInfo = 'PMS编码 : ' + item.pms_code + ' （ ' + item.pms_name + ' ）';
            }
            return (
                <div name={item.tabConvertName} value={item.tabConvertName} key={index}>
                    <span>{pmsInfo}</span>
                </div>
            )
        });
        return (
            <div>
                {/*
                this.state.fullCostPmsNextTabValue  : 点击的下一个 全成本的 Pms的 tab

                directTabChangeClick
                t3: 当前大tab      flag: 模态框的操作标志，confirm close cancel    1： 是否是全成本的 Pms的tab

                saveOrSubmitCostBudget
                optName: 保存还是提交，isTab: 是否是大tab,  t3: 即将跳转的下一个tab， 1： 是否是全成本的 Pms的tab
                */}
                <TabChangeModal
                    ref='fullcostChangeModal'
                    directTabChangeClick={(key,flag)=>this.props.directTabChangeClick('t3',flag,'1',this.state.fullCostPmsNextTabValue)}
                    saveOrSubmitCostBudget={
                        (optName,isTab)=>this.props.saveOrSubmitCostBudget(
                            optName,
                            isTab,
                            't3',
                            '1',
                            this.state.fullCostPmsNextTabValue
                        )
                    }
                />
                {
                    this.props.fullCostShowPmsTab === '1'
                        ?
                        <SquareTab
                            activeKey={this.props.fullCostPmsTab.tabConvertName}
                            onTabsClick={this.tabChangeClick}
                        >
                            {pmsTabsList}
                        </SquareTab>
                        :
                        ''
                }
                <div className={styles.predictTime}>
                    <span>{config.PREDICT_TIME_TOTAL}</span><span>{this.props.predictTimeTotal}</span>{'人月'}
                </div>
                <h2 className={styles.headerName}>{config.COORP_DEPT_INFO}</h2>
                <Table columns={columns}
                       dataSource={this.props.coorpDeptList.filter(item => item.opt_type !== 'delete')}
                       pagination={false}
                       className={styles.fcTable + ' ' + styles.deptsTable}
                />
                {/*添加配合部门的模态框*/}
                <Modal visible={this.state.deptModalVisible}
                       key={getuuid(20, 62)}
                       width={'500px'}
                       title={'选择配合方联系人'}
                       onOk={() => this.hideDeptModal('confirm')}
                       onCancel={() => this.hideDeptModal('cancel')}
                >
                    <div>
                        <SelectCoopDeptPerson
                            ref='startSelectCoorpDeptPerson'
                            searchUrl='/microservice/project/project_proj_start_add_cos_query_coopdept'
                            postData={
                                {
                                    arg_tenantid: Cookie.get('tenantid'),
                                    arg_proj_uid: this.props.projNewUid,
                                    arg_tab_flag: this.props.fullCostPmsTab.tab_flag,
                                    arg_pms_code: this.props.fullCostPmsTab.pms_code
                                }
                            }
                        />
                        {/*<AssignDept flag={true} ref='assignDeptComp' defaultDept={this.props.coorpDeptList}/>*/}
                    </div>
                </Modal>

                <br/>
                <h2 className={styles.headerName}>{config.DEPT_BUDGET_INFO}</h2>
                <Table columns={budgetColumns}
                       dataSource={this.props.deptBudgetTableData}
                       pagination={false}
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
        );
    }
}

export default ProjStartFullCost;
