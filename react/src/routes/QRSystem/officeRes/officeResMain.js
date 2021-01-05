/**
  * 作者： 卢美娟
  * 创建日期： 2018-08-22
  * 邮箱: lumj14@chinaunicom.cn
  * 功能： 办公资源-指示图
  */

import React from 'react';
import { connect } from 'dva';
import { Table, Row, Col, message,Tag,Input,Tooltip,Card,Spin,Modal,Button } from 'antd';
import moment from 'moment';;
import { routerRedux } from 'dva/router';
import Cookie from 'js-cookie';
import styles from './officeRes.less';
const Search = Input.Search;

class officeResMain extends React.Component{

  state = {
    showModal: false,
    listData:[],
    selectid:'',
    parentid:'',
    saveStationArr:[],
    configVisible: false,
  }

  componentWillMount(){
    const {dispatch} = this.props;
    var temparr = [];
    dispatch({
      type:'officeResMain/infraQuery',
      callback:(backdata) => {
        for(let i = 0; i < backdata.length; i++){
          var data = {
            arg_infra_id:backdata[i].id
          }
          dispatch({
            type:'officeResMain/statisticsInfraStation',
            data,
            callback:(backdata2) => {
              temparr.push(backdata2)
              this.setState({saveStationArr:temparr})
            }
          })
        }
      }
    })
    /**
    dispatch({
      type:'officeResMain/userpermission',
      callback:(backdata) => {
        console.log("6666666");
        console.log(backdata);
        if(backdata){
          for(let i = 0; i < backdata.length; i++){
            if(backdata[i].permission_code == 'config_assets_usecount'){
              this.setState({configVisible: true})
            }
          }
        }
      }
    })

**/
    dispatch({
      type:'officeResMain/rolepermission',
      callback:(backdata) => {
        if(backdata == "2"||backdata == "4"||backdata == "3"){   //2 属地管理员 4 部门属地管理员  3部门经理
              this.setState({configVisible: true})
            }
          }
    })
  }

  toCommon = (id) => {
    const {dispatch} = this.props;
    if(id == 'yhl7c'){
      dispatch(routerRedux.push({
        pathname:'/adminApp/compRes/officeResMain/officeRes',
        query:{param: 'yhl7c'},
      }));
    }else{
      dispatch(routerRedux.push({
        pathname:'/adminApp/compRes/officeResMain/commonPageOne',
        query:{param: id},
      }));
    }
  }

  searchPos = (value) => {
    if(value == '' || value == null || value == undefined){
       message.info("使用人姓名不能为空！");
       return;
      }
    if(value.replace(/\s+/g,'') == '' || value.replace(/\s+/g,'') == null || value.replace(/\s+/g,'') == undefined){
      message.info("使用人姓名不能为空格！");
      return;
     }
    const {dispatch} = this.props;
    var data = {
      arg_username_list: value,
    }
    dispatch({
      type:'officeResMain/searchPos',
      data,
      callback:(data) => {
        this.setState({listData:data})
        if(data.length > 0){
          this.setState({showModal: true})
        }
      }
    })
  }

  handleOk = (e) => {
    const {dispatch} = this.props;
    if(this.state.selectid == ''){
      message.info("请选择查询人员");
      return;
    }
    if(this.state.parentid == 'nw' || this.state.parentid == 'ew'){
      dispatch(routerRedux.push({
        pathname:'/adminApp/compRes/officeResMain/commonPageOne',
        query:{id:this.state.selectid,param:this.state.parentid},
      }));
      this.setState({showModal: false},()=>{
        var data = {
          arg_infra_id: this.props.location.query.param,
        }
        dispatch({
          type:'CommonPageOne/infraQuery',
          data,
        })
      });
    }else{
      dispatch(routerRedux.push({
        pathname:'/adminApp/compRes/officeResMain/commonPage',
        query:{id:this.state.selectid,param:this.state.parentid},
      }));
      this.setState({showModal: false});
    }
  }

  handleCancel = (e) => {this.setState({showModal: false});}

  getSelectid = (parent_id,id) => {
    this.setState({
      parentid:parent_id,
      selectid: id,
    })
  }

  gotoConfig = () => {
    const {dispatch} = this.props;
    dispatch(routerRedux.push({
      pathname:'/adminApp/compRes/officeResMain/officeConfig',
    }))
  }
  //跳转至工位申请页面
  gotoApply =()=>{
    const {dispatch} = this.props;
    dispatch(routerRedux.push({
      pathname:'/adminApp/compRes/officeResMain/apply',
    }))
  }

  //跳转至工位延期页面
  gotoDelay =()=>{
    const {dispatch} = this.props;
    dispatch(routerRedux.push({
      pathname:'/adminApp/compRes/officeResMain/delayWorkstation',
    }))
  }

  //跳转至工位释放页面
  gotoRelease =()=>{
    const {dispatch} = this.props;
    dispatch(routerRedux.push({
      pathname:'/adminApp/compRes/officeResMain/releaseWorkstation',
    }))
  }

  render(){
    const {stationContent,infraContent} = this.props;
    let ListCard = [];
    if(this.state.listData){
      for(let i = 0; i < this.state.listData.length; i++){
        ListCard.push(
            <div style={{display:'inline-block',marginLeft:30,marginTop:30,width:260,height:170}} key = {i} className = {(this.state.listData[i].id==this.state.selectid)?styles.antcardIn:styles.antcard}
              onClick = {()=>this.getSelectid(this.state.listData[i].parent_id,this.state.listData[i].id)}>
              <div className = {styles.antcardbordered}>
                <div className = {styles.antcardhead}>
                  <div className = {styles.antcardheadtitle}>{this.state.listData[i].id}</div>
                </div>
                  <div style = {{float:'left',width:'60%',overflow:'hidden',}}>
                    <p style = {{padding:10}} className = {styles.overflow}>归属部门： <Tooltip title = {this.state.listData[i].charger_dept_name}>{this.state.listData[i].charger_dept_name}</Tooltip></p>
                    <p style = {{padding:10}} className = {styles.overflow}>使用人： <Tooltip title = {this.state.listData[i].assetuser_name}>{this.state.listData[i].assetuser_name}</Tooltip></p>
                  </div>

              </div>
            </div>

        )
      }
    }

    var renderData = () => {
      let res = []
      for(let i = 0; i < infraContent.length;i++){
        res.push(
          <Col span = {24/(infraContent.length)}>
            <Tooltip  title = {`一层${infraContent[i].infra_name}，共有工位${this.state.saveStationArr[i]?this.state.saveStationArr[i].all_station_count:'0'}个，
            其中长期使用${this.state.saveStationArr[i]?this.state.saveStationArr[i].longterm_station_count:0}个，临时使用${this.state.saveStationArr[i]?this.state.saveStationArr[i].temporary_station_count:0}个，
            闲置${this.state.saveStationArr[i]?this.state.saveStationArr[i].free_station_count:0}个，不可用${this.state.saveStationArr[i]?this.state.saveStationArr[i].cant_use_station_count:0}个`}>
              <div style={infraContent[i].shape_container.thumb_property.position} onClick = {()=>this.toCommon(infraContent[i].id)} >
                <img src={infraContent[i].shape_container.thumb_property.img_src} className={styles.centerImg} />
                <font className={styles.centerword222}>{infraContent[i].infra_name}</font>
              </div>
            </Tooltip>
          </Col>
        )
      }
      return res;
    }

    if(stationContent&&infraContent&&this.state.saveStationArr){
      return(
        <Spin tip="加载中..." spinning={this.props.loading}>
          <div className = {styles.pageContainer1}>
            <h2 style = {{textAlign:'center'}}>指示图</h2>
            {
              this.state.configVisible ?
                <div style={{display:'inline',folat:"left",marginLeft:'30px'}}>
                  <Button type = "primary" style = {{marginRight:"3px"}} onClick = {this.gotoApply}>{"申请工位"}</Button>
                  <Button type = "primary" style = {{marginRight:"3px"}} onClick = {this.gotoDelay}>{"延期工位"}</Button>
                  <Button type = "primary" style = {{marginRight:"3px"}} onClick = {this.gotoRelease}>{"释放工位"}</Button>
                  <Button  onClick = {this.gotoConfig}>配置</Button>
                </div>
                :
                ''
            }
            <Search
              placeholder="请输入使用人姓名搜索"
              onSearch={value => this.searchPos(value)}
              style={{width:'300px',marginRight:"30px",float:"right"}}
              maxLength = {10}
              enterButton
            />
            <div style = {{marginTop: '5%',marginLeft:'10%',marginRight:'10%'}}>
              <Row type="flex" gutter={16}>
                {renderData()}
              </Row>
            </div>
            <div style = {{marginLeft:'10%',marginRight:'10%'}}>
              <div className={styles.mainPageWord}>共有工位 <span style={{color:'#FA7252'}}>{`${stationContent?stationContent.all_station_count:0}`}</span> 个，其中:</div>
              <div className={styles.mainPageWord}>长期使用：<span style={{color:'#FA7252'}}>{`${stationContent?stationContent.longterm_station_count:0}`}</span></div>
              <div className={styles.mainPageWord}>临时使用：<span style={{color:'#FA7252'}}>{`${stationContent?stationContent.temporary_station_count:0}`}</span></div>
              <div className={styles.mainPageWord}>闲置：<span style={{color:'#FA7252'}}>{`${stationContent?stationContent.free_station_count:0}`}</span></div>
              <div className={styles.mainPageWord}>不可用：<span style={{color:'#FA7252'}}>{`${stationContent?stationContent.cant_use_station_count:0}`}</span></div>
            </div>
            <Modal title = '请选择查询人员' width='925' height='600' visible = {this.state.showModal} onOk={this.handleOk} onCancel={this.handleCancel}>
              <div style={{height:'460',overflow:'auto'}}>
                {ListCard}
              </div>
            </Modal>
          </div>
        </Spin>
      );
    }
    else{
      return(
        <div></div>
      )
    }

  }

}

function mapStateToProps (state) {
  const {query,stationContent,infraContent} = state.officeResMain;  //lumj
  return {
    loading: state.loading.models.officeResMain,
    query,
    stationContent,
    infraContent
  };
}


export default connect(mapStateToProps)(officeResMain);
