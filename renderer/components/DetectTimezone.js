import { Component } from 'react'
import { ConnectHOC, query, mutation } from 'urql'
import ms from 'ms'
import moment from 'moment-timezone'

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
    const now = Date.now()

    if (!currentTimezone) {
      return
    }

    const currentTime = moment(now)
      .tz(currentTimezone)
      .format()
    const guessedTime = moment(now)
      .tz(guessedTimezone)
      .format()

    const areSame = currentTime === guessedTime

    console.log('areSame', currentTimezone, guessedTimezone)

    if (areSame) {
      return
    }

    console.log('updating...')

    this.setState({ updating: true })

    // If timezone has changed, we should update it
    try {
      await this.props.updateTimezone({ timezone: guessedTimezone })
    } catch (err) {
      console.log(err)
    } finally {
      this.setState({ updating: false })
    }
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
