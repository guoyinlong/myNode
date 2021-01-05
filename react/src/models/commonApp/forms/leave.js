/**
 * 作者：王超
 * 创建日期：2017-10-19
 * 邮箱：wangc235@chinaunicom.cn
 * 文件说明：请假单state,reduers,数据接口定义
 */

export default {
  namespace : 'leave',
  state : {
    	employeeType:2,
    	startValue: new Date(),
    	endValue: null,
  },

  reducers : {
    selectedTpye(state,{value,startValue,endValue}){
      return{
        ...state,
        employeeType:value,
        startValue,
	      endValue,
        SrcFlag:false
      };
    }
  }
}
