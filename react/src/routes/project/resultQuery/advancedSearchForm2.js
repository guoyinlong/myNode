/**
 * 作者：任华维
 * 日期：2017-10-21
 * 邮箱：renhw21@chinaunicom.cn
 * 文件说明：查询表单
 */
import React, { Component } from 'react';
import { Form, Row, Col, Input, Button, Icon, Select} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
import moment from 'moment';
import styles from './projectTable.less';
class AdvancedSearchForm extends React.Component {
    constructor (props) {
        super(props);
    }
    getFields() {
        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 },
        };
        const {year,season,yearData,handleChange} = this.props;
        const yearOption = yearData.map((item, index) => {
            return (
                <Option key={index} value={item}>{item}</Option>
            )
        })
        return (
            <div >终止时间：


                            <Select style={{width:"70px"}} value={year} onChange={(value)=>handleChange({'endYear':value,'endSeason':season})} >
                                {yearOption}
                            </Select>
                            &nbsp;&nbsp;
                            <Select style={{width:"80px"}} value={season} onChange={(value)=>handleChange({'endYear':year,'endSeason':value})} >
                                <Option value="1">一季度</Option>
                                <Option value="2">二季度</Option>
                                <Option value="3">三季度</Option>
                                <Option value="4">四季度</Option>
                            </Select>


            </div>
        );
    }

    render() {
        return (
            <Form className="ant-advanced-search-form">
                {this.getFields()}
            </Form>
        );
    }
}

export default Form.create()(AdvancedSearchForm);
