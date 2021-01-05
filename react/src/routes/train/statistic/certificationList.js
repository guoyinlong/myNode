/**
 * 文件说明: 认证考试查询的界面
 * 作者：wangfj80
 * 邮箱：wangfj80@chinaunicom.cn
 * 创建日期：2020-05-27
 **/
import React, { Component } from 'react';
import {Table, FormItem, Card } from "antd";
import { connect } from "dva";
import Cookie from "js-cookie";
import { routerRedux } from "dva/router";

class certificationList extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  //查询
  search = () => {
    let ou_search = this.state.ou;
    if (ou_search === null) {
      //防止没有值，默认为登录员工所在院
      ou_search = Cookie.get('OU');
    }

    let arg_params = {};

    arg_params["arg_page_size"] = 10;
    arg_params["arg_page_current"] = 1;
    arg_params["arg_ou_name"] = ou_search;
    arg_params["arg_train_time"] = this.state.time;
    arg_params["arg_status"] = this.state.status;
    if (this.state.dept !== '') {
      arg_params["arg_dept_name"] = this.state.dept; //部门传参加上前缀
    }
    if (this.state.type !== '') {
      arg_params["arg_type"] = this.state.type;
    }
    if (this.state.year !== '') {
      arg_params["arg_year"] = this.state.year;
    }
    const { dispatch } = this.props;
    //TODO 根据条件进行查询
    dispatch({
      type: 'train_do_model/trainPlanListQuery',
      query: arg_params
    });
  };

  /**选修课程 */
  columns = [
    { title: '认证考试名称', dataIndex: 'certification_name' },
    { title: '认证考试单位', dataIndex: 'certification_unit'}
  ];

  render() {
    const {tableDataList} = this.props;
    return (
      <div>
        <Card>
          <div style={{ marginBottom: '15px' }}>
            <div>
            </div>
          </div>
          <Table
            columns={this.columns}
            dataSource={tableDataList}
            pagination={{ pageSize: 20 }}
            bordered={true}
          />
        </Card>
      </div>);

  }

}

function mapStateToProps(state) {
  const {
    tableDataList
  } = state.certification_list_model;
  return {
    loading: state.loading.models.certification_list_model,
    ...state.certification_list_model,
    tableDataList
  };
}
export default connect(mapStateToProps)(certificationList);

