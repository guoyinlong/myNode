/**
 * 作者：王旭东
 * 创建日期：2018-11-12
 * 邮箱：wangxd347@chinaunicom.cn
 *文件说明：用于选择部门联系人的树形控件
 */
import React from 'react';
import request from '../../../../../utils/request';
import {stringify} from 'qs';
import {Tree, message} from 'antd';

const treeNode = Tree.TreeNode;

class SelectStaff extends React.PureComponent {

  constructor(props) {
    super(props);
  }

  state = {
    treeData: [],    // 整个树形结构的数据
    selectKey: '',   // 选中人员的id
    selectName: '',  // 选中人员的名字
  }

  /**
   * 初次加载的数据获取
   */
  componentDidMount() {
    let postData = {
      arg_req_tenantid: publicFunc.getTenantId(),
      arg_req_userid: publicFunc.getUserId(),
      // arg_req_moduleurl: publicFunc.getModuleUrlIndex(),
      arg_req_moduleurl: 'projInfoManager',
    };
    let oudata = request (
      `/microservice/sysmgt/auth_visible_depts_persons_default?${stringify(postData)}`,
      { method: 'POST' }
    );
    oudata.then((data) => {
      if (data.RetCode === '1') {
        let transData = [];
        let objData = {};
        for(let i = 0; i < data.DataRows.length; i++) {
          objData = {};
          objData.title = data.DataRows[i].deptname;
          objData.key = data.DataRows[i].deptid;
          objData.isLeaf = data.DataRows[i].orghaschildrens === '0' && data.DataRows[i].is_dept === '0';
          objData.deptid = data.DataRows[i].deptid;
          //objData.selectable = data.DataRows[i].deptid !== '-1';     //deptid为-1的不能选择
          transData.push(objData);
        }
        this.setState({
          treeData: transData
        });
      }
    })
  }
  /**
   * 用于异步加载节点点开数据
   * @param treeNode
   * @returns {Promise<any>}
   */
  onLoadData = (treeNode) => {
    return new Promise((resolve) => {
      // 如果该节点存在子节点，直接进行后续操作
      if (treeNode.props.children) {
        resolve();
        return;
      }
      // 服务的参数
      let postData = {
        arg_deptid: treeNode.props.dataRef.deptid,
        arg_req_tenantid: publicFunc.getTenantId(),
        arg_req_userid: publicFunc.getUserId(),
        // arg_req_moduleurl: publicFunc.getModuleUrlIndex(),
        arg_req_moduleurl: 'projInfoManager', //选人

      };
      let oudata = request(
        `/microservice/sysmgt/auth_visible_depts_persons_default?${stringify(postData)}`,
        {method: 'POST'}
      );
      oudata.then((data) => {
        if (data.RetCode === '1') {
          let transData = [];
          let objData = {};
          for (let i = 0; i < data.DataRows.length; i++) {
            objData = {};
            objData.title = data.DataRows[i].deptname;
            objData.key = data.DataRows[i].deptid;
            objData.isLeaf = data.DataRows[i].orghaschildrens === '0' && data.DataRows[i].is_dept === '0';
            objData.deptid = data.DataRows[i].deptid;
            //objData.selectable = data.DataRows[i].deptid !== '-1';;     //deptid为-1的不能选择
            transData.push(objData);
          }
          // 将服务获取的数据添加为当前节点的children
          treeNode.props.dataRef.children = transData;
          this.setState({
            treeData: [...this.state.treeData],
          });
          resolve();
        }
      });
    });
  };

  /**
   * 渲染节点
   * @param data
   * @returns {*}
   */
  renderTreeNodes = (data) => {
    return data.map((item) => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode {...item} dataRef={item}/>;
    });
  };

  /**
   * 选中的节点
   * @param key  key为选中的一个数组
   * @param e
   */
  setTreeSelect = (key, e) => {
    if (key.length) {
      if (key[0] === '-1' || e.node.props.dataRef.isLeaf === false) {// 不能再次展开的数据isleaf
        message.info('当前节点不能选择');   //异步加载时，selectable属性不管用，从此处提示
        this.setState({
          selectKey: '',     //选中节点的key，即员工id
          selectName: '',    //选中节点的名称，即员工名称
        });
        return;
      }
      this.setState({
        selectKey: key[0],
        selectName: e.node.props.dataRef.title
      });
    } else {
      this.setState({
        selectKey: '',     //选中节点的key，即员工id
        selectName: '',    //选中节点的名称，员工名称
      });
    }
  };

  render() {
    return (
      <div style={{maxHeight: 400, overflow: 'scroll'}}>
        <Tree
          loadData={this.onLoadData}
          onSelect={(key, e) => this.setTreeSelect(key, e)}
          showLine={true}
        >
          {this.renderTreeNodes(this.state.treeData)}
        </Tree>
      </div>
    );
  }
}


export default SelectStaff;
