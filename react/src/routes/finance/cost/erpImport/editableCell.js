/**
 * 作者：张楠华
 * 日期：2018-8-26
 * 邮箱：zhangnh6@chinaunicom.cn
 * 文件说明：表格编辑
 */
import React from 'react';
import styles from '../feeManager/costmainten.less';
import { Input, Icon } from 'antd';
import {MoneyComponentEditCell} from '../costCommon.js';
export default class EditableCell extends React.Component {
  state = {
    editable: false,
    value : this.props.value,
  };
  handleChange = (e) => {
    let value = e.target.value;
    let isMinus = false;
    //如果以 — 开头
    if (value.indexOf('-') === 0) {
      isMinus = true;
    }

    //先将非数值去掉
    value = value.replace(/[^\d.]/g, '');
    //如果以小数点开头，或空，改为0
    if (value === '.') { value = '0'}
    //如果输入两个小数点，去掉一个
    if (value.indexOf('.') !== value.lastIndexOf('.')) {
      value = value.substring(0, value.lastIndexOf('.'))
    }
    //如果有小数点
    if (value.indexOf('.') >= 1 && value.indexOf('.') !== value.length - 1) {
      //费用项，最多2位小数
      value = value.substring(0, value.indexOf('.') + 3);
    }
    if(isMinus === true){
      value = '-' + value;
    }
    // if(this.props.changeValue){
    //   this.props.changeValue(value,this.props.feeName,this.props.record);
    // }
    this.setState({value})
  };
  //点击check掉服务，将项目编号等传出去，即可更新数据
  check = () => {
    this.setState({ editable: false });
    if(this.props.onCellChange){
      this.props.onCellChange(this.state.value,this.props.feeName,this.props.record);
    }
  };
  edit = () => {
    this.setState({ editable: true });
  };
  close = () => {
    this.setState({ editable: false,value:this.props.value });
  };
  componentWillReceiveProps(nextProps){
      this.setState({
        value : nextProps.value
      })

  }
  render() {
    const { editable,value } = this.state;
    return (
      <div className={styles.editableCell}>
        {
          this.props.disabled?
            <MoneyComponentEditCell text={value || ' '}/>
            :
            editable ?
              <div className={styles.editableCellInputWrapper}>
                <Input
                  value={value}
                  onChange={this.handleChange}
                  onPressEnter={this.check}
                />
                <Icon
                  type="close"
                  className={styles.editableCellIconClose}
                  onClick={this.close}
                />
                <Icon
                  type="check"
                  className={styles.editableCellIconCheck}
                  onClick={this.check}
                />
              </div>
              :
              <div className={styles.editableCellTextWrapper}>
                <MoneyComponentEditCell text={value || ' '}/>
                <Icon
                  type="edit"
                  className={styles.editableCellIcon}
                  onClick={this.edit}
                />
              </div>
        }
      </div>
    );
  }
}
