/**
 * 作者：张楠华
 * 日期：2018-6-25
 * 邮件：zhangnh6@chinaunicom.cn
 * 文件说明：辅助账汇总组件
 */
import React from 'react';
import { Collapse, Tooltip } from 'antd';
import Styles from '../../../../components/finance/subsidiaryCollect/subsidiaryCollect.less'
const Panel = Collapse.Panel;
const state_code_map={
  '1':'已审核',
  '2':'待审核'
};
export default function ({data,header}) {
  return(
    <div>
      <div>
        <Collapse defaultActiveKey={['0']} accordion>
          <Panel header='基本信息' key={0}>
            <div className={Styles.subsidiaryItemHalf2}>
              <div>
                <Tooltip title='项目名称' placement="topRight">
                  <span>项目名称</span>
                </Tooltip>
                <span>{data.proj_name}</span>
              </div>
              <div>
                <Tooltip title='项目编号' placement="topRight">
                  <span>项目编号</span>
                </Tooltip>
                <span>{data.proj_code}</span>
              </div>
              <div>
                <Tooltip title='研发形式' placement="topRight">
                  <span>研发形式</span>
                </Tooltip>
                <span>{data.proj_type}</span>
              </div>
              <div>
                <Tooltip title='资本化、费用化支出选项' placement="topRight">
                  <span>资本化、费用化支出选项</span>
                </Tooltip>
                <span>{data.fee_type}</span>
              </div>
              <div>
                <Tooltip title='项目实施状态选项' placement="topRight">
                  <span>项目实施状态选项</span>
                </Tooltip>
                <span>{state_code_map[data.state_code]}</span>
              </div>
            </div>
          </Panel>
          {
            header.map((i,index)=>{
              return (
                <Panel header={i.name} key={index+1}>
                  <div className={Styles.subsidiaryItemHalf2}>
                    {
                      i.list? //如果没有第二层，直接第一层就取数据
                          i.list.map((second,indexSecond)=> //第二层
                            second.list? //第三层，如果有第三层就循环
                              second.list.map((third,indexThird)=>{
                                return(
                                  <div key={indexThird+'bb'}>
                                    <Tooltip title={third.name} placement="topRight">
                                      <span>{third.name}</span>
                                    </Tooltip>
                                    <span>{data[third.englishName]}</span>
                                  </div>
                                )
                              })
                              :
                              //没有第三层就直接取数据
                              <div key={indexSecond}>
                                <Tooltip title={second.name} placement="topRight">
                                  <span>{second.name}</span>
                                </Tooltip>
                                <span>{data[second.englishName]}</span>
                              </div>)
                        :
                        // 第一层 i,index
                        <div key={index+'aa'}>
                          <Tooltip title={i.name} placement="topRight">
                            <span>{i.name}</span>
                          </Tooltip>
                          <span>{data[i.englishName]}</span>
                        </div>
                    }
                  </div>
                </Panel>
                )
            })
          }
          <Panel header='其他' key={data.length+1}>
            <div className={Styles.subsidiaryItemHalf2}>
              <div>
                <Tooltip title='委托外部机构或个人进行研发活动所发生的费用' placement="topRight">
                  <span>委托外部机构或个人进行研发活动所发生的费用</span>
                </Tooltip>
                <span>{data.entrust_fee_seven}</span>
              </div>
              <div>
                <Tooltip title='委托境外进行研发活动所发生的费用（包括存在关联关系的委托研发）' placement="topRight">
                  <span>委托境外进行研发活动所发生的费用（包括存在关联关系的委托研发）</span>
                </Tooltip>
                <span>{data.entrust_fee}</span>
              </div>
              <div>
                <Tooltip title='允许加计扣除的研发费用中的第1至5类费用合计（1+2+3+4+5）' placement="topRight">
                  <span>允许加计扣除的研发费用中的第1至5类费用合计（1+2+3+4+5）</span>
                </Tooltip>
                <span>{data.sum_divided}</span>
              </div>
              <div>
                <Tooltip title='其他相关费用限额=序号8×10％/(1-10％)' placement="topRight">
                  <span>其他相关费用限额=序号8×10％/(1-10％)</span>
                </Tooltip>
                <span>{data.other_divided}</span>
              </div>
              <div>
                <Tooltip title='当期费用化支出可加计扣除总额' placement="topRight">
                  <span>当期费用化支出可加计扣除总额</span>
                </Tooltip>
                <span>{data.cost_divided}</span>
              </div>
              <div>
                <Tooltip title='当期资本化可加计扣除的研发费用率' placement="topRight">
                  <span>当期资本化可加计扣除的研发费用率</span>
                </Tooltip>
                <span>{data.asset_divided}</span>
              </div>
            </div>
          </Panel>
        </Collapse>
      </div>
    </div>
  )
}

