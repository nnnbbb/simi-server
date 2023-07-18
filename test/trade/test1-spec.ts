import log from "../../src/utils/log";
import { getAuthCode, getPayType, login, tradepay, tradeRefund } from "./trade-pay-spec";

/**
 * 1. 支付
 * 2. 退款
 */
async function test1() {
  const source = getAuthCode()

  const gen = source();
  while (true) {
    const promise: any = gen.next().value;
    const authCode: string = await promise
    const refundAmount = '2'
    const payType = getPayType(authCode)

    await login()

    const res = await tradepay(authCode, refundAmount, payType)
    log('pay res ->', res)
    setTimeout(async () => {
      const refund = res?.data?.tradeNo && await tradeRefund(res?.data?.tradeNo, refundAmount)
      log('refund res ->', refund)
    }, 3000);

  }

}

test1()