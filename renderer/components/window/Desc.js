import styled from 'styled-components'
import { darken } from 'polished'

const Desc = styled.p`
  line-height: 1.3;
  font-size: 15px;
  font-weight: normal;
  margin: 5px auto 10px auto;
  max-width: 430px;

  color: ${p => p.theme.colors.grayText};

  a {
    color: ${p => p.theme.colors.grayText};
    text-decoration-color: #ccc;
    text-decoration-style: dotted;

    &:hover {
      color: ${p => darken(0.2, p.theme.colors.grayText)};
      text-decoration-color: #bbb;
    }
  }
`

export default Desc
