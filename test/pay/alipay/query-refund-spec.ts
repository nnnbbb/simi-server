import fetch from 'node-fetch';
import log from '../../../src/utils/log';
import { host } from "../../common.test";

export async function queryRefund() {

  const body = {
    out_trade_no: "PGmyjy2_UPJsWH5R6NCveq6Q",
    out_request_no: "QTFaSy7ZtBxMO3M2pU7g91Vg",
  }
  log('req body ->', body)

  const payRes = await fetch(`${host}/api/alipay/query-refund`, {
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
queryRefund()