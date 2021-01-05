/**
 * 作者：卢美娟
 * 日期：2018-5-24
 * 邮箱：lumj14@chinaunicom.cn
 * 功能：会议室统计页面
 */
import { connect } from 'dva';
import React from 'react';
import {Row, Col, Card, Table, Badge,Button,Popconfirm,message} from 'antd'; //引入antd中的Row、Col组件
import styles from './statisticalStyle.less';
import { routerRedux } from 'dva/router';
import Cookie from 'js-cookie';

function showseeopeartion (text, record,index,ss) {
  return  <Popconfirm title="您确定要取消对此人的限制吗？" onConfirm={()=>ss.confirm(record)} onCancel={ss.cancel}  okText="Yes" cancelText="No">
    <a className = {styles["canc-detail"]+' '+styles.bookTag} href="#">取消限制</a>
  </Popconfirm>
}



class Limited extends React.Component {
    constructor (props) {
        super(props);
    }


    columns = [
      {
        title: '被限制人',
        dataIndex: 'staff_name',
        key: 'staff_name',
        width:100,
      },
      {
        title: '部门',
        dataIndex: 'deptname',
        key: 'deptname',
        width:200,
      },
      {
        title: '限制开始时间',
        dataIndex: 'limit_stime',
        width:100,
      },
      {
        title: '限制结束时间',
        dataIndex: 'limit_etime',
        width:100,
      },
      {
        title: '限制原因',
        dataIndex: 'limit_reason',
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
      {
        title: '操作',
        render: (text, record, index) =>showseeopeartion (text, record, index,this),
        width:100
      }
    ];
    columns2 = [
      {
        title: '被限制人',
        dataIndex: 'staff_name',
        key: 'staff_name',
        width:100,
      },
      {
        title: '部门',
        dataIndex: 'deptname',
        key: 'deptname',
        width:200,
      },
      {
        title: '限制开始时间',
        dataIndex: 'limit_stime',
        width:100,
      },
      {
        title: '限制结束时间',
        dataIndex: 'limit_etime',
        width:100,
      },
      {
        title: '限制原因',
        dataIndex: 'limit_reason',
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
      }
    ];

    confirm=(record)=> {
      const {dispatch} = this.props;
       dispatch({
         type: 'limited/removeLimit',
         arg_limit_id:record.limit_id,
       });
    }

    cancel=(e) => {
      message.error('您放弃取消限制');
    }

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
              <div className={styles.lightInfo}>
                温馨提示：被限制人员自被限制日期起，十日内不能预定会议室
              </div>
              {(Cookie.get('dept_id') == 'e65c07d7179e11e6880d008cfa0427c4' || Cookie.get('staff_id') == '0864957')?
                <Table columns={this.columns}
                        dataSource={this.props.limitList}
                        // bordered  //是否展示外边框和列边框
                        pagination={true} //分页器，配置项参考 pagination，设为 false 时不展示和进行分页
                        loading={loading}
                        className={styles.limitTable}
                />
                :
                <Table columns={this.columns2}
                        dataSource={this.props.limitList}
                        // bordered  //是否展示外边框和列边框
                        pagination={true} //分页器，配置项参考 pagination，设为 false 时不展示和进行分页
                        loading={loading}
                        className={styles.limitTable}
                />
              }
              <Button type = 'primary' style = {{float:'right'}} onClick = {this.gotoStatis}>返回</Button>
            </div>
        )
    }
}


function mapStateToProps(state) {
  const { list, query,limitList} = state.limited;
  return {
    loading: state.loading.models.limited,
    list,
    query,
    limitList
  };
}
export default connect(mapStateToProps)(Limited);
