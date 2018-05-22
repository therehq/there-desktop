import styled, { css } from 'styled-components'

export const Space = styled.div`
  width: ${p => p.width || 0}px;
  height: ${p => p.height || 0}px;
  pointer-events: none;

  ${p =>
    p.fillVertically &&
    css`
      margin-top: auto;
      margin-bottom: auto;
    `};

  ${p =>
    p.fillHorizentally &&
    css`
      margin-right: auto;
      margin-left: auto;
    `};
`

export default Space
