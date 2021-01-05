/**
 * 作者：任华维
 * 日期：2017-10-21
 * 邮箱：renhw21@chinaunicom.cn
 * 文件说明：查询表单
 */
import React, { Component } from "react";
import { Form, Row, Col, Input, Button, Icon, Select, Modal } from "antd";
import AdvancedSearchFormButton from "./advancedSearchFormButton";
import DeptRadioGroup from "../../../../components/common/deptRadio.js";
import styles from "./advancedSearchForm.less";
import config from "../../../../utils/config";
const FormItem = Form.Item;
const Option = Select.Option;
class AdvancedSearchForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expand: false,
      visible: false,
    };
  }
  showModal = () => {
    this.setState({ visible: true });
  };
  modalOk = () => {
    const value = this.refs.mainDeptRadioGroup.getData().dept_name;
    const deptId = this.refs.mainDeptRadioGroup.getData().dept_id;
    this.props.search({ projMainDep: deptId });
    this.props.form.setFieldsValue({
      projMainDep: value.includes("-") ? value.split("-")[1] : value,
    });
    this.setState({ visible: false });
  };
  modalCancel = () => {
    this.setState({ visible: false });
  };
  handleSearch = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      console.log("Received values of form: ", values);
    });
  };
  reset = () => {
    this.props.form.resetFields();
    this.props.search();
  };
  toggle = () => {
    const { expand } = this.state;
    this.setState({ expand: !expand });
  };
  getFields = () => {
    const { getFieldDecorator } = this.props.form;
    const { expand } = this.state;
    const { search } = this.props;
    const ouOpt = this.props.ouSource.map((item, index) => {
      return (
        <Option key={index} value={item.id}>
          {item.ouName}
        </Option>
      );
    });
    const puOpt = this.props.puSource.map((item, index) => {
      return (
        <Option key={index} value={item.puDeptId}>
          {item.puDeptName.split("-")[1]}
        </Option>
      );
    });
    const typeOpt = this.props.typeSource.map((item, index) => {
      return (
        <Option key={index} value={item.type_name}>
          {item.type_name_show}
        </Option>
      );
    });
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };
    return (
      <fieldset style={{ border: "none" }}>
        <Row gutter={20}>
          <Col span={7}>
            <FormItem {...formItemLayout} label="团队名称">
              {getFieldDecorator("projName")(
                <Input
                  placeholder=""
                  onPressEnter={(e) =>
                    search({ projName: e.target.value })
                  }
                  onBlur={(e) => search({ projName: e.target.value })}
                />
              )}
            </FormItem>
          </Col>
          <Col span={7}>
            <FormItem {...formItemLayout} label="项目经理">
              {getFieldDecorator("marName")(
                <Input
                  placeholder=""
                  onPressEnter={(e) => search({ marName: e.target.value })}
                  onBlur={(e) => search({ marName: e.target.value })}
                />
              )}
            </FormItem>
          </Col>
          <Col span={7}>
            <FormItem {...formItemLayout} label="生产编码">
              {getFieldDecorator("projCode")(
                <Input
                  placeholder=""
                  onPressEnter={(e) =>
                    search({ projCode: e.target.value })
                  }
                  onBlur={(e) => search({ projCode: e.target.value })}
                />
              )}
            </FormItem>
          </Col>
          <Col span={3}>
            <span
              onClick={this.toggle}
              style={{
                display: "inline-block",
                marginTop: 7,
                marginLeft: 20,
                cursor: "pointer",
                color: "#f04134",
              }}
            >
              {this.state.expand ? (
                <span>
                  收起<Icon type="up-circle-o"></Icon>
                </span>
              ) : (
                <span>
                  展开<Icon type="down-circle-o"></Icon>
                </span>
              )}
            </span>
          </Col>
        </Row>
        <Row gutter={20} style={{ display: expand ? "block" : "none" }}>
          <Col span={7}>
            <FormItem {...formItemLayout} label="项目类型">
              {getFieldDecorator("projKind", {
                initialValue: "",
              })(
                <Select onChange={(value) => search({ projKind: value })}>
                  {[
                    <Option value="" key="-1">
                      全部
                    </Option>,
                    ...typeOpt,
                  ]}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={7}>
            <FormItem {...formItemLayout} label="项目分类">
              {getFieldDecorator("projType", {
                initialValue: "",
              })(
                <Select onChange={(value) => search({ projType: value })}>
                  <Option value="">全部</Option>
                  <Option value="0">项目类</Option>
                  <Option value="3">项目类(纯第三方)</Option>
                  <Option value="1">小组类</Option>
                  <Option value="2">支撑类</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={7}>
            <FormItem {...formItemLayout} label="主建单位">
              {getFieldDecorator("ouId", {
                initialValue: "",
              })(
                <Select onChange={(value) => search({ ouId: value })}>
                  {[
                    <Option value="" key="-1">
                      全部
                    </Option>,
                    ...ouOpt,
                  ]}
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={20} style={{ display: expand ? "block" : "none" }}>
          <Col span={7}>
            <FormItem {...formItemLayout} label="归属部门">
              {getFieldDecorator("projBelongDep", {
                initialValue: "",
              })(
                <Select onChange={(value) => search({ projBelongDep: value })}>
                  {[
                    <Option value="" key="-1">
                      全部
                    </Option>,
                    ...puOpt,
                  ]}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={7}>
            <FormItem {...formItemLayout} label="主建部门">
              {getFieldDecorator("projMainDep", {
                rules: [],
              })(<Input placeholder="" onClick={this.showModal} readOnly />)}
            </FormItem>
            <Modal
              visible={this.state.visible}
              width={config.DEPT_MODAL_WIDTH}
              title="选择部门"
              onOk={this.modalOk}
              onCancel={this.modalCancel}
              footer={[
                <Button key="cancel" size="large" onClick={this.modalCancel}>
                  关闭
                </Button>,
                <Button
                  key="submit"
                  type="primary"
                  size="large"
                  onClick={this.modalOk}
                >
                  确定
                </Button>,
              ]}
            >
              <div>
                <DeptRadioGroup ref="mainDeptRadioGroup" />
              </div>
            </Modal>
          </Col>
        </Row>
      </fieldset>
    );
  };

  render() {
    const { caihaoSearch, isCaiHao } = this.props;
    return (
      <Form
        className={styles["ant-advanced-search-form"]}
        onSubmit={this.handleSearch}
      >
        {this.getFields()}
        <AdvancedSearchFormButton
          handleReset={this.reset}
          handleSearch={caihaoSearch}
          isCaiHao={isCaiHao}
        ></AdvancedSearchFormButton>
      </Form>
    );
  }
}

export default Form.create()(AdvancedSearchForm);
