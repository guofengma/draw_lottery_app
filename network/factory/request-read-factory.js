/**
 * Created by coin on 1/13/17.
 */

import Request from '../base-requests/request'
import Operation from '../operation'

//读取请求具体封装
export default class RequestFactory {
  // 统一的请求 
  static request(url, params = {},name,hasCookie){

    let sysInfo = global.Storage.sysInfo()

    // 是否需要携带cookie
    
    if (hasCookie) params.hasCookie = hasCookie

    //请求的接口

    params.url = url

    // 手机型号
    params.device = sysInfo.model

    // 微信版本
    params.wechatVersion = sysInfo.version

    // 系统版本
    params.systemVersion = sysInfo.system

    let req = new Request(params);

    req.name = name;//用于日志输出

    return req;
  }
  
  /********************登陆*************************/

  // 获取openid verifyWechat

  static verifyWechat(params) {
    let url = Operation.sharedInstance().verifyWechat;
    return this.request(url, params, '获取openid和是否注册');
  }
  
  
  static queryCompletedOrderPageList(params) {
      params.port = '8103';
      let url = Operation.sharedInstance().queryCompletedOrderPageList;
      return this.request(url, params, '已完成订单', true);
  }
  
  // 上传图片的地址 
  static aliyunOSSUploadImage() {
    let params = {
      port: 8100
    }
    let baseUrl = new Request(params).getBaseUrl(params)
    let url = Operation.sharedInstance().aliyunOSSUploadImage;
    return baseUrl + url
  }

}
