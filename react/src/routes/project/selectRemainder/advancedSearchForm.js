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
            <div style={{}}>
                <Row >
                    <Col span={14} className={styles.select}>
                    年度季度:&nbsp;&nbsp;
                            <Select style={{width:"90px"}} value={year} onChange={(value)=>handleChange({'year':value,'season':season})} >
                                {yearOption}
                            </Select>
                            &nbsp;&nbsp;
                            <Select style={{width:"90px"}} value={season}  onChange={(value)=>handleChange({'year':year,'season':value})} >
                                <Option value="1">一季度</Option>
                                <Option value="2">二季度</Option>
                                <Option value="3">三季度</Option>
                                <Option value="4">四季度</Option>
                            </Select>

                    </Col>
                </Row>
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
