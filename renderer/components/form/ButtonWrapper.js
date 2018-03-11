import styled, { css } from 'styled-components'

const ButtonWrapper = styled.div`
  margin-top: 15px;
  text-align: right;
  visibility: visible;
  opacity: 1;
  transition: opacity 100ms ease-out, visibility 150ms ease-out;

  ${p =>
    p.isHidden &&
    css`
      visibility: hidden;
      opacity: 0;
    `};
`

export default ButtonWrapper
