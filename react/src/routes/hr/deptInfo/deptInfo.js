/**
 *  作者: 耿倩倩
 *  创建日期: 2017-08-19
 *  邮箱：gengqq3@chinaunicom.cn
 *  文件说明：实现部门负责人维护功能
 */
import React from 'react';
import {connect} from 'dva';
import {Table, Button, Select} from 'antd';
import styles from './deptInfo.less';
import EditDeptModal from './editDeptModal.js';
import EditManagerModal from './editManagerModal'
import Cookie from 'js-cookie';
const Option = Select.Option;
const label = '暂无';
/**
 * 作者：耿倩倩
 * 创建日期：2017-08-19
 * 功能：实现部门负责人维护功能
 */
class deptInfo extends React.Component{
  constructor(props){
    let auth_ouname = localStorage.getItem("ou");
    super(props);
    this.state = {
      ou:auth_ouname,
      auth_ou:auth_ouname,
      flag:true //标记显示哪个column,true显示columns(带操作类型列),false显示columns2
    }
  }

  /**
   * 作者：耿倩倩
   * 创建日期：2017-08-19
   * 功能：根据所属OU设置flag的值
   */
  setFlag=()=> {
    if(this.state.ou !== this.state.auth_ou){
      this.setState({
        flag:false
      })
    }
    if(this.state.ou === this.state.auth_ou){
      this.setState({
        flag:true
      })
    }
  };

  /**
   * 作者：耿倩倩
   * 创建日期：2017-08-19
   * 功能：切换OU查询部门负责人
   * @param value 传入改变值，选中的负责人
   */
  handleChange=(value)=> {
    this.setState({
      ou:value,
    },()=>{this.setFlag()});
    let auth_tenantid = Cookie.get('tenantid');
    let arg_params = {
      "arg_tenantid": auth_tenantid,
      "arg_ou_name":value,
      "arg_page_size": 10,
      "arg_page_current": 1
    };
    const {dispatch} = this.props;
    dispatch({
      type:'hrDeptInfo/deptInfoSearch',
      arg_param:arg_params
    })
  };

  columns = [
    {
      title: '序号',
      dataIndex: 'key',
      width: '10%'
    },
    {
      title: '部门名称',
      dataIndex: 'deptname',
      width: '20%'
    },
    {
      title: '部门负责人',
      dataIndex: '',
      width: '10%',
      render:(record) =>{
        if(record.username === ''){
          return '无';
        }else{
          return record.username;
        }
      }
    },
    {
      title: '分管领导人',
      dataIndex: 'managername',
      width: '10%',
      render:(text, record, index) =>{
        return text === '' ? '无' : text
      }
    },
    {
      title: '操作类型',
      dataIndex: '',
      width: '30%',
      render:(record) =>{
        return (
          <div>
            <Button
              type="danger"
              onClick={()=>this.refs.editDeptModal.showModal(record,this.props.dispatch)}
            >修改部门负责人
            </Button>
            &nbsp;&nbsp;
            <Button
              type="danger"
              onClick={()=>this.refs.editManagerModal.showModal(record,this.state.ou)}
            >修改分管领导人
            </Button>
          </div>
        );
      }
    }
  ];

  //不是所属OU则不显示操作类型列
  columns2 = [
    {
      title: '序号',
      dataIndex: 'key',
      width: '10%'
    },
    {
      title: '部门名称',
      dataIndex: 'deptname',
      width: '20%'
    },
    {
      title: '部门负责人',
      dataIndex: '',
      width: '10%',
      render:(record) =>{
        if(record.username === ''){
          return '无';
        }else{
          return record.username;
        }
      }
    },
    {
      title: '分管领导',
      dataIndex: 'managername',
      width: '10%',
      render:(text, record, index) =>{
        return text === '' ? '无' : text
      }
    },
  ];
  render() {
    const {list,masterOptionList,ouList,dispatch,loading} = this.props;
    const {ou,auth_ou} = this.state;

    //  返回的数据没有序号，这里为每一条记录添加一个key，从1开始
    if(list.length){
      list.map((i,index)=>{
        i.key=index + 1;
      })
    }
    const OptionList = ouList.map((item) => {
      return (
        <Option key={item.OU}>
          {item.OU}
        </Option>
      )
    });
    return (
      <div className={styles.hrWrap}>
        <div style={{ marginBottom:'40px' }}>
          {/*<div className={styles.headerName}>部门负责人管理</div>*/}
          <div style={{float:'left'}}><span>组织单元：</span>
          <Select style={{width: 180}} defaultValue={auth_ou}  placeholder="请选择OU" onSelect={this.handleChange}>
            {OptionList}
          </Select></div>
        </div>
        {this.state.flag === true
          ?
          <Table
            loading={loading}
            columns={this.columns}
            dataSource={list}
            className={styles.hrTable}
            bordered={true}
            pagination={true}
          />
          :
          <Table
            loading={loading}
            columns={this.columns2}
            dataSource={list}
            className={styles.hrTable}
            bordered={true}
            pagination={true}
          />
        }
        <EditDeptModal
          ref='editDeptModal'
          masterOptionList={masterOptionList}
          dispatch={dispatch}
          ou={ou}
        />
        <EditManagerModal
          ref='editManagerModal'
          dispatch={dispatch}
          ou={ou}
        />
      </div>
    );
  }
}

function mapStateToProps (state) {
  return {
    loading: state.loading.models.hrDeptInfo,
    ...state.hrDeptInfo
  }
}

export default connect(mapStateToProps)(deptInfo);



