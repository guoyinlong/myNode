/**
 * 作者：杨青
 * 日期：2018-10-8
 * 邮箱：yangq41@chinaunicom.cn
 * 功能：年度预算
 */
import { Checkbox,Modal,Row } from 'antd';
const CheckboxGroup = Checkbox.Group;

export default class SelectDeptModule extends React.Component {
  state = {
    indeterminate: false,
    checkAll: true,
    visible:false,
  };
  onChange = (checkedList) => {
    const { flag } = this.props;
    this.setState({
      indeterminate: !!checkedList.length && (checkedList.length < this.props.plainOptions.length),
      checkAll: checkedList.length === this.props.plainOptions.length,
    });
    this.props.dispatch({
      type : flag ==='1' ? 'annualBudget/onChangeCheckList': flag === '2' ?'budgetImplementation/onChangeCheckList': flag === '3' ? 'rollingBudget/onChangeCheckList': 'monthlyBudgetCompletion/onChangeCheckList',
      checkedList,
    })
  };
  onCheckAllChange = (e) => {
    const { flag } = this.props;
    this.setState({
      indeterminate: false,
      checkAll: e.target.checked,
    });
    let all = [];
    this.props.plainOptions.map((item)=>{
      all.push(item.props.children.props.value);
    });
    this.props.dispatch({
      type : flag ==='1' ? 'annualBudget/onChangeCheckList': flag === '2' ?'budgetImplementation/onChangeCheckList': flag === '3' ? 'rollingBudget/onChangeCheckList': 'monthlyBudgetCompletion/onChangeCheckList',
      checkedList: e.target.checked ? all : [],
    })
  };
  showModule=(e,deptInfo)=>{
    this.setState({
      visible : true,
      deptFlagInfo : deptInfo,
    })
  };
  onCancel=()=>{
    this.setState({visible:false})
  };
  onChangeDept=()=>{
    // if( this.props.checkList.length !== 0){
      this.props.onChangeDept(this.props.checkList,this.state.checkAll);
      this.setState({visible : false});
    // }else{
    //   message.info('部门不能为空')
    // }

  };
  render() {
    return (
      <Modal
        title="选择部门"
        visible={this.state.visible}
        onOk={this.onChangeDept}
        onCancel={this.onCancel}
        width="400px"
      >
        <div>
          <div style={{ borderBottom: '1px solid #E9E9E9' }}>
            <Checkbox
              indeterminate={this.state.indeterminate}
              onChange={this.onCheckAllChange}
              checked={this.state.checkAll}
            >
              全部
            </Checkbox>
          </div>
          <br />
          {/*<CheckboxGroup style={{width:'350px'}} options={this.props.plainOptions} value={this.props.checkList} onChange={this.onChange} />*/}
          <Checkbox.Group style={{width:'350px'}} value={this.props.checkList} onChange={this.onChange}>
            <Row>
              {this.props.plainOptions}
            </Row>
          </Checkbox.Group>
        </div>
      </Modal>
    );
  }
}
