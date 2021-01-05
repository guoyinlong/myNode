/**
 * 作者：郭银龙
 * 日期：2020-4-29
 * 邮箱：guoyl@itnova.com.cn
 * 文件说明：整改反馈消息页面  
 */
import React from 'react';
import {connect } from 'dva';
import Cookie from 'js-cookie';
import styles from './tzstyle.less';
import { Select, Input, DatePicker, Radio, Button, Icon, Popconfirm, Tooltip,Form,Upload,Group,Modal} from "antd";
import PicShow from './picShow';
const RadioGroup = Radio.Group; 
import { routerRedux } from 'dva/router';

 

class zhengGaiFanKuiXiaoXi extends React.Component {
  state = 
  {
    InputValue:"",
    value: "",
    showElem:false,
    Evaluationvalue:"1",
    inforid:"",
    previewVisible: false,
    previewImage: '',
};
handleCancel = () => this.setState({ previewVisible: false })
handlePreview = (file) => {
this.setState({
  previewImage: file.url || file.thumbUrl,
  previewVisible: true,
});
}
//提交
handlePost = () => {
  const {InputValue,value,Evaluationvalue,inforid} = this.state;
  // console.log(Evaluationvalue,value,InputValue,"提交",inforid);
  //在此做提交操作，比如发dispatch等
  this.props.dispatch({
    type:"zhengGaiFanKuiXiaoXi/Submit",
    argReformAppraise:Evaluationvalue ,  //整改描述1笑2哭
    argAppraise:InputValue,//描述
    argInfoId:inforid   //消息id
  })
  this.setState({
    InputValue : ""
  })
  
};
//笑脸苦脸评价
Evaluation = e => {
  // console.log('radio checked', e.target.value);
  this.setState({
    Evaluationvalue: e.target.value,
  });
 
  
};
// 常用语评价
handleGetInputValue = (event) => {
  this.setState({
    InputValue : event.target.value,
  })
};
onChange = e => {
  // console.log('radio checked', e.target.value);
  this.setState({
    value: e.target.value,
  });
  if(e.target.value==0){
    this.setState({
      InputValue: "整改非常好"
    });

  }else if(e.target.value==1){
    this.setState({
      InputValue: "请继续保持"
    });
  }else if(e.target.value==2){
    this.setState({
      InputValue: "不要发生此类问题"
    });
  }else if(e.target.value==3){
    this.setState({
      InputValue: ""
    });
    this.setState({
      showElem: true
    });
  }else{
    this.setState({
      showElem: false
    });
  }
};
componentDidMount() {
  const{arg_state}=this.props.location.query
  this.setState({
    inforid:arg_state
  })
//  console.log(this.state.inforid)
//  const query = this.props.match.location.search
//  const arr = query.split('&') // ['?s=', 'f=7']
// const successCount = arr[0].substr(3) // '1'
// const failedCount = arr[1].substr(2) // '7'
// console.log(successCount,failedCount,"参数")
}
goBackPage = () => {
  this.props.dispatch( routerRedux.push({
    pathname:'/adminApp/securityCheck/myNews',
    query: {
      ontabs:JSON.parse(JSON.stringify(this.props.taskList[0].infoState))
    }
  }));
   
}
  render(){
    const {taskList,examineImgId} =this.props
    const styles1 = {display:"none"};
// console.log(taskList[0],123456);
    return (
      <div className={styles.outerField}>
         <div className={styles.title}>
         整改反馈
          </div>
          <Button style = {{float: 'right',marginRight:"15%"}} size="default" type="primary"  onClick={this.goBackPage}>
									<a >返回</a>
							</Button>
              {taskList.length>0?
              <div>

           
        <div style={{marginTop:'45px'}} className={styles.out}>
         
      

          <div className={styles.lineOut}>
            <span className={styles.lineKey}>
               安全主体
            </span>
            <span className={styles.lineColon}>:</span>
            <span>{taskList[0].assetsName}</span>
          </div>

           <div className={styles.lineOut}>
            <span className={styles.lineKey}>
               所属区域
            </span>
            <span className={styles.lineColon}>:</span>
            <span>{taskList[0].assetsArea}</span>
          </div>

          <div className={styles.lineOut}>
          <span className={styles.lineKey}>
              责任人员
            </span>
            <span className={styles.lineColon}>:</span>
            <span>{taskList[0].dutyUserName}</span>
          </div>

          <div className={styles.lineOut}>
            <span className={styles.lineKey}>
            所属部门
            </span>
            <span className={styles.lineColon}>:</span>
            <span>{taskList[0].dutyDeptName}</span>
          </div>

          <div className={styles.lineOut}>
            <span className={styles.lineKey}>
            情况反馈
            </span>
            <span className={styles.lineColon}>:</span>
           
          </div>
          <div className={styles.lineOut}>
         
          <Modal visible={this.state.previewVisible} footer={null} onCancel={this.handleCancel}>
                              <img alt="example" style={{ width: '100%' }} src={this.state.previewImage} />
                            </Modal>
                            <div style={{width:420,overflow:"hidden", marginLeft: 90}}>
                            <PicShow 
                                fileList = {examineImgId!=undefined?examineImgId:[]} 
                                visible = {this.state.previewVisible} 
                                handlePreview = {this.handlePreview}/>
                            </div>
          </div>
         
          <div className={styles.lineOut}>
            <span className={styles.lineKey}>
               检查情况
            </span>
            <span className={styles.lineColon3}>:</span>
            <span>{taskList[0].examinState}</span>
          </div>
          <div className={styles.lineOut}>
            <span className={styles.lineKey}>
            建议
            </span>
            <span className={styles.lineColon}>:</span>
            <span>{taskList[0].reformOpinion}</span>
          </div>

          <div className={styles.lineOut}>
            <span className={styles.lineKey}>
            情况等级
            </span>
            <span className={styles.lineColon}>:</span>
            <span>{taskList[0].problemLevel=="severe"?"严重":(
              taskList[0].problemLevel=="poor"?"差":(
                taskList[0].problemLevel=="average"?"一般":(
                  taskList[0].problemLevel=="mild"?"轻微":(
                    taskList[0].problemLevel=="good"?"好":(
                      taskList[0].problemLevel=="well"?"良好":(
                        taskList[0].problemLevel=="perfect"?"非常好":""
                      )
                    )
                  )
                )
              )
            )}</span>
          </div>

          <div className={styles.lineOut}>
            <span className={styles.lineKey}>
               截止时间
            </span>
            <span className={styles.lineColon}>:</span>
            <span>{taskList[0].endTime.substring(0,16)}</span>
          </div>
          
        </div>
        <div className={styles.out}>
          <div className={styles.lineOut}>
              <span className={styles.lineKey}>
              整改情况
              </span>
              <span className={styles.lineColon}>:</span>
             
            </div>
            <div className={styles.lineOut}>
            
            {
              
            taskList[0].reformSet.map((person) => {
              return (<div style={{padding:10,borderRadius:20,backgroundColor:"#eae8e8",marginTop:10}}>
                    {person.examineImg.length>0?


                          <div className={styles.lineOut}>
                         
                             <Modal visible={this.state.previewVisible} footer={null} onCancel={this.handleCancel}>
                              <img alt="example" style={{ width: '100%' }} src={this.state.previewImage} />
                            </Modal>
                            <div style={{width:420,  marginLeft: 100,}}>
                            <PicShow 
                                fileList = {JSON.parse(person.examineImg)} 
                                visible = {this.state.previewVisible} 
                                handlePreview = {this.handlePreview}/>
                            </div>
                          </div>
                         :""}
                           <div className={styles.lineOut}>
                           <span className={styles.lineKey}>
                              描述
                           </span>
                           <span className={styles.lineColon}>:</span>
                           <span>{person.appraiseDesc}</span>
                         </div>
                         
                         {
                                person.appraiseContent===""?(
                                  <div style={styles1} className={styles.lineOut}>
                                  <span className={styles.lineKey}>
                                     评价
                                  </span>
                                  <span className={styles.lineColon}>:</span>
                                  <span>{person.appraiseContent}</span>
                                </div>
                                            ):(
                                   <div  className={styles.lineOut}>
                                  <span className={styles.lineKey}>
                                     评价
                                  </span>
                                  <span className={styles.lineColon}>:</span>
                                  <span>{person.appraiseContent}</span>
                                </div>
                                )
                            }
                         
                         </div>
              )
            })
          }
            </div>
    {taskList[0].infoState==0?
    <div>
        <div className={styles.lineOut}>
            <span className={styles.lineKey}>
               整改评价
            </span>
            <span className={styles.lineColon}>:</span>
            <RadioGroup className={styles.radiogroup} onChange={this.Evaluation} value={this.state.Evaluationvalue} defaultValue={this.state.Evaluationvalue}>
                  <Radio value="1">
                    <div className={styles.imsvg} style={{paddingTop:'10px'}}>
                     {
                       this.state.Evaluationvalue==1?
                       <svg t="1592382328884" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5452" width="32" height="32"><path d="M1000.58368 460.57728c-6.15168-56.96-21.90336-111.14496-47.32928-162.48576-30.70464-61.98528-72.74496-115.07456-125.91872-159.27296-47.7056-39.65184-101.08928-69.16096-160.12032-88.34816-35.91424-11.6736-72.66304-19.2128-110.35904-22.00832-6.28736-0.46848-12.5568-1.21856-18.83392-1.83808-13.93152 0-27.86816 0-41.79968 0-10.69312 0.98304-21.39904 1.80736-32.07168 2.97728-56.61952 6.21056-110.5152 21.8624-161.58208 47.09632-62.16192 30.72-115.38176 72.86016-159.6928 126.13888-39.55968 47.56736-68.98688 100.8384-88.18944 159.67744-11.76576 36.04992-19.34336 72.96-22.1312 110.81984-0.46336 6.272-1.216 12.52608-1.83296 18.78784 0 13.93152 0 27.86816 0 41.79968 0.9728 10.51904 1.8048 21.056 2.93632 31.55968 6.15168 56.97024 21.9136 111.17056 47.3472 162.51392 30.70976 62.00064 72.76544 115.10016 125.952 159.30112 47.59296 39.54944 100.86144 68.99456 159.72352 88.18944 35.90656 11.70944 72.68864 19.03616 110.36672 22.1312 30.87872 2.54464 61.66528 2.18112 92.43136-1.12128 57.1392-6.1312 111.47264-21.99552 162.95168-47.52128 52.27264-25.92512 98.41408-60.16 138.42944-102.62016 44.37504-47.0912 78.13376-100.86912 101.12512-161.35424 13.81376-36.3392 23.27552-73.79968 27.65824-112.47104 1.26464-11.1488 2.05056-22.35904 3.08992-33.54112 0.16128-1.69984 0.51968-3.3792 0.78592-5.0688 0-13.92896 0-27.8656 0-41.79968C1002.5472 481.60768 1001.7152 471.07584 1000.58368 460.57728zM517.08672 929.9456c-231.00416-0.4096-417.088-187.27936-416.8064-417.31072 0.2816-230.87616 187.22304-416.67072 417.1136-416.45312 230.94784 0.2176 416.09472 187.06688 416.73984 416.99584C933.72416 743.05024 746.58304 930.34496 517.08672 929.9456zM769.00864 636.85888c7.24992 13.22496 5.91104 26.4704-3.32288 38.23104-47.74144 60.8-109.15584 100.02432-185.18528 115.12064-20.38784 4.0448-41.30048 5.42976-54.09024 7.04512-108.21888-2.61888-190.5152-41.664-253.7216-119.80544-9.52576-11.776-11.08736-25.15968-3.82464-38.58944 6.83008-12.63104 18.09152-18.77504 32.4864-18.15552 11.30752 0.48896 19.90144 6.34624 26.83904 15.04 19.25632 24.14592 42.22464 44.03456 69.02272 59.4048 27.46368 15.74912 56.896 25.8304 88.32256 29.84448 52.9024 6.75584 102.9888-2.08384 149.90592-27.66592 28.99968-15.81056 53.53728-36.98944 73.94048-62.94528 6.97088-8.8704 15.57504-14.9888 27.07456-15.53408C750.8352 618.17088 762.09408 624.25088 769.00864 636.85888zM622.6688 466.09152c-0.06912-24.3584-0.26112-48.71936 0.02304-73.0752 0.27392-23.62112 18.12992-44.53632 41.28-49.06496 33.1136-6.47424 62.25152 17.53088 62.79424 51.85024 0.1792 11.38432 0.02816 22.77376 0.02816 34.16576-0.2176 0-0.43776 0-0.65536 0.00256 0 13.7472 0.95232 27.57888-0.20736 41.2288-2.13248 25.11616-24.38144 44.54656-50.3552 45.33248-24.65792 0.73984-47.59808-17.7536-51.98592-41.98144C623.08864 471.76448 622.67648 468.91264 622.6688 466.09152zM310.12864 466.90304c-0.4736-24.68864-0.48896-49.40032-0.01536-74.08896 0.52736-27.43552 23.0144-49.28 50.40384-49.84832 27.94752-0.576 51.2768 19.94496 53.05856 47.52128 0.84224 13.07904 0.14592 26.26304 0.14592 39.40096-0.0128 0-0.0256 0-0.0384 0 0 13.13792 0.70912 26.3168-0.15104 39.3984-1.76128 26.8288-25.86368 48.08448-52.57472 47.23968C333.27104 515.65056 310.64064 493.93664 310.12864 466.90304z" p-id="5453" fill="#1296db"></path></svg>
                       : <svg t="1592382328884" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5452" width="32" height="32"><path d="M1000.58368 460.57728c-6.15168-56.96-21.90336-111.14496-47.32928-162.48576-30.70464-61.98528-72.74496-115.07456-125.91872-159.27296-47.7056-39.65184-101.08928-69.16096-160.12032-88.34816-35.91424-11.6736-72.66304-19.2128-110.35904-22.00832-6.28736-0.46848-12.5568-1.21856-18.83392-1.83808-13.93152 0-27.86816 0-41.79968 0-10.69312 0.98304-21.39904 1.80736-32.07168 2.97728-56.61952 6.21056-110.5152 21.8624-161.58208 47.09632-62.16192 30.72-115.38176 72.86016-159.6928 126.13888-39.55968 47.56736-68.98688 100.8384-88.18944 159.67744-11.76576 36.04992-19.34336 72.96-22.1312 110.81984-0.46336 6.272-1.216 12.52608-1.83296 18.78784 0 13.93152 0 27.86816 0 41.79968 0.9728 10.51904 1.8048 21.056 2.93632 31.55968 6.15168 56.97024 21.9136 111.17056 47.3472 162.51392 30.70976 62.00064 72.76544 115.10016 125.952 159.30112 47.59296 39.54944 100.86144 68.99456 159.72352 88.18944 35.90656 11.70944 72.68864 19.03616 110.36672 22.1312 30.87872 2.54464 61.66528 2.18112 92.43136-1.12128 57.1392-6.1312 111.47264-21.99552 162.95168-47.52128 52.27264-25.92512 98.41408-60.16 138.42944-102.62016 44.37504-47.0912 78.13376-100.86912 101.12512-161.35424 13.81376-36.3392 23.27552-73.79968 27.65824-112.47104 1.26464-11.1488 2.05056-22.35904 3.08992-33.54112 0.16128-1.69984 0.51968-3.3792 0.78592-5.0688 0-13.92896 0-27.8656 0-41.79968C1002.5472 481.60768 1001.7152 471.07584 1000.58368 460.57728zM517.08672 929.9456c-231.00416-0.4096-417.088-187.27936-416.8064-417.31072 0.2816-230.87616 187.22304-416.67072 417.1136-416.45312 230.94784 0.2176 416.09472 187.06688 416.73984 416.99584C933.72416 743.05024 746.58304 930.34496 517.08672 929.9456zM769.00864 636.85888c7.24992 13.22496 5.91104 26.4704-3.32288 38.23104-47.74144 60.8-109.15584 100.02432-185.18528 115.12064-20.38784 4.0448-41.30048 5.42976-54.09024 7.04512-108.21888-2.61888-190.5152-41.664-253.7216-119.80544-9.52576-11.776-11.08736-25.15968-3.82464-38.58944 6.83008-12.63104 18.09152-18.77504 32.4864-18.15552 11.30752 0.48896 19.90144 6.34624 26.83904 15.04 19.25632 24.14592 42.22464 44.03456 69.02272 59.4048 27.46368 15.74912 56.896 25.8304 88.32256 29.84448 52.9024 6.75584 102.9888-2.08384 149.90592-27.66592 28.99968-15.81056 53.53728-36.98944 73.94048-62.94528 6.97088-8.8704 15.57504-14.9888 27.07456-15.53408C750.8352 618.17088 762.09408 624.25088 769.00864 636.85888zM622.6688 466.09152c-0.06912-24.3584-0.26112-48.71936 0.02304-73.0752 0.27392-23.62112 18.12992-44.53632 41.28-49.06496 33.1136-6.47424 62.25152 17.53088 62.79424 51.85024 0.1792 11.38432 0.02816 22.77376 0.02816 34.16576-0.2176 0-0.43776 0-0.65536 0.00256 0 13.7472 0.95232 27.57888-0.20736 41.2288-2.13248 25.11616-24.38144 44.54656-50.3552 45.33248-24.65792 0.73984-47.59808-17.7536-51.98592-41.98144C623.08864 471.76448 622.67648 468.91264 622.6688 466.09152zM310.12864 466.90304c-0.4736-24.68864-0.48896-49.40032-0.01536-74.08896 0.52736-27.43552 23.0144-49.28 50.40384-49.84832 27.94752-0.576 51.2768 19.94496 53.05856 47.52128 0.84224 13.07904 0.14592 26.26304 0.14592 39.40096-0.0128 0-0.0256 0-0.0384 0 0 13.13792 0.70912 26.3168-0.15104 39.3984-1.76128 26.8288-25.86368 48.08448-52.57472 47.23968C333.27104 515.65056 310.64064 493.93664 310.12864 466.90304z" p-id="5453" fill="#cdcdcd"></path></svg>
                     }
                     </div>
                  </Radio>
									<Radio value="0">
                  <div className={styles.imsvg2} style={{paddingTop:'10px'}}>
                  {
                       this.state.Evaluationvalue==0?
                       <svg t="1592382021623" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4221" width="32" height="32"><path d="M509.698306 956.552578c-245.061833 0-444.412306-199.385285-444.412306-444.448142 0-245.03214 199.351497-444.418449 444.412306-444.418449 245.062857 0 444.448142 199.356616 444.448142 444.418449-0.033788 245.061833-199.385285 444.448142-444.448142 444.448142z m0-842.128274c-219.262995 0-397.675012 178.412018-397.675013 397.680132 0 219.287568 178.412018 397.709824 397.675013 397.709825 219.293711 0 397.710848-178.422257 397.710848-397.709825-0.033788-219.268114-178.417137-397.680132-397.710848-397.680132z" fill="#d81e06" p-id="4222"></path><path d="M736.094709 735.511095c8.413266 9.814965 7.199962 24.556866-2.615003 32.940438-9.751484 8.413266-24.493385 7.195866-32.935319-2.619098-47.857424-56.085366-117.438623-88.276321-190.847105-88.276321-73.377766 0-142.953845 32.189931-190.811269 88.276321-8.412242 9.814965-23.212504 11.03134-32.940439 2.619098-9.814965-8.383573-11.027245-23.154143-2.613979-32.940438 56.77137-66.523877 139.244309-104.692274 226.365687-104.692275 87.119331 0 169.631177 38.168397 226.397427 104.692275zM369.548883 505.307886h-5.672325c-20.754156 0-37.609356-16.8552-37.609356-37.605261v-67.336842c0-20.720367 16.8552-37.580687 37.609356-37.580687h5.672325c20.720367 0 37.575568 16.86032 37.575567 37.580687v67.336842c-0.001024 20.75006-16.8552 37.60526-37.575567 37.605261zM655.521078 505.307886h-5.672325c-20.719343 0-37.574544-16.8552-37.574544-37.605261v-67.336842c0-20.720367 16.8552-37.580687 37.574544-37.580687h5.672325c20.720367 0 37.574544 16.86032 37.574543 37.580687v67.336842c0 20.75006-16.854176 37.60526-37.574543 37.605261z" fill="#d81e06" p-id="4223"></path></svg>
                       : 
                       <svg t="1592382497348" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6865" width="32" height="32"><path d="M977.67619 312.888889c-51.2-121.904762-147.911111-219.428571-269.003174-272.253968-125.968254-53.638095-268.190476-53.638095-394.15873 0-60.139683 26.006349-114.590476 62.577778-160.101588 109.714285C58.514286 246.247619 5.688889 376.279365 5.688889 512c0 204.8 121.092063 390.095238 308.825397 471.365079 62.577778 26.819048 129.219048 39.822222 196.673016 39.822223 134.095238 0 263.314286-53.638095 357.587301-149.536508 46.32381-46.32381 82.895238-101.587302 108.088889-162.539683 54.450794-127.593651 54.450794-271.44127 0.812698-398.222222z m-31.695238 198.298413c0 242.184127-195.047619 438.857143-434.79365 438.857142S77.206349 753.371429 77.206349 511.187302s195.047619-438.857143 433.980953-438.857143c240.55873 0 434.793651 197.485714 434.79365 438.857143z m0 0" p-id="6866" fill="#cdcdcd"></path><path d="M312.07619 458.361905c39.009524 0 71.51746-32.507937 71.517461-72.330159s-32.507937-72.330159-71.517461-72.330159-71.51746 32.507937-71.51746 72.330159c0 18.692063 7.314286 37.384127 20.31746 51.2 13.815873 13.003175 32.507937 21.130159 51.2 21.130159zM711.92381 459.174603c39.009524 0 71.51746-32.507937 71.51746-72.330159s-31.695238-72.330159-71.51746-72.330158-71.51746 32.507937-71.517461 72.330158c0 40.634921 31.695238 72.330159 71.517461 72.330159zM770.438095 795.631746c15.44127-12.190476 18.692063-34.133333 7.314286-50.387302-30.069841-40.634921-69.079365-73.955556-114.590476-96.711111-95.085714-47.949206-208.050794-47.949206-303.136508 0-44.698413 22.755556-83.707937 56.07619-113.777778 96.711111-12.190476 16.253968-8.939683 38.196825 7.314286 50.387302 16.253968 11.377778 38.196825 8.126984 50.387301-7.314286 47.949206-65.015873 125.968254-103.212698 208.050794-103.212698 82.08254 0 160.101587 39.009524 208.050794 104.025397 12.190476 14.628571 34.133333 17.879365 50.387301 6.501587z" p-id="6867" fill="#cdcdcd"></path></svg>

                     }
                    </div>
                  </Radio>
						</RadioGroup>
          </div>
          <div className={styles.lineOut}>
            <span className={styles.lineKey}>
               评价
            </span>
            <span className={styles.lineColon}>:</span>
            <RadioGroup onChange={this.onChange} value={this.state.value}>
                  <Radio value={0}>整改非常好</Radio>
									<Radio value={1}>请继续保持</Radio> 
                  <Radio value={2}>不要发生此类问题</Radio>
                  <Radio value={3}>其他</Radio>
						</RadioGroup>
            {
                    this.state.value==3?
                      <Input style={{width:'300px',margin:'20px',display: 'inherit'}} value={this.state.InputValue} onChange={this.handleGetInputValue} />
                    :""
                }

                
          </div>
      
          <div className={styles.buttonOut}>
            <div style={{margin:'0 auto'}}>
              <Button type="primary" className={styles.buttonSubmit} onClick={this.handlePost}>提交</Button>
            </div>
          </div>
    </div>
           
        
        :""}
          

          </div>
     
          </div>
            :""}
      </div>
    )
  }
}

const form1 = Form.create()(zhengGaiFanKuiXiaoXi);
function mapStateToProps (state) {

  return {
    loading: state.loading.models.zhengGaiFanKuiXiaoXi,
    ...state.zhengGaiFanKuiXiaoXi
  };
}
export default connect(mapStateToProps)(form1);
