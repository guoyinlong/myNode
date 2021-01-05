/**
 *  作者: 张楠华
 *  创建日期: 2018-8-22
 *  邮箱：zhangnh6@chinaunicom.cn
 *  文件说明：审核详情底部栏。
 */
import Style from './review.less'
import {Select,Row,Col,Modal,Table } from 'antd';
import { routerRedux } from 'dva/router';
const Option = Select.Option;
function changeToHumanQuery(dispatch){
  dispatch(routerRedux.push({
    pathname: 'projectApp/timesheetManage/staffTimesheetSearchPm'
  }));
}
class ReviewBottom extends React.Component {

  state={
    visibleDetail:false,
    visibleOther:false,
    visibleMakeUp:false,
  };
  render(){
    const { allDetail,dispatch,tag } = this.props;
    if(allDetail.DataRows1){
      allDetail.DataRows1.map((i,index)=>{
        i.key = index;
      })
    }
    if(allDetail.DataRows){
      allDetail.DataRows.map((i,index)=>{
        i.key = index;
      })
    }
    let columnsDetail =[
      {
        title: '员工编号',
        dataIndex:'staff_id',
        key:'1',
      },
      {
        title: '员工姓名',
        dataIndex:'staff_name',
        key:'2'
      },
      {
        title: '状态',
        dataIndex:'show_status',
        key:'3'
      },
    ];
    let columnsOther = [
      {
        title: '员工编号',
        dataIndex:'staff_id',
        key:'1',
      },
      {
        title: '员工姓名',
        dataIndex:'full_name',
        key:'2'
      },
      {
        title: '团队',
        dataIndex:'proj_name',
        key:'3'
      },
      {
        title: '工时数',
        dataIndex:'total_proj_hours',
        key:'4'
      }
    ];
    let columnsMakeUp = [
      {
        title: '员工编号',
        dataIndex:'staff_id',
        key:'1',
      },
      {
        title: '员工姓名',
        dataIndex:'staff_name',
        key:'2'
      },

      {
        title: '欠缺工时',
        dataIndex:'lack_hours',
        key:'3'
      }
    ];
    return(
      <div>
        {
          allDetail.show_restrict === '0'?
           ''
              :
            tag === 0 ?
              <div  className={Style.cardWrap}>
                <div style={{padding:'20px 20px'}}>
                  <div>
                    <span style={{textAlign:'left',paddingLeft:'15px',fontWeight:'600',fontSize:'16px'}}>工时填报情况</span>
                    <span style={{marginLeft:'20px',color:'#F76442',cursor:'pointer',textDecoration:'underline'}} onClick={()=>changeToHumanQuery(dispatch)}>详情请参见项目人员工时查询</span>
                  </div>
                  <Row style={{textAlign:'left',paddingLeft:'15px',marginTop:'20px'}}>
                    <Col span={4}>
                      <span>团队总人数：{allDetail.team_staff_num}</span>
                    </Col>
                    <Col span={5}>
                      <span>审核通过人数：{allDetail.team_checked_num}</span>
                    </Col>
                    <Col span={5}>
                      <span>待提交人数：<a style={{cursor:'pointer',textDecoration:'underline',color:'#F76442'}} onClick={()=>this.setState({visibleDetail:true})}>{allDetail.team_unsubmit_num}</a></span>
                    </Col>
                    <Col span={5}>
                      <span>已提交本项目人数：{allDetail.team_submit_num}</span>
                    </Col>
                    <Col span={5}>
                      <span>已提交其他项目人数：<a style={{cursor:'pointer',color:'#F76442',textDecoration:'underline'}} onClick={()=>this.setState({visibleOther:true})}>{allDetail.team_submit_other_num}</a></span>
                    </Col>
                  </Row>
                </div>
              </div>
              :
              tag === 1 ?
                <div  className={Style.cardWrap}>
                  <div style={{padding:'20px 20px'}}>
                    <div>
                      <span style={{textAlign:'left',paddingLeft:'15px',fontWeight:'600',fontSize:'16px'}}>工时补录情况（{allDetail.this_year_month}）</span>
                    </div>
                    <Row style={{textAlign:'left',paddingLeft:'15px',marginTop:'20px'}}>
                      <Col span={5}>
                        <span>团队总人数：{allDetail.team_staff_num}</span>
                      </Col>
                      <Col span={5}>
                        <span>需要补录人数：<a style={{cursor:'pointer',color:'#F76442',textDecoration:'underline'}} onClick={()=>this.setState({visibleMakeUp:true})}>{allDetail.team_makeup_staff_num}</a></span>
                      </Col>
                      <Col span={10}>
                        <span style={{color:'#fb947b'}}>（当月填写工时总数小于应填总数×90%）</span>
                      </Col>
                    </Row>
                  </div>
                </div>
                :
                ''
        }
        <Modal
          title='待提交名单'
          visible={this.state.visibleDetail}
          onCancel={()=>this.setState({visibleDetail:false})}
          footer={null}
        >
          <Table columns={columnsDetail}
                 dataSource={allDetail.DataRows1}
                 pagination={true}
          />
        </Modal>
        <Modal
          title='提交其他项目人员名单'
          visible={this.state.visibleOther}
          onCancel={()=>this.setState({visibleOther:false})}
          footer={null}
          width="600px"
        >
          <Table columns={columnsOther}
                 dataSource={allDetail.DataRows}
                 pagination={true}
          />
        </Modal>
        <Modal
          title='需要补录名单'
          visible={this.state.visibleMakeUp}
          onCancel={()=>this.setState({visibleMakeUp:false})}
          footer={null}
        >
          <Table columns={columnsMakeUp}
                 dataSource={allDetail.DataRows}
                 pagination={true}
          />
        </Modal>
      </div>
    )
  }
}
export default ReviewBottom;
