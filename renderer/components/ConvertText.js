import electron from 'electron'
import { Component } from 'react'
import moment from 'moment-timezone'

// Utilities
import { detectTimezone } from '../utils/timezones/detect'

export default class ConvertText extends Component {
  ipc = electron.ipcRenderer || false

  componentDidMount() {
    if (!this.ipc) {
      return
    }

    this.ipc.on('text-dropped', this.textDopped)
  }

  componentWillUnmount() {
    if (!this.ipc) {
      return
    }

    this.ipc.removeListener('text-dropped', this.textDopped)
  }

  textDopped = (event, arg) => {
    const timezone = detectTimezone()
    const momentInstance = moment(arg)
    const isValidDateTime = momentInstance.isValid()

    if (!isValidDateTime) {
      this.answer({
        message: `Sorry, the data / time format wasn't recognized.`,
      })
      return
    }

    const data = momentInstance.format('DD/MM/YYYY (ddd, MMMM)')
    const time = momentInstance
      .tz(timezone)
      .format('hh:mm:ss A ([converted to] Z UTC)')
    const fromNow = momentInstance.fromNow()
    const hasTime = !time.startsWith('00:00:00')

    this.answer({
      message: `${data}${hasTime ? `\n${time}` : ``}\n${fromNow}`,
      detail: `\nBased on your local time, with considering Daylight saving time.`,
    })
  }

  answer = msg => {
    this.ipc.send('dropped-text-converted', msg)
  }

  render() {
    return null
  }
}
