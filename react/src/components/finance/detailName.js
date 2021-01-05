/**
 * 作者：张楠华
 * 日期：2018-3-28
 * 邮箱：zhangnh6@chinaunicom.cn
 * 文件说明：办公用品和capex明细
 */
import { Table,Icon,Popover  } from 'antd'
import tableStyle from '../../components/finance/table.less'
function detailName(text,capexItemList ) {
  let data = capexItemList?JSON.parse(capexItemList):[];
  if(data.length){
    data.forEach((i,index)=>{
      i.key = index;
    })
  }
  let columns = [
    {
      title: '项目批复年度',
      dataIndex: 'proj_approval_year',
      width:'8%',
    },
    {
      title: '批复项目名称',
      dataIndex: 'approved_proj_name',
      width:'8%',
    },
    {
      title: '批复项目编号',
      dataIndex: 'approved_item_number',
      width:'8%',
    },
    {
      title: '项目总预算',
      dataIndex: 'total_proj_budget',
      width:'8%',
    },
    {
      title: '合同名称',
      dataIndex: 'contract_title',
      width:'8%',
    },
    {
      title: '合同总金额',
      dataIndex: 'contract_amount',
      width:'8%',
    },
    {
      title: '累计已支付金额',
      dataIndex: 'accumulated_amount_paid',
      width:'8%',
    },
    {
      title: '本月付款金额',
      dataIndex: 'payment_amount_this_month',
      width:'8%',
    },
    {
      title: '填报状态',
      dataIndex: 'fill_state_code',
      width:'8%',
      render:(text)=>{
        return(
          <div>
            {text ==='0'?'新增':text ==='1'?'保存':text==='2'?'待审核':text==='3'?'审核通过':text ==='4'?'退回':'-'}
          </div>
        )
      }
    },
    {
      title: '本月调整后付款金额',
      dataIndex: 'adjust_payment_amount_this_month',
      width:'8%',
    },
    {
      title: '调整阶段状态',
      dataIndex: 'adjust_state_code',
      width:'8%',
      render:(text)=>{
        return(
          <div>
            {text ==='0'?'新增':text ==='1'?'保存':text==='2'?'待审核':text==='3'?'审核通过':text ==='4'?'退回':'-'}
          </div>
        )
      }
    },
  ];
  return(
    <div>
      <span>{text}</span>
      {
          text === '其他capex' || text === '资产购置'?
            <Popover placement="top"  title={text+'详情'} content ={<Table dataSource={data} columns={columns} className={tableStyle.financeTable} pagination={false}/>}>
              <Icon type="info-circle-o" style={{ marginLeft:10 }}/>
            </Popover>
            :
            []
      }
    </div>
  )
}

export default { detailName }
