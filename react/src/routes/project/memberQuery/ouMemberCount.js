/*
*单位人员汇总
*Author: 任金龙
*Date: 2017年11月6日
*Email: renjl33@chinaunicom.cn
*/
import React from 'react';
import {Table, Button} from 'antd';
import styles from './ouMemberCount.less';
import {ouMembersCountQueryService} from "../../../services/project/projService";
import exportExl from "../../../components/commonApp/exportExl.js";
//tabs中里程碑页面
class OuMemberCount extends React.Component {
  constructor(props) {super(props);}
  state={
  }
  exportExcelOuMember = () => {

    const list= this.props.ouMemberCountList;
    let tab=document.querySelector('#tabOuMember table');
    if(list !== null && list.length !== 0){
      exportExl()(tab,'单位人数汇总表')
    }else{
      message.info("查询结果为空！")
    }


  };
  columns = [
    {
      title: '主建单位',
      dataIndex: 'ou_short',
      key: 'ou_short',
      width: 180,
  },
    {
      title: '人数',
      children: [
        {
      title: '总人数',
      dataIndex: 'total',
      key: 'total',
      width: 150,
    },
        {
         title: '职能类人数',
         dataIndex: 'func_num',
         key: 'func_num',
         width: 150,
      },
        {
          title: '项目类人数',
          children: [
            {
              title: '主责人数',
              dataIndex: 'proj_team_num',
              key: 'proj_team_num',
              width: 150,
            },
            {
              title: '配合人数',
              dataIndex: 'proj_team_num_cooperation',
              key: 'proj_team_num_cooperation',
              width: 150,
            },
            {
              title: '总人数',
              dataIndex: 'proj_total_num',
              key: 'proj_total_num',
              width: 150,
            },
          ],
        },
       ],
  },
    {
       title: '项目数',
       dataIndex: 'proj_num',
       key:'proj_num',
    }
    ];

  render() {
    const{loading,dispatch} = this.props;
    return (
      <div>
        <div id="tabOuMember">
          <Table columns={this.columns}
                 dataSource={this.props.ouMemberCountList}
                 pagination={false}
                 className={styles.orderTable}
                 loading={loading}
                 bordered={true}
                 />
        </div>
        <div style={{textAlign:'right',marginTop:'10px'}}>
          <Button type="primary" onClick={this.exportExcelOuMember} style={{marginRight:'8px'}}>{'导出'}</Button>
        </div>
      </div>
    );

  }
}
export default OuMemberCount;
