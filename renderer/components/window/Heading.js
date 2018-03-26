import styled from 'styled-components'

const Heading = styled.h1`
  line-height: 1.2;
  font-size: ${p => (p.secondary ? 28 : 32)}px;
  font-weight: 300;

  flex-shrink: 0;
  margin: ${p => (p.secondary ? 20 : 25)}px 0 0 0;
`

export default Heading
