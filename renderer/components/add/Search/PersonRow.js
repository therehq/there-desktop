import { PureComponent } from 'react'
import styled, { css } from 'styled-components'

// Utilities
import { restEndpoint } from '../../../../config'
import { transition } from '../../../utils/styles/mixins'

export default class PersonRow extends PureComponent {
  image = null
  state = { backupPhotoUrl: '' }

  render() {
    const {
      photoUrl,
      fullName,
      countryFlag,
      highlight,
      fullWidth = true,
      ...props
    } = this.props
    const { backupPhotoUrl } = this.state

    return (
      <Wrapper
        {...props}
        data-label={fullName}
        highlight={highlight}
        fullWidth={fullWidth}
      >
        <Photo>
          <img
            src={backupPhotoUrl || photoUrl}
            title={fullName}
            ref={r => {
              this.image = r
            }}
          />
        </Photo>

        <Info>
          <Name>{fullName}</Name>
          <Time>{countryFlag}</Time>
        </Info>
      </Wrapper>
    )
  }

  componentDidMount() {
    if (this.image) {
      this.image.addEventListener('error', this.imageFailed)
    }
  }

  componentWillUnmount() {
    if (this.image) {
      this.image.removeEventListener('error', this.imageFailed)
    }
  }

  imageFailed = () => {
    const { twitterHandle } = this.props
    if (twitterHandle) {
      this.setState({
        backupPhotoUrl: `${restEndpoint}/twivatar/${twitterHandle}`,
      })
    }
  }
}

const photoSize = 34

const wrapperHighlighted = css`
  background: ${p => p.theme.colors.subtle};
  color: ${p => p.theme.colors.primaryOnLight};

  & img {
    filter: saturate(1.1) brightness(1.2);
  }
`

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  -webkit-app-region: no-drag;

  /* Full Width-ify :) */
  ${p =>
    p.fullWidth
      ? css`
          width: 100%;
          padding: 5px ${p => p.theme.sizes.sidePaddingLarge}px;
        `
      : null};

  /* Remove Button-style */
  color: #666;
  border-bottom: 1px solid #eee;
  background: transparent;
  cursor: pointer;

  ${transition('background', 'color')};

  & img {
    transition: filter 100ms;
  }

  &:hover,
  &:focus {
    ${wrapperHighlighted};
  }

  ${p => (p.highlight ? wrapperHighlighted : null)};
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
  font-size: 16px;
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
