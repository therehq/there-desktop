import styled, { css } from 'styled-components'

import CloseIcon from '../vectors/Close'

const NotificationBox = ({
  children,
  visible,
  closeButton = true,
  onCloseClick,
  ...props
}) => (
  <Wrapper hidden={!visible} closeButton={closeButton} {...props}>
    <Text>{children}</Text>
    {closeButton && (
      <CloseWrapper onClick={onCloseClick}>
        <CloseIcon width="11" height="11" />
      </CloseWrapper>
    )}
  </Wrapper>
)

export default NotificationBox

const Wrapper = styled.div`
  position: absolute;
  bottom: 25px;
  left: 50%;
  transform: translateX(-50%);
  z-index: ${p => p.theme.sizes.notificationZIndex};

  max-width: 90%;
  padding: 7px ${p => (p.closeButton ? 8 : 14)}px 7px 14px;
  display: flex;
  align-items: center;
  flex-direction: row;

  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e5e5;
  background: white;
  transition: bottom 200ms ease, opacity 200ms ease, visibility 200ms ease,
    transform 150ms ease-in, box-shadow 150ms ease;

  ${p =>
    p.hidden &&
    css`
      bottom: 10px;
      opacity: 0;
      visibility: hidden;
    `};

  &:hover {
    transform: translateY(-1.5px) translateX(-50%);
    box-shadow: 0 4.5px 13px rgba(0, 0, 0, 0.12);
  }
`

const Text = styled.div`
  flex: 1 1 auto;
  font-size: ${p => p.theme.sizes.fontSizeSmall}px;
  color: #666;
  line-height: 1.35;
  white-space: nowrap;
`

const CloseWrapper = styled.div`
  flex: 0 1 auto;
  margin-left: 10px;
  margin-right: 4px;
  cursor: pointer;

  svg {
    display: block;
    path {
      fill: #d0d0d0;
      transition: fill 100ms ease;
    }
  }

  &:hover {
    svg path {
      fill: #999;
    }
  }
`
