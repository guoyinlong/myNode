/**
 * 作者：任华维
 * 日期：2017-07-31 
 * 邮箱：renhw21@chinaunicom.cn
 * 功能：门户修改头像
 */
import React, { Component } from 'react';
import {Row, Col, Modal, Button, Card, Collapse, Tabs, Slider, Upload, Icon  } from 'antd';
import AvatarEditor from 'react-avatar-editor';
import {dataURLtoFile}  from '../../utils/func';
import config  from '../../utils/config';
import styles from '../../themes/main.less'
import { message } from 'antd';

const Panel = Collapse.Panel;
const TabPane = Tabs.TabPane;

/**
 * 作者：任华维
 * 创建日期：2017-08-20
 * 功能：头像模态框
 */
class Profile extends Component {
    constructor (props) {
        super(props);
        this.state = {
            avatarUrl: this.props.avatarUrl,
            avatarUuid: this.props.avatarUuid,
            avatarFilename:'',
            image: '',
            scale: 1,
            position: { x: 0.5, y: 0.5 },
            rotate: 0,
            borderRadius: 100,
    	    width: 150,
    	    height: 150,
            border:0,
            color:[0, 0, 0, 0.6],
            loading:false,
            type: 'custom',
        }
    }
    setEditorRef = editor => {
      if (editor) this.editor = editor
    }

    /**
     * 作者：任华维
     * 创建日期：2017-08-20
     * 功能：设置初始位置
     * @param 坐标
     */
    handlePositionChange = position => {
        this.setState({ position })
    }
    /**
     * 作者：任华维
     * 创建日期：2017-08-20
     * 功能：设置比例
     * @param 倍数
     */
    handleScale = (value) => {
        const num = Math.round(value*10)/10;
        if(num>0 && num<2){
            this.setState({ scale: num })
        }
    }
    /**
     * 作者：任华维
     * 创建日期：2017-08-20
     * 功能：上传前设置image
     * @param 图片文件
     */
    handleBeforeUpload = (file) => {
        this.setState({image:file});
        return false;
    }
    /**
     * 作者：任华维
     * 创建日期：2017-08-20
     * 功能：上传
     * @param event
     */
    handleUpload = (e) => {
        if (this.editor) {
            try {
                this.editor.getImage();
            } catch (e) {
                this.setState({loading:false});
                message.error('请选择图片');
                return;
            }
            this.setState({loading:true});
            const img = this.editor.getImageScaledToCanvas().toDataURL()
            //const rect = this.editor.getCroppingRect()
            const file = dataURLtoFile(img,'profile');
            e.persist();
            this.props.handleUpload(file,()=>{
                this.setState({loading:false});
            });
        }
    }
    /**
     * 作者：任华维
     * 创建日期：2017-08-20
     * 功能：获取图片数据
     * @param 图片对象
     */
    handleCheck = (item) => {
        this.setState({avatarUrl:item.relative_url,avatarUuid:item.uuid,avatarFilename:item.filename});
    };

    /**
     * 作者：任华维
     * 创建日期：2017-08-20
     * 功能：提交
     * @param event
     */
    handleSubmit = e => {
        this.props.handleOk({arg_userid:this.props.userid,arg_uuid:this.state.avatarUuid,arg_relative_url:this.state.avatarUrl,arg_real_filename:this.state.avatarFilename});
    };
    /**
     * 作者：任华维
     * 创建日期：2017-08-20
     * 功能：重置
     * @param event
     */
    handleReset = e => {
        this.props.handleReset({arg_userid:this.props.userid});
    };
    /**
     * 作者：任华维
     * 创建日期：2017-08-20
     * 功能：关闭
     * @param event
     */
    handleClose = e => {
        this.setState({
            avatarUrl:this.props.avatarUrl,
            avatarUuid:this.props.avatarUuid,
            avatarFilename:'',
            scale:1,
        });
    };
    /**
     * 作者：任华维
     * 创建日期：2017-08-20
     * 功能：tab切换
     * @param event
     */
    handleTabChange = e => {
        this.setState({type:e});
    };
    render() {
        const { profilePictures, profileVisible, handleCancel } = this.props
        const gridStyle = {width: '20%',textAlign: 'center',};
        const picItems = {
            profilePlant : [],
            profileAnimal : [],
            profileLand : [],
            profileCustom : []
        }
        profilePictures.map((item, index) => {
            switch (item.attributes) {
                case '1':
                    picItems.profileAnimal.push(item);
                    break;
                case '2':
                    picItems.profileLand.push(item);
                    break;
                case '3':
                    picItems.profilePlant.push(item);
                    break;
                default:
                    picItems.profileCustom.push(item);
            }
        })
        const profilePlant = picItems.profilePlant.map((item, index) => {
            return (
                <Card.Grid className={item.uuid === this.state.avatarUuid ? 'actived' : ''} key={index} style={gridStyle} onClick={this.handleCheck.bind(this,item)}>
                    <img alt={item.filename} width="100%" src={item.relative_url} />
                </Card.Grid>
            )
        })
        const profileAnimal = picItems.profileAnimal.map((item, index) => {
            return (
                <Card.Grid className={item.uuid === this.state.avatarUuid ? 'actived' : ''} key={index} style={gridStyle} onClick={this.handleCheck.bind(this,item)}>
                    <img alt={item.filename} width="100%" src={item.relative_url} />
                </Card.Grid>
            )
        })
        const profileLand = picItems.profileLand.map((item, index) => {
            return (
                <Card.Grid className={item.uuid === this.state.avatarUuid ? 'actived' : ''} key={index} style={gridStyle} onClick={this.handleCheck.bind(this,item)}>
                    <img alt={item.filename} width="100%" src={item.relative_url} />
                </Card.Grid>
            )
        })
        const profileCustom = picItems.profileCustom.map((item, index) => {
            return (
                <Card.Grid className={item.uuid === this.state.avatarUuid ? 'actived' : ''} key={index} style={gridStyle} onClick={this.handleCheck.bind(this,item)}>
                    <img alt={item.filename} width="100%" src={item.relative_url} />
                </Card.Grid>
            )
        })
        return (
            <Modal
                title="更换头像"
                width={540}
                visible={profileVisible}
                onOk={this.handleSubmit}
                onCancel={handleCancel}
                afterClose={this.handleClose}
                footer={this.state.type === 'system' ? [
                    <Button key="reset" size="large" onClick={this.handleReset}>使用默认头像</Button>,
                    <Button key="cancelChoose" size="large" onClick={handleCancel}>取消</Button>,
                    <Button key="submit" type="primary" size="large" onClick={this.handleSubmit}>确定</Button>,
                ]:[
                    <Upload key="select" className={styles.update_btn}
                        action=""
                        beforeUpload={this.handleBeforeUpload}>
                        <Button size="large" type="primary">选择图片</Button>
                    </Upload>,
                    <Button key="cancelUpdate" size="large" onClick={handleCancel}>取消</Button>,
                    <Button key="update" loading={this.state.loading} type="primary" size="large" onClick={this.handleUpload}>上传头像</Button>,
                ]}
                >
                <Tabs activeKey={this.state.type} size="small" onChange={this.handleTabChange}>
                    <TabPane tab="自定义" key="custom" className={styles.profileList}>
                        <div style={{width:200,height:200,margin:'0 auto',textAlign:'center',background:'#fff url('+config.img_crop+') repeat top'}}>
                            <AvatarEditor
                                ref={this.setEditorRef}
                                scale={parseFloat(this.state.scale)}
                                width={this.state.width}
                                height={this.state.height}
                                position={this.state.position}
                                onPositionChange={this.handlePositionChange}
                                rotate={parseFloat(this.state.rotate)}
                                borderRadius={this.state.borderRadius}
                                image={this.state.image}
                            />
                        </div>
                        <div style={{width:200,margin:'0 auto',textAlign:'center'}}>
                            <br/>
                            <div className={styles.iconWrapper}>
                                <Icon type="minus-square" style={{cursor: 'pointer'}} onClick={() => this.handleScale(this.state.scale-0.1)}/>
                                <Slider
                                    step={0.1}
                                    min={0.1}
                                    max={1.9}
                                    marks={{1:'标准'}}
                                    included={false}
                                    value={this.state.scale}
                                    onChange={this.handleScale}
                                />
                                <Icon type="plus-square" style={{cursor: 'pointer'}} onClick={() => this.handleScale(this.state.scale+0.1)}/>
                            </div>

                        </div>
                    </TabPane>
                    <TabPane tab="全部" key="system" className={styles.profileList}>
                        <Card title="自定义头像" noHovering bordered={false}>
                            {profileCustom}
                        </Card>
                        <Card title="植物" noHovering bordered={false}>
                            {profilePlant}
                        </Card>
                        <Card title="动物" noHovering bordered={false}>
                            {profileAnimal}
                        </Card>
                        <Card title="风景" noHovering bordered={false}>
                            {profileLand}
                        </Card>
                    </TabPane>
                </Tabs>
            </Modal>
        )
    }

};

export default Profile
