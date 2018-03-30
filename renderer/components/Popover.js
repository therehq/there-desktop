import React from 'react'
import styled from 'styled-components'

// Local
import TopArrowPosition from './tray/TopArrowPosition'
import Caret from '../vectors/Caret'

const isWindows = process.platform === 'win32'

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
  padding-top: 14px;
  box-sizing: border-box;
`

const Popover = ({ children, ...props }) => (
  <TransparentWrapper {...props}>
    <PopoverBox>
      {isWindows || (
        <TopArrowPosition>
          {left => (
            <TopArrowWrapper left={left}>
              <Caret />
            </TopArrowWrapper>
          )}
        </TopArrowPosition>
      )}

      {children}
    </PopoverBox>
  </TransparentWrapper>
)

export default Popover
