import styled from 'styled-components'
import { lighten } from 'polished'

import { transition } from '../../utils/mixins'

const PersonResult = ({ photoUrl, name, time, flag, ...props }) => (
  <Wrapper {...props} data-label={name}>
    <Photo>
      <img src={photoUrl} title={name} />
    </Photo>

    <Info>
      <Name>{name}</Name>
      <Time>
        {time} {flag}
      </Time>
    </Info>
  </Wrapper>
)

export default PersonResult

const photoSize = 40

const Wrapper = styled.button`
  display: flex;
  align-items: center;

  /* Full Width-ify :) */
  width: calc(100% + ${p => p.theme.sizes.sidePaddingLarge * 2}px);
  padding: 5px ${p => p.theme.sizes.sidePaddingLarge}px;
  margin: 0 ${p => -p.theme.sizes.sidePaddingLarge}px;

  /* Remove Button-style */
  color: #666;
  border: none;
  outline: none;
  border-bottom: 1px solid #eee;
  background: transparent;
  cursor: pointer;

  ${transition('background', 'color')};

  &:hover,
  &:focus {
    background: ${p => lighten(0.05, p.theme.colors.subtle)};
    color: ${p => p.theme.colors.primaryOnLight};

    img {
      filter: grayscale(0%);
    }
  }
`

const Photo = styled.div`
  flex: 0 0 auto;
  width: ${photoSize}px;
  height: ${photoSize}px;
  overflow: hidden;
  margin-right: 12px;
  border-radius: ${photoSize}px;

  img {
    width: ${photoSize}px;
    height: auto;
    cursor: pointer;

    filter: grayscale(100%);
    transition: filter 100ms;
  }
`

const Info = styled.div`
  flex: 1 1 auto;
  width: auto;
  cursor: pointer;
  display: flex;
  align-items: center;
`

const Name = styled.span`
  font-size: 18px;
  font-weight: 600;
  line-height: 1.3;
`

const Time = styled.span`
  margin-left: auto;
  margin-right: 5px;

  font-size: 18px;
  font-variant-numeric: tabular-nums;

  color: #aaa;
  opacity: 0.6;
  cursor: pointer;
`
