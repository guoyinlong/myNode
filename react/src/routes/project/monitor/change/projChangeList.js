/**
 * 作者：邓广晖
 * 创建日期：2017-11-4
 * 邮件：denggh6@chinaunicom.cn
 * 文件说明：实现项目变更的项目列表展示
 *
 * 作者：薛刚
 * 变更时间：2018-10-11
 * 邮件：xueg@chinaunicom.cn
 * 文件说明：实现项目变更的项目列表展示
 */
import React from 'react';
import { Row, Col, Radio, Button } from 'antd';
import styles from './projChangeList.less'
import { connect } from 'dva';
import { routerRedux } from 'dva/router';

const RadioGroup = Radio.Group;

/**
 * 作者：邓广晖
 * 创建日期：2017-11-4
 * 功能：变更项目的卡片组件
 */
class ProjChgCard extends React.PureComponent {

  constructor(props) {
    super(props);
  }

  projChangeApply = ()=>{
    this.props.projChangeApply(this.props.proj_id, this.props.change_flag);
  };

  render(){
    return(
      <div className={styles.cardWrap} onClick={this.projChangeApply}>
        <Row>
          <Col className="gutter-box" span={16}>
            团队名称：{this.props.proj_name}
          </Col>
          {this.props.change_flag != '0'?
            <Col className="gutter-box" span={8} style={{color:'red',textAlign:'right',paddingRight:10}}>
              {this.props.change_flag_show}
            </Col>
            :
            null
          }
        </Row>
        <Row>
          <Col className="gutter-box" span={8}>
            生产编码：{this.props.proj_code}
          </Col>
        </Row>
        <Row gutter={16}>
          <Col className="gutter-box" span={8}>
            OU：{this.props.ou}
          </Col>
          <Col className="gutter-box" span={8}>
            主建部门：{this.props.dept_name_show}
          </Col>
          <Col className="gutter-box" span={8}>
            项目经理：{this.props.mgr_name}
          </Col>
        </Row>
        <Row gutter={16}>
          <Col className="gutter-box" span={8}>
            项目类型：{this.props.proj_type}
          </Col>
          <Col className="gutter-box" span={8}>
            主/子项目：{this.props.is_primary_show}
          </Col>
          <Col className="gutter-box" span={8}>
            项目分类：{this.props.proj_label_show}
          </Col>
        </Row>
      </div>
    );
  }
}

/**
 * 作者：邓广晖
 * 创建日期：2017-11-4
 * 功能：项目变更列表页面组件
 */
class ProjChangeList extends React.PureComponent {

  constructor(props) {
    super(props);
  }

  projChangeApply = (proj_id, change_flag)=>{
    if(change_flag == 0){
      return ;
    }
    const {dispatch} = this.props;
    // 如果项目处于差旅费预算变更中，点击卡片则可以查询变更中的差旅费信息；
    if(change_flag == 2 || change_flag == 4) {
      dispatch(routerRedux.push({
        pathname: 'projectApp/projMonitor/change/budgetChangeApply',
        query: {
          arg_proj_id: proj_id,
        }
      }));
    }
    // 如果项目处于项目信息变更中，点击卡片则可以查询变更中的项目信息
    else if(change_flag == 1 || change_flag == 3 || change_flag == 5) {
      dispatch(routerRedux.push({
        pathname: 'projectApp/projMonitor/change/projChangeApply',
        query: {
          arg_proj_id: proj_id
        }
      }));
    }
  };

  // 监控选择，根据选择设置state值
  selectOnChange = (e) => {
    const selectName = e.target.name, selectValue = e.target.value;
    this.props.dispatch({
      type: 'projChangeList/change',
      payload: {
        changeName: selectName,
        changeValue: selectValue
      }
    })
  }

  onProjChange = () => {
    const { dispatch, changeType, changeProjId } = this.props;
    if(changeType == 0) {
      dispatch(routerRedux.push({
        pathname: 'projectApp/projMonitor/change/projChangeApply',
        query: {
          arg_proj_id: changeProjId
        }
      }));
    } else if(changeType == 1) {
      dispatch(routerRedux.push({
        pathname: 'projectApp/projMonitor/change/budgetChangeApply',
        query: {
          arg_proj_id: changeProjId
        }
      }));
    }
  }

  render(){
    const { projChgList, changeType, typeDisabled, changeProjId } = this.props;

    const projCardList = projChgList.map((proj,index)=>{
      return(
        <Radio key={index} value={proj.proj_id} style={{ width: '100%'}} disabled={proj.change_flag != 0}>
          <ProjChgCard {...proj}
                       projChangeApply={(proj_id,change_flag)=>this.projChangeApply(proj_id,change_flag)}/>
        </Radio>
        );
    });
    const typeChooseList = (
      <RadioGroup name='changeType' onChange={this.selectOnChange} disabled={typeDisabled} value={changeType}>
        <Radio value={0} style={{ fontSize: '16px'}}>项目信息变更</Radio>
        <Radio value={1} style={{ fontSize: '16px'}}>差旅费预算变更</Radio>
      </RadioGroup>
    );

    return(
      <div>
        {projChgList.length?
          <div style={{background:'white',padding:'20px 10px 10px 20px'}}>
            <Row>
              <Col span={2}>
                <span style={{ fontSize: '16px', fontWeight: 'bold'}}>变更事项 <span style={{ color: 'red'}}>*</span>:</span>
              </Col>
              <Col span={22}>
                { typeChooseList }
              </Col>
            </Row>
            <Row style={{ marginTop: '20px'}}>
              <Col>
                <span style={{ fontSize: '16px', fontWeight: 'bold'}}>变更项目 <span style={{ color: 'red'}}>*</span>:</span>
              </Col>
            </Row>
            <Row style={{ marginTop: '20px'}}>
              <Col>
                <RadioGroup style={{ width: '100%'}} name='changeProjId' onChange={this.selectOnChange} value={changeProjId}>
                  {projCardList}
                </RadioGroup>
              </Col>
            </Row>
            <Row style={{ marginTop: '20px', textAlign: 'center'}}>
              <Button type="primary" disabled={typeDisabled || (changeType === '' || changeProjId === '')}
                onClick={this.onProjChange}>变更</Button>
            </Row>
          </div>
          :
          <div style={{background:'white',textAlign:'center',fontSize:19,height:30}}>
            {'无数据'}
          </div>
        }
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    loading:state.loading.models.projChangeList,
    ...state.projChangeList
  }
}

export default connect(mapStateToProps)(ProjChangeList);
