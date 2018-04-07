import styled from 'styled-components'

const Desc = styled.div`
  padding: 0 25px;
  margin-top: ${p => p.theme.sizes.sidePadding / 1.5}px;
  font-size: ${p => p.theme.sizes.fontSizeSmall}px;
  color: ${p => p.theme.colors.lightMutedText};
`

export default Desc
