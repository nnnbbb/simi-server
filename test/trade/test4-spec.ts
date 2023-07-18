import log from "../../src/utils/log";
import { getAuthCode, getPayType, login, randomBetween, tradeClose, tradepay } from "./trade-pay-spec";

/**
 * 1. 下单
 * 2. 交易关闭
 * 3. 支付         支付应该失败
 */
async function test4() {
  const source = getAuthCode()

  const gen = source();
  while (true) {
    const promise: any = gen.next().value;
    const authCode: string = await promise
    const payType = getPayType(authCode)

    await login()

    const payAmount = randomBetween(10, 310)

    const pay = await tradepay(authCode, payAmount, payType)
    log('pay res ->', pay)

    const tradeNo = pay?.data?.tradeNo

    const close = await tradeClose(tradeNo)
    log('close res ->', close)

  }

}

test4()