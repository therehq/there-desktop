import styled, { css, keyframes } from 'styled-components'

const fadeUp = keyframes`
  from { opacity: 1; transform: translateY(0); }
  to { opacity: 0.5; transform: translateY(-10px); }
`

const fadeDown = keyframes`
  from { opacity: 0.5; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
`

const Content = styled.div`
  overflow: hidden;
  position: relative;
  width: 100%;

  ${p =>
    p.collapsed === true
      ? css`
          > div > * {
            animation: ${fadeUp} 100ms ease;
          }
        `
      : p.collapsed === false &&
        css`
          > div > * {
            animation: ${fadeDown} 100ms ease;
          }
        `};
`

export default Content
