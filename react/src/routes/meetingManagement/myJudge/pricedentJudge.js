/**
 * 作者：贾茹
 * 日期：2020-3-5
 * 邮箱：m18311475903@163.com
 * 功能：院长审核议题清单审核页面
 */
import React from 'react';
import {connect } from 'dva'
import { Tabs, Button, Table, Modal,Pagination } from 'antd';
import styles from '../../meetingManagement/meetingTable.less';
import { routerRedux } from 'dva/router';


const { TabPane } = Tabs;
const columns = [
  {
    title: '议题名称',
    key:'topic_name',
    dataIndex: 'topic_name',
  },
  {
    title: '汇报部门',
    key:'topic_dept_name',
    dataIndex: 'topic_dept_name',
  },

];

class PricedentJudge extends React.Component{
  state = {
    selectedRowKeys: [], // Check here to configure the default column
    loading: false,
    change:false,
  };
  componentDidMount=()=>{
    const a =this.props.selectedRowKeys
    this.setState({
      selectedRowKeys:a
    })
    
  }

  start = () => {
    this.setState({ loading: true });
    // ajax request after empty completing
    setTimeout(() => {
      this.setState({
        selectedRowKeys: [],
        loading: false,
      });
    }, 1000);
  };

  onSelectChange = selectedRowKeys => {
    //console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ 
      selectedRowKeys,
      change:true
     });
  };

  // 点击页面跳转
  handlePageChange = (pageNumber) => {
    /* console.log(pageNumber)*/
    this.props.dispatch({
      type:"pricedentJudge/handlePageChange",
      page: pageNumber
    })
  };

  //跳转到modal层对应的方法
  returnModel =(value,value2)=>{
    console.log(value,value2);
    if(value2!==undefined){
      this.props.dispatch({
        type:'pricedentJudge/'+value,
        record : value2,
      })
    }else{
      console.log('aaa');
      this.props.dispatch({
        type:'pricedentJudge/'+value,
      })
    }

  };

  render() {
    const { loading, selectedRowKeys,change } = this.state;
   //console.log(selectedRowKeys,this.props.selectedRowKeys)
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      getCheckboxProps: record => ({      
          defaultChecked: record.topic_id, // 配置默认勾选的列 （Bealean）
       }),
    };
    const hasSelected = selectedRowKeys.length > 0;
    return (
      <div style={{background: '#fff',padding:'10px',borderRadius: '6px', height:'100%',boxShadow: '0 1px 6px rgba(0, 0, 0, .2)'}}>
        <div style={{margin:'0 auto',width:'800px',textAlign:'center',fontSize:'22px',color:'#999',}}>
          {this.props.meetingName}
        </div>
        <div className="clearfix" style={{height:'30px'}}>
          <Button type="primary" style={{float:'right',marginLeft:'15px',marginRight:'50px'}} onClick={(e)=>this.returnModel('handleAgreen',change===false?this.props.selectedRowKeys:selectedRowKeys)}>审核通过</Button>
        </div>
        <div style={{marginTop:'40px',margin:'0 auto'}}>
          <div>
            <div style={{ marginBottom: 16 }}>
              <Button type="primary" onClick={this.start} disabled={!hasSelected} loading={loading}>
                重置
              </Button>
            </div>
            <Table
              rowSelection={rowSelection}
              rowKey={record => record.topic_id}
              columns={columns}
              dataSource={this.props.listData}
              className={ styles.tableStyle }
              pagination={ false }
            />
            {this.props.loading !== true?
              <div style={{textAlign:'center',marginTop:'20px'}}>
                <Pagination
                  current={Number(this.props.pageCurrent)}
                  total={Number(this.props.pageDataCount)}
                  pageSize={this.props.pageSize}
                  onChange={(page) => this.handlePageChange(page)}
                />
              </div>
              :
              null
            }
          </div>
        </div>
      </div>


    );
  }
}

function mapStateToProps (state) {

  return {
    loading: state.loading.models.pricedentJudge,
    ...state.pricedentJudge
  };
}
export default connect(mapStateToProps)(PricedentJudge);
