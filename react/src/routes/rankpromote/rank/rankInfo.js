/**
 * 文件说明：导入劳动合同
 * 作者：翟金亭
 * 邮箱：zhaijt3@chinaunicom.cn
 * 创建日期：2019-09-16
 **/
import React ,{Component} from 'react';
import {connect} from "dva";
import {Button, Card, Form, Input, message, Modal, Popconfirm, Row, Select, Table} from "antd";
import {routerRedux} from "dva/router";
import Cookie from "js-cookie";

const { Option } = Select;

class rankInfo extends Component{
  constructor (props) {
    super(props);
    this.state = {
      isSaveClickable:true,
      isSuccess:false,
      personRankDataList:[],
      ou_name : Cookie.get("OU"),
      user_id : Cookie.get("userid"),
      dept_id : Cookie.get("dept_id"),
      //显示：1：导入显示，2：查询显示，默认是查询显示
      showTablesDataFlag : '2',
      saveFlag : true,
      text: '',
      visible: false,
    }
  }

  //职级历史
  rankHistory = (record) => {
    let arg_user_id = record.user_id;
    const {dispatch} = this.props;
    dispatch({
      type: 'rankImportModel/rankPersonSearch',
      arg_user_id
    });
    this.setState ({visible: true});
  };
  handleCancel = () => {
    this.setState ({visible: false});
  };


  person_rank_columns = [
    { title: '序号', dataIndex: 'indexID',width:'50px',},
    { title: '姓名', dataIndex: 'user_name',width:'80px'},
    { title: '员工编号', dataIndex: 'user_id',width:'80px'},
    { title: '所属单位', dataIndex: 'ou_name',width:'120px'},
    { title: '所属部门', dataIndex: 'dept_name',width:'100px'},
    { title: '年度', dataIndex: 'year' ,width:'60px'},
    { title: '加入联通时间', dataIndex: 'join_time',width:'110px'},
    { title: '现职级薪档', dataIndex: 'rank_sequence_before',width:'100px'},
    { title: '调整后职级薪档', dataIndex: 'rank_sequence',width:'120px'},
    { title: '剩余考核积分', dataIndex: 'bonus_points',width:'110px'},
    { title: '生效日期', dataIndex: 'effective_time',width:'110px'},
    { title: '晋升路径', dataIndex: 'promotion_path',width:'150px'},
    { title: '人才标识', dataIndex: 'talents_name',width:'100px'},
    {
      title: '操作', dataIndex: '', width: '100px',
      render: (text, record, index) => {
        return (
          <div>
            <Button
              type='primary'
              size='small'
              onClick={() => this.rankHistory(record)}
            >{'职级记录'}
            </Button>
            &nbsp;&nbsp;&nbsp;
          </div>
        );
      }
    }
  ];
  export_rank_columns = [
    { title: '序号', dataIndex: 'indexID',width:'50px',},
    { title: '姓名', dataIndex: 'user_name',width:'80px'},
    { title: '员工编号', dataIndex: 'user_id',width:'80px'},
    { title: '所属单位', dataIndex: 'ou_name',width:'120px'},
    { title: '所属部门', dataIndex: 'dept_name',width:'100px'},
    { title: '年度', dataIndex: 'year' ,width:'60px'},
    { title: '加入联通时间', dataIndex: 'join_time',width:'110px'},
    { title: '现职级薪档', dataIndex: 'rank_sequence_before',width:'100px'},
    { title: '调整后职级薪档', dataIndex: 'rank_sequence',width:'120px'},
    { title: '剩余考核积分', dataIndex: 'bonus_points',width:'110px'},
    { title: '生效日期', dataIndex: 'effective_time',width:'110px'},
    { title: '晋升路径', dataIndex: 'promotion_path',width:'150px'},
    { title: '人才标识', dataIndex: 'talents_name',width:'100px'}
  ];

  render() {
    const {searchRankDataList,historyDataList} = this.props;
    return(
      <div>
        <Row span={2} style={{textAlign: 'center'}}><h2>职级信息查询</h2></Row>
        <br/>
        <div style={{ float: 'left'}}>
          <br/><br/>
          <Table
            columns={this.person_rank_columns}
            dataSource={searchRankDataList}
            pagination={true}
            scroll={{y: 400}}
          />
        </div>
        <Modal
          title="劳动合同"
          visible={this.state.visible}
          width={'1200px'}
          footer={[
            <Button key="submit" type="primary" size="large" onClick={this.handleCancel}>
              关闭
            </Button>
          ]}
        >
          <div>
            <Form>
              <Table
                columns={this.export_rank_columns}
                dataSource={historyDataList}
                pagination={false}
                bordered={true}
              />
            </Form>
          </div>
        </Modal>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    loading: state.loading.models.rankImportModel,
    ...state.rankImportModel
  };
}

rankInfo = Form.create()(rankInfo);
export default connect(mapStateToProps)(rankInfo);
