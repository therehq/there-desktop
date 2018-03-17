import { Container } from 'unstated'

export const sortKeys = {
  People: 'People',
  Places: 'Places',
}

export default class SortModeContainer extends Container {
  state = {
    enabled: false,
    lists: {},
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
}
