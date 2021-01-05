/**
 * 作者：刘东旭
 * 日期：2018-03-05
 * 邮箱：liudx1006@chinaunicom.cn
 * 文件说明：资金计划-人员管理
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
} from 'antd'
import style from './management.less'

const TabPane = Tabs.TabPane; //标签切换
const TreeNode = Tree.TreeNode; //树形控件
const Search = Input.Search; //树形控件搜索
const confirm = Modal.confirm; //确认框

class StaffManagement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false, //设置弹窗显示状态
      expandedKeys: [], //展开的
      searchValue: '', //搜索内容
      autoExpandParent: true,
      checkedKeys: [], //已选人员默认信息
      generateData: [], //重构默认数据部门-项目
      generateDepartmentData: [], //重构默认数据部门
      generateProjectData: [], //重构默认数据部门
      loggedOu: '', //当前登录者ou
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
        width: 100,
      }, {
        title: '姓名',
        dataIndex: 'member_name',
        key: 'member_name',
        width: 150,
      }, {
        title: '工号',
        dataIndex: 'member_staffid',
        key: 'member_staffid',
        width: 150,
      }, {
        title: '部门',
        dataIndex: 'member_department',
        key: 'member_department',
      }, {
        title: '操作',
        key: 'action',
        render: (text, record) => (
          <Button onClick={() => this.showDeleteConfirm(record)} size='small' type="danger" ghost>
            删除
          </Button>
        ),
        width: 150,
      }
    ];
  }

  //打开弹窗Model
  showModal = () => {
    const {departProjectData, departData, projectData} = this.props; //从状态机中获取默认传递数据（部门-项目）.teamMember.member_staffid 是已加入小组的成员id

    const secondData = departProjectData.map(item => ({ //对数据进行重构，成为树组件数据格式。部门-团队
      key: item.id + '++miss', //父级节点加关键字miss
      title: item.name,
      children: item.list ? item.list.map(itemSecond => ({
        key: itemSecond.id + '++miss', //父级节点加关键字miss
        title: itemSecond.name,
        children: itemSecond.list ? itemSecond.list.map(itemThird => (
          {
            key: itemThird.name + '++' + itemThird.id + '++' + item.name,
            title: itemThird.name,
          }
        )) : []
      })) : []
    }));


    const secondDepartmentData = departData.map(item => ({ //对数据进行重构，成为树组件数据格式。部门
      key: item.id + '++miss', //父级节点加关键字miss
      title: item.name,
      children: item.list ? item.list.map(itemThird => (
        {
          key: itemThird.name + '++' + itemThird.id + '++' + item.name,
          title: itemThird.name,
        }
      )) : []
    }));

    const secondProjectData = projectData.map(item => ({ //对数据进行重构，成为树组件数据格式。部门
      key: item.id + '++miss', //父级节点加关键字miss
      title: item.name,
      children: item.list ? item.list.map(itemThird => (
        {
          key: itemThird.name + '++' + itemThird.id + '++' + itemThird.deptName,
          title: itemThird.name,
        }
      )) : []
    }));

    this.setState({
      generateData: secondData, //重构默认数据部门-团队
      generateDepartmentData: secondDepartmentData, //重构默认数据部门
      generateProjectData: secondProjectData, //重构默认数据团队
      visible: true,
      loggedOu: localStorage.ou,//获取当前用户ou
    })
  };

  //点击弹窗ok
  handleOk = (e) => {
    const {checkedKeys} = this.state;
    const memberData = checkedKeys.filter(item => 'miss' !== item.split('++')[1]).map(item => ({ //此处的filter筛掉父级节点
      arg_member_name: item.split('++')[0], //成员姓名
      arg_member_staffid: item.split('++')[1], //成员ID
      arg_member_department: item.split('++')[2],
    }));

    const {dispatch} = this.props;
    dispatch({
      type: 'staffManagement/staffNew',
      memberData
    });
    this.setState({
      visible: false,
      checkedKeys: [],
    });
  };

  //点击弹窗cancel
  handleCancel = (e) => {
    this.setState({
      visible: false,
    });
  };

  //标签切换时执行
  callback = (key) => {
    //console.log(key);
  };

  /* == 树形控件 START== */
  onExpand = (expandedKeys) => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };

  //按部门-项目搜索触发函数
  onChange = (e) => {
    const {generateData} = this.state;
    const gData = generateData;

    const dataList = [];
    const generateList = (data) => {
      for (let i = 0; i < data.length; i++) {
        const node = data[i];
        const key = node.key;
        dataList.push({key, title: key});
        if (node.children) {
          generateList(node.children, node.key);
        }
      }
    };
    generateList(gData);

    const getParentKey = (key, tree) => {
      let parentKey;
      for (let i = 0; i < tree.length; i++) {
        const node = tree[i];
        if (node.children) {
          if (node.children.some(item => item.key === key)) {
            parentKey = node.key;
          } else if (getParentKey(key, node.children)) {
            parentKey = getParentKey(key, node.children);
          }
        }
      }
      return parentKey;
    };

    const value = e.target.value;
    const expandedKeys = dataList.map((item) => {
      if (item.title.indexOf(value) > -1) {
        return getParentKey(item.title, gData);
      }
      return null;
    }).filter((item, i, self) => item && self.indexOf(item) === i);

    this.setState({
      expandedKeys,
      searchValue: value,
      autoExpandParent: true,
    });
  };

  //按部门搜索触发函数
  onChangeDepartment = (e) => {
    const {generateDepartmentData} = this.state;
    const gData = generateDepartmentData;

    const dataList = [];
    const generateList = (data) => {
      for (let i = 0; i < data.length; i++) {
        const node = data[i];
        const key = node.key;
        dataList.push({key, title: key});
        if (node.children) {
          generateList(node.children, node.key);
        }
      }
    };
    generateList(gData);

    const getParentKey = (key, tree) => {
      let parentKey;
      for (let i = 0; i < tree.length; i++) {
        const node = tree[i];
        if (node.children) {
          if (node.children.some(item => item.key === key)) {
            parentKey = node.key;
          } else if (getParentKey(key, node.children)) {
            parentKey = getParentKey(key, node.children);
          }
        }
      }
      return parentKey;
    };

    const value = e.target.value;
    const expandedKeys = dataList.map((item) => {
      if (item.title.indexOf(value) > -1) {
        return getParentKey(item.title, gData);
      }
      return null;
    }).filter((item, i, self) => item && self.indexOf(item) === i);

    this.setState({
      expandedKeys,
      searchValue: value,
      autoExpandParent: true,
    });
  };

  //按项目搜索触发函数
  onChangeProject = (e) => {
    const {generateProjectData} = this.state;
    const gData = generateProjectData;

    const dataList = [];
    const generateList = (data) => {
      for (let i = 0; i < data.length; i++) {
        const node = data[i];
        const key = node.key;
        dataList.push({key, title: key});
        if (node.children) {
          generateList(node.children, node.key);
        }
      }
    };
    generateList(gData);

    const getParentKey = (key, tree) => {
      let parentKey;
      for (let i = 0; i < tree.length; i++) {
        const node = tree[i];
        if (node.children) {
          if (node.children.some(item => item.key === key)) {
            parentKey = node.key;
          } else if (getParentKey(key, node.children)) {
            parentKey = getParentKey(key, node.children);
          }
        }
      }
      return parentKey;
    };

    const value = e.target.value;
    const expandedKeys = dataList.map((item) => {
      if (item.title.indexOf(value) > -1) {
        return getParentKey(item.title, gData);
      }
      return null;
    }).filter((item, i, self) => item && self.indexOf(item) === i);

    this.setState({
      expandedKeys,
      searchValue: value,
      autoExpandParent: true,
    });
  };

  //已选择的
  onCheck = (checkedKeys) => {
    this.setState({
      checkedKeys
    });
  };

  /* == 树形控件 END== */


  //小组删除
  showDeleteConfirm = (record) => { //删除确认框
    const {dispatch} = this.props; //从props中得到表格原始数据
    const memberId = record.member_staffid; //当前对象的name
    confirm({
      title: '确认删除？',
      content: '要删除 ' + record.member_name + ' 吗？',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        //将要删除的数据传给models层
        dispatch({
          type: 'staffManagement/staffDelete',
          memberId
        });
      },
      onCancel() {
        console.log('取消删除');
      },
    });
  };


  render() {
    const {searchValue, expandedKeys, autoExpandParent, generateData, generateDepartmentData, generateProjectData, loggedOu} = this.state;
    const columns = this.columns;
    const {loading, teamInfo, list, teamMember} = this.props; //loading
    //给表格每行数据加key
    if (list !== undefined && list.length > 0) {
      list.map((i, index) => {
        i.key = index;
      })
    }


    /* == 树形控件 START== */
    const loop = data => data.map((item) => {
      const index = item.title.indexOf(searchValue);
      const beforeStr = item.title.substr(0, index);
      const afterStr = item.title.substr(index + searchValue.length);
      const title = index > -1 ? (
        <span>
          {beforeStr}
          <span style={{color: '#f50'}}>{searchValue}</span>
          {afterStr}
        </span>
      ) : <span>{item.title}</span>;
      if (item.children) {
        return (
          <TreeNode key={item.key} title={title}>
            {loop(item.children)}
          </TreeNode>
        );
      }
      const flag = teamMember.filter(itemTeam => itemTeam.member_staffid === item.key.split('++')[1]);
      return <TreeNode key={item.key} title={title} disableCheckbox={flag.length > 0 ? true : false}/>;
    });
    /* == 树形控件 END== */

    return (
      <div className={style.wrap}>
        <div style={{overflow: 'hidden'}}>
          <span style={{float: 'left', fontSize: 16,}}>团队名称：{teamInfo.team_name}</span>
          <Button type='primary' onClick={this.showModal} style={{marginBottom: '10px', float: 'right'}}>新增</Button>
          <Modal
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
          >

            {
              loggedOu === '联通软件研究院本部' ?
                <Tabs defaultActiveKey="1" onChange={this.callback}>
                  <TabPane tab="按部门" key="1">
                    <Search style={{marginBottom: 8}} placeholder="搜索..." onChange={this.onChangeDepartment}
                            value={this.state.searchValue}/>
                    <Tree
                      checkable
                      onExpand={this.onExpand}
                      expandedKeys={expandedKeys}
                      autoExpandParent={autoExpandParent}
                      onCheck={this.onCheck}
                      checkedKeys={this.state.checkedKeys}
                    >
                      {loop(generateDepartmentData)}
                    </Tree>
                  </TabPane>
                </Tabs>
                :
                <Tabs defaultActiveKey="1" onChange={this.callback}>
                  <TabPane tab="按部门-项目" key="1">
                    <Search style={{marginBottom: 8}} placeholder="搜索..." onChange={this.onChange}
                            value={this.state.searchValue}/>
                    <Tree
                      checkable
                      onExpand={this.onExpand}
                      expandedKeys={expandedKeys}
                      autoExpandParent={autoExpandParent}
                      onCheck={this.onCheck}
                      checkedKeys={this.state.checkedKeys}
                    >
                      {loop(generateData)}
                    </Tree>
                  </TabPane>
                  <TabPane tab="按部门" key="2">
                    <Search style={{marginBottom: 8}} placeholder="搜索..." onChange={this.onChangeDepartment}
                            value={this.state.searchValue}/>
                    <Tree
                      checkable
                      onExpand={this.onExpand}
                      expandedKeys={expandedKeys}
                      autoExpandParent={autoExpandParent}
                      onCheck={this.onCheck}
                      checkedKeys={this.state.checkedKeys}
                    >
                      {loop(generateDepartmentData)}
                    </Tree>
                  </TabPane>
                  <TabPane tab="按项目" key="3">
                    <Search style={{marginBottom: 8}} placeholder="搜索..." onChange={this.onChangeProject}
                            value={this.state.searchValue}/>
                    <Tree
                      checkable
                      onExpand={this.onExpand}
                      expandedKeys={expandedKeys}
                      autoExpandParent={autoExpandParent}
                      onCheck={this.onCheck}
                      checkedKeys={this.state.checkedKeys}
                    >
                      {loop(generateProjectData)}
                    </Tree>
                  </TabPane>
                </Tabs>
            }
          </Modal>
        </div>
        <Table columns={columns} dataSource={list} className={style.financeTable} loading={loading}/>
      </div>
    );
  }
}


function mapStateToProps(state) {
  const {list, departProjectData, departData, projectData, teamMember} = state.staffManagement;

  return {
    list,
    departProjectData,
    departData,
    projectData,
    teamMember,
    loading: state.loading.models.staffManagement,
    ...state.staffManagement
  };
}

export default connect(mapStateToProps)(StaffManagement);
