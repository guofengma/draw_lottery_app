/**
 * Created by weiwei on 11/6/18.
 */
import Tool from './tool';

/**
 * 存储类
 */
let __instance = (function () {
    let instance;
    return (newInstance) => {
        if (newInstance) instance = newInstance;
        return instance;
    }
}());

export default class Storage {

    constructor() {
        if (__instance()) return __instance();

        //init

        __instance(this);
    }

    static sharedInstance() {
        return new Storage();
    }

    static getterFor(key) {
        if (Storage.sharedInstance()['_' + key] === undefined) {
            try {
                let value = wx.getStorageSync(key);
                if (value) {
                    Storage.sharedInstance()['_' + key] = value;
                }
            } catch (e) {
                Storage.sharedInstance()['_' + key] = undefined;
            }
        }
        return Storage.sharedInstance()['_' + key];
    }

    static setterFor(key, value) {
        Storage.sharedInstance()['_' + key] = undefined;
        wx.setStorageSync(key, value);
    }

    /**
     * 微信用户信息
     * @returns {undefined|*|void}
     */
    static wxUserInfo() {
        return this.getterFor('wxUserInfo');
    }

    static setWxUserInfo(wxUserInfo) {
        this.setterFor('wxUserInfo', wxUserInfo);
    }

    static currentMember(){
        return this.getterFor('currentMember');
    }

    static setCurrentMember(currentMember){
        this.setterFor('currentMember',currentMember);
    }

    //登陆标记
    static didAuthorize() {
      return this.getterFor('authorize');
    }

    static setAuthorize(didLogin) {
      this.setterFor('authorize', didLogin);
    }

    //当前登录用户Id
    static memberId() {
        return this.getterFor('memberId');
    }

    static setMemberId(memberId) {
        this.setterFor('memberId', memberId);
    }

    //系统信息
    static sysInfo() {
        return this.getterFor('sysInfo');
    }

    static setSysInfo(sysInfo) {
        this.setterFor('sysInfo', sysInfo);
    }

    // 获取 openId
    static setWxOpenid(Openid){
      this.setterFor('openid', Openid)
    }

    static getWxOpenid() {
      return this.getterFor('openid');
    }

    // 用户账号信息

    static setUserAccountInfo(info) {
      this.setterFor('userAccountInfo', info)
    }

    static getUserAccountInfo() {
      return this.getterFor('userAccountInfo');
    }

    // 存cookie

    static setUserCookie(info) {
      this.setterFor('userCookie', info)
    }
   
    static getUserCookie() {
      return this.getterFor('userCookie');
    }

    // 订单确认页面地址

    static setOrderAddress(info) {
      this.setterFor('OrderAddress', info)
    }

    static getOrderAddress() {
      return this.getterFor('OrderAddress');
    }

    // 存活动ID

    static setActivityId(info) {
      this.setterFor('activityId', info)
    }

    static getActivityId() {
      return this.getterFor('activityId');
    }

    // orderList

    static setOrderList(info) {
      this.setterFor('orderList', info)
    }

    static getOrderList() {
      return this.getterFor('orderList');
    }

    // 存储地理定位
    
    static setLocation(info) {
      this.setterFor('userLocation', info)
    }

    static getLocation() {
      return this.getterFor('userLocation');
    }



    
}