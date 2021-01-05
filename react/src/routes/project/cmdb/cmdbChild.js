import React from "react";
import { connect } from "dva";
import { Button, Row, Col, Input, Table } from "antd";
import style from "./css/cmdb.css"

/**
 *
 *  系统表头
 *  */
const columns = [
  {
    title:'业务系统编码',
    dataIndex:'projectID',
    key: 'projectID'
  },
  {
    title: '业务系统名称',
    dataIndex: 'projectName',
    key: 'projectName',
  },
  {
    title: '集群名称',
    dataIndex: 'clusterName',
    key: 'clusterName',
  },
  {
    title: '模块',
    dataIndex: 'moduleName',
    key: 'moduleName',
  },
  //
  // {
  //   title: '特别系统标识（天宫）',
  //   dataIndex: 'specialSysid',
  //   key: 'specialSysid',
  // },
  {
    title: '项目成本',
    dataIndex: 'hostCost',
    key: 'hostCost',
  },
  {
    title: '分摊完成占比',
    dataIndex: 'apportionmentProportion',
    key: 'apportionmentProportion',
  }
];
//创建router类，继承React的Component类
class cmdbChild extends React.Component {
    constructor(props) {
        super(props);
    }
    onClickBtn(type) {
        if (type === 'query') {
        this.props.dispatch({
            type: "cmdbChild/queryData",
        });
    } else {
        this.props.dispatch({
        type: "cmdbChild/updateProjectID",
        projectID: ""
    });
        this.props.dispatch({
        type: "cmdbChild/inited",
            });
        }
    }
    onProjectIDChange(e, type) {
        this.props.dispatch({
            type: "cmdbChild/updateProjectID",
            projectID: e.target.value
        });
    }

    render() {
        const { queryData, projectData } = this.props;
        let dataSource = projectData.map((item, index, ary) => { item.key = index; return item; });
        let projectID = queryData && queryData.projectID ? queryData.projectID : '';
        return (
            <div className={style.tableContainer}  >
              <Row gutter={16}>
                <Col span={3}></Col>
                <Col className={style.searchTitle} span={4}><p>查询条件：</p></Col>
                <Col span={6}>
                    <Input placeholder="输入业务编码查询" value={projectID} onChange={(e) => this.onProjectIDChange(e, "projectID")}></Input>
                </Col>
                <Col span={4} className={style.fontStyle}>
                <Button onClick={() => this.onClickBtn("query")}
                    type="primary">查询</Button>
                </Col>
                <Col span={4} className={style.fontStyle}>
                <Button onClick={() => this.onClickBtn("reset")}
                    type="primary">重置</Button>
                </Col>
                <Col span={3}></Col>
              </Row>
              <Row gutter={16} >
                  <div>
                      <p className={style.resultTitle}>结果展示：</p>
                      <Table dataSource={dataSource} columns={columns} />
                  </div>
              </Row>
            </div>
            );
        }
    }
//数据映射
const mapStateToProps = (state) => {
    return {
        ...state.cmdbChild,
    };
};


//
export default connect(mapStateToProps)(cmdbChild);
