import styled from 'styled-components'

const Title = styled.div`
  margin-top: ${p => p.theme.sizes.sidePadding}px;

  font-size: ${p => p.theme.sizes.fontSizeBigger};
  font-weight: bold;
  color: ${p => p.theme.colors.lightText};
`

export default Title
