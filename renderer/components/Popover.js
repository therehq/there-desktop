import React from 'react'
import styled from 'styled-components'

const PopoverBox = styled.div`
  height: 100%;
  position: relative;
  border-radius: 5px;
  background: ${p => p.theme.colors.primary};
  color: white;

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
`

const TransparentWrapper = styled.div`
  background: transparent;
  height: 100%;
  width: 100%;
  padding-top: 14px;
  box-sizing: border-box;
`

const Popover = ({ children, ...props }) => (
  <TransparentWrapper {...props}>
    <PopoverBox>{children}</PopoverBox>
  </TransparentWrapper>
)

export default Popover
