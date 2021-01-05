/**
 * 作者：刘东旭
 * 日期：2018-03-15
 * 邮箱：liudx1006@chinaunicom.cn
 * 文件说明：资金计划-小组管理
 */
import React from 'react';
import {connect} from 'dva';
import {
  Table,
  Input,
  Button,
  Modal,
  Divider,
  Tabs,
  Tree,
  TreeSelect
} from 'antd'
import style from './management.less'

const TabPane = Tabs.TabPane; //标签切换
const TreeNode = Tree.TreeNode; //树形控件
const Search = Input.Search; //树形控件搜索
const confirm = Modal.confirm; //确认框

class TeamManagement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false, //新增弹出框开关状态
      inputTeamName: '', //输入的团队名称
      inputTeamLeader: undefined, //选择的团队负责人
      leaderDepartment: '', //负责人所属部门
      leaderId: '', //团队负责人id
      visibleEdit: false, //新增弹出框开关状态
      editTeamName: '', //编辑团队名称
      editTeamLeader: undefined, //编辑团队负责人
      editLeaderId: '', //编辑团队负责人id
      editLeaderDepartment: '', //编辑负责人所属部门
      oldTeamName: '',
      oldLeader: '',
      oldLeaderId: '',
    };
    //表格表头
    this.columns = [
      {
        title: '序号',
        dataIndex: 'number',
        key: 'number',
        render: (text, record, index) => {
          return (record.key + 1)
        },
        width: 70,
      }, {
        title: '小组名称',
        dataIndex: 'team_name',
        key: 'team_name',
      }, {
        title: '负责人',
        dataIndex: 'team_manager',
        key: 'team_manager',
        width: 100,
      }, {
        title: '负责人部门',
        dataIndex: 'department',
        key: 'department',
      },{
        title: '负责人工号',
        dataIndex: 'team_manager_staffid',
        key: 'team_manager_staffid',
        width: 100,
      }, {
        title: '人数',
        dataIndex: 'team_count',
        key: 'team_count',
        width: 70,
      }, {
        title: '操作',
        key: 'action',
        render: (text, record) => (
          <div>
            <Button className={style.margin05} size='small' onClick={() => this.editModal(record)}>
              编辑
            </Button>
            <Button className={style.margin05} size='small' type="danger" ghost
                    onClick={() => this.showDeleteConfirm(record)}>
              删除
            </Button>
          </div>
        ),
        width: 150,
      }
    ];
  }

  /* == 新增功能 START== */
  //打开新增弹窗Model
  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  //新增输入框团队名称获取
  teamNameChange = (e) => {
    this.setState({
      inputTeamName: e.target.value
    })
  };

  //新增负责人获取
  teamLeaderChange = (inputTeamLeader, index, e) => {
    if (inputTeamLeader !== undefined){
      if (inputTeamLeader.indexOf('++')!==-1){
        this.setState({
          inputTeamLeader: inputTeamLeader.split('++')[0],
          leaderDepartment: inputTeamLeader.split('++')[1],
          leaderId: e.triggerNode.props.eventKey
        });
      }
    } else {
      this.setState({
        inputTeamLeader: undefined,
        leaderDepartment: '',
        leaderId: ''
      });
    }
  };

  //点击新增弹窗ok，提交新增数据
  handleOk = () => {
    const {inputTeamName, inputTeamLeader, leaderId, leaderDepartment} = this.state;
    this.setState({
      visible: false,
    });
    //将填写后的新增信息传给models层
    const {dispatch} = this.props;
    dispatch({
      type: 'teamManagement/teamNew',
      inputTeamName, inputTeamLeader, leaderId, leaderDepartment
    });
    this.setState({
      inputTeamName: '', //输入的团队名称
      inputTeamLeader: undefined, //输入的团队负责人
      leaderId: '', //团队负责人id
    })
  };

  //点击新增弹窗cancel
  handleCancel = () => {
    this.setState({
      visible: false,
      inputTeamName: '', //输入的团队名称
      inputTeamLeader: undefined, //输入的团队负责人
      leaderId: '', //团队负责人id
    });
  };
  /* == 新增功能 END== */


  /* == 编辑功能 START== */
  //打开编辑弹窗Model
  editModal = (record) => {
    this.setState({
      visibleEdit: true,
      editTeamName: record.team_name,
      editTeamLeader: record.team_manager,
      editLeaderId: record.team_manager_staffid,
      editLeaderDepartment: record.department,
      oldTeamName: record.team_name,
      oldTeamLeader: record.team_manager,
      oldLeaderId: record.team_manager_staffid,
    });
  };

  //编辑输入框团队名称获取
  teamNameEdit = (e) => {
    this.setState({
      editTeamName: e.target.value
    })
  };

  //编辑负责人选择
  teamLeaderEdit = (editTeamLeader, index, e) => {
    if (editTeamLeader !== undefined){
      if (editTeamLeader.indexOf('++')!==-1){
        this.setState({
          editTeamLeader: editTeamLeader.split('++')[0],
          editLeaderDepartment: editTeamLeader.split('++')[1],
          editLeaderId: e.triggerNode.props.eventKey
        });
      }
    } else {
      this.setState({
        editTeamLeader: '',
        editLeaderDepartment: '',
        editLeaderId: ''
      });
    }

  };

  //点击编辑弹窗ok，提交编辑数据
  handleOkEdit = () => {
    const {editTeamName, editTeamLeader, editLeaderId, editLeaderDepartment, oldTeamName, oldTeamLeader, oldLeaderId} = this.state;
    const {dispatch} = this.props; //从props中得到表格原始数据
    dispatch({
      type: 'teamManagement/teamEdit',
      editTeamName, editTeamLeader, editLeaderId, editLeaderDepartment, oldTeamName, oldTeamLeader, oldLeaderId
    });
    this.setState({
      visibleEdit: false,
    })
  };

  //点击编辑弹窗cancel
  handleCancelEdit = () => {
    this.setState({
      visibleEdit: false,
    });
  };
  /* == 编辑功能 END== */


  //小组删除
  showDeleteConfirm = (record) => { //删除确认框
    const {dispatch} = this.props; //从props中得到表格原始数据
    const teamName = record.team_name; //当前对象的name
    confirm({
      title: '确认删除？',
      content: '要删除 ' + teamName + ' 吗？',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        //将要删除的数据传给models层
        dispatch({
          type: 'teamManagement/teamDelete',
          teamName
        });
      },
      onCancel() {
        console.log('取消删除');
      },
    });
  };


  render() {
    const {visible, inputTeamName, inputTeamLeader, visibleEdit, editTeamName, editTeamLeader} = this.state;
    const columns = this.columns;
    const {loading, list, memberList, teamMember} = this.props;

    //给表格每行数据加key
    if (list.length) {
      list.map((i, index) => {
        i.key = index;
      })
    }

    const treeData = memberList.map(item => (
      <div title={item.name} key={item.id} value={item.id}>
        {
          item.list?
            item.list.map(i => {
              const flag = teamMember.filter(itemTeam => itemTeam.member_staffid === i.id);
              return <TreeNode value={i.name + '++' + item.name} title={i.name} key={i.id} disabled={flag.length > 0 ? true : false}/>
            }):null
        }
      </div>
    ));

    const treeData2 = memberList.map(item => (
      <div title={item.name} key={item.id} value={item.id}>
        {
          item.list?
            item.list.map(i => <TreeNode value={i.name + '++' + item.name} title={i.name} key={i.id}/>):null
        }
      </div>
    ));

    return (
      <div className={style.wrap}>
        <div style={{marginBottom: 16, overflow: 'hidden'}}>
          <h3 style={{float: 'left', marginLeft: 8, marginTop: 5}}>
            {localStorage.deptname}
          </h3>
          <Button type='primary' style={{float: 'right'}} onClick={this.showModal}>新增</Button>
          <Modal
            title="新增小组"
            visible={visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
          >
            <p className={style.marginTB16}>所在部门：{localStorage.deptname}</p>
            <p className={style.marginTB16}>
              <Input placeholder="小组名称" onChange={this.teamNameChange} value={inputTeamName} maxLength="60"/>
            </p>
            <TreeSelect
              showSearch
              style={{width: '100%'}}
              value={inputTeamLeader}
              dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
              placeholder="负责人"
              allowClear
              onChange={this.teamLeaderChange}
            >
              {treeData}
            </TreeSelect>
          </Modal>
          <Modal
            title="编辑小组"
            visible={visibleEdit}
            onOk={this.handleOkEdit}
            onCancel={this.handleCancelEdit}
          >
            <p className={style.marginTB16}>所在部门：{localStorage.deptname}</p>
            <p className={style.marginTB16}>
              <Input placeholder="编辑小组名称" onChange={this.teamNameEdit} value={editTeamName} maxLength="60"/>
            </p>
            <TreeSelect
              showSearch
              style={{width: '100%'}}
              value={editTeamLeader}
              dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
              placeholder="负责人"
              allowClear
              onChange={this.teamLeaderEdit}
            >
              {treeData2}
            </TreeSelect>
          </Modal>
        </div>
        <Table columns={columns} dataSource={list} className={style.financeTable} loading={loading}/>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const {teamMember} = state.teamManagement;
  return {
    teamMember,
    loading: state.loading.models.teamManagement,
    ...state.teamManagement
  };
}

export default connect(mapStateToProps)(TeamManagement);
