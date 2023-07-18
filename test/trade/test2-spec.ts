import log from "../../src/utils/log";
import { sleep } from "../common.test";
import { getAuthCode, getPayType, login, tradeClose, tradepay, tradeRefund } from "./trade-pay-spec";


/**
 * 1. 支付
 * 2. 部分退款
 * 3. 关闭交易  --->  当前交易状态不支持此操作
 */
async function test2() {

  const source = getAuthCode()

  const gen = source();
  while (true) {
    const promise: any = gen.next().value;
    const authCode: string = await promise
    const payType = getPayType(authCode)
    await login()

    const payAmount = '10'
    const refundAmount = '5'

    const pay = await tradepay(authCode, payAmount, payType)
    log('pay res ->', pay)
    const tradeNo = pay?.data?.tradeNo

    await sleep('3s')

    const refund = await tradeRefund(tradeNo, refundAmount)
    log('refund res ->', refund)

    await sleep('3s')
    const close = await tradeClose(tradeNo)
    log('close res ->', close)
  }

}

test2()