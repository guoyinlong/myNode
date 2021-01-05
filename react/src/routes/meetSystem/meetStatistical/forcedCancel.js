/**
 * 作者：卢美娟
 * 日期：2018-5-24
 * 邮箱：lumj14@chinaunicom.cn
 * 功能：会议室统计页面
 */
import { connect } from 'dva';
import React from 'react';
import {Row, Col, Card, Table, Badge,Button} from 'antd'; //引入antd中的Row、Col组件
import styles from './statisticalStyle.less';
import { routerRedux } from 'dva/router';

class ForcedCancel extends React.Component {
    constructor (props) {
        super(props);
    }

    columns = [
        {
          title: '被强制释放员工',
          dataIndex: 'staff_name',
          key: 'staff_name',
          width:100,
        },
        {
          title: '部门',
          dataIndex: 'dept_name',
          key: 'dept_name',
          width:200,
        },
        {
          title: '强制释放时间',
          dataIndex: 'cancel_time',
          width:100,
        },
        {
          title: '强制释放原因',
          dataIndex: 'cancel_reason',
          width:250
        },
        {
          title: '会议室',
          dataIndex: 'room_name',
          key: 'room_name',
          width:100
        },
        {
          title: '会议名称',
          dataIndex: 'title',
          key: 'title',
          width:200
        },
    ];

    gotoStatis = () => {
      const {dispatch}=this.props;
      dispatch(routerRedux.push({
        pathname:'/adminApp/meetSystem/meet_statistical'
      }));
    }

    render () {
        const {loading} = this.props;
        return (
            <div  className = {styles.statisticalWrap}>
                <Table columns={this.columns}
                        dataSource={this.props.forcedList}
                        // bordered  //是否展示外边框和列边框
                        pagination={true} //分页器，配置项参考 pagination，设为 false 时不展示和进行分页
                        loading={loading}
                        className={styles.limitTable}
                />
                <Button type = 'primary' style = {{float:'right'}} onClick = {this.gotoStatis}>返回</Button>
            </div>
        )
    }
}


function mapStateToProps(state) {
  const { list, query,forcedList} = state.forcedcancel;
  return {
    loading: state.loading.models.forcedcancel,
    list,
    query,
    forcedList,
  };
}
export default connect(mapStateToProps)(ForcedCancel);
