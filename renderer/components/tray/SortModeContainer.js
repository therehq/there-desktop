import { Container } from 'unstated'

export default class SortModeContainer extends Container {
  state = {
    enabled: false,
  }

  enable = () => {
    this.setState({ enabled: true })
  }

  disable = () => {
    this.setState({ enabled: false })
  }
}
