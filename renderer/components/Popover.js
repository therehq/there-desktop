import React from 'react'
import styled, { css } from 'styled-components'

const isWindows = process.platform === 'win32'

const PopoverBox = styled.div`
  height: 100%;
  position: relative;
  border-radius: 5px;
  background: ${p => p.theme.colors.primary};
  color: white;

  ${p =>
    p.topArrow &&
    css`
      &:before {
        content: ' ';
        position: absolute;
        bottom: 100%;
        left: 50%;
        margin-left: -12px;
        height: 0;
        width: 0;
        pointer-events: none;
        border: solid transparent;
        border-color: rgba(0, 0, 0, 0);
        border-bottom-color: ${p => p.theme.colors.primary};
        border-width: 12px;
      }
    `};
`

const TransparentWrapper = styled.div`
  background: transparent;
  height: 100vh;
  width: 100vw;
  padding-top: 14px;
  box-sizing: border-box;
`

const Popover = ({ children, ...props }) => (
  <TransparentWrapper {...props}>
    <PopoverBox topArrow={!isWindows}>{children}</PopoverBox>
  </TransparentWrapper>
)

export default Popover
