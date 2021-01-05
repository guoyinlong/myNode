/**
 * 作者：王旭东
 * 创建日期：2019-2-14
 * 邮箱：wangxd347@chinaunicom.cn
 *文件说明：
 */
import React from "react";
import {Table, Button, Modal, Checkbox, Row, Col, Input} from 'antd';
import Style from "./import.css";
import tableStyle from "../../../components/common/table.less";
import MgrRadio from "../../../components/common/mgrRadio.js"
import SelectPerson from "../../../components/common/selectPerson.js"

const CheckboxGroup = Checkbox.Group;

/**
 * 作者：王旭东
 * 创建日期：2019-2-13
 * 邮箱：wangxd347@chinaunicom.cn
 *文件说明：添加权限弹窗信息
 */

class AddAuthModal extends React.Component {
    state = {
        selectedKeys: ''
    }

    onChange = (values) => {
        this.props.lablesChange(values)
    }

    setSelectData = (selectedKeys) => {
        this.setState({
            selectedKeys,
        })
    }

    getSelectData = () => {
        return this.state.selectedKeys
    }


    render() {
        let {oneRecord, allMachList, notEditable,title,currentKey} = this.props;

        const chooseLabel = currentKey=="1"?(oneRecord || []).map(item => item.category_name):(oneRecord || []).map(item => item.report_name)

        const colList = allMachList.map(item =>{
              if(currentKey=="1"){
                return(    
               <Col span={12} style={{height: '30px'}} key={item.category_name}>
                <Checkbox
                    value={item.category_name}>{item.category_name}
                </Checkbox>
                </Col>)
           
              }else{
                return(
                <Col span={12} style={{height: '30px'}} key={item.name}>
                <Checkbox
                      value={item.name}>{item.name}
                  </Checkbox>
                  </Col> 
                )
              }
               })

        return (
            <div style={{marginLeft: 30}}>
                {
                    this.props.modalType === 'addModal' ?
                        <div style={{marginBottom: 10}}>
                            <span style={{marginBottom: 10}}>员工：</span>
                            <span>
                                <SelectPerson
                                    setSelectData={this.setSelectData}
                                    selectedKeys={this.state.selectedKeys}
                                    ref={'selectPerson'}
                                />
                            </span>
                        </div>
                        :
                        ''
                }

                <div style={{marginBottom: 10}}>
              <span>{title}:</span>
                    <div style={{marginTop: 10}}>
                        <Checkbox.Group
                            disabled={notEditable}
                            value={chooseLabel}
                            style={{width: '100%'}}
                            onChange={this.onChange}>
                            <Row>
                                {colList}
                            </Row>
                        </Checkbox.Group>
                    </div>
                </div>
            </div>
        )
    }
}

export default AddAuthModal;