import styled from 'styled-components'

const Desc = styled.p`
  line-height: 1.3;
  font-size: 15px;
  font-weight: normal;
  margin: 5px auto 10px auto;
  max-width: 430px;

  color: ${p => p.theme.colors.grayText};
`

export default Desc
