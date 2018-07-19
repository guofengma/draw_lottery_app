/**
 * Created by coin on 1/13/17.
 */

let __instance = (function () {
    let instance;
    return (newInstance) => {
        if (newInstance) instance = newInstance;
        return instance;
    }
}());

//操作常量定义
export default class Operation {

    constructor() {
        if (__instance()) return __instance();


    /*************  注册登录相关接口 *********************/
       
        // 验证openid是否注册
        this.verifyWechat = '/user/memberLogin/verifyWechat'


        // 上传图片的地址

        this.aliyunOSSUploadImage ='/commonAPI/ossClient/aliyunOSSUploadImage'

        // 获取反馈问题的列表
      
        this.queryDictionaryDetailsType = '/admin/dictionary/queryDictionaryDetailsType'

      /*************  首页接口 *********************/

        //天天签到 签到

        this.signUrl = '/user/activitySign/addActivitySign'

        // 天天签到 签到列表

        this.signListUrl = '/user/activitySign/queryActivitySignData'
      
      /*************  我的奖品 *********************/

        // 字卡数量获取

        this.queryActivityWordCard ='/user/activityWordCard/queryActivityWordCard'
        
        // 合成字卡 

        this.configListCard='/user/activityWordCardConfig/queryActivityWordCardConfigListByActivityId'

        // 合成字卡活动地址选择

        this.updateUserCheckedAddress = '/user/userAddress/updateUserCheckedAddress'
      
      /*************  地址 *********************/

        // 新增地址

        this.addUserAddress ='/user/userAddress/addUserAddress'

        // 删除地址

        this.deleteUserAddress = '/user/userAddress/deleteUserAddress'

        // 修改地址

        this.updateUserAddress = ' /user/userAddress/updateUserAddress'

        // 查询列表

        this.queryUserAddressList ='/user/userAddress/queryUserAddressList'


      /**********  获取省市区 *******************/

        // 获取省
        this.getProvinceList = '/admin/areaApi/getProvinceList'

        // 获取市
        this.getCityList = '/admin/areaApi/getCityList'

        // 获取区
        this.getAreaList = '/admin/areaApi/getAreaList'

    }

    static sharedInstance() {
        return new Operation();
    }
}