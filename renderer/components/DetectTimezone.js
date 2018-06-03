import electron from 'electron'
import { Component } from 'react'
import { ConnectHOC, query, mutation } from 'urql'
import ms from 'ms'
import moment from 'moment-timezone'

// Utilities
import { getTimeZoneAutoUpdate } from '../utils/store'
import { getAbbrOrUtc } from '../utils/timezones/helpers'

class DetectTimezone extends Component {
  refetchInterval = null

  state = {
    updating: false,
  }

  componentDidMount() {
    this.refetchInterval = setInterval(() => {
      this.props.refetch()

      setTimeout(() => {
        this.updateTimezone()
      }, ms('10s'))
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
    console.log('update called...')
    const currentTimezone = this.props.data
      ? this.props.data.user.timezone
      : false
    const guessedTimezone = moment.tz.guess(true)

    // Check if data isn't loaded
    if (currentTimezone === false) {
      return
    }

    const noCurrentTimezone = currentTimezone === null || currentTimezone === ''

    // Only if there is a current timezone check for
    if (!noCurrentTimezone) {
      const areSame = this.compareTimezones(currentTimezone, guessedTimezone)

      if (areSame) {
        return
      }
    }

    console.log('updating')

    // Updating timezone...
    this.setState({ updating: true })

    // If timezone has changed, we should update it
    try {
      await this.props.updateTimezone({ timezone: guessedTimezone })

      // Only if it's not the first timezone, notify
      if (!noCurrentTimezone) {
        // Push a notification for user to know we updated it
        this.notifyOfUpdate(guessedTimezone)
      }
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

export default ConnectHOC(() => {
  // Get user preference
  const shouldUpdate = getTimeZoneAutoUpdate()

  return {
    cache: false,
    query: shouldUpdate ? query(User) : undefined,
    mutation: {
      updateTimezone: mutation(UpdateTimezone),
    },
  }
})(DetectTimezone)
