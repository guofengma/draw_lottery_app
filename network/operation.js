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

    }

    static sharedInstance() {
        return new Operation();
    }
}