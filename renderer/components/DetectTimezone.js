import electron from 'electron'
import { Component } from 'react'
import { ConnectHOC, query, mutation } from 'urql'
import ms from 'ms'
import moment from 'moment-timezone'

// Utilities
import { getAbbrOrUtc } from '../utils/timezones/helpers'

class DetectTimezone extends Component {
  refetchInterval = null

  state = {
    updating: false,
  }

  componentDidMount() {
    this.refetchInterval = setInterval(() => {
      this.props.refetch({ skipCache: true })
      this.updateTimezone()
    }, ms('1h'))
  }

  componentWillUnmount() {
    if (this.refetchInterval) {
      clearInterval(this.refetchInterval)
    }
  }

  componentDidUpdate(prevProps) {
    const isFirstTime = !prevProps.data && this.props.data

    if (isFirstTime) {
      this.updateTimezone()
    }
  }

  updateTimezone = async () => {
    const currentTimezone = this.props.data
      ? this.props.data.user.timezone
      : null
    const guessedTimezone = moment.tz.guess()

    if (!currentTimezone) {
      return
    }

    const areSame = this.compareTimezones(currentTimezone, guessedTimezone)

    if (areSame) {
      return
    }

    // Updating timezone...
    this.setState({ updating: true })

    // If timezone has changed, we should update it
    try {
      await this.props.updateTimezone({ timezone: guessedTimezone })

      // Push a notification for user to know we updated it
      this.notifyOfUpdate(guessedTimezone)
    } catch (err) {
      console.log(err)
    } finally {
      this.setState({ updating: false })
    }
  }

  notifyOfUpdate = newTimezone => {
    const title = this.getMessage(newTimezone)
    const notification = new Notification(title, {
      body: `Click to set city, or dismiss.`,
      requireInteraction: true,
    })

    notification.onclick = () => {
      this.openLocationWindow()
    }
  }

  getMessage = newTimezone => {
    const abbrOrUtc = getAbbrOrUtc(newTimezone)

    return `Time Zone Updated to ${abbrOrUtc}! ✈️`
  }

  compareTimezones = (aZone, bZone) => {
    const now = Date.now()

    const aTime = moment(now)
      .tz(aZone)
      .format()
    const bTime = moment(now)
      .tz(bZone)
      .format()

    return aTime === bTime
  }

  openLocationWindow = () => {
    const sender = electron.ipcRenderer || false
    if (!sender) {
      return
    }

    sender.send('open-update-location')
  }

  render() {
    return <div />
  }
}

const User = `#graphql
  query {
    user {
      timezone
    }
  }
`

const UpdateTimezone = `#graphql
  mutation updateTimezone($timezone: String!) {
    updateTimezone(timezone: $timezone) {
      timezone
    }
  }
`

export default ConnectHOC({
  cache: false,
  query: query(User),
  mutation: {
    updateTimezone: mutation(UpdateTimezone),
  },
})(DetectTimezone)
