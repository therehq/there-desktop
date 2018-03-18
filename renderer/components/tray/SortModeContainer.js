import { Container } from 'unstated'

export const sortKeys = {
  People: 'people',
  Places: 'places',
}

export default class SortModeContainer extends Container {
  state = {
    enabled: false,
    lists: {},
    followingsFetching: false,
  }

  enable = () => {
    this.setState({ enabled: true })
  }

  disable = () => {
    this.setState({ enabled: false, lists: {} })
  }

  setList = (key, list) => {
    this.setState({ lists: { ...this.state.lists, [key]: list } })
  }

  getList = key => this.state.lists[key] || null

  disableOnFollowingsFetched = () => {
    this.setState({ followingsFetching: true })
  }

  followingsFetched = () => {
    if (!this.state.followingsFetching) {
      return
    }

    this.setState({ followingsFetching: false })
    this.disable()
  }
}
