/**
 * 作者：翟金亭
 * 创建日期：2019-12-04
 * 邮箱：zhaijt3@chinaunicom.cn
 * 文件说明：培训管理-人力专员：全院课程查询：详情/概要查询，导出
 */
import React ,{Component} from 'react';
import {connect} from "dva";
import Cookie from 'js-cookie';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
import tableStyle from './table.less';
import styles from './costmainten.less';
import exportCost from './exportCost.css';
import exportExl from './exportExl';
import {Select, Card, Tabs, Button, Table, Popconfirm, message,Icon, Modal, Input, DatePicker, Form} from 'antd';
const Option = Select.Option;
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;

class trainManagementSettings extends Component {
    constructor(props) {
        super(props);
        this.state = {
          OUDataList : [],
          modalVisibleEdit: false,
          modalVisible: false,
          OU : Cookie.get("OU"),
          year : new Date().getFullYear(),
          dept : 'all',
          query_type : 't1',
          type:'0',
          train_group: '',
          group: '全部',
          edit_train_com_num: '',
          edit_train_target_score: '',
          edit_train_target_hour: '',
          edit_train_score_max: '',
          edit_train_hour_max: '',
        };
    };
  //选择培训群体
  handleTypeChange = (value) => {
    this.setState({
      type:value
    });
  }
  updateVisible = (value) =>{
  };
  // 查询
  exportCostQuery = () => {
    let arg_params = {};
    if(this.state.type !== ''){
      arg_params["arg_type"] = this.state.type;
    }
    const {dispatch} = this.props;
    //TODO 根据条件进行查询
    dispatch({
      type: 'trainManagementSettingsModel/trainManagementQuery',
      query: arg_params
    });
  };
  trainUpdate = (modalType, record) => {
    if(modalType==='edit'){
      this.setState({
        train_group: record.train_group,
        train_com_num: record.edit_train_com_num,
        train_target_score: record.edit_train_target_score,
        train_target_hour: record.edit_train_target_hour,
        train_score_max: record.edit_train_score_max,
        train_hour_max: record.edit_train_hour_max,
      });
      this.setState({
        modalVisibleEdit: true
      });
    }else{
      this.setState({
        modalVisible: true
      });
    }
  };
  handleOKEdit = () => {
    let formData = this.props.form.getFieldsValue();
    let arg_param = {};
    arg_param['arg_train_group'] = this.state.train_group;
    arg_param['arg_train_com_num'] = formData.edit_train_com_num;
    arg_param['arg_train_target_score'] = formData.edit_train_target_score;
    arg_param['arg_train_target_hour'] = formData.edit_train_target_hour;
    arg_param['arg_train_score_max'] = formData.edit_train_score_max;
    arg_param['arg_train_hour_max'] = formData.edit_train_hour_max;
    this.setState({
      modalVisibleEdit: false
    });
    if(arg_param['arg_train_group']==''||(arg_param['arg_train_com_num']==''&& arg_param['arg_train_target_score']==''&& arg_param['arg_train_target_hour']==''&& arg_param['arg_train_score_max']==''&& arg_param['arg_train_hour_max']=='')){
      message.error("培训任务不能全部为空");
    }else{
      const {dispatch} = this.props;
      dispatch({
        type: 'trainManagementSettingsModel/trainManagementUpdate',
        arg_param: arg_param
      });
    }
  };
  handleConcelEdit = () => {
    this.setState({
      modalVisibleEdit: false
    });
  };
  handleGroupChange = (value) => {
    this.setState({
      group: value
    })
    const { dispatch } = this.props;
    dispatch({
      type: 'trainManagementSettingsModel/getGroupList',
      arg_param: value
    });
  };
  // 点击导出按钮
  //济南分院员工培训获取学分统计及明细数据—截止10.28提供历史台账数据
  render(){
    const columnListDetail=[
      {
        title:'培训群体',
        dataIndex:'train_group',
        width:'18%',
      },
      {
        title:'年度必修课数',
        dataIndex:'train_com_num',
        width:'12%',
      },
      {
        title:'年度目标学分',
        dataIndex:'train_target_score',
        width:'12%',
      },
      {
        title:'年度目标学时',
        dataIndex:'train_target_hour',
        width:'10%',
      },
      {
        title:'线上课上限学分',
        dataIndex:'train_score_max',
        width:'16%',
      },
      {
        title:'线上课上限学时',
        dataIndex:'train_hour_max',
        width:'16%',
      },
      {
        title: '操作', dataIndex: '', width: '10%',
        render: (text, record, index) => {
          return (
            <div>
              <Button
                type='primary'
                size='small'
                onClick={() => this.trainUpdate('edit', record)}
              >{'设置'}
              </Button>
            </div>
          );
        }
      }
    ];
    const { getFieldDecorator } = this.props.form;
    const {groupList,loading,trainManagementData}=this.props;
/*    if(groupList && groupList.length){
      let groupOptionList = groupList.map((item) => {
        return (
          <Option key={item}>
            {item}
          </Option>
        )
      });
    }*/
    let groupOptionList = [];
    groupOptionList.push(<Option key='' value=''>全部</Option>);
    const inputstyle = {color:'#000',width:50,height:25};
    //统计
    return(
      <div className={exportCost.container}>
        <Tabs
          defaultActiveKey = 't1'
        >
          <TabPane tab="培训任务设定" key="t1">
          {/*查询条件结束*/}
          {trainManagementData && trainManagementData[0] ?
            /*查询结果结束*/
            <div style={{marginTop:'20px'}}>
              <div className={styles.costmaintenTable+' '+tableStyle.orderTable} style={{marginTop:'15px'}}>
                  <Table columns={columnListDetail} dataSource={trainManagementData} scroll={{ x: '100%', y: 550 }} loading={loading} pagination={false}/>
              </div>
              <div id='exportTable' className={styles.costmaintenTable+' '+tableStyle.orderTable} style={{display:"none"}}>
                  <Table columns={columnListDetail} dataSource={trainManagementData} pagination={false}/>
              </div>
            </div>
          /*查询结果结束*/
            :
            <div className={styles.costmaintenTable+' '+tableStyle.orderTable} style={{marginTop:'15px'}}>
              <Table
                  columns={columnListDetail}
                  dataSource={trainManagementData}
                  scroll={{ x: '100%', y: 500 }}
                  loading={loading}
              />
            </div>
          }
          </TabPane>
        </Tabs>
        <Modal
          onOk={() => this.handleOKEdit()}
          onCancel={() => this.handleConcelEdit()}
          width={'600px'}
          visible={this.state.modalVisibleEdit}
          title={'培训任务'}
        >
          <span> 年度必修课： </span>
          {getFieldDecorator('edit_train_com_num', {
            rules: [{
              required: false,
              message: '选填',
              whitespace: true
            }],
            initialValue: ''
          })(<Input style={inputstyle}/>)}
          <span>  门</span><br/><br/>
          <span> 年度目标学分： </span>
          {getFieldDecorator('edit_train_target_score', {
            rules: [{
              required: false,
              message: '选填',
              whitespace: true
            }],
            initialValue: ''
          })(<Input style={inputstyle}/>)}
          <span>  分，限制条件：线上课上线 </span>
          {getFieldDecorator('edit_train_score_max', {
            rules: [{
              required: false,
              message: '选填',
              whitespace: true
            }],
            initialValue: ''
          })(<Input style={inputstyle}/>)}
          <span>  分</span><br/><br/>
          <span> 年度目标学时： </span>
          {getFieldDecorator('edit_train_target_hour', {
            rules: [{
              required: false,
              message: '选填',
              whitespace: true
            }],
            initialValue: ''
          })(<Input style={inputstyle}/>)}
          <span>  小时，限制条件：线上学时上线 </span>
          {getFieldDecorator('edit_train_hour_max', {
            rules: [{
              required: false,
              message: '选填',
              whitespace: true
            }],
            initialValue: ''
          })(<Input style={inputstyle}/>)}
          <span> 小时（时间折算1天=8小时）</span>
        </Modal>
      </div>
    )
  }
}

function mapStateToProps(state) {
    const {groupList} = state.trainManagementSettingsModel;
    return {
      loading: state.loading.models.trainManagementSettingsModel,
      ...state.trainManagementSettingsModel,
      groupList
    };
  }
trainManagementSettings= Form.create()(trainManagementSettings);
export default connect(mapStateToProps)(trainManagementSettings);

/*train_plan_look_exam = Form.create()(train_plan_look_exam);
export default connect(mapStateToProps)(train_plan_look_exam);*/
