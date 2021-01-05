/**
 * 作者： 夏天
 * 创建日期：2018-09-5
 * 邮件：1348744578@qq.com
 * 文件说明：项目信息导出--表头搜索组件
 */
import React from 'react';
import { Input, Button, Row, Col, Select, Modal } from 'antd';
import config from '../../../../utils/config';
import DeptRadioGroup from '../../../../components/common/deptRadio.js';

const Option = Select.Option;

export default class ProjInfoExportHead extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            mainDeptVisible: false,
            dept_name: '',
        };
    }
    /**
     * 功能：隐藏主责部门模态框显示
     */
    hideMainDept = () => {
        this.setState({ mainDeptVisible: false });
    };
    /**
   * 功能：选择主责部门模态框关闭
   */
    hideMainDeptModel = () => {
        this.props.dispatch({
            type: 'projInfoExport/setInputOrSelectShow',
            value: this.refs.mainDeptRadioGroup.getData().dept_name,
            objParam: 'arg_dept_name',
        });
        this.setState({
            mainDeptVisible: false,
            dept_name: this.refs.mainDeptRadioGroup.getData().dept_name,
        });
    };
    /**
     * 作者：夏天
     * 功能：设置是选择框的值
     * @param key 选择的key
     * @param objParam 输入的对象参数
     */
    setSelectShow = (key, objParam) => {
        this.props.dispatch({
            type: 'projInfoExport/setInputOrSelectShow',
            value: key,
            objParam: objParam,
        });
    };
    /**
    * 功能：选择主责部门模态框显示
    */
    showMainDeptModel = () => {
        this.setState({ mainDeptVisible: true });
    };

    render() {
        const {
            tableParam,
            allDepartment,
            allSearchProjType,
            allComonProjType,
            allOu,
            allProjTag,
            startAndEndYear,
        } = this.props;
        const optionDepartment = allDepartment.map((item) => {
            return (
                <Option key={item.pu_dept_name} value={item.pu_dept_name}>
                    {item.pu_dept_name}
                </Option>
            );
        });
        const optionSearchProjType = allSearchProjType.map((item) => {
            return (<Option key={item.type_id} value={item.type_id}>{item.type_name}</Option>);
        });
        const optionComonProjType = allComonProjType.map((item) => {
            return (<Option key={item.type_name} value={item.type_name}>{item.type_name}</Option>);
        });
        const optionOu = allOu.map((item) => {
            return (
                <Option key={item.ou_remarks} value={item.ou_remarks}>{item.ou_remarks}</Option>
            );
        });
        const optionProjTag = allProjTag.map((item) => {
            return (
                <Option key={item.proj_tag} value={item.proj_tag}>{item.proj_tag_show}</Option>
            );
        });
        const startYear = (startAndEndYear.beginYears || '').split(',').map((item) => {
            return (<Option key={item} value={item}>{item}</Option>);
        });
        const endYear = (startAndEndYear.endYears || '').split(',').map((item) => {
            return (<Option key={item} value={item}>{item}</Option>);
        });
        return (
            <div style={{ marginTop: 5 ,textAlign:"center"}}>
                <Row gutter={16} >
                    <Col span={8} >
                        <span>归属部门：</span>
                        <Select
                            showSearch
                            optionFilterProp="children"
                            style={{ width: 250 }}
                            value={tableParam.arg_pu_dept_name === '' ? 'defaultAll' : tableParam.arg_pu_dept_name}
                            onSelect={(key) => this.setSelectShow(key, 'arg_pu_dept_name')}
                        >
                            <Option value="defaultAll">{'全部'}</Option>
                            {optionDepartment}
                        </Select>
                    </Col>
                    <Col span={8} >
                        <span>主建单位：</span>
                        <Select
                            showSearch
                            optionFilterProp="children"
                            style={{ width: 250 }}
                            value={tableParam.arg_ou === '' ? 'defaultAll' : tableParam.arg_ou}
                            onSelect={(key) => this.setSelectShow(key, 'arg_ou')}
                        >
                            <Option value="defaultAll">{'全部'}</Option>
                            {optionOu}
                        </Select>
                    </Col>
                    <Col span={8} >
                        <span>项目分类：</span>
                        <Select
                            showSearch
                            optionFilterProp="children"
                            style={{ width: 250 }}
                            value={tableParam.arg_proj_label === '' ? 'defaultAll' : tableParam.arg_proj_label}
                            onSelect={(key) => this.setSelectShow(key, 'arg_proj_label')}
                        >
                            <Option value="defaultAll">{'全部'}</Option>
                            {optionSearchProjType}
                        </Select>
                    </Col>
                </Row>
                <Row gutter={16} style={{ marginTop: 5 }}>
                    <Col span={8} >
                        <span>项目类型：</span>
                        <Select
                            showSearch
                            optionFilterProp="children"
                            style={{ width: 250 }}
                            value={tableParam.arg_proj_type === '' ? 'defaultAll' : tableParam.arg_proj_type}
                            onSelect={(key) => this.setSelectShow(key, 'arg_proj_type')}
                        >
                            <Option value="defaultAll">{'全部'}</Option>
                            {optionComonProjType}
                        </Select>
                    </Col>
                    <Col span={8}>
                        <span>主建部门：</span>
                        <Input
                            style={{ width: 250 }}
                            value={tableParam.arg_dept_name}
                            onClick={this.showMainDeptModel}
                        />
                        <Modal
                            key="arg_dept_name"
                            visible={this.state.mainDeptVisible}
                            width={config.DEPT_MODAL_WIDTH}
                            title="选择部门"
                            onCancel={this.hideMainDept}
                            footer={[
                                <Button
                                    key="mainDeptNameClose"
                                    size="large"
                                    onClick={this.hideMainDept}>关闭</Button>,
                                <Button
                                    key="mainDeptNameConfirm"
                                    type="primary"
                                    size="large"
                                    onClick={this.hideMainDeptModel}>确定</Button>,
                            ]}
                        >
                            <div>
                                <DeptRadioGroup ref="mainDeptRadioGroup" />
                            </div>
                        </Modal>
                    </Col>
                    <Col span={8}>
                        <span>项目状态：</span>
                        <Select
                            showSearch
                            optionFilterProp="children"
                            style={{ width: 250 }}
                            value={tableParam.arg_proj_tag}
                            onSelect={(key) => this.setSelectShow(key, 'arg_proj_tag')}
                        >
                            {optionProjTag}
                        </Select>
                    </Col>
                </Row>
                <Row gutter={16} style={{ marginTop: 5 }}>
                    <Col span={8}>
                        <span>启动年份：</span>
                        <Select
                            showSearch
                            optionFilterProp="children"
                            style={{ width: 250 }}
                            value={tableParam.arg_begin_year === '' ? 'defaultAll' : tableParam.arg_begin_year}
                            onSelect={(key) => this.setSelectShow(key, 'arg_begin_year')}
                        >
                            <Option value="defaultAll">{'全部'}</Option>
                            {startYear}
                        </Select>
                    </Col>
                    <Col span={8}>
                        <span>结束年份：</span>
                        <Select
                            showSearch
                            optionFilterProp="children"
                            style={{ width: 250 }}
                            value={tableParam.arg_end_year === '' ? 'defaultAll' : tableParam.arg_end_year}
                            onSelect={(key) => this.setSelectShow(key, 'arg_end_year')}
                        >
                            <Option value="defaultAll">{'全部'}</Option>
                            {endYear}
                        </Select>
                    </Col>
                </Row>
            </div>
        );
    }
}
