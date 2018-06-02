import { Container } from 'unstated'

export default class CaretColorContainer extends Container {
  state = {
    color: p => p.theme.colors.primary,
  }

  hasPinneds = () => {
    this.setState({ color: p => p.theme.colors.light })
  }
}
