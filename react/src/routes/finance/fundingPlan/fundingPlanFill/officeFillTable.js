/**
 *  作者: 邓广晖
 *  创建日期: 2018-03-14
 *  邮箱：denggh6@chinaunicom.cn
 *  文件说明：办公费填报
 */
import {Button,Table, Input,Icon,Modal,message,Popconfirm} from 'antd';
import {getUuid} from '../../../../components/commonApp/commonAppConst.js';
import OfficeStationery  from './officeStationery';
import styles from './planFill.less';

/**
 *  作者: 邓广晖
 *  创建日期: 2018-03-14
 *  邮箱：denggh6@chinaunicom.cn
 *  功能：办公费填报
 */
class OfficeFillTable extends React.PureComponent {

  state = {
    stationeryVisible:false,                                //选择办公用品对话框的显示状态
    officeDataList:[...this.props.officeDataList],
  };

  /**
   * 作者：邓广晖
   * 创建日期：2018-03-14
   * 功能：编辑办公费输入框
   * @param e 输入事件
   * @param index 编辑行所在的索引值
   * @param colType 编辑单元格所在的列名
   */
  editOfficeCellData = (e,index,colType) => {
    //先将非数值去掉
    let value = e.target.value.replace(/[^\d.]/g, '');
    if (colType === 'funds_plan') {
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
    } else if (colType === 'quantity') {
      if (value === '0') { value = ''}
      //如果输入小数点，去掉
      if (value.indexOf('.') >= 0) {
        value = value.substring(0, value.indexOf('.'))
      }
    }
    let {officeDataList} = this.state;
    officeDataList[index][colType] = value;
    this.setState({
      officeDataList:[...officeDataList]
    });
  };

  /**
   * 作者：邓广晖
   * 创建日期：2018-03-14
   * 功能：判断办公用品数量，离开输入框时判断
   * @param e 输入事件
   * @param index 编辑行所在的索引值
   * @param colType 编辑单元格所在的列名
   */
  judgeQuantity = (e,index,colType) => {
    let value = e.target.value;
    let {officeDataList} = this.state;
    if (value === '' || Number(value) === 0) {
      value = '1';
      message.info(officeDataList[index].supplies_name + '的数量不能为空，不能为0，至少为1');
    }
    officeDataList[index][colType] = value;
    this.setState({
      officeDataList:[...officeDataList]
    });
  };

  /**
   * 作者：邓广晖
   * 创建日期：2018-03-14
   * 功能：改变办公用品数量
   * @param index 办公用品索引值
   * @param value 当前值
   * @param changeType 改变类型，增加（add）或者减少（minus）
   */
  changeQuantity = (value,index,changeType) => {
    let {officeDataList} = this.state;
    if (changeType === 'add') {
      value = (Number(value) + 1).toString();
    } else if (changeType === 'minus') {
      value = (Number(value) - 1).toString();
    }
    officeDataList[index].quantity = value;
    this.setState({
      officeDataList:[...officeDataList]
    });
  };

  /**
   * 作者：邓广晖
   * 创建日期：2018-03-14
   * 功能：删除办公用品
   * @param index 办公用品索引值
   */
  deleteOfficeData = (index) => {
    let {officeDataList} = this.state;
    //直接删除这条记录
    officeDataList.splice(index,1);
    //处理之后将key值重排
    for(let i = 0; i < officeDataList.length; i++){
      officeDataList[i].key = i;
    }
    this.setState({
      officeDataList:[...officeDataList]
    });
  };

  /**
   * 作者：邓广晖
   * 创建日期：2018-03-14
   * 功能：添加办公用品
   */
  addOfficeStationery = () => {
    this.setState({
      stationeryVisible:true
    });
  };

  /**
   * 作者：邓广晖
   * 创建日期：2018-03-14
   * 功能：选择办公用品对话框关闭
   * @param flag 关闭对话框时的标志，为confirm，cancel
   */
  hideStationeryModal=(flag)=>{
    if(flag === 'confirm'){
      let {selectedList} = this.refs.officeStationery.state;
      let {officeDataList} = this.state;
      let dataLength = officeDataList.length;
      if (selectedList.length > 0) {
        for (let i = 0; i < selectedList.length; i++) {
          officeDataList.push({
            supplies_name:selectedList[i].supplies_name,
            supplies_uuid:selectedList[i].supplies_uuid,
            funds_plan:'',
            quantity:'1',
            key:dataLength + i
          });
        }
      }
      this.setState({
        officeDataList:[...officeDataList]
      });
    }
    this.setState({stationeryVisible:false})
  };

  officeColumns = [
    {
      title: '序号',
      dataIndex: '',
      width:'17%',
      render:(text, record, index) => {
        return (<div>{index+1}</div>);
      }
    },{
      title: '商品',
      dataIndex: 'supplies_name',
      width:'26%',
      render:(text, record, index) => {
        return (<div style={{textAlign:'left'}}>{text}</div>);
      }
    },
    {
      title: '单价',
      dataIndex: 'funds_plan',
      width:'20%',
      render:(text, record, index) => {
        return (
          <Input
            value={text}
            maxLength='12'
            onChange={(e)=>this.editOfficeCellData(e,record.key,'funds_plan')}
          />
        );
      },
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      width:'23%',
      render:(text, record, index) => {
        return (
          <div>
            {Number(text) <= 1 ?
              <Icon
                type='minus-circle-o'
                style={{color:'gainsboro',marginRight:7}}
              />
              :
              <Icon
                type='minus-circle-o'
                style={{marginRight:7,cursor:'pointer'}}
                onClick={()=>this.changeQuantity(text,record.key,'minus')}
              />
            }
            <Input
              value={text}
              style={{width:'45px'}}
              maxLength='12'
              onChange={(e)=>this.editOfficeCellData(e,record.key,'quantity')}
              onBlur={(e)=>this.judgeQuantity(e,record.key,'quantity')}
            />
            <Icon
              type='plus-circle-o'
              style={{marginLeft:7,cursor:'pointer'}}
              onClick={()=>this.changeQuantity(text,record.key,'add')}
            />
          </div>

        );
      },
    },
    {
      title: '操作',
      dataIndex: '',
      width:'12%',
      render: (text, record, index) => {
        return (
          <Popconfirm title="确定删除吗?" onConfirm={()=>this.deleteOfficeData(record.key)}>
            <Button size='small' type="danger"  ghost>{'删除'}</Button>
          </Popconfirm>
        );
      },
    }
  ];

  render(){
    let {officeDataList} = this.state;
    let officeMoneySum = 0;
    for( let i = 0; i < officeDataList.length; i++){
      officeMoneySum += Number(officeDataList[i].funds_plan) * Number(officeDataList[i].quantity);
    }
    officeMoneySum = officeMoneySum.toFixed(2);

    return(
      <div>
        {/*追加阶段，如果是预填报审核通过的，可编辑，这里只用审核通过来判断，因为，审核通过的能弹出对话框的一定是预填报通过的*/}
        {/*{this.props.fundStage === '2' && this.props.stateCode === '3'?
          null
          :
          <Button onClick={this.addOfficeStationery} type='primary'>新增</Button>
        }*/}

        <Button onClick={this.addOfficeStationery} type='primary'>新增</Button>
        <div style={{textAlign:'right'}}>
          <span>总金额：</span><span style={{color:'red'}}>{officeMoneySum + '(元)'}</span>
        </div>
        <Table
          dataSource={this.state.officeDataList}
          columns={this.officeColumns}
          className={styles.fillTable}
          bordered={true}
          pagination={false}
        />
        {/*办公用品选择对话框*/}
        <Modal
          title={'办公用品'}
          key={getUuid(20,62)}
          visible={this.state.stationeryVisible}
          width={'620px'}
          onOk={()=>this.hideStationeryModal('confirm')}
          onCancel={()=>this.hideStationeryModal('cancel')}
        >
          <OfficeStationery
            ref='officeStationery'
            officeStationery={this.props.officeStationery}
            ordinalStationery={this.props.ordinalStationery}
            officeDataList={this.state.officeDataList}
          />
        </Modal>
      </div>
    );
  }
}

export default OfficeFillTable;
