import fetch from 'node-fetch';
import log from '../../../src/utils/log';
import { host } from "../../common.test";

export async function queryTrade() {

  const body = {
    out_trade_no: "VGIG24WRc2JRgPSEQZGqea7b",
  }
  log('req body ->', body)

  const payRes = await fetch(`${host}/api/alipay/query-trade`, {
    method: "POST",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body)
  })
  const res = await payRes.json();
  /* eslint-disable  no-console */
  log('res ->', res)
}
queryTrade()