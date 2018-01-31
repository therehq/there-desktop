import styled from 'styled-components'

const SafeArea = styled.div`
  width: 100%;
  height: auto;
  padding: 0 ${p => p.theme.sizes.sidePaddingLarge}px;

  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
`

export default SafeArea
