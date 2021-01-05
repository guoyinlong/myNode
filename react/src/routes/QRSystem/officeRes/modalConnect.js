/**
 *  作者: 卢美娟
 *  创建日期: 2018-04-11
 *  邮箱：lumj14@chinaunicom.cn
 *  文件说明：通用模态框，add，edit等
 */
import React from 'react';
import { Icon,Modal,Popconfirm,message,Tooltip,Button,Input,Form,Row,Col,Card,Checkbox,Radio,Spin} from 'antd';
import styles from './officeRes.less';
import request from '../../../utils/request';
// import request from '../../utils/request';
const RadioGroup = Radio.Group;
const Search = Input.Search;
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 9 },
};
class ModalConnect extends React.Component {

  state = {
    resValue:'',
    selectAssetid:'',
    iseverFind:'0',
    isSearch: '0', //是否点了查询
    oriList:[],
    isLoading:false,
  }



  handleCancel = () => {
    const {cancelClick} = this.props;
    cancelClick();
    this.setState({resValue:'',iseverFind:'0',isSearch:'0'});
  }
  handleSubmit = (assetid) => {
    const {okClick} = this.props;
    okClick(assetid);
    this.setState({resValue:'',iseverFind:'0',isSearch:'0'});
  }

  findResName = (value) => {
    const {findRes} = this.props;
    this.setState({isLoading:true})
    if(value == ''){
      message.info("资产名称不能为空");
      this.setState({isLoading:false})
      return;
    }
    findRes(value);
    this.setState({resValue:'',iseverFind:'1',isSearch:'1'});
  }

  changeValue = (e) => {
    this.setState({
      resValue: e.target.value,
    })
  }

  getSelectRes = (assetid) => {
    this.setState({
      selectAssetid: assetid,
    })
  }

  componentDidMount(){
    let postData2 = {
      argReferInfraState: 0,
      argOrderRule: 'byName',
    };

    let oudata2=request('/assetsmanageservice/assetsmanage/assets/assetsQuery',postData2);
    oudata2.then((data)=>{
      if(data.RetCode == '1'){
        this.setState({
          oriList:data.DataRows,
        })
      }
      else{
        message.info(data.RetVal);
        this.setState({
          oriList:[],
        })
      }

    })
  }

  componentWillReceiveProps(nextProps){
    // if(this.props.infratypeId !== nextProps.infratypeId){
      var temp = JSON.stringify(this.props.infra_refer_location);
      let postData2 = {};
      if(this.props.infratypeId){
        postData2 = {
          argAccuracyLocationInfo:temp,
          argReferInfraState: 0,
          argOrderRule: 'byName',
          argTypeId: this.props.infratypeId,
        };
      }else{
        postData2 = {
          argReferInfraState: 0,
          argOrderRule: 'byName',
        };
      }
      let oudata2=request('/assetsmanageservice/assetsmanage/assets/assetsQuery',postData2);
      oudata2.then((data)=>{
        if(data.RetCode == '1'){
          this.setState({
            oriList:data.DataRows,
          })
        }else {
          message.info(data.RetVal);
          this.setState({
            oriList:[],
          })
        }
      })

      this.setState({
        selectAssetid:'',
        // isSearch:'0',
      })

      if(this.props.resList){
        this.setState({isLoading:false})
      }
  }

  render(){
    let ListCard = [];
    // if(this.state.iseverFind === '0'){
    //   console.log("清空");
    // }else{
    //
    // }
    if(this.props.resList){
      if(this.props.resList.length>0){
        for(let i = 0; i < this.props.resList.length; i++){
          ListCard.push(
              <div style={{display:'inline-block',marginLeft:30,marginTop:30,width:260,height:170}} key = {i} className = {(this.props.resList[i].asset_id==this.state.selectAssetid)?styles.antcardIn:styles.antcard}
                onClick = {()=>this.getSelectRes(this.props.resList[i].asset_id)}>
                <div className = {styles.antcardbordered}>
                  <div className = {styles.antcardhead}>
                    <div className = {styles.antcardheadtitle}>{this.props.resList[i].asset_name}</div>
                  </div>
                    <div style = {{float:'left',width:'60%',overflow:'hidden',}}>
                      <p style = {{padding:10}} className = {styles.overflow}>所属部门： <Tooltip title = {this.props.resList[i].charger_dept_name}>{this.props.resList[i].charger_dept_name}</Tooltip></p>
                      <p style = {{padding:10}} className = {styles.overflow}>使用人： <Tooltip title = {this.props.resList[i].assetuser_name}>{this.props.resList[i].assetuser_name}</Tooltip></p>
                    </div>

                </div>
              </div>
          )
        }
      }
      else if(this.props.resList.length === 0){
        ListCard.push(
          <div style = {{marginLeft:30,marginTop:30}}>未找到相应资产，请重新查找！</div>
        )
      }
    }

    let ListOri = [];

    if(this.state.oriList){
        if(this.state.oriList.length>0){
          for(let i = 0; i < this.state.oriList.length; i++){
            ListOri.push(
                <div style={{display:'inline-block',marginLeft:30,marginTop:30,width:260,height:170}} key = {i} className = {(this.state.oriList[i].asset_id==this.state.selectAssetid)?styles.antcardIn:styles.antcard}
                  onClick = {()=>this.getSelectRes(this.state.oriList[i].asset_id)}>
                  <div className = {styles.antcardbordered}>
                    <div className = {styles.antcardhead}>
                      <div className = {styles.antcardheadtitle}>{this.state.oriList[i].asset_name}</div>
                    </div>
                      <div style = {{float:'left',width:'60%',overflow:'hidden',}}>
                        <p style = {{padding:10}} className = {styles.overflow}>所属部门： <Tooltip title = {this.state.oriList[i].charger_dept_name}>{this.state.oriList[i].charger_dept_name}</Tooltip></p>
                        <p style = {{padding:10}} className = {styles.overflow}>使用人： <Tooltip title = {this.state.oriList[i].assetuser_name}>{this.state.oriList[i].assetuser_name}</Tooltip></p>
                      </div>
                  </div>
                </div>
            )
            // ListOri.push(
            //   <div>hehe</div>
            // )
          }
        }
      }



    return(
      <Modal visible={this.props.visible} width='925' height='600' okText="关联"  title="关联" onCancel={this.handleCancel} onOk={()=>this.handleSubmit(this.state.selectAssetid)}>
        <div style={{height:'460',overflow:'auto'}}>
        <label style = {{marginLeft:30}}>请输入关联的资产名称：    </label>
          <Search
            placeholder="资产名称"
            onSearch={value => this.findResName(value)}
            style={{ width: 670 }}
            maxLength={30}
            value = {this.state.resValue}
            onChange = {this.changeValue}
          />

          <Spin spinning = {this.state.isLoading}>
          {(this.state.isSearch === '1')?ListCard:ListOri}
          </Spin>
        </div>
      </Modal>
    )

  }
}

export default Form.create()(ModalConnect);
