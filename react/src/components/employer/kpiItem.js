/**
 * 作者：李杰双
 * 日期：2017/9/1
 * 邮件：282810545@qq.com
 * 文件说明：单个项目的指标UI组件
 */

import Style from './searchDetail.less'
import Masonry from './Masonry2'
import {EVAL_COMP_EVAL_KPI,EVAL_PROJ_EVAL_KPI,EVAL_BP_EVAL_KPI} from '../../utils/config'
const MasonryItem=Masonry.MasonryItem
import { Collapse,Icon ,Table,Tooltip} from 'antd';
import {splitEnter} from '../../utils/func'
const Panel = Collapse.Panel;
const stateMap={
  0: {state:'待提交',color:'#FA7252'},
  1: {state:'待审核',color:'#FA7252'},
  2: {state:'审核未通过',color:'red'},
  3: {state:'待评价',color:'#FA7252'},
  4: {state:'待确认',color:'#FA7252'},
  5: {state:'复议',color:'#FA7252'},
  6: {state:'评价完成',color:'green'},
  7: {state:'评价完成',color:'green'},
  8: {state:'评价完成',color:'green'},
  9: {state:'评价完成',color:'green'},
  10: {state:'评价完成',color:'green'},
  A:{state:'完成情况未填报',color:'red'}
};
function showChecker(item) {
  //alert(JSON.stringify(item))
  return <p>{item.second_checker_name?item.checker_name + '、'+item.second_checker_name:item.checker_name}</p>
}
function showLeaderUnPassReason(list) {
  for(let i = 0; i < list.length; i++){
    if(list[i].evaluationReturn_reason && list[i].state==='6'){
      return <p className={Style.unpass}>不通过原因：{list[i].evaluationReturn_reason}</p>
    }
  }
  return null;
}
/**
 * 作者：李杰双
 * 功能：单个项目的容器组件
 * list：某个项目的empKpis，[]
 */
export default function Project_kpiBox({project:p,kpiTpyes,list,noScore,totalScore,scoreDetails,isValue,stateTemp}) {
  return (
    <div className={Style.projectsBox}>
      <div className={Style.projectTitle}>
        <div className={Style.staffInfo}>
          <div>
            {p.proj_name?p.proj_name:p.emp_type=='7'? EVAL_BP_EVAL_KPI:EVAL_COMP_EVAL_KPI}
          </div>
          <div>
            {p.season?<span><Icon type="nianduhejidu"/>{`${p.year}年 第${p.season}季度`}</span>:<span>{`${p.year}年`}</span>}
            <span><Icon type="xingming"/>{p.staff_name}</span>
            {p.season?<span><Icon type="xiangmubianhao"/>{p.staff_id}</span>:null}
            {p.season?<span><Icon type="gongxiandu"/>贡献度：{p.cont_degree ? parseFloat(p.cont_degree).toFixed(3) : '--'}</span>:null}
            {p.cont_degree?<Tooltip  title={p.adjust_reason} placement="bottomLeft"><Icon style={{marginLeft:'-8px'}} type="question-circle"/></Tooltip>:null}
          </div>
        </div>
        {noScore?
          <div className={Style.totalScore}>{!totalScore?null:<span>目标分值：<span>{totalScore||'--'}</span></span>}</div>
        :<div className={Style.staffScore}>
          <span>评级：<span>{p.rank||'--'}</span></span>
          <span>总分：<span>{p.score||'--'}
            {p.score?<svg id="svg" width="80" height="10">
              <path d="M0 9 Q37 3, 80 4" stroke="#ff0000" fill="none" style={{strokeWidth:'2px'}}></path>
            </svg>:null}
          </span></span>
          {!totalScore?null:<span>目标分值：<span>{totalScore||'--'}</span></span>}
        </div>}


      </div>
      <div>
        {
          (p.unpass_reason&&p.state==='2')
            ?<p className={Style.unpass}>审核不通过原因：{p.unpass_reason}</p>
            :null
        }
        {
          (list && list.length)
            ?showLeaderUnPassReason(list)
            :null
        }

        {kpiTpyes && kpiTpyes.length ? kpiTpyes.map((i,index)=>{
          // /let details=list?list.filter(k=>k.kpi_type===i)? list.filter(k=>k.kpi_type===i).filter(j=>j.proj_name===p.proj_name):null:null
          // 将所有的kpi 根据类型分成两类，每一类又是一个 KpiTypesBox
          let details = [];
          let typeFilter = [];
          if(list && list.length){
            typeFilter = list.filter(k=>k.kpi_type===(i.kpi_type||i));

            if(typeFilter && typeFilter.length){
              details = typeFilter.filter(j=>(j.proj_id===p.proj_id))
            }
          }


          return (<KpiTypesBox key={index} title={i} list={details} scoreDetails={scoreDetails} isValue={isValue} stateTemp={stateTemp}/>)
        }):null}
      </div>
    </div>
  )
}
/*{list && list.length ? list.map((i,index)=><MasonryItem key={index}><KpiItem kpi={i}/></MasonryItem>):null}*/
/**
 * 作者：李杰双
 * 功能：指标项的统计表
 */
function ScoreTable({list,isValue}) {
  let total=0;
  let columns = [
    { title: '总分',dataIndex: 'tScore', key: 'tScore', fixed: 'left',width:'70px', className:'scoreTh'},
  ];
  let reList=[{}];
  list.forEach((i,index)=>{
    reList[0]['score'+index]=i.score;
    columns.push({
      title: '指标'+(index+1),dataIndex: 'score'+index, key: 'score'+index,
      width:'80px',
      render:(text)=> text && (i.state >= '6' || isValue == 'true' || isValue == true) ? parseFloat(text).toFixed(2) : '--',
      className:'scoreTh'
    });
    if(i.score &&  (i.state >= '6' || isValue == 'true' || isValue == true)){
      total+=parseFloat(i.score)
    }
  });
  columns[0].render=()=>total.toFixed(2);

  return (
    <div>
      <Table bordered size={'small'} columns={columns} dataSource={reList} scroll={{ x: list.length*80+70 }} pagination={false}/>
    </div>

  )
}

/**
 * 作者：李杰双
 * 功能：单个指标类别的容器组件
 */
function KpiTypesBox({title,list,scoreDetails,isValue,stateTemp}) {
  function getHeader(title,list=[],scoreDetails){
    return (
      <div className={Style.typeTitle}>
        <div>{title.render?title.render(title.kpi_type):title.kpi_type||title}</div>
        {
          list.length&&(list[0].score || scoreDetails)?<div className={Style.scoreTable}>
            <ScoreTable list={list} isValue = {isValue}/>
          </div>:null
        }

      </div>
    )

  }
  return (
    <div className={Style.KpiTypesBox+" "+(list.length&&list[0].score?Style.arr:null)}>
      <Collapse bordered={false} defaultActiveKey={['1']}>
        <Panel header={getHeader(title,list,scoreDetails)} key="1">
          {/*<CardList list={list}/>*/}
          <Masonry wrapClass={Style.borderR}>
            {list && list.length ? list.map((i,index) => <MasonryItem key={index}><KpiItem kpi={i} index={index} stateTemp={stateTemp}/></MasonryItem>):null}
          </Masonry>
        </Panel>
      </Collapse>
    </div>
  )
}

/**
 * 功能：瀑布流展示卡片
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2017-12-13
 * @param list
 * @returns {XML}
 * @constructor
 */
const CardList = ({list}) => {
  const columns = list.map((i, index) => {
    return (
      <MasonryItem key={index}><KpiItem kpi={i} key={index}/></MasonryItem>
    );
  })
  return (
    <Masonry wrapClass={Style.borderR}>
      {columns}
    </Masonry>
  )
}
/**
 * 作者：李杰双
 * 功能：单个指标UI组件
 */
function KpiItem({kpi:k,index,stateTemp}){
  return(
    <div className={Style.kpiBox}>
      <div className={Style.kpiItemTitle}>
        <div>{k.renderkpi_name?k.renderkpi_name(k.kpi_name,k,index): '指标'+(index+1)+":" + (k.kpi_name || k.kpi_content)}</div>
        {k.renderScore?k.renderScore(k.score,k):<div>得分：<span>{k.score && k.state >= '6' ? parseFloat(k.score).toFixed(2) : '--'}</span>{'/'+(k.target_score?k.target_score:0)}</div>}
      </div>
      <div>
        <span>完成目标：</span>
        <span>
          {k.renderkpi_content
            ?k.renderkpi_content(k.kpi_content,k)
            :splitEnter(k.kpi_target || k.kpi_content)
          }
        </span>
      </div>
      <div>
        <span>评价标准：</span>
        <span>
          {k.renderformula
            ?k.renderformula(k.formula,k)
            :splitEnter(k.formula)
          }
        </span>

      </div>
      <div>
        <span>考&nbsp;&nbsp;核&nbsp;&nbsp;人：</span>
        <span>
          {k.renderchecker_name
            ?k.renderchecker_name(k.checker_name,k)
            :showChecker(k)
          }
        </span>
      </div>
      {k.remark
        ?
        <div>
          <span>备&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;注：</span>
          <span>
          {k.remark}
        </span>
        </div>
        :null
      }

      {k.renderfinish
        ?<div>
          <span>完成情况：</span>
          <span>
            {k.renderfinish(k.finish,k)}
          </span>
        </div>
        :k.finish
          ?<div>
            <span>完成情况：</span>
            <span>
            {splitEnter(k.finish)}
            </span>
          </div>
          :null
      }

      {k.state
        ?
        <div>
          <span>状&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;态：</span>
          <span style={{  color: stateTemp==='A' && !k.finish ?stateMap[stateTemp].color:stateMap[k.state].color }}>{stateTemp==='A' && !k.finish?stateMap[stateTemp].state:(k.state ? stateMap[k.state].state : 0)}</span>
        </div>
        :null
      }

    </div>
  )
}
