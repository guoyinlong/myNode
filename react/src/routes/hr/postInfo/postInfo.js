/**
 *  作者: 耿倩倩
 *  创建日期: 2017-08-17
 *  邮箱：gengqq3@chinaunicom.cn
 *  文件说明：实现组织单元职务维护功能
 */
import React from 'react';
import {connect } from 'dva';
import { Table,Popconfirm,Select,Button } from 'antd';
const Option = Select.Option;
import styles from './postInfo.less';
import PostNewAdd from './postNewAdd.js';
import moment from 'moment';
/**
 * 作者：耿倩倩
 * 创建日期：2017-08-19
 * 功能：实现组织单元职务维护功能
 */
class postInfo extends React.Component {
  columns1 = [
    {
      title: '序号',
      dataIndex: 'key'
    },
    {
      title:'职务名称',
      dataIndex:'post_name'
    },
    {
      title:'职务状态',
      dataIndex:'post_state',      //post_state=0时，为“启用”。post_state=1时，为“停用”
      render:(text,record)=>{
        return (record.post_state === '0')?'启用':'停用';
      }
    },
    {
      title:'创建人',
      dataIndex:'username'
    },
    {
      title:'创建时间',
      dataIndex:'op_create_time',
      render:(text,record)=>{
        return moment(record.op_create_time).format('YYYY-MM-DD hh:mm:ss')
      }
    },
    {
      title: '操作类型',
      dataIndex: '',
      render: (text, record) => {
        return <Popconfirm title={`确定要删除${record.post_name}职务吗？`} onConfirm={()=>this.confirm(record)}  okText="确定"
                      cancelText="取消">
            <Button type="danger">删除</Button>
          </Popconfirm>
      }
    }
  ];
//不是所属OU时不显示操作类型列
  columns2 = [
    {
      title:'序号',
      dataIndex:'key'
    },
    {
      title:'职务名称',
      dataIndex:'post_name'
    },
    {
      title:'职务状态',
      dataIndex:'post_state',      //post_state=0时，为“启用”。post_state=1时，为“停用”
      render:(text,record)=>{
        return (record.post_state === '0')?'启用':'停用';
      }
    },
    {
      title:'创建人',
      dataIndex:'username'
    },
    {
      title:'创建时间',
      dataIndex:'op_create_time',
      render:(text,record)=>{
        return moment(record.op_create_time).format('YYYY-MM-DD hh:mm:ss')
      }
    }
  ];


  /**
   * 作者：耿倩倩
   * 创建日期：2017-09-11
   * 功能：删除职务时点击确定
   */
  confirm=(record)=> {
   let postData = {
     "arg_op_tenantid" : record.op_tenantid,
     "arg_op_ouid":record.op_ouid,
     "arg_op_postid":record.op_postid
   };
    const {dispatch} = this.props;
    dispatch({
      type:'hrPostInfo/delPost',
      arg_param:postData,
      arg_ouname:this.props.current_ou_name
    })
  };

  /**
   * 作者：耿倩倩
   * 创建日期：2017-09-11
   * 功能：切换OU
   * @param value 选中当前ou值
   */
  handleChange=(value)=>{
  const {dispatch} = this.props;
  dispatch({
    type:'hrPostInfo/postInfoSearch',  //此处的hrPostInfo是model的命名空间
    arg_ouname:value
  });
};

  render() {
    const {loading,list,optionList,current_ou_name,postList,current_ou_id} = this.props;
    //返回的数据没有序号，这里为每一条记录添加一个key，从0开始
    if(list.length){
      list.map((i,index)=>{
        i.key=index + 1;
      })
    }

    const OptionList = optionList.map((item) => {
      return (
        <Option key={item.OU}>
          {item.OU}
        </Option>
      )
    });

    return (
        <div className={styles.meetWrap}>
          {/*<div className={styles.headerName}>职务管理</div>*/}
          <div style={{ marginBottom:'40px' }}>
            <div style={{float:'left'}}><span>组织单元：</span>
              <Select value={this.props.ouSelectValue} onSelect={this.handleChange} style={{ width: 180 }}>
                {OptionList}
              </Select>
              &nbsp;&nbsp;&nbsp;&nbsp;
            </div>
             {this.props.ouSelectValue === current_ou_name ?
               <Button type="primary" className={styles.addBtn} onClick={()=>this.refs.postNewAdd.showModal()}>{'添加'}</Button>
               :
                null
             }
          </div>
          {/*<br/>*/}
          <Table columns={this.props.ouSelectValue === current_ou_name?this.columns1:this.columns2}
                 dataSource={list}
                 pagination={false}
                 bordered={true}
                 className={styles.orderTable}
                 loading={loading}
          />
          <PostNewAdd
              ref='postNewAdd'
              optionList={postList}
              ouID={current_ou_id}
              current_ou_name = {current_ou_name}
              dispatch={this.props.dispatch}
              list={list}
           />
        </div>
      );
  }
}
function mapStateToProps (state) {
  const { list,optionVisible,optionList,current_ou_name,postList,current_ou_id,ouSelectValue} = state.hrPostInfo;
  return {
    loading: state.loading.models.hrPostInfo,
    list,
    optionVisible,
    optionList,
    current_ou_name,/*这里的curren_ou_name都是没有带后缀的，即联通软件研究院本部，济南软件研究院，哈尔滨软件研究院*/
    current_ou_id,
    postList,
    ouSelectValue
  };
}

export default connect(mapStateToProps)(postInfo);
