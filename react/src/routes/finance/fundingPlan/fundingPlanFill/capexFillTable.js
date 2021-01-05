/**
 *  作者: 邓广晖
 *  创建日期: 2018-03-14
 *  邮箱：denggh6@chinaunicom.cn
 *  文件说明：capex填报
 */
import {Button,Table, Input, Select,Tabs,Icon,Modal,message,Popconfirm,Tooltip,Menu,Checkbox} from 'antd';
import {getUuid} from '../../../../components/commonApp/commonAppConst.js';
import styles from './planFill.less';

/**
 *  作者: 邓广晖
 *  创建日期: 2018-03-14
 *  邮箱：denggh6@chinaunicom.cn
 *  功能：capex填报
 */
class CapexFillTable extends React.PureComponent {

  state = {
    capexDataList:[...this.props.capexDataList],
  };

  /**
   * 作者：邓广晖
   * 创建日期：2018-03-14
   * 功能：新增数据
   * @param e 输入事件
   * @param index 编辑行所在的索引值
   * @param colType 编辑单元格所在的列名
   */
  addCapexCellData = (e,index,colType) => {
    let {capexDataList} = this.state;
    let dataLength = capexDataList.length;
    capexDataList.push({
      capex_uid:this.props.subjectObj.uuid,
      capex_sub_name:this.props.subjectObj.fee_name,
      proj_approval_year:this.props.fundStageData.plan_year,
      approved_proj_name:'',
      approved_item_number:'',
      total_proj_budget:'',
      contract_title:'',
      contract_amount:'',
      accumulated_amount_paid:'',
      payment_amount_this_month:'',
      key:dataLength
    });
    this.setState({
      capexDataList:[...capexDataList]
    });
  };

  /**
   * 作者：邓广晖
   * 创建日期：2018-03-14
   * 功能：编辑输入框
   * @param e 输入事件
   * @param index 编辑行所在的索引值
   * @param colType 编辑单元格所在的列名
   */
  editCapexCellData = (e,index,colType) => {
    let value = e.target.value;
    //对于金额类，需要处理
    if (colType === 'total_proj_budget' || colType === 'contract_amount' ||
        colType === 'accumulated_amount_paid' || colType === 'payment_amount_this_month'
    ) {
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
    }
    let {capexDataList} = this.state;
    capexDataList[index][colType] = value;
    this.setState({
      capexDataList:[...capexDataList]
    });
  };

  /**
   * 作者：邓广晖
   * 创建日期：2018-03-14
   * 功能：删除capex
   * @param index 办公用品索引值
   */
  deleteCapexData = (index) => {
    let {capexDataList} = this.state;
    //直接删除这条记录
    capexDataList.splice(index,1);
    //处理之后将key值重排
    for(let i = 0; i < capexDataList.length; i++){
      capexDataList[i].key = i;
    }
    this.setState({
      capexDataList:[...capexDataList]
    });
  };

  capexColumns = [
    {
      title: '序号',
      dataIndex: '',
      width:'10%',
      render:(text, record, index) => {
        return (<div>{index+1}</div>);
      }
    },{
      title: '项目批复年度',
      dataIndex: 'proj_approval_year',
      width:'10%',
    },{
      title: '批复项目名称',
      dataIndex: 'approved_proj_name',
      width:'10%',
      render: (text, record, index) => {
        return (
          <Input
            value={text}
            disabled={false}
            maxLength='100'
            onChange={(e)=>this.editCapexCellData(e,record.key,'approved_proj_name')}
          />
        );
      },
    },{
      title: '批复项目编号',
      dataIndex: 'approved_item_number',
      width:'10%',
      render: (text, record, index) => {
        return (
          <Input
            value={text}
            disabled={false}
            maxLength='100'
            onChange={(e)=>this.editCapexCellData(e,record.key,'approved_item_number')}
          />
        );
      },
    },{
      title: '项目总预算',
      dataIndex: 'total_proj_budget',
      width:'10%',
      render: (text, record, index) => {
        return (
          <Input
            value={text}
            disabled={false}
            maxLength='12'
            onChange={(e)=>this.editCapexCellData(e,record.key,'total_proj_budget')}
          />
        );
      },
    },{
      title: '合同名称',
      dataIndex: 'contract_title',
      width:'10%',
      render: (text, record, index) => {
        return (
          <Input
            value={text}
            disabled={false}
            maxLength='100'
            onChange={(e)=>this.editCapexCellData(e,record.key,'contract_title')}
          />
        );
      },
    },{
      title: '合同总金额',
      dataIndex: 'contract_amount',
      width:'10%',
      render: (text, record, index) => {
        return (
          <Input
            value={text}
            disabled={false}
            maxLength='12'
            onChange={(e)=>this.editCapexCellData(e,record.key,'contract_amount')}
          />
        );
      },
    },{
      title: '累计已支付金额',
      dataIndex: 'accumulated_amount_paid',
      width:'10%',
      render: (text, record, index) => {
        return (
          <Input
            value={text}
            disabled={false}
            maxLength='12'
            onChange={(e)=>this.editCapexCellData(e,record.key,'accumulated_amount_paid')}
          />
        );
      },
    },{
      title: '本月付款金额',
      dataIndex: 'payment_amount_this_month',
      width:'10%',
      render: (text, record, index) => {
        return (
          <Input
            value={text}
            disabled={false}
            maxLength='12'
            onChange={(e)=>this.editCapexCellData(e,record.key,'payment_amount_this_month')}
          />
        );
      },
    },
    {
      title: '操作',
      dataIndex: '',
      width:'10%',
      render: (text, record, index) => {
        return (
          <Popconfirm title="确定删除吗?" onConfirm={()=>this.deleteCapexData(record.key)}>
            <Button size='small' type="danger"  ghost>{'删除'}</Button>
          </Popconfirm>
        );
      },
    }
  ];

  render(){
    let {capexDataList} = this.state;
    let capexMoneySum = 0;
    for( let i = 0; i < capexDataList.length; i++){
      capexMoneySum += Number(capexDataList[i].payment_amount_this_month);
    }
    capexMoneySum = capexMoneySum.toFixed(2);
    return(
      <div>
        {/*追加阶段，如果是预填报审核通过的，可编辑，这里只用审核通过来判断，因为，审核通过的能弹出对话框的一定是预填报通过的*/}
        {/*{this.props.fundStage === '2' && this.props.stateCode === '3'?
          null
          :
          <Button onClick={this.addCapexCellData} type='primary'>新增</Button>
        }*/}
        <Button onClick={this.addCapexCellData} type='primary'>新增</Button>
        <div style={{textAlign:'right'}}>
          <span>本月付款总金额：</span><span style={{color:'red'}}>{capexMoneySum + '(元)'}</span>
        </div>
        <Table
          dataSource={this.state.capexDataList}
          columns={this.capexColumns}
          className={styles.fillTable}
          bordered={true}
          pagination={false}
        />
      </div>
    );
  }
}

export default CapexFillTable;
