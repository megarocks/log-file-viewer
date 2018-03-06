const fs = require('fs')
const moment = require('moment')
const random = require('random-js')()

const messages = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  'Duis aute irure dolor in reprehenderit in voluptate',
  'Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur?'
]
const severityLeveles = ['ERROR', 'WARNING', 'INFO']

const logRecordMoment = moment('2018-01-01')
const now = moment()

const logRecords = []

while (logRecordMoment < now) {
  const recordType = random.integer(0, 2)
  const logRecord = `${logRecordMoment.format('Y-MM-DD HH:mm:ss,SSS')} ${severityLeveles[recordType]} ${messages[recordType]}`
  logRecords.push(logRecord)
  logRecordMoment.add(random.integer(7*1000, 7*1000*60*60), 'milliseconds')
}

fs.appendFile('big_log_file.txt', logRecords.join('\n'), (err) => { console.log(err) })


