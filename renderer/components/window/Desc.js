import styled, { css } from 'styled-components'

const Desc = styled.p`
  line-height: 1.4;
  font-size: 15px;
  font-weight: normal;
  margin: 5px auto 10px auto;
  max-width: 430px;

  color: ${p => p.theme.colors.grayText};

  ${p =>
    p.fullWidth &&
    css`
      max-width: 100%;
      margin-right: 0;
      margin-left: 0;
    `};
`

export default Desc
