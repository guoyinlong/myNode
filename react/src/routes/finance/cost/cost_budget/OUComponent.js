/**
 * 作者：李杰双
 * 日期：2017/11/11
 * 邮件：282810545@qq.com
 * 文件说明：选OU组件
 */
import React from 'react'
import Cookie from 'js-cookie';
import * as service from '../../../../services/finance/const_budget'
import Styles from '../../../../components/cost/cost_budget.less'
import { Select, message} from 'antd';
const Option = Select.Option;

class OUComponent extends React.Component {
  state={
    ous:[]
  }
  loadData = async (selectedOptions) => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;
    try{
      let {DataRows} = await service.projname({
        arguserid:window.localStorage['sys_userid'],
        argou:targetOption.label
      })
      targetOption.loading = false;
      if(!DataRows.length){
        targetOption.children=[
          {
            label:'无',
            value:'无',
            disabled:true
          }
        ]
      }else{
        targetOption.children = DataRows.map((i)=>{
          return {
            label:i.proj_name,
            value:i.proj_code,

          }
        })
      }

      this.setState({
        ouCascader:[...this.state.ouCascader]
      })
    }catch (e){
      console.log(e)
    }

  }
  async componentDidMount(){
    try{
      let argtenantid=Cookie.get('tenantid'),arguserid=window.localStorage['sys_userid'];
      let { RetCode,moduleid } = await service.p_userhasmodule({
        argtenantid,
        arguserid,
        argrouterurl:this.props.argrouterurl
      });
      if(RetCode){
        let { DataRows } = await service.p_usergetouordeptinmodule({
          argtenantid,
          arguserid,
          argmoduleid:moduleid,
          argvgtype:'2'       //todo:暂时写死
        });
        this.props.dataReady(true);
        this.setState({
          ous:DataRows
        })
      }

    }catch (e){
      message.error(e.message)
    }
  }
  onChange=(value, selectedOptions)=>{
    //console.log(this.refs.wrapedComponent.onChange(value,selectedOptions))
  }
  render() {
    return <span>
      OU：&nbsp;
      {
        this.props.value ?
          <Select value={this.props.value} style={{width:'200px'}}   onChange={this.props.onChange} placeholder='请选择OU'>
            {
              this.state.ous.map((i,index)=><Option key={index} value={i.dept_name}>{i.dept_name}</Option>)
            }
          </Select>
          :
          <Select style={{width:'200px'}}  onChange={this.props.onChange} placeholder='请选择OU'>
            {
              this.state.ous.map((i,index)=><Option key={index} value={i.dept_name}>{i.dept_name}</Option>)
            }
          </Select>
      }
    </span>

  }
}
export default OUComponent

