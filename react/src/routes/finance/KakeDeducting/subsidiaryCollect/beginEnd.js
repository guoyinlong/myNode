/**
 * 作者：张楠华
 * 日期：2018-6-25
 * 邮件：zhangnh6@chinaunicom.cn
 * 文件说明：辅助账汇总组件
 */
import React from 'react';
import { Collapse, Tooltip,Row,Col } from 'antd';
import Styles from '../../../../components/finance/subsidiaryCollect/subsidiaryCollect.less'
const Panel = Collapse.Panel;
export default function ({summaryData,list,tableHeader}) {
  return(
    <div>
      <Row style={{marginBottom : '10px'}}>
        <Col offset={4} span={3} style={{textAlign: 'right'}}>
          <span style={{fontWeight: 'bold'}}>期初余额</span>
        </Col>
        <Col span={3} style={{textAlign: 'right'}}>
          <span style={{fontWeight: 'bold'}}>本期借方发生额</span>
        </Col>
        <Col span={3} style={{textAlign: 'right'}}>
          <span style={{fontWeight: 'bold'}}>本期贷方发生额</span>
        </Col>
        <Col span={4} style={{textAlign: 'right'}}>
          <span style={{fontWeight: 'bold'}}>其中：结转管理费用</span>
        </Col>
        <Col span={4} style={{textAlign: 'right'}}>
          <span style={{fontWeight: 'bold'}}>其中：结转无形资产</span>
        </Col>
        <Col span={3} style={{textAlign: 'right'}}>
          <span style={{fontWeight: 'bold'}}>期末余额</span>
        </Col>
      </Row>
      <Collapse defaultActiveKey={['0']} accordion>
        {
          tableHeader.map((i,index)=>{
            return (
              <Panel header={i.name} key={index+1}>
                <div>
                  {
                    i.list? //如果没有第二层，直接第一层就取数据，目前第一层没有数据，取空
                      i.list.map((second,indexSecond)=> //第二层
                        second.list? //第三层，如果有第三层就循环1
                          second.list.map((third,indexThird)=>{
                            return(
                              <div key={indexThird+'ccc'}>
                                <Row>
                                  <Col span={4}>
                                    <Tooltip title={third.name}>
                                      <span className={Styles.titleStyle}>{third.name}</span>
                                    </Tooltip>
                                  </Col>
                                  {
                                    summaryData.length !== 0 ?summaryData.map((iList,indexList)=>{
                                      if(third.name === iList.fee_name){
                                        return(
                                          <Row key={indexList}>
                                            <Col span={3} style={{textAlign: 'right'}}><span>{iList['total_open']}</span></Col>
                                            <Col span={3} style={{textAlign: 'right'}}><span>{iList['total_borrow']}</span></Col>
                                            <Col span={3} style={{textAlign: 'right'}}><span>{iList['total_loan']}</span></Col>
                                            <Col span={4} style={{textAlign: 'right'}}><span>{iList['total_cost_loan']}</span></Col>
                                            <Col span={4} style={{textAlign: 'right'}}><span>{iList['total_asset_loan']}</span></Col>
                                            <Col span={3} style={{textAlign: 'right'}}> <span>{iList['total_close']}</span></Col>
                                          </Row>
                                        )
                                      }
                                    }):<div style={{textAlign:'center',color:'#ccc',minHeight:'500px',paddingTop:'20px'}}>暂无数据</div>
                                  }
                                </Row>
                              </div>
                            )
                          })
                          :
                          //没有第三层就直接取数据
                        <div key={indexSecond}>
                          <Row>
                            <Col span={4}>
                              <Tooltip title={second.name} placement="topRight">
                                <span className={Styles.titleStyle}>{second.name}</span>
                              </Tooltip>
                            </Col>
                            {
                              summaryData.length !== 0 ?summaryData.map((iList,indexList)=>{
                                if(second.name === iList.fee_name){
                                  return(
                                    <Row key={indexList}>
                                      <Col span={3} style={{textAlign: 'right'}}><span>{iList['total_open']}</span></Col>
                                      <Col span={3} style={{textAlign: 'right'}}><span>{iList['total_borrow']}</span></Col>
                                      <Col span={3} style={{textAlign: 'right'}}><span>{iList['total_loan']}</span></Col>
                                      <Col span={4} style={{textAlign: 'right'}}><span>{iList['total_cost_loan']}</span></Col>
                                      <Col span={4} style={{textAlign: 'right'}}><span>{iList['total_asset_loan']}</span></Col>
                                      <Col span={3} style={{textAlign: 'right'}}> <span>{iList['total_close']}</span></Col>
                                    </Row>
                                  )
                                }
                              }):<div style={{textAlign:'center',color:'#ccc',minHeight:'500px',paddingTop:'20px'}}>暂无数据</div>
                            }
                          </Row>
                        </div>)
                      :
                      []
                  }
                </div>
              </Panel>
            )
          })
        }
        <Panel header='其他' key={'cccdd'}>
          <div className={Styles.subsidiaryItemHalf2} key={'cc'}>
            <div>
              <Tooltip title='委托外部机构或个人进行研发活动所发生的费用' placement="topRight">
                <span>委托外部机构或个人进行研发活动所发生的费用</span>
              </Tooltip>
              <span>{list[0].entrust_fee_seven}</span>
            </div>
            <div>
              <Tooltip title='委托境外进行研发活动所发生的费用（包括存在关联关系的委托研发）' placement="topRight">
                <span>委托境外进行研发活动所发生的费用（包括存在关联关系的委托研发）</span>
              </Tooltip>
              <span>{list[0].entrust_fee}</span>
            </div>
            <div>
              <Tooltip title='允许加计扣除的研发费用中的第1至5类费用合计（1+2+3+4+5）' placement="topRight">
                <span>允许加计扣除的研发费用中的第1至5类费用合计（1+2+3+4+5）</span>
              </Tooltip>
              <span>{list[0].sum_divided}</span>
            </div>
            <div>
              <Tooltip title='其他相关费用限额=序号8×10％/(1-10％)' placement="topRight">
                <span>其他相关费用限额=序号8×10％/(1-10％)</span>
              </Tooltip>
              <span>{list[0].other_divided}</span>
            </div>
            <div>
              <Tooltip title='当期费用化支出可加计扣除总额' placement="topRight">
                <span>当期费用化支出可加计扣除总额</span>
              </Tooltip>
              <span>{list[0].cost_divided}</span>
            </div>
            <div>
              <Tooltip title='当期资本化可加计扣除的研发费用率' placement="topRight">
                <span>当期资本化可加计扣除的研发费用率</span>
              </Tooltip>
              <span>{list[0].asset_divided}</span>
            </div>
          </div>
        </Panel>
      </Collapse>
    </div>
  )
}

