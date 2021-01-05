/**
 * 作者：李杰双
 * 日期：2017/9/1
 * 邮件：282810545@qq.com
 * 文件说明：员工类型查看组件
 */

import React from 'react'
import styles from '../../../components/employer/employer.less'
import {Button,Select,Table,Tag} from 'antd'
import  tableStyles from '../../../components/common/table.less'

/**
 * 作者：李杰双
 * 文件说明：员工类型查看组件
 */
export  default class KindDist extends React.Component{
  state={
    // checkAll:false,
    selectedRowKeys:[]
  }
  /**
   * 作者：李杰双、
   * 功能：表格的表头
   */
  tHead=[
    //   {
    //   title: '序号',
    //   dataIndex: 'index',
    //   key: 'index',
    //   render: (text,record,index) => <Checkbox checked={record.checked} onChange={this.changeChecked(index)}>{index+1}</Checkbox>,
    // },
    {
      title: '员工编号',
      dataIndex: 'staff_id',
      key: 'staff_id',
      render:text=>`NO.${text}`

    },
    {
      title:'部门',
      dataIndex:'dept_name',
    },
    {
      title: '员工姓名',
      dataIndex: 'staff_name',
      key: 'staff_name',
    }, {
      title: '职位',
      dataIndex: 'post',
      key: 'post',
    }, {
      title: '员工类型',
      key: 'action',
      render: (text, record,index) => (
        <Select style={{ width: 120 }} onChange={this.changeType(record.uuid,index)} value={record.emp_type||''}>
          <Option value="0">进入项目组</Option>
          <Option value="1">不进入项目组</Option>
        </Select>
      ),
    }];
  changeType=(uuid,index)=>(emptype)=>{
    //debugger
    const {dispatch}=this.props
    dispatch({
      type:'empKind/update_persion_type',
      emptype,
      uuid,
      index
    })
  }
  changeTypeAll=(emptype)=>()=>{
    const {dispatch}=this.props
    console.log(this.state.selectedRowKeys)
    dispatch({
      type:'empKind/update_persion_type_all',
      emptype,
      checkedArr:this.state.selectedRowKeys
    })

  }
  changeChecked=(selectedRowKeys)=>{
    // e&&e.stopPropagation()
    // debugger
    // const {dispatch}=this.props
    // dispatch({
    //   type:'empKind/cBoxChange',
    //   index
    // })
    this.setState({
      selectedRowKeys
    })

  }
  // checkedAll=()=>{
  //   const {dispatch}=this.props
  //   dispatch({
  //     type:'empKind/checkedAll',
  //     checked:!this.state.checkAll
  //   })
  //   this.setState({
  //     checkAll:!this.state.checkAll
  //   })
  // }
  RowClick=(record,index,e)=>{
    if(e.target.className.indexOf("ant-select-selection")!=-1){
      return
    }
    //debugger
    let selectedRowKeys=this.state.selectedRowKeys
    if(selectedRowKeys[index]===undefined){
      selectedRowKeys[index]=index
    }else{
      selectedRowKeys[index]=undefined
    }

    this.setState({
      selectedRowKeys
    })
    // debugger
    // e.stopPropagation()
    //
    //
    // // console.log(e)
    // if(e.target.className.indexOf("ant-select-selection")!=-1){
    //   return
    // }
    // if(e.target.className.indexOf("ant-checkbox-input")!=-1){
    //   return
    // }
    //
    // this.changeChecked(index)(e)
  }
  pageChange=(page,pageSize)=>{

    const {dispatch}=this.props
    dispatch({
      type:'empKind/fetch',
      pageCondition:{
        arg_page_num:pageSize,
        arg_start:page
      }
    })
  }
  render(flag){
    const {list,loading}=this.props;
    const {selectedRowKeys}=this.state;
    let rowSelection
    if(flag){
      rowSelection=null
    }else{
      rowSelection={
        selectedRowKeys,
        onChange: this.changeChecked,
      };
    }

    //const tState=location.pathname.indexOf('kindDist')===-1;
    return(
      <div className={styles.wrap}>
        {flag?null:<p style={{marginBottom:'15px'}}>
          {/*<CheckableTag checked={this.state.checkAll} onChange={this.checkedAll} >{this.state.checkAll?'取消':'全选'}</CheckableTag>*/}

          <Button onClick={this.changeTypeAll('0')} style={{marginRight:'10px'}}>批量进入项目组</Button>
          <Button onClick={this.changeTypeAll('1')}>批量不进入项目组</Button>
        </p>}


        <div className={tableStyles.orderTable}>

          <Table   rowSelection={rowSelection} pagination={false} onRowClick={this.RowClick} dataSource={list} columns={this.tHead} loading={loading}/>

          {/*<Pagination showSizeChanger onChange={this.pageChange} defaultCurrent={3} total={500} />*/}
        </div>
      </div>
    )
  }
}
