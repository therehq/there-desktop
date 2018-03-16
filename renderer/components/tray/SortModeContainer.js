import { Container } from 'unstated'

export default class SortModeContainer extends Container {
  state = {
    enabled: true,
  }

  enable = () => {
    this.setState({ enabled: true })
  }

  disable = () => {
    this.setState({ enabled: false })
  }
}
