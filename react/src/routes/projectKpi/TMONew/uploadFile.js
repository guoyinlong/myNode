/**
 * 作者：王超
 * 创建日期：2017-10-19
 * 邮箱：wangc235@chinaunicom.cn
 * 文件说明：项目指标详情页组件
 */
import { connect } from 'dva';
import Style from '../searchDetail.less';
import { Upload, message, Button, Icon } from 'antd';

class UploadFile extends React.Component {
    constructor(props) {
        super(props);
    }
    
    componentWillMount(){
    	
    	if(this.props.name == "" || !this.props.name) {
    		this.setState({ fileList:[] });
    	}
   }
    
    state = {
    	fileList: [{
    		uid: 1,
      		name: this.props.name,
      		status: 'done',
      		url: this.props.path
    	}],
    	isSuccess:this.props.isOk
    }
    
    handleChange = (info) => {
    	const {dispatch} = this.props;
		let testconfirmupdate = [];
    	let fileList = info.fileList;
    	fileList = fileList.slice(-2);
    	
    	if(fileList.length > 1) {
    		return;
    	}
        
        if(info.file.status === 'removed') {
        	testconfirmupdate.push({
                "update": {"pf_url":"","file_name":"","file_relativepath":""},
                "condition": {"score_id":this.props.scoreId}
            });
        	
	    	dispatch({
	        	type:'taskDeatilTMO/updateKpiFile',
	        	params:{
					"transjsonarray": JSON.stringify(testconfirmupdate)
	        	},
	        	nexObj:{
	        		"RelativePath":info.file.url
	        	}
	    	});
        } else {
        	if (info.file.status === 'done') {
		    	testconfirmupdate.push({
	                "update": {"pf_url": info.file.response.file.AbsolutePath,"file_name":info.file.name,"file_relativepath":info.file.response.file.RelativePath},
	                "condition": {"score_id":this.props.scoreId}
	            });
	            
		    	dispatch({
		        	type:'taskDeatilTMO/updateKpiNewFile',
		        	params:{
						"transjsonarray": JSON.stringify(testconfirmupdate)
		        	}
		    	});
		    	fileList[0].url = info.file.response.file.RelativePath;
		    	
		    } else if (info.file.status === 'error') {
		    	message.error('上传失败');
		    }
        }
    	this.setState({ fileList });
    }
    
    render() {
    	let fileObj = {
            action: '/filemanage/fileupload',
    		name: 'file',
    		method: "POST",
    		data:{
                argappname:'evaluation',
                argtenantid:10010,
                arguserid:window.localStorage.userid,
                argyear:2017,
                argmonth:11,
                argday:13
            },
		    onChange: this.handleChange
        };
    	
        return (
        	<div id="uploadFile" className={Style.uploadFile}>
		    	<Upload  {...fileObj} fileList={this.state.fileList}>
				    <Button>
				      <Icon type="upload" />评分依据
				    </Button>
			    </Upload>
			</div>
        );
    }
}

export default connect()(UploadFile);