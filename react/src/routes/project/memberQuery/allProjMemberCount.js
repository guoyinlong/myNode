/*
*项目人员汇总
*Author: 任金龙
*Date: 2017年11月7日
*Email: renjl33@chinaunicom.cn
*/
import React from 'react';
import { Collapse ,Table,Button} from 'antd';
import styles from './allProjMemberInfo.less';
import  {exportExlMember} from './exportExlMember.js'
const Panel = Collapse.Panel;
function projIndex(record, index) {
  if(record.level == 0 ){
    return index + 1;
  }else{
    return ((index + 1).toString());
  }
}

class AllProjMemberCount extends React.Component {
  state={

  }

  exportExcelAllProjMember = () => {

    const list= this.props.projMemberCount;
    let header=["单位","团队数","总人数","序号","归属部门","团队名称","团队人数","主责人数","配合人数","总数"];
    let headerKey=["ou","row","sum","i","pu_dept_name","proj_name","count","0","count_cooperation","total_num"];

    if(list !== null && list.length !== 0){
      exportExlMember(list,'所有项目人员汇总表',header,headerKey,2);
    }else{
      message.info("查询结果为空！")
    }
  };

  columns = [
    {
      title: '序号',
      dataIndex: 'i',
      render: (text, record, index) => projIndex(record, index)
    },
    {
      title: '归属部门',
      dataIndex: 'pu_dept_name',
      key:'pu_dept_name',
    },
    {
      title: '团队名称',
      dataIndex: 'proj_name',
      key:'proj_name',
    },
    {
      title: '团队人数',
      children: [
        {
          title: '主责人数',
          dataIndex: 'count',
          key: 'count',
        },
        {
          title: '配合人数',
          dataIndex: 'count_cooperation',
          key: 'count_cooperation',
        },
        {
          title: '总人数',
          dataIndex: 'total_num',
          key: 'total_num',
        },
      ],
    }];
  render() {
    const {loading}=this.props;

    return (
      <div>
        <Collapse bordered={false} defaultActiveKey={['1']}>
          <Panel key="1" className={styles.customPanelStyle} header={<div>
            {this.props.projMemberCount[0].ou}
            <div style={{float:'right'}}>
              <span><b>团队数：</b>{this.props.projMemberCount[0].row}</span>&nbsp;&nbsp;&nbsp;&nbsp;<span><b>人员总数：</b>{this.props.projMemberCount[0].sum}</span>&nbsp;&nbsp;&nbsp;&nbsp;
            </div>
          </div>
          }>
            <Table columns={this.columns}
                   dataSource={this.props.projMemberCount[0].proj}
                   pagination={false}
                   className={styles.orderTable}
                   loading={loading}
                   bordered={true}
                   rowKey={(i, index) => i=index}

            />
          </Panel>
          <Panel key="2" className={styles.customPanelStyle} header={<div>
            {this.props.projMemberCount[1].ou}
            <div style={{float:'right'}}>
              <span><b>团队数：</b>{this.props.projMemberCount[1].row}</span>&nbsp;&nbsp;&nbsp;&nbsp;<span><b>人员总数：</b>{this.props.projMemberCount[1].sum}</span>&nbsp;&nbsp;&nbsp;&nbsp;
            </div>
                       </div>
                        }>
            <Table columns={this.columns}
                   dataSource={this.props.projMemberCount[1].proj}
                   pagination={false}
                   className={styles.orderTable}
                   loading={loading}
                   bordered={true}
                   key={"2"}
            />
          </Panel>
          <Panel key="3" className={styles.customPanelStyle} header={<div>
            {this.props.projMemberCount[2].ou}
            <div style={{float:'right'}}>
              <span><b>团队数：</b>{this.props.projMemberCount[2].row}</span>&nbsp;&nbsp;&nbsp;&nbsp;<span><b>人员总数：</b>{this.props.projMemberCount[2].sum}</span>&nbsp;&nbsp;&nbsp;&nbsp;
            </div>
          </div>
          }>
            <Table columns={this.columns}
                   dataSource={this.props.projMemberCount[2].proj}
                   pagination={false}
                   className={styles.orderTable}
                   loading={loading}
                   bordered={true}
                   key={"3"}
            />
          </Panel>
          <Panel key="4" className={styles.customPanelStyle} header={<div>
            {this.props.projMemberCount[3].ou}
            <div style={{float:'right'}}>
              <span><b>团队数：</b>{this.props.projMemberCount[3].row}</span>&nbsp;&nbsp;&nbsp;&nbsp;<span><b>人员总数：</b>{this.props.projMemberCount[3].sum}</span>&nbsp;&nbsp;&nbsp;&nbsp;
            </div>
          </div>
          }>
            <Table columns={this.columns}
                   dataSource={this.props.projMemberCount[3].proj}
                   pagination={false}
                   className={styles.orderTable}
                   loading={loading}
                   bordered={true}
                   key={"4"}
            />
          </Panel>
          <Panel key="5" className={styles.customPanelStyle} header={<div>
            {this.props.projMemberCount[4].ou}
            <div style={{float:'right'}}>
              <span><b>团队数：</b>{this.props.projMemberCount[4].row}</span>&nbsp;&nbsp;&nbsp;&nbsp;<span><b>人员总数：</b>{this.props.projMemberCount[4].sum}</span>&nbsp;&nbsp;&nbsp;&nbsp;
            </div>
          </div>
          }>
            <Table columns={this.columns}
                   dataSource={this.props.projMemberCount[4].proj}
                   pagination={false}
                   className={styles.orderTable}
                   loading={loading}
                   bordered={true}
                   key={"5"}
            />
          </Panel>
        </Collapse>
        <div style={{textAlign:'right',marginTop:'10px'}}>
          <Button type="primary" onClick={this.exportExcelAllProjMember} style={{marginRight:'8px'}}>{'导出'}</Button>
        </div>
      </div>
    );
  }
}

export default AllProjMemberCount;
