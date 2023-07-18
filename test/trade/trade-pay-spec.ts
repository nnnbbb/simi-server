// TypeScript
import fetch from 'node-fetch';
import { from, Observable, of } from 'rxjs';
import { SerialPort } from 'serialport';
import { Duplex } from 'stream';
import util from 'util';
import { TradeCloseDto } from '../../src/trade/dto/trade-close.dto';
import { TradePayDto } from '../../src/trade/dto/trade-pay.dto';
import { TradeRefundDto } from '../../src/trade/dto/trade-refund.dto';
import { PayWay } from '../../src/trade/trade.constants';
import { host } from '../common.test';

// const host = 'http://192.168.29.32:5000'
export function randomBetween(min: number, max: number) { // min and max included 
  const n = Math.floor(Math.random() * (max - min + 1) + min);
  return String(n)
}
let token: string

/**
 * @description: 根据code获取是支付宝或者二维码
 * @description: 支付宝二维码 25-30开头的长度为16-24位的数字
 * @description: 微信二维码18位纯数字,前缀以10、11、12、13、14、15开头
 * @param authCode 二维码解析的code
 */
export function getPayType(authCode: string): PayWay {
  const code = authCode.substring(0, 2)
  const n = Number(code)
  let type: PayWay

  if (n < 25) {
    type = PayWay.WECHAT_PAY
  } else if (n >= 25 && n <= 30) {
    type = PayWay.ALI_PAY
  }
  return type
}

export async function login() {

  const body = {
    account: "超级管理员",
    password: "123123",
  }
  /* eslint-disable  no-console */
  console.log('req body ->', body)

  const payRes = await fetch(`${host}/api/doctor/login`, {
    method: "POST",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body)
  })
  const res = await payRes.json();
  /* eslint-disable  no-console */
  console.log('res ->', res)
  token = res.data
}

export async function tradepay(auth_code: string, total_fee: string, payWay: PayWay) {

  const tradePayBody: TradePayDto = {
    payWay,
    totalAmount: total_fee,
    authCode: auth_code,
  }
  /* eslint-disable  no-console */
  console.log('trade pay req body ->', tradePayBody)

  const payRes = await fetch(`${host}/api/trade/pay`, {
    method: "POST",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      token,
    },
    body: JSON.stringify(tradePayBody)
  })
  const pay = await payRes.json();
  return pay
}


export async function tradeClose(tradeNo: string) {

  const tradeCloseBody: TradeCloseDto = {
    tradeNo,
  }
  /* eslint-disable  no-console */
  console.log('trade close req body ->', tradeCloseBody)

  const payRes = await fetch(`${host}/api/trade/close`, {
    method: "POST",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      token,
    },
    body: JSON.stringify(tradeCloseBody)
  })
  const pay = await payRes.json();
  /* eslint-disable  no-console */
  console.log('pay ->', util.inspect(pay, { showHidden: false, depth: null, colors: true }))
  return pay
}


export async function tradeRefund(tradeNo: string, refundAmount: string) {
  let refundBody: TradeRefundDto = {
    tradeNo,
    refundAmount,
  }

  /* eslint-disable  no-console */
  console.log('trade refund req body ->', refundBody)

  const refundRes = await fetch(`${host}/api/trade/refund`, {
    method: "POST",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      token,
    },
    body: JSON.stringify(refundBody)
  })

  const refund = await refundRes.json();
  return refund
}
/**
 * @see https://stackoverflow.com/questions/41537504/how-to-convert-node-readable-stream-to-rx-observable
 * @param stream 
 * @param finishEventName 
 * @param dataEventName 
 */
function fromStream(stream: Duplex, finishEventName = 'end', dataEventName = 'data') {
  stream.pause();

  return new Observable((observer) => {
    function dataHandler(data) {
      observer.next(data);
    }

    function errorHandler(err) {
      observer.error(err);
    }

    function endHandler() {
      observer.complete();
    }

    stream.addListener(dataEventName, dataHandler);
    stream.addListener('error', errorHandler);
    stream.addListener(finishEventName, endHandler);

    stream.resume();

    return () => {
      stream.removeListener(dataEventName, dataHandler);
      stream.removeListener('error', errorHandler);
      stream.removeListener(finishEventName, endHandler);
    };
  })
}

/**
 * @see https://stackoverflow.com/questions/39426849/can-node-js-stream-be-made-as-coroutine
 * @param stream 
 */
function streamToPromises(stream: Duplex) {
  return function () {
    if (stream.isPaused()) {
      stream.resume();
    }

    return new Promise(function (resolve) {
      stream.on('data', function (data: Buffer) {
        const authCode = data.toString().replace("\r", "");
        resolve(authCode)
        stream.pause();
      });
    });
  }
}


export function getAuthCode() {
  const serialPort = new SerialPort({
    path: "COM6",
    baudRate: 9600,
    autoOpen: false,
  });

  serialPort.open(function (error) {
    if (error) {
      /* eslint-disable  no-console */
      console.log("错误：" + error);
    } else {
      /* eslint-disable  no-console */
      console.log("打开端口成功，正在监听数据中");
    }
  });

  // return new Promise((resolve, reject) => {
  //   // 以 flowing mode 监听收到的数据
  //   serialPort.on('data', async (data: Buffer) => {
  //     await login()

  //     const authCode = data.toString().replace("\r", "");
  //     console.log('authCode ->', authCode)
  //     resolve(
  //       of(authCode)
  //     )
  //   });
  // })

  // run(function* () {
  //   var nextFib = streamToPromises(serialPort);

  //   while (true) {
  //     let n = yield nextFib();
  //     console.log(n);

  //   }
  // });
  return function* () {
    const next = streamToPromises(serialPort);

    while (true) {
      yield next();
    }
  }

  // return fromStream(serialPort)
  // await login()
  // const auth_code = "283195965126619122"
  // const total_fee = '3000'
  // const payType = getPayType(auth_code)
  // const res = await tradepay(auth_code, total_fee, payType)

};

// const prompt = require("prompt-sync")({ sigint: true });
// const age = prompt("How old are you? ");
// console.log(`You are ${age} years old.`);

// tradeRefund("TFJm_ia6q00EBFP4jxKec0C1", 420)