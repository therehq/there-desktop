import React from 'react'
import styled from 'styled-components'

// Local
import TopArrowPosition from './tray/TopArrowPosition'
import { ConnectedCaret } from './ConnectedCaret'

// const notWindows = process.platform !== 'win32'
// macOS white line bug
const showBalloon = false

const PopoverBox = styled.div`
  height: 100%;
  position: relative;
  border-radius: 5px;
  background: ${p => p.theme.colors.primary};
  color: white;
`

const TopArrowWrapper = styled.div`
  position: absolute;
  top: -12px;
  left: 0;
  right: 0;

  /* Position based on where tray is */
  padding-left: ${p => p.left || 0}px;
`

const TransparentWrapper = styled.div`
  background: transparent;
  height: 100vh;
  width: 100vw;
  padding-top: ${p => (p.arrowSpace ? 14 : 0)}px;
  box-sizing: border-box;
`

const Popover = ({ children, ...props }) => (
  <TransparentWrapper {...props} arrowSpace={showBalloon}>
    <PopoverBox>
      {showBalloon && (
        <TopArrowPosition>
          {left => (
            <TopArrowWrapper left={left}>
              <ConnectedCaret />
            </TopArrowWrapper>
          )}
        </TopArrowPosition>
      )}

      {children}
    </PopoverBox>
  </TransparentWrapper>
)

export default Popover
