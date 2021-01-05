/**
 *  作者: 张楠华
 *  创建日期: 2018-2-7
 *  邮箱：zhangnh6@chinaunicom.cn
 *  文件说明：审核详情title。
 */
import {Select} from 'antd';
const Option = Select.Option;
import style from './review.less'
function changeProjName(value,tag,dispatch){
  if(tag === 0){
    dispatch({
      type:'review/queryReview',
      projInfo:value,
    });
  }else if(tag === 1){
    dispatch({
      type:'review/queryMakeUpReview',
      projInfo:value,
    });
  }
}
export function ReviewTitle({titleList,tag,dispatch,titleTime,projInfo}) {
    const titleOption = titleList.map((item,index)=>{
      return (
        <Option value={item.proj_id} key={index}>
          {item.proj_name}
        </Option>
      )
    });
  return(
    <div style={{marginBottom:'20px'}}>
      {

          tag === 0 ?
            <div style={{textAlign:'center'}}>
              {
                titleList.length !== 0?
                  <div>
                    {
                      titleList.length > 1?
                        <Select
                          onChange={(value)=>changeProjName(value,tag,dispatch)}
                          style={{minWidth:'500px',margin:'0 auto',fontSize:'16px'}}
                          size="large"
                          value={projInfo}
                          placeholder="请选择团队名称"
                          dropdownStyle={{fontSize : '16px'}}>
                          {titleOption}
                        </Select>
                        :
                        <h2 style={{textAlign:'center'}}>{titleList.length !== 0 ?titleList[0].proj_name:''}</h2>

                    }
                    <div style={{textAlign:'center',marginTop:'10px'}}>
                      {
                        titleTime? titleTime.mon +'~'+ titleTime.sun:''
                      }
                    </div>
                  </div>
                  :
                  []
              }
            </div>
            :
            tag === 1 ?
            <div style={{textAlign:'center'}}>
              {
                titleList.length > 1?
                  <Select
                    onChange={(value)=>changeProjName(value,tag,dispatch)}
                    style={{minWidth:'500px',margin:'0 auto',fontSize:'16px'}}
                    size="large"
                    value={projInfo}
                    placeholder="请选择团队名称"
                    dropdownStyle={{fontSize : '16px'}}>
                    {titleOption}
                  </Select>
                  :
                  <h2 style={{textAlign:'center'}}>{titleList.length !== 0 ?titleList[0].proj_name:''}</h2>

              }
            </div>
              :
              []

      }
    </div>
  )
}
