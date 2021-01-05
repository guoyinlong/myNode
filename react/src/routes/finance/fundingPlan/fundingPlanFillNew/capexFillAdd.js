/**
 *  作者: 邓广晖
 *  创建日期: 2018-03-14
 *  邮箱：denggh6@chinaunicom.cn
 *  文件说明：capex填报
 */
import React from 'react';
import {Button,Table, Input,Modal,message } from 'antd';
import styles from './planFill.less';
const EMPTY_DATA = '输入项不能为空';
const { TextArea } = Input;
/**
 *  作者: 邓广晖
 *  创建日期: 2018-03-14
 *  邮箱：denggh6@chinaunicom.cn
 *  功能：capex填报
 */
class CapexFillAdd extends React.PureComponent {

  state = {
    chlidRowsIndex:'',                  //表格当前行 通过record.key 传入改的时候改当前行数据
    capexDataList:[],        // 通过record传入，当前行的数据 record.child
    capexVisible:false,
    subjectObj:{},          //切换科目时用到，因为如果切换回来需要改变当前行的数据 编辑的时候其实用不到，因为编辑时科目名称不会改变，只有在新增的时候才会用到

    //projList:[]
  };

  addCapexCellData = () => {
    let {capexDataList} = this.state;
    let dataLength = capexDataList.length;
    if(this.props.flag === 'pre'){
      capexDataList.push({
        uuid:'',
        capex_uid:this.state.subjectObj.uuid,
        capex_sub_name:this.state.subjectObj.fee_name,
        proj_approval_year:'',
        approved_proj_name:'',
        approved_item_number:'',
        total_proj_budget:'',
        contract_title:'',
        contract_amount:'',
        accumulated_amount_paid:'',
        payment_amount_this_month:'',
        key:dataLength,
        opt :'insert'
      });
    }else{
      capexDataList.push({
        uuid:'',
        capex_record_id:'',
        capex_uid:this.state.subjectObj.uuid,
        capex_sub_name:this.state.subjectObj.fee_name,
        proj_approval_year:'',
        approved_proj_name:'',
        approved_item_number:'',
        total_proj_budget:'',
        contract_title:'',
        contract_amount:'',
        accumulated_amount_paid:'',
        payment_amount_this_month:'',
        fill_state_code:'',
        adjust_state_code:'',
        adjust_payment_amount_this_month:'',
        key:dataLength,
        opt :'insert'
      });
    }
    this.setState({
      capexDataList:[...capexDataList]
    });
    if(this.props.isPriorYear === '1'){
      this.props.dispatch({
        type:'fundingPlanFillNew/changeDeleteToOtherMonth',
        index:this.state.chlidRowsIndex
      });
    }else{
      this.props.dispatch({
        type:'fundingPlanFillNew/changeDeleteToOther',
        index:this.state.chlidRowsIndex
      });
    }
  };

  editCapexCellData = (e,index,colType) => {
    let value = e.target ?e.target.value : e;
    //对于金额类，需要处理
    if (colType === 'total_proj_budget' || colType === 'contract_amount' ||
        colType === 'accumulated_amount_paid' || colType === 'payment_amount_this_month'|| colType === 'adjust_payment_amount_this_month' || colType ==='proj_approval_year'
    ) {
      let isMinus = false;
      // if (colType === 'funds_current_amount' || colType === 'funds_plan' ) {
      //如果以 — 开头
      if (value.indexOf('-') === 0) {
        isMinus = true;
      }
      //}
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
    }
    let {capexDataList} = this.state;
    capexDataList[index][colType] = value;
    capexDataList[index]['opt'] = 'edit';
    // if( colType === 'approved_proj_name'){
    //   capexDataList[index]['approved_item_number'] = this.state.projList.filter(i=>i.proj_name === value)[0] && this.state.projList.filter(i=>i.proj_name === value)[0].proj_code;
    // }
    this.setState({
      capexDataList:[...capexDataList]
    });
    if(this.props.isPriorYear === '1'){
      this.props.dispatch({ //当月
        type:'fundingPlanFillNew/changeDeleteToOtherMonth',
        index:this.state.chlidRowsIndex
      });
    }else{
      this.props.dispatch({ //以前年度
        type:'fundingPlanFillNew/changeDeleteToOther',
        index:this.state.chlidRowsIndex
      });
    }
  };

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


  showModule=(record,subjectObj,addOrEdit)=>{
    //let projList=(await service.getProjList({argou: '联通软件研究院本部', argyear: 2017, argmonth: 6})).DataRows || [];
    if(addOrEdit === 'add'){
      this.setState({
        chlidRowsIndex:record.key,                  //表格当前行
        capexDataList:[],        //将弹出框详细数据缓存在state
        capexVisible:true,
        subjectObj:subjectObj,
        orgData : [],
        //projList:projList
      });
    }else{
      this.setState({
        chlidRowsIndex:record.key,                  //表格当前行
        capexDataList:JSON.parse(JSON.stringify(record.childRows)),        //将弹出框详细数据缓存在state
        capexVisible:true,
        subjectObj:subjectObj,
        orgData:record.childRows,
        //projList:projList
      });
    }
  };
  hideCapexModal=(flag,capexMoneySum)=>{
    if(flag === 'confirm'){
      let capexTableData = this.state.capexDataList;
      if (capexTableData.length > 0) {
        if(this.props.flag === 'pre'){
          for (let i = 0; i < capexTableData.length; i++) {

            if (capexTableData[i].approved_proj_name.trim() === '') {
              message.info(EMPTY_DATA);
              return;
            }
            if (capexTableData[i].approved_item_number.trim() === '') {
              message.info(EMPTY_DATA);
              return;
            }
            if (capexTableData[i].total_proj_budget.trim() === '') {
              message.info(EMPTY_DATA);
              return;
            }
            if (capexTableData[i].contract_title.trim() === '') {
              message.info(EMPTY_DATA);
              return;
            }
            if (capexTableData[i].contract_amount.trim() === '') {
              message.info(EMPTY_DATA);
              return;
            }
            if (capexTableData[i].accumulated_amount_paid.trim() === '') {
              message.info(EMPTY_DATA);
              return;
            }
            if (!capexTableData[i].hasOwnProperty('payment_amount_this_month') ||capexTableData[i].payment_amount_this_month.trim() === '') {
              message.info(EMPTY_DATA);
              return;
            }
          }
        }else{
          for (let i = 0; i < capexTableData.length; i++) {

            if (capexTableData[i].approved_proj_name.trim() === '') {
              message.info(EMPTY_DATA);
              return;
            }
            if (capexTableData[i].approved_item_number.trim() === '') {
              message.info(EMPTY_DATA);
              return;
            }
            if (capexTableData[i].total_proj_budget.trim() === '') {
              message.info(EMPTY_DATA);
              return;
            }
            if (capexTableData[i].contract_title.trim() === '') {
              message.info(EMPTY_DATA);
              return;
            }
            if (capexTableData[i].contract_amount.trim() === '') {
              message.info(EMPTY_DATA);
              return;
            }
            if (capexTableData[i].accumulated_amount_paid.trim() === '') {
              message.info(EMPTY_DATA);
              return;
            }
            //数组中没有adjust_payment_amount_this_month，或者有他但是为空，都返回不能为空
            if (!capexTableData[i].hasOwnProperty('adjust_payment_amount_this_month') || capexTableData[i].adjust_payment_amount_this_month === '') {
              message.info(EMPTY_DATA);
              return;
            }
          }
        }

        for (let i = 0; i < capexTableData.length; i++){
          capexTableData[i].contract_title = capexTableData[i].contract_title.trim();
          capexTableData[i].approved_proj_name = capexTableData[i].approved_proj_name.trim();
          capexTableData[i].approved_item_number = capexTableData[i].approved_item_number.trim();
        }
        if(this.props.isPriorYear === '1'){ //当月

          this.props.dispatch({
            type:'fundingPlanFillNew/editCurrentCapexData',
            index:this.state.chlidRowsIndex,
            fillCapexData:capexTableData,
            subjectObj:this.state.subjectObj,
            capexMoneySum
          });
        }else{
          this.props.dispatch({ //以前年度
            type:'fundingPlanFillNew/editPriorYearCapexData',
            index:this.state.chlidRowsIndex,
            fillCapexData:capexTableData,
            subjectObj:this.state.subjectObj,
            capexMoneySum
          });
        }
      }else {
        message.info('请添加数据');
        return;
      }
    }
    this.setState({capexVisible:false})
  };
  render(){
    let {capexDataList} = this.state;
    let capexColumns=[];
    if(this.props.flag === 'pre'){
      capexColumns = [
        {
          title: '序号',
          dataIndex: '',
          width:'100px',
          render:(text, record, index) => {return (<div>{index+1}</div>);}
        },
        {
          title: '项目批复年度',
          dataIndex: 'proj_approval_year',
          width:'120px',
          render: (text, record) => {
            return (
              <Input
                value={text}
                disabled={false}
                onChange={(e)=>this.editCapexCellData(e,record.key,'proj_approval_year')}
              />
            );
          },
        },
        {
          title: '批复项目名称',
          dataIndex: 'approved_proj_name',
          width:'300px',
          render: (text, record) => {
            return (
              <Input
                value={text}
                disabled={false}
                onChange={(e)=>this.editCapexCellData(e,record.key,'approved_proj_name')}
              />
            );
          },
        },
        {
          title: '批复项目编号',
          dataIndex: 'approved_item_number',
          width:'200px',
          render: (text,record) => {
            return (
              <TextArea
                autosize
                value={text}
                disabled={false}
                onChange={(e)=>this.editCapexCellData(e,record.key,'approved_item_number')}
              />
            );
          },
        },
        {
          title: '项目总预算',
          dataIndex: 'total_proj_budget',
          width:'200px',
          render: (text, record) => {
            return (
              <Input
                value={text}
                disabled={false}
                onChange={(e)=>this.editCapexCellData(e,record.key,'total_proj_budget')}
              />
            );
          },
        },
        {
          title: '合同名称',
          dataIndex: 'contract_title',
          width:'280px',
          render: (text, record) => {
            return (
              <Input
                value={text}
                disabled={false}
                onChange={(e)=>this.editCapexCellData(e,record.key,'contract_title')}
              />
            );
          },
        },
        {
          title: '合同总金额',
          dataIndex: 'contract_amount',
          width:'200px',
          render: (text, record) => {
            return (
              <Input
                value={text}
                disabled={false}
                onChange={(e)=>this.editCapexCellData(e,record.key,'contract_amount')}
              />
            );
          },
        },
        {
          title: '累计已支付金额',
          dataIndex: 'accumulated_amount_paid',
          width:'200px',
          render: (text, record) => {
            return (
              <Input
                value={text}
                disabled={false}
                onChange={(e)=>this.editCapexCellData(e,record.key,'accumulated_amount_paid')}
              />
            );
          },
        },
        {
          title: '本月付款金额',
          dataIndex: 'payment_amount_this_month',
          width:'200px',
          render: (text, record) => {
            return (
              <Input
                value={text}
                disabled={false}
                onChange={(e)=>this.editCapexCellData(e,record.key,'payment_amount_this_month')}
              />
            );
          },
        },
        {
          title: '操作',
          dataIndex: '',
          width:'120px',
          render: (text, record) => {
            return (
              <a onClick={()=>this.deleteCapexData(record.key)}>{'删除'}</a>
            );
          },
        }
      ];
    }else{
      capexColumns = [
        {
          title: '序号',
          dataIndex: '',
          width:'50px',
          render:(text, record, index) => {return (<div>{index+1}</div>);}
        },
        {
          title: '项目批复年度',
          dataIndex: 'proj_approval_year',
          width:'120px',
          render: (text, record) => {
            if(record.fill_state_code === '3'){
              return(<div>{text}</div>)
            }else{
              return (
                <Input
                  value={text}
                  disabled={false}
                  onChange={(e)=>this.editCapexCellData(e,record.key,'proj_approval_year')}
                />
              );
            }
          },
        },
        {
          title: '批复项目名称',
          dataIndex: 'approved_proj_name',
          width:'300px',
          render: (text, record) => {
            if(record.fill_state_code === '3'){
              return(<div>{text}</div>)
            }else{
              return (
                <Input
                  value={text}
                  disabled={false}
                  maxLength='100'
                  onChange={(e)=>this.editCapexCellData(e,record.key,'approved_proj_name')}
                />
              );
              // return(
              //   <AutoComplete
              //     dataSource={this.state.projList.map((i)=>{return i.proj_name})}
              //     onChange={(value)=>this.editCapexCellData(value,record.key,'approved_proj_name')}
              //   />
              // )
            }
          },
        },
        {
          title: '批复项目编号',
          dataIndex: 'approved_item_number',
          width:'150px',
          render: (text, record) => {
            if(record.fill_state_code === '3'){
              return(<div>{text}</div>)
            }else{
              return (
                <TextArea
                  autosize
                  value={text}
                  disabled={false}
                  onChange={(e)=>this.editCapexCellData(e,record.key,'approved_item_number')}
                />
              );
            }
          },
        },
        {
          title: '项目总预算',
          dataIndex: 'total_proj_budget',
          width:'150px',
          render: (text, record) => {
            if(record.fill_state_code === '3'){
              return(<div>{text}</div>)
            }else{
              return (
                <Input
                  value={text}
                  disabled={false}
                  onChange={(e)=>this.editCapexCellData(e,record.key,'total_proj_budget')}
                />
              );
            }
          },
        },
        {
          title: '合同名称',
          dataIndex: 'contract_title',
          width:'200px',
          render: (text, record) => {
            if(record.fill_state_code === '3'){
              return(<div>{text}</div>)
            }else{
              return (
                <Input
                  value={text}
                  disabled={false}
                  onChange={(e)=>this.editCapexCellData(e,record.key,'contract_title')}
                />
              );
            }
          },
        },
        {
          title: '合同总金额',
          dataIndex: 'contract_amount',
          width:'150px',
          render: (text, record) => {
            if(record.fill_state_code === '3'){
              return(<div>{text}</div>)
            }else{
              return (
                <Input
                  value={text}
                  disabled={false}
                  onChange={(e)=>this.editCapexCellData(e,record.key,'contract_amount')}
                />
              );
            }
          },
        },
        {
          title: '累计已支付金额',
          dataIndex: 'accumulated_amount_paid',
          width:'150px',
          render: (text, record) => {
            if(record.fill_state_code === '3'){
              return(<div>{text}</div>)
            }else{
              return (
                <Input
                  value={text}
                  disabled={false}
                  onChange={(e)=>this.editCapexCellData(e,record.key,'accumulated_amount_paid')}
                />
              );
            }
          },
        },
        {
          title: '本月付款金额',
          dataIndex: 'payment_amount_this_month',
          width:'150px',
          render: (text, record) => {
            if(record.fill_state_code === '3'){
              return(<div>{text}</div>)
            }else{
              return (
                <Input
                  value={text}
                  disabled={true}
                  onChange={(e)=>this.editCapexCellData(e,record.key,'payment_amount_this_month')}
                />
              );
            }
          },
        },
        {
          title: '填报状态',
          dataIndex: 'fill_state_code',
          width:'100px',
          render:(text)=>{
            return(
              <div>
                {text ==='0'?'新增':text ==='1'?'保存':text==='2'?'待审核':text==='3'?'审核通过':text ==='4'?'退回':'-'}
              </div>
            )
          }
        },
        {
          title: '本月调整后付款金额',
          dataIndex: 'adjust_payment_amount_this_month',
          width:'150px',
          render: (text, record) => {
            return (
              <Input
                value={text}
                disabled={false}
                onChange={(e)=>this.editCapexCellData(e,record.key,'adjust_payment_amount_this_month')}
              />
            );
          },
        },
        {
          title: '调整阶段状态',
          dataIndex: 'adjust_state_code',
          width:'150px',
          render:(text)=>{
            return(
              <div>
                {text ==='0'?'新增':text ==='1'?'保存':text==='2'?'待审核':text==='3'?'审核通过':text ==='4'?'退回':'-'}
              </div>
            )
          }
        },
        {
          title: '操作',
          dataIndex: '',
          width:'100px',
          render: (text, record) => {
            if( record.fill_state_code === '3'){
              return (
                <div style={{color:'#B0B0B0'}}>{'删除'}</div>
              );
            }else{
              return (
                <a onClick={()=>this.deleteCapexData(record.key)}>{'删除'}</a>
              );
            }

          },
        }
      ];
    }
    let capexMoneySum = 0;
    if(this.props.flag === 'pre'){
      for( let i = 0; i < capexDataList.length; i++){
        if(capexDataList[i].payment_amount_this_month) {//如果有这个字段才相加
          capexMoneySum += Number(capexDataList[i].payment_amount_this_month);
        }
      }
      capexMoneySum = capexMoneySum.toFixed(2);
    }else{
      for( let k = 0; k < capexDataList.length; k++){
        if(capexDataList[k].payment_amount_this_month) {//如果有这个字段才相加
          capexMoneySum += Number(capexDataList[k].payment_amount_this_month);
        }
      }
        for( let j = 0; j < capexDataList.length; j++){
          if(capexDataList[j].adjust_payment_amount_this_month) {//如果有调整后金额，总和等于 调整后金额-之前金额 + 之前金额的和
            if(!capexDataList[j].payment_amount_this_month){//如果没有这个字段 赋0
              capexDataList[j].payment_amount_this_month = 0;
            }
            capexMoneySum = capexMoneySum + (Number(capexDataList[j].adjust_payment_amount_this_month)-Number(capexDataList[j].payment_amount_this_month));
          }
        }
        capexMoneySum = capexMoneySum.toFixed(2);
    }
    return(
      <Modal
        title={this.state.subjectObj.fee_name+'管理'}
        visible={this.state.capexVisible}
        width={'1220px'}
        onOk={()=>this.hideCapexModal('confirm',capexMoneySum)}
        onCancel={()=>this.hideCapexModal('cancel')}
        maskClosable={false}
      >
        <div>
          <Button onClick={this.addCapexCellData} type='primary'>新增</Button>
          <div style={{overflow:'hidden'}}>
            <div style={{float:'left',color:'red'}}>金额单位：元</div>
            <div style={{float:'right'}}>本月付款总金额：<span style={{color:'red'}}>{capexMoneySum + '(元)'}</span></div>
          </div>
          <Table
            dataSource={this.state.capexDataList}
            columns={capexColumns}
            className={styles.fillTable}
            bordered={true}
            pagination={false}
            scroll={{x:1920}}
          />
        </div>
      </Modal>
    );
  }
}

export default CapexFillAdd;
