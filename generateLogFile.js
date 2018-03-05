const fs = require('fs')
const moment = require('moment')
const random = require('random-js')()

const messages = ['Error Message', 'Warning Message', 'Info Message']
const severityLeveles = ['ERROR', 'WARNING', 'INFO']

const logRecordMoment = moment('2017-01-01')
const now = moment()

const logRecords = []

while (logRecordMoment < now) {
  const recordType = random.integer(0, 2)
  const logRecord = `${logRecordMoment.format('Y-MM-DD HH:mm:ss,SSS')} ${severityLeveles[recordType]} ${messages[recordType]}`
  logRecords.push(logRecord)
  logRecordMoment.add(random.integer(7*1000, 7*1000*60*60), 'milliseconds')
}

fs.appendFile('big_log_file.txt', logRecords.join('\n'), (err) => { console.log(err) })


