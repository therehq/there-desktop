import styled, { css } from 'styled-components'
import { shade } from 'polished'

import { transition } from '../utils/styles/mixins'
import TwitterLogo from '../vectors/TwitterLogo'
import Email from '../vectors/Email'

export const TwitterButton = ({ ...props }) => (
  <BaseButton {...props} center={true} color="#00ACED">
    <IconWrapper>
      <TwitterLogo />
    </IconWrapper>
    Continue with Twitter
  </BaseButton>
)

export const EmailButton = ({ ...props }) => (
  <BaseButton {...props} center={true} color="rgb(60,95,105)">
    <IconWrapper>
      <Email />
    </IconWrapper>
    Continue with email
  </BaseButton>
)

export const ButtonsStack = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const BaseButton = styled.button`
  display: inline-flex;
  align-items: center;

  padding: 9px 13px;
  font-size: 15px;
  font-weight: 600;

  border: none;
  outline: none;
  cursor: pointer;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);

  ${p =>
    p.type === 'outline'
      ? css`
          background: transparent;
          color: ${p.color};
          border: 2px solid ${p.color};

          svg {
            fill: ${p.color};
            stroke: ${p.color};
          }

          &:hover {
            color: white;

            svg {
              color: white;
              stroke: white;
            }

            background: ${p => shade(0.85, p.color)};
          }
        `
      : css`
          background: ${p.color};
          color: #fff;

          svg {
            fill: white;
            stroke: white;
          }

          &:hover {
            background: ${p => shade(0.85, p.color)};
          }

          &:active {
            background: ${p => shade(0.6, p.color)};
            box-shadow: 0 0 0;
          }
        `};

  justify-content: ${p => (p.center ? 'center' : 'initial')};

  svg {
    display: block;
    height: 16px;
    width: auto;

    ${transition('fill', 'stroke')};
  }

  ${transition('box-shadow', 'background', 'color')};
`

const IconWrapper = styled.span`
  margin-right: 8px;
`
