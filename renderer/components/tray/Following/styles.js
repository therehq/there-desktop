import styled, { css, keyframes } from 'styled-components'

export const height = p => p.theme.sizes.followingHeight
const photoSize = 42
const firstLineFontSize = 18
const firstLineHeight = 21
const secondLineFontSize = 12

// Photo
export const Photo = styled.div`
  flex: 0 1 ${photoSize}px;
  width: ${photoSize}px;
  height: ${photoSize}px;
  margin-left: ${p => p.theme.sizes.sidePadding}px;
  margin-right: ${p => p.theme.sizes.sidePadding}px;
  background: linear-gradient(
    45deg,
    ${p => p.theme.colors.light} 0%,
    ${p => p.theme.colors.lighter} 100%
  );
  border-radius: ${photoSize / 2}px;
  overflow: hidden;
  align-self: center;
  transition: filter 100ms ease;
`

export const PhotoImage = styled.img`
  display: block;
  max-height: ${photoSize}px;
  border-radius: ${photoSize / 2}px;
  width: auto;
`

export const Flag = styled.div`
  height: ${photoSize}px;
  width: ${photoSize}px;
  font-size: 1.3em;
  line-height: 1;
  opacity: 0.8;

  /* Position center */
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 2px;
`

// OffsetWrapper
export const OffsetWrapper = styled.span`
  visibility: hidden;
  opacity: 0;
  transition: 30ms ease-out;
`

// Wrapper
export const Wrapper = styled.div`
  flex: 0 1 auto;
  min-height: ${height}px;
  height: ${height}px;
  display: flex;
  overflow: hidden; /* for safety, to not leak elements into whole UI */
  background: transparent;
  transition: background 80ms ease-out, box-shadow 100ms ease-out,
    border-bottom 80ms;
  -webkit-app-region: no-drag;

  &:hover {
    background: ${p => p.theme.colors.light};

    ${Photo} {
      filter: brightness(1.1) contrast(1.1);
    }

    ${OffsetWrapper} {
      visibility: visible;
      opacity: 1;
    }
  }

  &:focus {
    outline: none;
  }

  &,
  * {
    cursor: ${p =>
      p.sortMode || p.floatingBoxStyle ? '-webkit-grab' : 'default'};
  }

  ${p =>
    p.floatingBoxStyle &&
    css`
      border-radius: 2px;
      background: ${p.theme.colors.light};
      box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1),
        inset 0 0 0 1px ${p.theme.colors.lighter};
    `};
`

// Info
export const Info = styled.div`
  flex: 1 1 auto;
  padding-right: ${p => p.theme.sizes.sidePadding}px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  border-bottom: 1px solid
    ${p => (!p.noBorder ? p.theme.colors.lighter : 'transparent')};
`

export const Start = styled.div``

export const End = styled.div`
  text-align: right;
`

export const Name = styled.div`
  font-size: ${firstLineFontSize - 2}px;
  vertical-align: bottom;
  line-height: ${firstLineHeight}px;
  text-align: right;
  color: ${p => p.theme.colors.lightText};
`

export const Time = styled.div`
  font-size: ${firstLineFontSize}px;
  line-height: ${firstLineHeight}px;
  color: ${p => p.theme.colors.lightText};
  font-variant-numeric: tabular-nums;
`

export const Hour = styled.span`
  font-weight: 600;
  letter-spacing: 0.5px;
  color: white;
`

export const fadeIn = keyframes`
  0% { opacity: 0.3; }
  100% { opacity: 1; }
`

export const fadeOut = keyframes`
  0% { opacity: 1; }
  100% { opacity: 0.3; }
`

export const Minute = styled.span`
  font-weight: normal;
  color: ${p => p.theme.colors.lightText};

  ${p =>
    p.animation &&
    css`
      animation: ${p.animation} 100ms ease;
    `};
`

export const AmPm = styled.span`
  font-weight: 500;
  font-size: 11px;
  margin-left: 4px;
  letter-spacing: 1px;
  color: ${p => p.theme.colors.lightText};
`

export const Separator = styled.span`
  display: inline-block;
  vertical-align: middle;

  width: 4px;
  height: 4px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.15);
`

export const secondLineStyles = css`
  font-size: ${secondLineFontSize}px;
  color: ${p => p.theme.colors.lightMutedText};
`

export const ExtraTime = styled.div`
  ${secondLineStyles};
`

export const City = styled.div`
  ${secondLineStyles};
`

export const Empty = styled.div``
