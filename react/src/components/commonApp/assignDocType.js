/**
 * 作者：卢美娟
 * 日期：2017-03-12
 * 邮箱：lumj14@chinaunicom.cn
 * 文件说明：编辑文档类型组件
 */
 import { connect } from 'dva';
 import Cookie from 'js-cookie';
 import {Button ,Icon,message,Breadcrumb,Modal,Checkbox,Radio,Tag,Tooltip,Input,Row, Col,} from 'antd';
 import request from '../../utils/request';
 import  './assignDept.css';

 class AssignDocType extends React.Component {
   state={
     tags:[],
     // tags:[{'81bd79e357764485862b079e328d4b53':'培训'},{'8968ced35ea04eb499a38d7853c1c91d':'测试'}],
     inputVisible: false,
     inputValue:'',
     visible1: false,
   }

     componentDidMount(){
       const {defaultdocType}=this.props;
       var temptags=[];
       for(let i = 0; i < defaultdocType.length; i++){
         temptags.push(defaultdocType[i].name)
       }
       this.setState({
         tags:temptags,
       })
     }

     confirmClose = (tag) => {
       //删除文档类型
       let oudata=request('/allcommondocument/commondocument/deleteType2',{arg_name:tag,arg_ou_id:Cookie.get('OUID')});

       oudata.then((data)=>{
         if(data.RetCode == '1')
         {
          message.success("删除文档分类成功");
         }

         else if(data.RetCode == '2'){
           message.error(data.RetVal);
         }
         else{
            message.error("出错了");
            return;
         }
       })
     }
     // equipment
     handleClose = (removedTag) => {
       //调用删除服务

       const tags = this.state.tags.filter(tag => tag !== removedTag);
       console.log(tags);
       this.setState({ tags });
     }

     showInput = () => {
       this.setState({ inputVisible: true }, () => this.input.focus());
     }


     handleInputChange = (e) => {
       this.setState({ inputValue: e.target.value });
     }

     handleInputConfirm = () => {
       const state = this.state;
       const inputValue = state.inputValue;
       if(inputValue == '' || inputValue == null || inputValue == undefined){
         message.info("文档名称不能为空");
         return;
       }
       //调用插入服务
       let oudata=request('/allcommondocument/commondocument/addType',{arg_staff_id:Cookie.get('staff_id'), arg_name:inputValue,arg_staff_name:Cookie.get('username'),arg_ou_id:Cookie.get('OUID')});
       oudata.then((data)=>{
         if(data.RetCode == '1'){
           message.success("添加文档分类成功");
           let tags = state.tags;
           if (inputValue && tags.indexOf(inputValue) === -1) {
             tags = [...tags, inputValue];
           }
           console.log(tags);
           this.setState({
             tags,
             inputVisible: false,
             inputValue: '',
             tempDocType:'',
           });
         }
         else if(data.RetCode == '2'){
            message.info(data.RetVal);
         }
         else if(data.RetCode == '0'){
           message.error("调用服务出错");
           return;
         }
       })

     }
     showModal=(tag)=>{
       this.setState({
         visible1:true,
         tempDocType:tag,
       })
     };
     handleCancel1=()=>{
       this.setState({
         visible1:false
       })
     };
     editMeetingType=()=>{
       this.setState({
         visible1:false,
       })
     };

     saveInputRef = input => this.input = input


   render(){
     const {tags, inputVisible, inputValue}=this.state;
     return(
       <div>
         {tags.map((tag, index) => {

           const isLongTag = tag.length > 20;
             const tagElem = (
               <Tag  /*onClick={()=>this.showModal(tag)}*/
                style={{ background: '#fff', borderStyle: 'dashed' }} key={tag} closable={true} onClose={() => this.confirmClose(tag)}  afterClose={() => this.handleClose(tag)}>
                 {isLongTag ? `${tag.slice(0, 20)}...` : tag}
               </Tag>
             )

          return isLongTag ? <Tooltip title={tag} key={tag}>{tagElem}</Tooltip> : tagElem;
         })}



         {inputVisible && (
           <Input
             ref={this.saveInputRef}
             type="text"
             size="small"
             style={{ width: 78 }}
             value={inputValue}
             onChange={this.handleInputChange}
             onBlur={this.handleInputConfirm}
             onPressEnter={this.handleInputConfirm}
           />
         )}
         {!inputVisible && (
           <Tag
             onClick={this.showInput}
             style={{ background: '#fff', borderStyle: 'dashed' }}
           >
             <Icon type="plus" /> 添加类型
           </Tag>
         )}

         <Modal
           title="文档分类修改"
           visible={this.state.visible1}
           onCancel={this.handleCancel1}
           onOk={this.editMeetingType}
           width="400px"
         >
           <div>
             <Row>
               <Col  span={12}><div>文档名称：</div></Col>
               <Col span={12}>
                 <Input value={this.state.tempDocType} onChange={(e)=>this.setState({tempDocType:e.target.value})}/>
               </Col>
             </Row>
           </div>
         </Modal>
       </div>
     )
   }
 }

 export default AssignDocType;
