/**
 *  作者: 胡月
 *  创建日期: 2017-10-30
 *  邮箱：huy61@chinaunicom.cn
 *  文件说明：实现选择项目经理的功能
 */
import { Row, Col, Tree,Icon,message,Spin} from 'antd';
import request from '../../utils/request';
const TreeNode = Tree.TreeNode;

//选择项目经理组合
class MgrRadioGroup extends React.Component {
  state = {
    ouDeptList: [],
    mgr_id: this.props.defaultDept ? this.props.defaultDept.dept_id : null,
    mgr_name: this.props.defaultDept ? this.props.defaultDept.dept_name : null,
    selectedKeys: [],
    isSpin:true
  }

  // 获取选中的值
  getData = ()=> {
    const {mgr_id,mgr_name}=this.state;
    return {mgr_id, mgr_name};
  }
  //选项改变时，对项目经理名字和项目经理id赋值
  onSelect = (selectedKeys, info) => {
    let mgrInfo = '', mgrId = '';
    if (selectedKeys[0] == undefined) {
      mgrId = this.state.mgr_id;
      mgrInfo = this.state.mgr_name;
    } else {
      if (selectedKeys[0].length == 7) {
        this.setState({
          selectedKeys: selectedKeys,
        });
        mgrInfo = info.selectedNodes[0].props.title;
        mgrId = selectedKeys[0];
      } else {
        message.error('请选择人员!');
        this.setState({
          selectedKeys: [],
        });
        mgrId = '';
        mgrInfo = '';
      }
    }
    this.setState({
      mgr_id: mgrId,
      mgr_name: mgrInfo,
    });
  }
  //加载服务，获取ou，部门，项目经理的值
  componentDidMount() {
    const {defaultDept}=this.props;
    let oudata = request('/microservice/serviceauth/project_projadd_get_pm');
    oudata.then((data)=> {
      let ouDeptList = {};
      if (defaultDept && defaultDept.length > 0) {
        for (let d = 0; d < defaultDept.length; d++) {
          //  获取根目录
          for (let i = 0; i < data.DataRows.length; i++) {
            if (data.DataRows[i].dept_name == '联通软件研究院') {
              ouDeptList['all'] = data.DataRows[i];
              ouDeptList['all'].child = [];
            }
          }
        }
      } else {
        //  获取根目录
        for (let i = 0; i < data.DataRows.length; i++) {
          if (data.DataRows[i].dept_name == '联通软件研究院') {
            ouDeptList['all'] = data.DataRows[i];
            ouDeptList['all'].child = [];
          }
        }
      }

      //  获取根目录下的三个OU
      for (let r = 0; r < data.DataRows.length; r++) {
        if (data.DataRows[r].deptname_p == ouDeptList['all'].dept_name) {
          data.DataRows[r].child = [];
          data.DataRows[r].selectable = false;
          ouDeptList['all'].child.push(data.DataRows[r]);
        }
      }
      //  根据OU获取ou下面的部门
      for (let s = 0; s < ouDeptList['all'].child.length; s++) {
        for (let t = 0; t < data.DataRows.length; t++) {
          if (data.DataRows[t].deptname_p && (data.DataRows[t].dept_name).split('-').length == 2) {
            let p_dept = (data.DataRows[t].deptname_p).split('-')[1];
            if (p_dept == ouDeptList['all'].child[s].dept_name) {
              data.DataRows[t].child = [];
              ouDeptList['all'].child[s].child.push(data.DataRows[t]);
            }
          }
        }
      }
      //  获取部门下的项目经理
      for (let s = 0; s < ouDeptList['all'].child.length; s++) {
        for (let u = 0; u < ouDeptList['all'].child[s].child.length; u++) {
          for (let t = 0; t < data.DataRows.length; t++) {
            let dept = data.DataRows[t].deptname_p;
            if (dept == ouDeptList['all'].child[s].child[u].dept_name) {
              ouDeptList['all'].child[s].child[u].child.push(data.DataRows[t]);
            }
          }
        }
      }
      this.setState({
        ouDeptList: ouDeptList,
        isSpin:false
      })
    })
  }

  render() {
    const {ouDeptList}=this.state;
    return (
      <Spin tip="加载中..." spinning={this.state.isSpin}>
        <div>
          <Row>
            {ouDeptList['all'] ? ouDeptList['all'].child.map((cItem, cIndex)=>
              <Col xs={4} sm={4} md={4} lg={4} xl={4} offset={cIndex === 1 || cIndex === 2?2:0} key={cItem.dept_id}>
                <Tree
                  showLine={true}
                  defaultExpandedKeys={[cItem.dept_id]}
                  onSelect={this.onSelect}
                  selectedKeys={this.state.selectedKeys}

                >
                  <TreeNode title={cItem.dept_name} key={cItem.dept_id}>
                    {cItem.child.map((cCItem, cCIndex)=>
                      <TreeNode title={cCItem.dept_name.split('-')[1]}
                                key={cCItem.dept_id}>
                        {cCItem.child.map((cCCItem, cCCIndex)=>
                          <TreeNode
                            title={cCCItem.dept_name}
                            key={cCCItem.dept_id}/>
                        )}
                      </TreeNode>
                    )}
                  </TreeNode>
                </Tree>
              </Col>
            )
              : null}
          </Row>
        </div>
      </Spin>

    )
  }
}


export default MgrRadioGroup;
