import log from "../../src/utils/log";
import { sleep } from "../common.test";
import { getAuthCode, getPayType, login, tradeClose, tradepay } from "./trade-pay-spec";

/**
 * 1. 支付
 * 2. 交易关闭   --->  当前交易状态不支持此操作
 */
async function test3() {
  const source = getAuthCode()

  const gen = source();
  while (true) {
    const promise: any = gen.next().value;
    const authCode: string = await promise
    const payType = getPayType(authCode)

    await login()
    const payAmount = '300'

    const pay = await tradepay(authCode, payAmount, payType)
    log('pay res ->', pay)
    const tradeNo = pay?.data?.tradeNo

    await sleep('10s')

    const close = await tradeClose(tradeNo)
    log('close res ->', close)
  }

}

test3()