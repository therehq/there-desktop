import styled, { css, keyframes } from 'styled-components'

const fadeUp = keyframes`
  from { opacity: 1; transform: translateY(0); }
  to { opacity: 0.5; transform: translateY(-10px); }
`

const Content = styled.div`
  overflow: hidden;
  position: relative;
  width: 100%;

  ${p =>
    p.collapsed === true &&
    css`
      > div > * {
        animation: ${fadeUp} 100ms ease;
      }
    `};
`

export default Content
