import ms from 'ms';
import fetch from 'node-fetch';
export const host = 'http://192.168.29.196:3000'
export let token: string

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

export async function sleep(time: string) {
  return new Promise<void>((resolve,) => {
    setTimeout(() => {
      resolve()
    }, ms(time));
  })
}

