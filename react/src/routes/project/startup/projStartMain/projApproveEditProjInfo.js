/**
 *  作者: 胡月
 *  创建日期: 2017-9-11
 *  邮箱：huy61@chinaunicom.cn
 *  文件说明：实现项目启动填写基本信息、验证基本信息的功能
 */
import React from 'react';
import {
    Row, Col, Form, Icon, Input, Button,
    DatePicker, Select, Modal, Tooltip,
    message, Popconfirm
} from 'antd';

import config from '../../../../utils/config';
import styles from './../projStartUp.less';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
import Cookie from 'js-cookie';

import {
    projLabelText,
    projCodeText,
    setFieldItemData,
    getBasicInfoChangeData,
    changeBr2RN,
    pmsStageList,
    numToCh,
    CHECK_INFO_RULE
} from '../../projConst.js';

import {getUuid} from '../../../../components/commonApp/commonAppConst.js';
//import DeptRadioGroup from '../../../../components/common/deptRadio.js';
//import MgrRadioGroup from '../../../../components/common/mgrRadio.js';
import MgrRadioGroup from '../../mgrRadioHasLimit';
import LimitDeptRadio from '../../../../components/common/limitDeptRadio';
import FourDeptThreeCenter from '../../../../components/common/fourDeptThreeCenter';
import GoBackModal from '../projAdd/goBackModal';
import TmoModifyReason from './tmoModifyReason';

const dateFormat = 'YYYY-MM-DD';
const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;
const confirm = Modal.confirm;

/**
 * 作者：胡月
 * 创建日期：2017-9-11
 * 功能：基本信息页面功表单组合
 */
class ProjectInfo extends React.Component {
    state = {
        deptVisible: false,            //归口部门模态框显示
        mainDeptVisible: false,        //主责部门模态框显示
        mgrVisible: false,             //项目经理模态框显示

        is_primary: this.props.projOldInfo ? this.props.projOldInfo.is_primary : "",
        //根据项目分类，如果是项目类，项目系数，预估投资替代额，预估工作量必填
        isProjectLabel: this.props.projOldInfo.proj_label === undefined || this.props.projOldInfo.proj_label === '0' || this.props.projOldInfo.proj_label === '1',
        pms_list: [],
        pms_list_orig: [],
        endTimeWarnShow:false,           //修改结束时间是否显示警告，初始化不显示

    };

    /*componentDidMount(){
        const form = this.props.form;
        form.validateFields();
    };*/

    componentDidMount(){
        this.setState({
            pms_list: this.props.pms_list,
            pms_list_orig: JSON.parse(JSON.stringify(this.props.pms_list))
        });
    }

    /**
     * 作者：邓广晖
     * 创建日期：2018-08-28
     * 功能：改变模态框的可见状态
     * @param item 模态框对象
     * @param visible 可见状态 true, false
     */
    changeModalVisible = (item,visible) => {
        this.setState({
            [item]: visible
        });
    };

    /**
     * 作者：邓广晖
     * 创建日期：2018-10-25
     * 功能：选择归口部门模态框关闭时(点击确定)，传归口名称，归口部门id，归口部门ou的值
     */
    hideDeptModel = () => {
        this.setState({
            deptVisible: false
        });
        let puDeptData = this.refs.puDeptRadioGroup.getData().dept_name;
        const form = this.props.form;
        form.setFieldsValue({pu_dept_name: puDeptData});
        //把归口部门的id和ou一起传过去
        let puInfo = {};
        puInfo.pu_dept_id = this.refs.puDeptRadioGroup.getData().dept_id;
        puInfo.pu_dept_ou = this.refs.puDeptRadioGroup.getData().deptname_p;
        this.props.changePuData(puInfo);
    };


    /**
     * 作者：邓广晖
     * 创建日期：2018-08-28
     * 功能：选择主责部门模态框关闭时，传归口名称，归口部门id，归口部门ou的值
     */
    hideMainDeptModel = () => {
        this.setState({
            mainDeptVisible: false
        });
        let mainDeptName = this.refs.mainDeptRadioGroup.getData().dept_name;
        const form = this.props.form;
        form.setFieldsValue({dept_name: mainDeptName});
        //获取主责部门的id和ou
        let mainDeptInfo = {};
        mainDeptInfo.dept_id = this.refs.mainDeptRadioGroup.getData().dept_id;
        mainDeptInfo.ou = this.refs.mainDeptRadioGroup.getData().deptname_p;
        this.props.changeDeptData(mainDeptInfo);
    };


    /**
     * 作者：邓广晖
     * 创建日期：2018-08-28
     * 功能：选择项目经理时，点击确定
     */
    hideMgrNameModel = () => {
        this.setState({
            mgrVisible: false
        });
        let mgrName = this.refs.mgrRadioGroup.getData().mgr_name;
        const form = this.props.form;
        form.setFieldsValue({ mgr_name: mgrName });
        //把项目经理id一起传递过去
        let mgrInfo = {};
        mgrInfo.mgr_id = this.refs.mgrRadioGroup.getData().mgr_id;
        mgrInfo.mgr_name = mgrName;
        this.props.changeMgrData(mgrInfo);
    };


    /**
     * 作者：邓广晖
     * 创建日期：2018-08-28
     * 功能：项目系数最多为2位小数
     */
    projRatioChange = (e) => {
        //先将非数去掉
        let value = e.target.value.replace(/[^\d.]/g, '');
        //如果以小数点开头，去掉
        if (value === '.') {
            value = ''
        }
        //如果输入两个小数点，去掉一个
        if (value.indexOf('.') !== value.lastIndexOf('.')) {
            value = value.substring(0, value.lastIndexOf('.'))
        }
        //如果有小数点（判断1.这样的情况）
        if (value.indexOf('.') >= 1 && value.indexOf('.') !== value.length - 1) {
            //截取小数点后2位
            let cutNumber = value.substring(0, value.indexOf('.') + 3);
            //设置工作量的state,方便计算剩余工作量
            e.target.value = cutNumber;
        } else {
            e.target.value = value;
        }
    };

    /**
     * 作者：邓广晖
     * 创建日期：2018-08-28
     * 功能：预估投资替代额最多为6位小数
     */
    replaceMoneyChange = (e) => {
        //先将非数去掉
        let value = e.target.value.replace(/[^\d.]/g, '');
        //如果以小数点开头，去掉
        if (value === '.') {value = ''}
        //如果输入两个小数点，去掉一个
        if (value.indexOf('.') !== value.lastIndexOf('.')) {
            value = value.substring(0, value.lastIndexOf('.'))
        }
        //如果有小数点（判断1.这样的情况）
        if (value.indexOf('.') >= 1 && value.indexOf('.') !== value.length - 1) {
            //截取小数点后6位
            let cutNumber = value.substring(0, value.indexOf('.') + 7);
            //设置工作量的state,方便计算剩余工作量
            e.target.value = cutNumber;
        } else {
            e.target.value = value;
        }
    };

    /**
     * 作者：邓广晖
     * 创建日期：2018-08-28
     * 功能：预估工作量最多为1位小数
     */
    foreWorkloadChange = (e) => {
        //先将非数去掉
        let value = e.target.value.replace(/[^\d.]/g, '');
        //如果以小数点开头，去掉
        if (value === '.') { value = ''}
        //如果输入两个小数点，去掉一个
        if (value.indexOf('.') !== value.lastIndexOf('.')) {
            value = value.substring(0, value.lastIndexOf('.'))
        }
        //如果有小数点（判断1.这样的情况）
        if (value.indexOf('.') >= 1 && value.indexOf('.') !== value.length - 1) {
            //截取小数点后一位
            let cutNumber = value.substring(0, value.indexOf('.') + 2);
            //设置工作量的state,方便计算剩余工作量
            e.target.value = cutNumber;
        } else {
            e.target.value = value;
        }
    };


    /**
     * 作者：邓广晖
     * 创建日期：2018-08-28
     * 功能：判断项目分类，来决定项目系数、预估投资替代额、预估工作量是否必填
     */
    changeProjLabel = (value) => {
        if (value === '0' || value === '1' || value === '3') {
            //如果是项目类和小组类，设置为true
            this.setState({
                isProjectLabel: true
            })
        } else {
            //如果是支撑类，设置为false
            this.setState({
                isProjectLabel: false
            })
        }
    };

    /**
     * 作者：邓广晖
     * 创建日期：2018-08-28
     * 功能：开始时间将锁定
     */
    disabledStartDate = (value) => {
        const form = this.props.form;
        const endValue = form.getFieldValue('end_time');
        if (!value || !endValue) {
            return false;
        }
        return value.valueOf() > endValue.valueOf();
    };

    /**
     * 作者：邓广晖
     * 创建日期：2018-08-28
     * 功能：结束时间将锁定
     */
    disabledEndDate = (value) => {
        //const form = this.props.form;
        //const startValue = form.getFieldValue('begin_time');
        const startValue = moment(this.props.projInfoLimit.minEndTime).subtract(1, 'days'); //项目结束时间最小值，前端要大于等于此值
        if (!value || !startValue) {
            return false;
        }
        return value.valueOf() <= startValue.valueOf();
    };


    /**
     * 作者：邓广晖
     * 创建日期：2018-08-28
     * 功能：主项目选择否的话，要清除primary_proj_id的值
     */
    mainProjCheck = (value)=> {
        this.setState({is_primary: value});
        /*const form = this.props.form;
         if(value=='1'){
         form.setFieldsValue({primary_proj_id:""});
         console.log(form.getFieldValue('primary_proj_id'));
         }*/
    };

    /**
     * 作者：邓广晖
     * 创建日期：2018-08-28
     * 功能：加载主项目时，需要更改主责部门id，配合部门id,项目经理id
     */
    setDeptPuDeptMgr = (i,isChange) => {
        let mainDeptInfo = {};
        if (isChange !== 'TMOmodify' && 'dept_id' in this.props.mainProjList[i]) {
            mainDeptInfo.dept_id = this.props.mainProjList[i].dept_id;
            mainDeptInfo.ou = this.props.mainProjList[i].ou;
            this.props.changeDeptData(mainDeptInfo);
        }
        let puInfo = {};
        if ('pu_dept_id' in this.props.mainProjList[i]) {
            puInfo.pu_dept_id = this.props.mainProjList[i].pu_dept_id;
            puInfo.pu_dept_ou = this.props.mainProjList[i].pu_dept_ou;
            this.props.changePuData(puInfo);
        }
        let mgrInfo = {};
        if (isChange !== 'TMOmodify' && 'mgr_id' in this.props.mainProjList[i]) {
            mgrInfo.mgr_id = this.props.mainProjList[i].mgr_id;
            mgrInfo.mgr_name = this.props.mainProjList[i].mgr_name;
            this.props.changeMgrData(mgrInfo);
        }
    };

    /**
     * 作者：邓广晖
     * 创建日期：2018-08-28
     * 功能：判断时候加载主项目，如果加载的话，需要置换显示主项目信息
     */
    mainProjNameSelect = (value)=> {
        const form = this.props.form;
        const loadMainProj = form.getFieldValue('loadMainProj');
        if (loadMainProj === '0') {
            //选择加载主项目时（loadMainProj = 0
            for (let i = 0; i < this.props.mainProjList.length; i++) {
                if (value === this.props.mainProjList[i].proj_id) {
                    //填充表单数据
                    form.setFieldsValue(setFieldItemData(this.props.mainProjList[i],'TMOmodify'));
                    //同时在组件外层修改主责部门、配合部门、项目经理的附加数据
                    this.setDeptPuDeptMgr(i,'TMOmodify');
                    break;
                }
            }
        }
    };


    /**
     * 作者：邓广晖
     * 创建日期：2018-08-28
     * 功能：判断时候加载主项目，如果加载的话，需要置换显示主项目信息，如果不加载，需要置换非主项目的信息
     */
    mainProjIsLoaded = (value) => {
        const form = this.props.form;
        let primaryProjIdTemp = form.getFieldValue('primary_proj_id');
        if (value === '0') {
            for (let i = 0; i < this.props.mainProjList.length; i++) {
                if (primaryProjIdTemp === this.props.mainProjList[i].proj_id) {
                    //填充表单数据
                    form.setFieldsValue(setFieldItemData(this.props.mainProjList[i],'TMOmodify'));
                    //同时在组件外层修改主责部门、配合部门、项目经理的附加数据
                    this.setDeptPuDeptMgr(i,'TMOmodify');
                    break;
                }
            }
        } else {
            //不加载主项目时，用原来的数据填充
            form.setFieldsValue(setFieldItemData(this.props.projOldInfo));
        }
    };


    /**
     * 作者：邓广晖
     * 创建日期：2018-06-25
     * 功能：转为大写
     * @param e 输入事件
     */
    changeToUpperCase = (e) => {
        //先将非数字和非字母去掉
        let value = e.target.value.replace(/[^0-9a-zA-Z_\-.]/g, '');
        e.target.value = value.toUpperCase();
    };

    /**
     * 作者：邓广晖
     * 创建日期：2018-09-05
     * 功能：添加PMS信息
     */
    addPmsInfo = () => {
        let { pms_list } = this.state;
        pms_list.push({
            pms_code:'',
            pms_name:'',
            pms_stage_num:'0',   //key是 0  ,显示的值是 ‘’
            is_delete:'1',      //1 是可删除
            opt_type: 'insert'
        });
        this.setState({
            pms_list: [...pms_list]
        });
        this.props.changePmsData(pms_list);
    };

    /**
     * 作者：邓广晖
     * 创建日期：2018-09-05
     * 功能：改变PMS信息
     * @param eventOrValue 输入事件或者下拉值
     * @param optName 操作项
     * @param index 索引
     */
    changePmsData = (eventOrValue,optName,index) => {
        let { pms_list, pms_list_orig } = this.state;
        if (optName === 'pms_code') {
            pms_list[index][optName] = eventOrValue.target.value.replace(/[^0-9a-zA-Z]/g, '');
        }
        else if (optName === 'pms_name') {
            pms_list[index][optName] = eventOrValue.target.value.trim();
        }
        else if (optName === 'pms_stage_num') {
            pms_list[index][optName] = eventOrValue;
        }
        //如果编辑的是查询出来的PMS,需要判断是 update 还是 search, 新增的不用处理，直接修改
        if (pms_list[index].opt_type !== 'insert') {
            //如果pms_code pms_name pms_stage 与原始的一样，则标记为search 否则 为update
            if (
                pms_list[index].pms_code !== pms_list_orig[index].pms_code ||
                pms_list[index].pms_name !== pms_list_orig[index].pms_name ||
                pms_list[index].pms_stage_num !== pms_list_orig[index].pms_stage_num
            ) {
                pms_list[index].opt_type = 'update';
            } else {
                pms_list[index].opt_type = 'search';
            }
        }

        this.setState({
            pms_list: [...pms_list]
        });
        this.props.changePmsData(pms_list);
    };

    /**
     * 作者：邓广晖
     * 创建日期：2018-09-05
     * 功能：添加PMS信息
     * @param index 索引
     */
    deletePmsData = (index) => {
        let { pms_list, pms_list_orig } = this.state;
        //如果删除的pms不是新增的，将状态改为delete
        if (pms_list[index].opt_type !== 'insert') {
            pms_list[index].opt_type = 'delete';
        } else {
            //如果删除的pms是新增的，直接删除这条记录
            pms_list.splice(index, 1);
        }
        //删除PMS信息时，需要清空其他PMS信息的期数 key是 0  ,显示的值是 ‘’
        pms_list.forEach((item,i)=>{
            item.pms_stage_num = '0';
            if (item.opt_type !== 'insert' && item.opt_type !== 'delete') {
                if ( pms_list_orig[i].pms_stage_num !== '0') {
                    item.opt_type = 'update';
                }
                else if (
                    item.pms_code === pms_list_orig[i].pms_code &&
                    item.pms_name === pms_list_orig[i].pms_name &&
                    item.pms_stage_num === pms_list_orig[i].pms_stage_num
                ) {
                    //这里主要针对查询的原始结果中，没有期数的情况
                    item.opt_type = 'search';
                }
            }
        });
        this.setState({
            pms_list: [...pms_list]
        });
        this.props.changePmsData(pms_list);
    };


    //投资替代额验证
    placeMoneyCheck = (rule, value, callback) =>{
        if(Number(value) < Number(this.props.projInfoLimit.minReplaceMoney)){
            callback('投资替代额必须大于' + this.props.projInfoLimit.minReplaceMoney +"(万元)");
        }
        callback();
    };

    //工作量验证
    workloadCheck = (rule, value, callback) =>{
        if(Number(value) < Number(this.props.projInfoLimit.minForeWorkload)){
            callback('预估工作量必须大于' + this.props.projInfoLimit.minForeWorkload + "人月");
        }
        callback();
    };

    //结束时间验证警告，可以提交
    endTimeCheckWarn = (value) => {
        let endTime = value.format(dateFormat);
        //如果存在草稿，且缩短了结束时间，提示月报的警告
        if(this.props.projInfoLimit.monthlyDraftFlag === '1' && endTime < this.props.projOldInfo.end_time){
            this.setState({
                endTimeWarnShow:true
            });
        }else{
            this.setState({
                endTimeWarnShow:false
            });
        }
    };


    render() {
        const { getFieldDecorator } = this.props.form;
        const { mainProjList, projTypeList, projOldInfo, projInfoLimit } = this.props;


        //选择主项目
        const projNameList = mainProjList.map((item, index) => {
            return (
                <Option key={item.proj_id} value={item.proj_id} style={{width: 400}}>{item.proj_name}</Option>
            )
        });
        //选择项目类型
        const projType = projTypeList.map((item, index) => {
            return (
                <Option key={item.type_name}>{item.type_name_show}</Option>
            )
        });

        const FormItemCol = {
            preCol: {span: 10},
            latCol: {span: 20}
        };
        const formItemLayout = {
            labelCol: {span: 10},
            wrapperCol: {span: 14},
        };
        const formItemLayoutProjName = {
            labelCol: {span: 4},
            wrapperCol: {span: 16},
        };
        const textItemLayout = {
            labelCol: {span: 5},
            wrapperCol: {span: 19},
        };

        //pms编码列表
        let pmsContentList = [];
        let { pms_list } = this.state;
        for (let i = 0; i < pms_list.length; i++) {
            //这里需要过滤掉 opt_type = delete,  pmsStageList 最大期数下拉选择也需要过滤 delete
            if (pms_list[i].opt_type !== 'delete') {
                pmsContentList.push(
                    <Row key={i}
                         style={{
                             margin:'0 auto',
                             marginBottom: 10,
                             width:'98%',
                             paddingBottom:5,
                             borderBottom:'1px solid gainsboro'
                         }}
                    >
                        <Col className="gutter-row" span={1} style={{textAlign:'center'}}>
                            {
                                pms_list[i].is_delete === '1'
                                    ?
                                    <Popconfirm
                                        title="删除PMS信息时，将会清空其他PMS信息的期数，确定删除该PMS信息吗?"
                                        onConfirm={() => this.deletePmsData(i)}
                                    >
                                        <Icon type="delete"
                                              style={{fontSize:20, cursor:'pointer'}}
                                        />
                                    </Popconfirm>
                                    :
                                    <Tooltip title={pms_list[i].is_delete_show}>
                                        <Icon type="delete"
                                              style={{fontSize:20, cursor:'pointer'}}
                                        />
                                    </Tooltip>
                            }

                        </Col>
                        <Col className="gutter-row" span={3} style={{textAlign:'right'}}>
                            <div style={{paddingTop:5}}>{'PMS项目编码：'}</div>
                        </Col>
                        <Col className="gutter-row" span={6}>
                            <Input
                                style={{width:'95%'}}
                                value={pms_list[i].pms_code}
                                maxLength={'14'}
                                placeholder={'PMS项目编码为14位'}
                                onChange={(e)=>this.changePmsData(e,'pms_code',i)}
                                disabled={pms_list[i].is_delete === '0'}
                            />
                        </Col>
                        <Col className="gutter-row" span={4} style={{textAlign:'right'}}>
                            <div style={{paddingTop:5}}>{'PMS项目名称：'}</div>
                        </Col>
                        <Col className="gutter-row" span={6}>
                            <Input
                                value={pms_list[i].pms_name}
                                maxLength={'40'}
                                placeholder={'最多可输入40字'}
                                onChange={(e)=>this.changePmsData(e,'pms_name',i)}
                                disabled={pms_list[i].is_delete === '0'}
                            />
                        </Col>
                        <Col className="gutter-row" span={4} >
                            <span style={{paddingLeft:20}}>{'期数：'}</span>
                            <Select
                                showSearch
                                optionFilterProp="children"
                                dropdownMatchSelectWidth={false}
                                value={pms_list[i].pms_stage_num}
                                style={{width:'50%'}}
                                onSelect={(value)=>this.changePmsData(value,'pms_stage_num',i)}
                            >
                                {pmsStageList(this.state.pms_list.filter(item=>item.opt_type!== 'delete').length)}
                            </Select>
                        </Col>
                    </Row>
                );
            }

        }

        return (
            <div>
                <div className={styles.titleBox}>
                    <Form >
                        <div>
                            <div className={styles.titleOneBox}>
                                <div className={styles.titleOneStyles}>基础信息</div>
                            </div>
                            <Row>
                                <Col className="gutter-row" span={24}>
                                    <FormItem label="团队名称" {...formItemLayoutProjName} >
                                        {getFieldDecorator('proj_name', {
                                            rules: [{
                                                required: true,
                                                message: '团队名称是必填项',
                                                whitespace: true
                                            }],
                                            initialValue: 'proj_name' in projOldInfo ? projOldInfo.proj_name : ""
                                        })
                                        (
                                            <TextArea
                                                rows={2}
                                                maxLength={'80'}
                                                placeholder={'最多可输入80字'}
                                            />
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>

                            <Row gutter={16}>
                                <Col className="gutter-row" {...FormItemCol.preCol}>
                                    <FormItem label="项目分类" {...formItemLayout} >
                                        {getFieldDecorator('proj_label', {
                                            rules: [{
                                                required: true,
                                                message: '项目分类是必选项'
                                            }],
                                            initialValue: 'proj_label' in projOldInfo ? projOldInfo.proj_label : "0"
                                        })
                                        (
                                            <Select onChange={this.changeProjLabel}>
                                                <Option value="0">项目类</Option>
                                                <Option value="3">项目类(纯第三方)</Option>
                                                <Option value="1">小组类</Option>
                                                <Option value="2">支撑类</Option>
                                            </Select>
                                        )}
                                        <Tooltip placement="right" title={projLabelText}>
                                            <Icon
                                                type="question-circle"
                                                style={{
                                                    position: 'absolute',
                                                    top: 8,
                                                    right: -22,
                                                    fontSize: 16,
                                                    color: '#08c',
                                                    zIndex: '999'
                                                }}
                                            />
                                        </Tooltip>
                                    </FormItem>
                                </Col>
                                {/*选择非主项目显示 主项目名称和加载主项目两项*/}
                                <Col className="gutter-row" {...FormItemCol.preCol}>
                                    <FormItem label="主项目" {...formItemLayout}>
                                        {getFieldDecorator('is_primary', {
                                            rules: [{
                                                required: true,
                                                message: '主项目是必选项'
                                            }],
                                            initialValue: this.state.is_primary
                                        })
                                        (<Select onChange={this.mainProjCheck}>
                                            <Option value="0">是</Option>
                                            <Option value="1">否</Option>
                                        </Select>)}
                                    </FormItem>
                                </Col>
                            </Row>
                            {this.state.is_primary === "1" ?
                                <Row gutter={16}>
                                    <Col className="gutter-row" {...FormItemCol.preCol}>
                                        <FormItem label="主项目名称" {...formItemLayout} >
                                            {getFieldDecorator('primary_proj_id', {
                                                rules: [{
                                                    required: true,
                                                    message: '主项目名称是必选项'
                                                }],
                                                initialValue: 'primary_proj_id' in projOldInfo ? projOldInfo.primary_proj_id : ""
                                            })
                                            (
                                                <Select
                                                    showSearch
                                                    optionFilterProp="children"
                                                    dropdownMatchSelectWidth={false}
                                                    onChange={this.mainProjNameSelect}
                                                >
                                                    {projNameList}
                                                </Select>)}
                                        </FormItem>
                                    </Col>
                                    <Col className="gutter-row" {...FormItemCol.preCol}>
                                        <FormItem label="加载主项目" {...formItemLayout} >
                                            {getFieldDecorator('loadMainProj', {
                                                initialValue: '1'
                                            })
                                            (<Select onChange={this.mainProjIsLoaded}>
                                                <Option value="0">是</Option>
                                                <Option value="1">否</Option>
                                            </Select>)}
                                        </FormItem>
                                    </Col>
                                </Row>
                                :
                                null
                            }

                            <Row gutter={16}>
                                <Col className="gutter-row" {...FormItemCol.preCol}>
                                    <FormItem label="生产编码" {...formItemLayout} >
                                        {getFieldDecorator('proj_code', {
                                            rules: [{
                                                required: true,
                                                min: 14,
                                                max: 14,
                                                message: '生产编码是必填项，且长度只能是14位',
                                                whitespace: true
                                            }],
                                            initialValue: 'proj_code' in projOldInfo ? projOldInfo.proj_code : ""
                                        })
                                        (
                                            <Input
                                                onChange={this.changeToUpperCase}
                                                maxLength={'14'}
                                                placeholder={'最多可输入14字'}
                                                disabled={projInfoLimit.isEditFieldProjCode === '0'}
                                            />
                                        )}
                                        <Tooltip placement="right" title={projCodeText}>
                                            <Icon
                                                type="question-circle"
                                                style={{
                                                    position: 'absolute',
                                                    top: 8,
                                                    right: -22,
                                                    fontSize: 16,
                                                    color: '#08c',
                                                    zIndex: '999'
                                                }}/>
                                        </Tooltip>
                                    </FormItem>
                                </Col>

                                <Col className="gutter-row" {...FormItemCol.preCol}>
                                    <FormItem label="项目简称" {...formItemLayout} >
                                        {getFieldDecorator('proj_shortname', {
                                            initialValue: 'proj_shortname' in projOldInfo ? projOldInfo.proj_shortname : ""
                                        })
                                        (
                                            <TextArea
                                                autosize
                                                maxLength={'20'}
                                                placeholder={'最多可输入20字'}
                                            />
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>

                            <Row gutter={16}>
                                <Col className="gutter-row" {...FormItemCol.preCol}>
                                    <FormItem label="项目类型" {...formItemLayout} >
                                        {getFieldDecorator('proj_type', {
                                            rules: [{
                                                required: true,
                                                message: '项目类型是必选项'
                                            }],
                                            initialValue: 'proj_type' in projOldInfo ? projOldInfo.proj_type : ""
                                        })
                                        (<Select
                                            showSearch
                                            optionFilterProp="children"
                                            style={{width: '100%'}}
                                            disabled={projInfoLimit.isEditFielProjType === '0'}
                                        >
                                            {projType}
                                        </Select>)}
                                    </FormItem>
                                </Col>
                                <Col className="gutter-row" {...FormItemCol.preCol}>
                                    <FormItem label="团队系数" {...formItemLayout} >
                                        {getFieldDecorator('proj_ratio', {
                                            rules: [{
                                                required: this.state.isProjectLabel,
                                                message: '团队系数是必填项',
                                                whitespace: this.state.isProjectLabel,
                                            }],
                                            initialValue: 'proj_ratio' in projOldInfo ? projOldInfo.proj_ratio : ""
                                        })
                                        (
                                            <Input
                                                onChange={this.projRatioChange}
                                                maxLength={'10'}
                                                placeholder={'最多可输入10字'}
                                                style={{width: '100%'}}
                                            />
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>

                            <Row gutter={16}>
                                <Col className="gutter-row" {...FormItemCol.preCol}>
                                    <FormItem label="预估投资替代额" {...formItemLayout} >
                                        {getFieldDecorator('replace_money', {
                                            rules: [{
                                                required: this.state.isProjectLabel,
                                                message: '预估投资替代额是必填项',
                                                whitespace: this.state.isProjectLabel,
                                            },{
                                                validator: this.state.isProjectLabel === true ?this.placeMoneyCheck:null
                                            }],
                                            initialValue: 'replace_money' in projOldInfo ? projOldInfo.replace_money : ""
                                        })
                                        (
                                            <Input
                                                maxLength={'17'}
                                                placeholder={'最多可输入17字'}
                                                onChange={this.replaceMoneyChange}
                                                style={{width: '85%'}}
                                            />
                                        )}
                                        <span>万元</span>
                                    </FormItem>
                                </Col>
                                <Col className="gutter-row" {...FormItemCol.preCol}>
                                    <FormItem label="预估工作量" {...formItemLayout} >
                                        {getFieldDecorator('fore_workload', {
                                            rules: [{
                                                required: this.state.isProjectLabel,
                                                message: '预估工作量是必填项',
                                                whitespace: this.state.isProjectLabel,
                                            },{
                                                validator: this.state.isProjectLabel === true ? this.workloadCheck:null
                                            }],
                                            initialValue: 'fore_workload' in projOldInfo ? projOldInfo.fore_workload : ""
                                        })
                                        (
                                            <Input
                                                maxLength={'10'}
                                                placeholder={'最多可输入10字'}
                                                onChange={this.foreWorkloadChange}
                                                style={{width: '85%'}}
                                            />
                                        )}
                                        <span>人月</span>
                                    </FormItem>
                                </Col>
                            </Row>


                            <Row gutter={16}>
                                <Col className="gutter-row" {...FormItemCol.preCol}>
                                    <FormItem label="开始时间" {...formItemLayout} >
                                        {getFieldDecorator('begin_time', {
                                            rules: [{
                                                required: true,
                                                message: '开始时间是必填项'
                                            }],
                                            initialValue: 'begin_time' in projOldInfo ? moment(projOldInfo.begin_time) : null
                                        })
                                        (<DatePicker disabledDate={this.disabledStartDate}
                                                     format={dateFormat}
                                                     disabled={projInfoLimit.isEditFieldBeginTime === '0'}
                                                     style={{ width: '100%' }}/>)}
                                    </FormItem>
                                </Col>
                                <Col className="gutter-row" {...FormItemCol.preCol}>
                                    <FormItem label="结束时间" {...formItemLayout} >
                                        {getFieldDecorator('end_time', {
                                            rules: [{
                                                type: 'object',
                                                required: true,
                                                message: '结束时间是必填项'
                                            }],
                                            initialValue: 'end_time' in projOldInfo ? moment(projOldInfo.end_time) : null
                                        })
                                        (<DatePicker disabledDate={this.disabledEndDate}
                                                     format={dateFormat}
                                                     onChange={this.endTimeCheckWarn}
                                                     disabled={projInfoLimit.isEditFieldEndTime === '0'}
                                                     style={{ width: '100%'}}/>)}
                                        {this.state.endTimeWarnShow === true?
                                            <div style={{height:'10px',color:'#f7d10a'}}>{this.props.projInfoLimit.monthlyDraftVal}</div>
                                            :
                                            null
                                        }
                                    </FormItem>
                                </Col>
                            </Row>

                            <Row gutter={16}>
                                <Col className="gutter-row" {...FormItemCol.preCol}>
                                    <FormItem label="主建部门" {...formItemLayout} >
                                        {getFieldDecorator('dept_name', {
                                            rules: [{
                                                required: true,
                                                message: '主建部门是必选项'
                                            }],
                                            initialValue: 'dept_name' in projOldInfo ? projOldInfo.dept_name : ""
                                        })
                                        (<TextArea rows={2} style={{ width: '85%'}} disabled/>
                                        )}
                                        <Icon type="plus-circle-o"
                                              style={{
                                                  position: 'absolute',
                                                  top: '24%',
                                                  left: '88%',
                                                  fontSize: 16,
                                                  color: '#FA7252',
                                                  cursor: 'pointer'
                                              }}
                                              onClick={()=>this.changeModalVisible('mainDeptVisible',true)}
                                        />
                                    </FormItem>
                                    <Modal
                                        key="dept_name"
                                        visible={this.state.mainDeptVisible}
                                        width={config.DEPT_MODAL_WIDTH}
                                        title="选择部门"
                                        onCancel={()=>this.changeModalVisible('mainDeptVisible',false)}
                                        footer={[
                                            <Button
                                                key="mainDeptNameClose"
                                                size="large"
                                                onClick={()=>this.changeModalVisible('mainDeptVisible',false)}
                                            >关闭
                                            </Button>,
                                            <Button
                                                key="mainDeptNameConfirm"
                                                type="primary"
                                                size="large"
                                                onClick={this.hideMainDeptModel}
                                            >确定
                                            </Button>
                                        ]}
                                    >
                                        <div>
                                            <LimitDeptRadio ref='mainDeptRadioGroup' projId={this.props.projOldInfo.proj_id} flag={'2'}/>
                                        </div>
                                    </Modal>
                                </Col>
                                <Col className="gutter-row" {...FormItemCol.preCol}>
                                    <FormItem label="项目经理" {...formItemLayout} >
                                        {getFieldDecorator('mgr_name', {
                                            rules: [{
                                                required: true,
                                                message: '项目经理是必选项'
                                            }],
                                            initialValue: 'mgr_name' in projOldInfo ? projOldInfo.mgr_name : ""
                                        })
                                        (<Input style={{ width: '85%'}} disabled/>)}
                                        {projInfoLimit.isEditFieldMgrname !== '0'?
                                            <Icon
                                                type="plus-circle-o"
                                                style={{
                                                    position: 'absolute',
                                                    top: '24%',
                                                    left: '88%',
                                                    fontSize: 16,
                                                    color: '#FA7252',
                                                    cursor: 'pointer'
                                                }}
                                                onClick={()=>this.changeModalVisible('mgrVisible',true)}
                                            />
                                            :
                                            null
                                        }
                                    </FormItem>
                                    <Modal
                                        key="mgr_name"
                                        visible={this.state.mgrVisible}
                                        width={config.DEPT_MODAL_WIDTH}
                                        title="选择项目经理"
                                        onCancel={()=>this.changeModalVisible('mgrVisible',false)}
                                        footer={[
                                            <Button
                                                size="large"
                                                onClick={()=>this.changeModalVisible('mgrVisible',false)}
                                            >关闭
                                            </Button>,
                                            <Button
                                                key="mgrNameConfirm"
                                                type="primary"
                                                size="large"
                                                onClick={this.hideMgrNameModel}
                                            >确定</Button>
                                        ]}
                                    >
                                        <div>
                                            <MgrRadioGroup ref='mgrRadioGroup'/>
                                        </div>
                                    </Modal>
                                </Col>
                            </Row>

                            <Row gutter={16}>
                                <Col className="gutter-row" {...FormItemCol.preCol}>
                                    <FormItem label="归属部门" {...formItemLayout} >
                                        {getFieldDecorator('pu_dept_name', {
                                            rules: [{
                                                required: true,
                                                message: '归属部门是必选项'
                                            }],
                                            initialValue: 'pu_dept_name' in projOldInfo ? projOldInfo.pu_dept_name : ""
                                        })
                                        (<TextArea rows={2} style={{ width: '85%'}} disabled/>
                                        )}
                                        <Icon
                                            type="plus-circle-o"
                                            style={{
                                                position: 'absolute',
                                                top: '24%',
                                                left: '88%',
                                                fontSize: 16,
                                                color: '#FA7252',
                                                cursor: 'pointer'
                                            }}
                                            onClick={()=>this.changeModalVisible('deptVisible',true)}
                                        />
                                    </FormItem>
                                    <Modal
                                        key="pu_dept_name"
                                        visible={this.state.deptVisible}
                                        width='400px'
                                        title="选择部门"
                                        onCancel={()=>this.changeModalVisible('deptVisible',false)}
                                        footer={[
                                            <Button
                                                key="puDeptNameClose"
                                                size="large"
                                                onClick={()=>this.changeModalVisible('deptVisible',false)}
                                            >关闭
                                            </Button>,
                                            <Button
                                                key="puDeptNameConfirm"
                                                type="primary"
                                                size="large"
                                                onClick={this.hideDeptModel}
                                            >确定</Button>]}
                                    >
                                        <div>
                                            <FourDeptThreeCenter ref='puDeptRadioGroup' projId={this.props.projOldInfo.proj_id}/>
                                        </div>
                                    </Modal>
                                </Col>
                            </Row>
                        </div>

                        <div>
                            <div className={styles.titleTwoBox}>
                                <div className={styles.titleOneStyles}>
                                    <span>PMS信息</span>
                                    {
                                        this.state.pms_list.length >= 20
                                            ?
                                            <span style={{fontWeight:'normal',fontSize:16}}>（pms编码最多添加20项）</span>
                                            :
                                            <Icon
                                                type="plus-circle-o"
                                                style={{fontSize:16, color:'#FA7252', cursor:'pointer', marginLeft:10}}
                                                onClick={()=>this.addPmsInfo()}
                                            />
                                    }
                                </div>
                            </div>
                            <div style={{marginTop:20,marginBottom:20}}>
                                {pmsContentList}
                            </div>
                        </div>
                        {/**
                         * 作者：刘洪若
                         * 时间：2020-4-9
                         * 功能：注释掉委托方信息
                         */}            
                        {/* <div>
                            <div className={styles.titleTwoBox}>
                                <div className={styles.titleOneStyles}>委托方信息</div>
                            </div>
                            <Row gutter={16}>
                                <Col className="gutter-row" {...FormItemCol.preCol}>
                                    <FormItem label="委托方" {...formItemLayout} >
                                        {getFieldDecorator('client', {
                                            initialValue: 'client' in projOldInfo ? projOldInfo.client : ""
                                        })
                                        (<Input
                                            maxLength={'40'}
                                            placeholder={'最多可输入40字'}
                                            style={{width: '100%'}}
                                        />)}
                                    </FormItem>
                                </Col>
                                <Col className="gutter-row" {...FormItemCol.preCol}>
                                    <FormItem label="委托方联系人" {...formItemLayout} >
                                        {getFieldDecorator('mandator', {
                                            initialValue: 'mandator' in projOldInfo ? projOldInfo.mandator : ""
                                        })
                                        (<Input
                                            maxLength={'20'}
                                            placeholder={'最多可输入20字'}
                                            style={{width: '100%'}}/>)}
                                    </FormItem>
                                </Col>
                            </Row>

                            <Row gutter={16}>
                                <Col className="gutter-row" {...FormItemCol.preCol}>
                                    <FormItem label="委托方手机号" {...formItemLayout} >
                                        {getFieldDecorator('client_tel', {
                                            rules: [{
                                                min: 11,
                                                max: 11,
                                                pattern: /^1[0-9]{10}$/,
                                                message: '请输入正确的委托方手机号',
                                            }],
                                            initialValue: 'client_tel' in projOldInfo ? projOldInfo.client_tel : ""
                                        })
                                        (<Input
                                            placeholder={'请输入正确的委托方手机号'}
                                            style={{width: '100%'}}/>)}
                                    </FormItem>
                                </Col>
                                <Col className="gutter-row" {...FormItemCol.preCol}>
                                    <FormItem label="委托方E-mail" {...formItemLayout} >
                                        {getFieldDecorator('client_mail', {
                                            rules: [{
                                                type: 'email',
                                                message: '请输入正确的E-mail'
                                            }],
                                            initialValue: 'client_mail' in projOldInfo ? projOldInfo.client_mail : ""
                                        })
                                        (<Input
                                            maxLength={'50'}
                                            placeholder={'最多可输入50字'}
                                            style={{width: '100%'}}/>)}
                                    </FormItem>
                                </Col>
                            </Row>
                        </div> */}

                        <div>
                            <div className={styles.titleTwoBox}>
                                <div className={styles.titleOneStyles}>其他信息</div>
                            </div>
                            <Row gutter={16}>
                                <Col className="gutter-row" {...FormItemCol.latCol}>
                                    <FormItem label="项目目标" {...textItemLayout} >
                                        {getFieldDecorator('work_target', {
                                            initialValue: 'work_target' in projOldInfo ? changeBr2RN(projOldInfo.work_target) : ""
                                        })
                                        (<TextArea rows={5} placeholder="字数限制在2000字以内" maxLength="2000"/>)}
                                    </FormItem>
                                </Col>
                            </Row>

                            <Row gutter={16}>
                                <Col className="gutter-row" {...FormItemCol.latCol}>
                                    <FormItem label="项目范围/建设内容" {...textItemLayout} >
                                        {getFieldDecorator('proj_range', {
                                            initialValue: 'proj_range' in projOldInfo ? changeBr2RN(projOldInfo.proj_range) : ""
                                        })
                                        (<TextArea rows={5} placeholder="字数限制在2000字以内" maxLength="2000"/>)}
                                    </FormItem>
                                </Col>
                            </Row>

                            <Row gutter={16}>
                                <Col className="gutter-row" {...FormItemCol.latCol}>
                                    <FormItem label="技术/质量目标" {...textItemLayout} >
                                        {getFieldDecorator('quality_target', {
                                            initialValue: 'quality_target' in projOldInfo ? changeBr2RN(projOldInfo.quality_target) : ""
                                        })
                                        (<TextArea rows={5} placeholder="字数限制在2000字以内" maxLength="2000"/>)}
                                    </FormItem>
                                </Col>
                            </Row>

                            <Row gutter={16}>
                                <Col className="gutter-row" {...FormItemCol.latCol}>
                                    <FormItem label="考核指标及验收标准" {...textItemLayout} >
                                        {getFieldDecorator('proj_check', {
                                            initialValue: 'proj_check' in projOldInfo ? changeBr2RN(projOldInfo.proj_check) : ""
                                        })
                                        (<TextArea rows={5} placeholder="字数限制在2000字以内" maxLength="2000"/>)}
                                    </FormItem>
                                </Col>
                            </Row>

                            <Row gutter={16}>
                                <Col className="gutter-row" {...FormItemCol.latCol}>
                                    <FormItem label="备注" {...textItemLayout} >
                                        {getFieldDecorator('proj_repair', {
                                            initialValue: 'proj_repair' in projOldInfo ? changeBr2RN(projOldInfo.proj_repair) : ""
                                        })
                                        (<TextArea rows={5} placeholder="字数限制在2000字以内" maxLength="2000"/>)}
                                    </FormItem>
                                </Col>
                            </Row>
                        </div>
                    </Form>
                </div>
            </div>
        );
    }
}

/**
 * 作者：胡月
 * 创建日期：2017-9-17
 * 功能：实现tabs中基本信息页面功能
 */
class ProjApproveEditProjInfo extends React.Component {
    state = {
        puInfo: {},
        deptInfo: {},
        mgrInfo: {mgr_id:this.props.userid},
        pms_list: [],
        pms_list_orig: [],
    };
    componentDidMount(){
        this.state.pms_list = this.props.pms_list;
        this.state.pms_list_orig = JSON.parse(JSON.stringify(this.props.pms_list));
    }
    componentWillReceiveProps(newProps) {
        this.state.pms_list = newProps.pms_list;
        this.state.pms_list_orig = JSON.parse(JSON.stringify(newProps.pms_list));
    }

    changePuData = (obj) => {
        this.state.puInfo = obj;
    };

    changeDeptData = (obj) => {
        this.state.deptInfo = obj;
    };

    changeMgrData = (value) => {
        this.state.mgrInfo = value;
    };

    changePmsData = (pms_list) => {
        this.state.pms_list = JSON.parse(JSON.stringify(pms_list));
    };

    getBasicInfoData = () => {
        //basicInfo 包含以下数据， projData :原本项目信息  pmsData： PMS编码信息，formIsRight ：表单数据是否验证正确
        let basicInfo = {};
        let pmsData = [];
        let obj = {};
        let pmsDataIsRight = '1';
        this.refs.projInfoNew.validateFields((err, values) => {
            if (!err) {
                if (values.is_primary && values.is_primary === '0') {
                    values.primary_proj_id = '';
                }
                obj = getBasicInfoChangeData(this.props.projOldInfo, values);
                if ('pu_dept_name' in obj) {
                    obj.pu_dept_id = this.state.puInfo.pu_dept_id;
                    obj.pu_dept_ou = this.state.puInfo.pu_dept_ou;
                }
                if ('dept_name' in obj) {
                    obj.dept_id = this.state.deptInfo.dept_id;
                    obj.ou = this.state.deptInfo.ou;
                }
                if ('mgr_name' in obj) {
                    obj.mgr_id = this.state.mgrInfo.mgr_id;
                }
                // 是否加载主项目，这一项是前端显示，手动添加，保存时不需要
                if ('loadMainProj' in obj) {
                    delete obj.loadMainProj
                }
                basicInfo.formIsRight = '1';
                //以下是判断pms信息是否正确
                let { pms_list, pms_list_orig } = this.state;
                //console.log('================pms_list_orig-============');
                //console.log(pms_list_orig);
                let pmsJudgetList = pms_list.filter(item => item.opt_type !== 'delete');
                for (let i = 0; i < pmsJudgetList.length; i++) {
                    //判断不能为空
                    if (pmsJudgetList[i].pms_code === '') {
                        pmsDataIsRight = '0';
                        message.info('PMS项目编码不能为空');
                        break;
                    }
                    if (pmsJudgetList[i].pms_name.trim() === '') {
                        pmsDataIsRight = '0';
                        message.info('PMS项目名称不能为空');
                        break;
                    }
                    if (pmsJudgetList[i].pms_code.length !== 14) {
                        pmsDataIsRight = '0';
                        message.info('PMS项目编码必须为14位');
                        break;
                    }
                    let dataRepeat = false;
                    for (let j = 0; j < pmsJudgetList.length; j++) {
                        if (i !== j && pmsJudgetList[i].pms_code === pmsJudgetList[j].pms_code) {
                            dataRepeat = true;
                            message.info('PMS项目编码重复');
                            break;
                        }
                        if (i !== j && pmsJudgetList[i].pms_name.trim() === pmsJudgetList[j].pms_name.trim()) {
                            dataRepeat = true;
                            message.info('PMS项目名称重复');
                            break;
                        }
                        if (i !== j && pmsJudgetList[i].pms_stage_num !== '0' &&
                            pmsJudgetList[j].pms_stage_num !== '0' &&
                            pmsJudgetList[i].pms_stage_num === pmsJudgetList[j].pms_stage_num) {
                            dataRepeat = true;
                            message.info('PMS项目期数重复');
                            break;
                        }
                    }
                    if (dataRepeat === true) {
                        pmsDataIsRight = '0';
                        break;
                    }
                }
                //以下是获取pms编码数据
                for (let i = 0; i < pms_list.length; i++) {
                    let pms_temp = {};
                    if (pms_list[i].opt_type === 'insert') {
                        pms_temp.flag = 'insert';
                        pms_temp.pms_code = pms_list[i].pms_code;
                        pms_temp.pms_name = pms_list[i].pms_name;
                        pms_temp.pms_stage_num = pms_list[i].pms_stage_num;
                        pms_temp.pms_stage = numToCh(Number(pms_list[i].pms_stage_num));
                        pmsData.push(pms_temp);
                    }
                    else if (pms_list[i].opt_type === 'update') {
                        pms_temp.flag = 'update';
                        //pms_temp.form_id = pms_list[i].form_id;
                        pms_temp.uuid = pms_list[i].uuid;
                        if (pms_list[i].pms_code !== pms_list_orig[i].pms_code) {
                            pms_temp.pms_code = pms_list[i].pms_code;
                        }
                        if (pms_list[i].pms_name !== pms_list_orig[i].pms_name) {
                            pms_temp.pms_name = pms_list[i].pms_name;
                        }
                        if (pms_list[i].pms_stage_num !== pms_list_orig[i].pms_stage_num) {
                            pms_temp.pms_stage_num = pms_list[i].pms_stage_num;
                            pms_temp.pms_stage = numToCh(Number(pms_list[i].pms_stage_num));
                        }
                        pmsData.push(pms_temp);
                    }
                    else if (pms_list[i].opt_type === 'delete') {
                        pms_temp.flag = 'delete';
                        //pms_temp.form_id = pms_list[i].form_id;
                        pms_temp.uuid = pms_list[i].uuid;
                        pmsData.push(pms_temp);
                    }
                }
            } else {
                basicInfo.formIsRight = '0';
                message.info(CHECK_INFO_RULE);
            }
        });
        basicInfo.projData = obj;
        basicInfo.pmsData = pmsData;
        basicInfo.pmsDataIsRight = pmsDataIsRight;
        return basicInfo;
    };

    /**
     * 作者：邓广晖
     * 创建日期：2018-01-29
     * 功能：提交基本信息数据
     */
    submitProjInfo = ()=>{
        let { formIsRight, pmsDataIsRight, projData, pmsData} = this.getBasicInfoData();
        if (formIsRight === '1' && pmsDataIsRight === '1') {
            if (JSON.stringify(projData) === '{}' && pmsData.length === 0 ) {
                message.info('没有变化数据');
            } else {
                this.refs.tmoModifyReason.showModal();
            }
        }
    };

    /**
     * 作者：邓广晖
     * 创建日期：2018-01-21
     * 功能：改变基本信息页面的显示，查看页面（view）和编辑页面（edit）
     * @param pageToType 想要切换成的页面
     */
    /*changeProjInfoShow = (pageToType) => {
        this.props.dispatch({
            type:'projStartMainPage/changeProjInfoShow',
            pageToType:pageToType
        });
    };*/

    /**
     * 作者：邓广晖
     * 创建日期：2018-01-22
     * 功能：隐藏修改原因模态框
     */
    hideReasonModal = () => {
        const { mainProjList } = this.props;
        const { reasonValue } = this.refs.tmoModifyReason.state;
        let { projData, pmsData, formIsRight, pmsDataIsRight } = this.getBasicInfoData();
        if (formIsRight === '1' && pmsDataIsRight === '1') {
            //将投资替代额还原到 元 单位
            if ('replace_money' in projData && projData.replace_money !== '') {
                projData.replace_money = (Number(projData.replace_money) * 10000).toString();
            }
            //如果是子项目，必选其主项目
            let projParentObj = {};
            if ('primary_proj_id' in projData) {
                projParentObj.proj_parent_id = projData.primary_proj_id;
                for (let i = 0; i < mainProjList.length; i++) {
                    if (projData.primary_proj_id === mainProjList[i].proj_id) {
                        projParentObj.proj_parent_name = mainProjList[i].proj_name;
                    }
                }
                delete projData.primary_proj_id;
            } else if('is_primary' in projData && projData.is_primary === '0') {
                //如果项目id不存在（本身就是主项目，或者子项目，没有去改变这个值），而且切换到主项目（0）
                projParentObj = {
                    proj_parent_id:'',
                    proj_parent_name:''
                };
            }

            //归口部门数据
            let puObj = {};
            if ('pu_dept_name' in projData) {
                puObj.pu_dept_name = projData.pu_dept_name;
                puObj.pu_dept_id = projData.pu_dept_id;
                puObj.pu_dept_ou = projData.pu_dept_ou;
                delete projData.pu_dept_name;
                delete projData.pu_dept_id;
                delete projData.pu_dept_ou;
            }
            this.props.dispatch({
                type: 'projStartMainPage/submitProjInfo',
                params: {
                    changeReason: reasonValue.trim(),                    //修改原因
                    arg_proj_info_json: projData,                        //基本信息修改项
                    arg_proj_parent_info_json: projParentObj,            //父子关系修改项
                    arg_pu_info_json: puObj,                             //归口部门修改项
                    arg_pms_code_json : pmsData,
                }
            });
        }
    };

    /**
     * 作者：邓广晖
     * 创建日期：2018-06-15
     * 功能：从页面返回,基本信息页面的显示，查看页面（view）和编辑页面（edit）
     */
    goBack = () => {
        this.props.dispatch({
            type:'projStartMainPage/changeProjInfoShow',
            pageToType: 'view'
        });
    };


    render() {
        const {mainProjList, projTypeList, projOldInfo, pms_list, dispatch}=this.props;
        const ProjInfoNew = Form.create()(ProjectInfo);
        return (
            <div>
                <div>
                    <div style={{textAlign:'right'}}>
                        <Button type='primary' onClick={this.submitProjInfo}>{'提交'}</Button>
                        &nbsp;&nbsp;
                        <Button type='primary' onClick={()=>this.refs.goBackModal.showModal()}>{'返回'}</Button>
                    </div>
                </div>

                <GoBackModal
                    ref='goBackModal'
                    goBack={this.goBack}
                />
                {/*修改原因模态框*/}
                <TmoModifyReason
                    ref="tmoModifyReason"
                    hideReasonModal={this.hideReasonModal}
                    showFlag={this.props.projInfoEditFlag}
                    showVal={this.props.projInfoEditVal}
                />
                <ProjInfoNew
                    ref="projInfoNew"
                    mainProjList={mainProjList}
                    projTypeList={projTypeList}
                    projOldInfo={projOldInfo}
                    dispatch={dispatch}
                    projInfoLimit={this.props.projInfoLimit}
                    pms_list={pms_list}
                    changePuData={this.changePuData}
                    changeDeptData={this.changeDeptData}
                    changeMgrData={this.changeMgrData}
                    changePmsData={this.changePmsData}
                />
            </div>
        )
    }
}
export default ProjApproveEditProjInfo;
