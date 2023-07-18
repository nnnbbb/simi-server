import fs from 'fs';
import path, { dirname, join } from 'path';
import { install } from 'source-map-support';
import util from 'util';

if (process.env.NODE_ENV !== 'production') { install() }


const Package = require(join(process.cwd(), 'package.json'))
const file = join(process.cwd(), `logs/${Package.name}/${Package.name}.log`)

fs.mkdirSync(dirname(file), { recursive: true })
let fileWriteStream = fs.createWriteStream(path.resolve(file), {
  'flags': 'a', 'mode': 0o666
})

const log = function (...args: any[]): void {
  let stack = stackTrace() || ''
  let line = getLine(stack)
  output(args, line)
}

const getLine = function (stack: string) {
  let matchResult = stack.match(/\(.*?\)|\s.+/g) || []
  let arr = matchResult.map((it: string) => it.split(' ').pop().replace(/\(|\)/g, ''))
  return arr[1] ?? ''
}

const formateTimestamp = function () {
  const d = new Date()
  const date = d.toISOString().split('T')[0]
  const time = d.toTimeString().split(' ')[0]
  return `${date} ${time}`
}

const stackTrace = function () {
  let obj: Error = new Error()
  Error.captureStackTrace(obj, stackTrace)
  return obj.stack
}

const output = function (data: any, line: string) {
  let output1 = formatText(data, `\x1b[34m${line}\x1b[0m`, true)
  let output2 = formatText(data, line, false)

  writeConsole(output1)
  writeFile(output2)
}

const formatText = function (data: any, line: string, color: boolean) {
  let text = `[${formateTimestamp()}] `
  for (let i = 0; i < data.length; i++) {
    let s = data[i]
    if (typeof data[i] == 'object') {
      s = util.inspect(data[i], false, 5, color)
      // arguments[i] = JSON.stringify(arguments[i])
    }

    let log = String(s) + ' '
    text += log
  }
  text += `${line}\n`
  return text
}

const writeFile = async function (text: string) {
  const chunk = 1000
  const str: any = chunkString(text, chunk)
  for (let i = 0; i < str.length; i++) {
    const ableToWrite = fileWriteStream.write(str[i])
    // if (!ableToWrite) {
    //   await new Promise(resolve => {
    //     fileWriteStream.once('drain', resolve);
    //   });
    // }
  }
}

function chunkString(str: string, length: number) {
  return str.match(new RegExp(`(.|[\r\n]){1,${length}}`, 'g'))
}

const writeConsole = function (text: string) {
  process.stdout.write(`${text}`)
}

if (process.env.NODE_ENV !== 'production') {
  /* eslint-disable  no-console */
  console.log = log
}

export default log