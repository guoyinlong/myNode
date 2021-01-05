/**
 * 作者：任华维
 * 日期：2017-10-21
 * 邮箱：renhw21@chinaunicom.cn
 * 文件说明：查询表单
 */
import React, { Component } from 'react';
import { InputNumber  } from 'antd';

class EditableCell extends React.Component {
    constructor (props) {
        super(props);
    }
    handleChange = (value=0) => {
        const number = parseInt(value);
        if (number) {
            this.props.onChange(number);
        }
    }
    render() {
        const { text,record,max } = this.props;
        return (
            <div className="editable-cell">
                {
                record.state_desc === '1' ?
                    <InputNumber min={1} max={max} value={text} onChange={this.handleChange}/>
                    :
                    <span>{text}</span>
                }
            </div>
        );
    }
}

export default EditableCell
