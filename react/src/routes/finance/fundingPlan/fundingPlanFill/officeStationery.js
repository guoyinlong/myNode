/**
 * 作者：邓广晖
 * 创建日期：2018-03-13
 * 邮件：denggh6@chinaunicom.cn
 * 文件说明：办公用品对话框
 */

import React from 'react';
import {Checkbox,Row,Col} from 'antd';

/**
 * 作者：邓广晖
 * 创建日期：2018-03-13
 * 功能：办公用品对话框
 */
class OfficeStationery extends React.PureComponent {

  state = {
    selectedList:[],       //缓存勾选的类别的ID(supplies_uuid),和名称(supplies_name)
  };

  /**
   * 作者：邓广晖
   * 创建日期：2018-03-13
   * 功能：勾选办公产品
   * @param checkedValues 勾选的值
   */
  selectOfficeStationery = (checkedValues) => {
    const {ordinalStationery} = this.props;
    let selectedList = [];
    for (let i = 0; i < checkedValues.length; i++) {
      for (let j = 0 ; j < ordinalStationery.length; j++) {
        if (checkedValues[i] === ordinalStationery[j].supplies_uuid) {
          selectedList.push(ordinalStationery[j]);
          break;
        }
      }
    }
    this.setState({
      selectedList:[...selectedList]
    });
  };

  render() {
    //officeStationery  办公用品可选择数据
    //officeDataList    表格数据，这里主要用来过滤已经选择的
    let {officeStationery,officeDataList} = this.props;
    let showList = officeStationery.map((sectionItem,sectionIndex)=>{
      let checkeBoxOptions = sectionItem.chlidRows;
      let sectionOption = checkeBoxOptions.map((checkItem,checkIndex)=>{
        //判断是否已经在表格列表中
        let isSelected = false;
        for (let i = 0; i < officeDataList.length; i++) {
          if(checkItem.supplies_uuid === officeDataList[i].supplies_uuid){
            isSelected = true;
            break;
          }
        }
        return (
          <Col span={7} offset={1} key={checkIndex}>
            <Checkbox
              value={checkItem.supplies_uuid}
              style={{paddingBottom:'2px'}}
              disabled={isSelected}
            >
              {checkItem.supplies_name}
            </Checkbox >
          </Col>
        );
      });
      return (
        <div key={sectionIndex}>
          <div style={{fontSize:17,fontWeight:'bold',borderBottom:'1px solid gainsboro'}}>
            {sectionItem.cla_name}
          </div>
          <Row style={{marginBottom:5}}>
            {sectionOption}
          </Row>
        </div>
      )
    });

    return (
      <div style={{paddingBottom:5,marginBottom:5}}>
        <Checkbox.Group onChange={this.selectOfficeStationery}>
          {showList}
        </Checkbox.Group>
      </div>
    );
  }
}

export default OfficeStationery;
