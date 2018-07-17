/**
 * Created by weiwei on 11/6/18.
 */

import Tool from './tool';
import RequestFactory from '../network/factory/request-read-factory';
import Storage from './storage';
import Event from './event';

require('./DateFormat');

let TCGlobal = {
    Tool: Tool,
    Storage: Storage,
    Event: Event,
    RequestFactory: RequestFactory,
    version:'V1.0',
    AppId: 'wxb149b67e84af7551',//小程序AppID
    Secret: 'ea39f6e44bd620a5381d2454e4e8e4b4',//小程序Secret
    WXPayKey: '',//商户平台32位密钥
    WXPayAccount: '',
    WXPayMchId: '',//商户Id
};

module.exports = TCGlobal;