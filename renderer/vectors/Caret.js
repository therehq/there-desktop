import styled from 'styled-components'

export default props => (
  <Svg width="25" height="12" viewBox="0 0 25 12" {...props}>
    <path d="M25 12H0L11.6 1.3a2 2 0 0 1 2.8 0L25 12z" />
  </Svg>
)

const Svg = styled.svg`
  vertical-align: top;
  fill: ${p => (p.hasPinneds ? p.theme.colors.light : p.theme.colors.primary)};
`
