/**
 * 作者：李杰双
 * 日期：2017/10/24
 * 邮件：282810545@qq.com
 * 文件说明：抽出ou搜索组件
 */
import React from 'react'
import Cookie from 'js-cookie';
import * as service from '../../../../services/finance/const_budget'
import Styles from '../../../../components/cost/cost_budget.less'
import { Cascader, message} from 'antd';


const cost_budeget_const={
  COST_BUDGET_Q: "/cost_budget_sel",  //全成本-项目全成本管理-项目全成本预算查询
  COST_BUDGET_M: "/cost_budget_ma",  //全成本-项目全成本管理-项目全成本预算查询(项目经理)
  COST_OU_VGTYPE: 2,//全成本选择ou

};
function getDisplayName(component) {
  return component.displayName || component.name || 'Component';
}
const withOuSearch=(WrappedComponent) =>{
  return class HOC extends React.Component {
    static displayName = `HOC(${getDisplayName(WrappedComponent)})`
    state={
      ouCascader:[]
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
      let path=this.props.location.pathname.split('/')
      //console.log()
      try{
        let argtenantid=Cookie.get('tenantid'),arguserid=window.localStorage['sys_userid'];
        let { RetCode,moduleid } = await service.p_userhasmodule({
          argtenantid,
          arguserid,
          argrouterurl:'/'+path[path.length-1]
        })

        if(RetCode){
          let { DataRows } = await service.p_usergetouordeptinmodule({
            argtenantid,
            arguserid,
            argmoduleid:moduleid,
            argvgtype:cost_budeget_const.COST_OU_VGTYPE
          });
          this.props.dispatch({
            type:'cost_budget_sel/usergetmodule_grpsrv',
            argmoduleid:moduleid
          })
          this.setState({
            ouCascader:DataRows.map((i)=>{
              return {value:i.dept_id,label:i.dept_name,isLeaf:false}
            })
          })
        }

      }catch (e){
        message.error(e.message)
      }
    }
    onChange=(value, selectedOptions)=>{
      console.log(this.refs.wrapedComponent.onChange(value,selectedOptions))
    };
    render() {
      return <div>
        <div style={{display:'inline-block'}}>
          <Cascader
            popupClassName={Styles.cascaderOU}
            allowClear={false}
            options={this.state.ouCascader}
            loadData={this.loadData}
            style={{width:'500px'}}
            onChange={this.onChange}
            size='large'
            placeholder='请选择OU/项目'
            displayRender={(label, selectedOptions)=>label[label.length-1]}
          />
        </div>
        <WrappedComponent {...this.props} ref='wrapedComponent'/>
      </div>
    }
  }
}
export default withOuSearch
