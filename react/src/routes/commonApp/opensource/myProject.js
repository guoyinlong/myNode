/*
    @author:zhulei
    @date:2017/11/9
    @email:xiangzl3@chinaunicom.cn
    @description:实现Gitlab-我的项目
*/

import React from 'react';
import {connect} from 'dva';
import {Button, Input, Table,Pagination} from 'antd';
import styles from './basicInfo.less';

import Cookie from 'js-cookie';

//获取当前用户名
const auth_username = Cookie.get('loginname');

class myProject extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
    displayWay: 'table',
    text: ''
  };


  //设置查询条件
  handleTextChange = (e) => {
    this.setState({
      text: e.target.value
    })
  };

  //清空查询条件
  clear = () => {
    this.setState({
      text: ''
    });
  };

  //查询
  search = () => {

    let arg_params = {};
    arg_params["arguser"] = auth_username;
    arg_params["argpagesize"] = 10;
    arg_params["argpagecurrent"] = 1;

    if (this.state.text !== '') {
      arg_params["arg_all"] = this.state.text;
    }
    const {dispatch} = this.props;
    dispatch({
      type: 'myProject/myProject',
      arg_param: arg_params
    });
  };

  //处理分页
  handlePageChange = (page) => {

    let arg_params = {};
    arg_params["arguser"] = auth_username;
    arg_params["argpagesize"] = 10;
    arg_params["argpagecurrent"] = page;
    // let queryParams = this.props.postData;
	//
    // console.log(queryParams);
    // console.log(page);
	//
    // queryParams.argpagecurrent = page;  //将请求参数设置为当前页
    const {dispatch} = this.props;
    dispatch({
      type: 'myProject/myProject',
      arg_param: arg_params
    });
  };


  columns = [
    {
      title: '项目名称',
      dataIndex: 'gitlab_proj_name'
    },
    {
      title: '项目参与人',
      dataIndex: 'owner_user'
    },
    {
      title: 'GitLab地址',
      dataIndex: 'gitlab_git_url'
    },
    {
      title: '项目描述',
      dataIndex: 'description'
    }
  ];

  render() {
    const {loading, tableDataList} = this.props;

    // 这里为每一条记录添加一个key，从0开始
    if (tableDataList.length) {
      tableDataList.map((i, index) => {
        i.key = index;
      })
    }

    return (
      <div className={styles.meetWrap}>

        <div className={styles.bookTitle}>我的项目</div>

        <div style={{marginBottom: '15px'}}>
          <div style={{float: 'left', marginTop: '12px', marginLeft: '5px'}}>查询条件：

          </div>

          <Input style={{width: 200}} onChange={this.handleTextChange} value={this.state.text}/>
          <div className={styles.btnLayOut}>
            <Button type="primary" onClick={() => this.search()}>{'查询'}</Button>
            &nbsp;&nbsp;&nbsp;
            <Button type="primary" onClick={() => this.clear()}>{'清空'}</Button>
          </div>
        </div>
        <Table columns={this.columns}
               dataSource={tableDataList}
               pagination={false}
               className={styles.orderTable}
               loading={loading}
               bordered={true}/>

        {loading !== true ?
          <Pagination current={this.props.currentPage}
                      total={Number(this.props.total)}
                      showTotal={(total, range) => `${range[0]}-${range[1]} / ${total}`}
                      pageSize={10}
                      onChange={this.handlePageChange}
          />
          :
          null
        }
      </div>

    );
  }
}

function mapStateToProps(state) {

  return {
    loading: state.loading.models.myProject,
    ...state.myProject
  }

}

export default connect(mapStateToProps)(myProject);
