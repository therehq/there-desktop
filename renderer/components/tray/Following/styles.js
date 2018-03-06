import styled, { css } from 'styled-components'

export const height = 55
const photoSize = 42
const firstLineFontSize = 18
const secondLineFontSize = 12

export const Wrapper = styled.div`
  flex: 0 1 auto;
  min-height: ${height}px;
  height: ${height}px;
  display: flex;
  overflow: hidden; /* for safety, to not leak elements into whole UI */
  background: transparent;
  color: white;

  transition: background 80ms ease-out;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }
`

// Photo
export const Photo = styled.div`
  flex: 0 1 auto;
  width: ${photoSize}px;
  height: ${photoSize}px;
  margin-left: ${p => p.theme.sizes.sidePadding}px;
  margin-right: ${p => p.theme.sizes.sidePadding}px;
  border-radius: ${photoSize / 2}px;
  overflow: hidden;
  align-self: center;
`

export const PhotoImage = styled.img`
  display: block;
  max-height: ${photoSize}px;
  width: auto;
`

// Info
export const Info = styled.div`
  flex: 1 1 auto;
  padding-right: ${p => p.theme.sizes.sidePadding}px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  border-bottom: ${p =>
    !p.noBorder ? `1px solid ${p.theme.colors.lighter}` : 'none'};
`

export const Start = styled.div``

export const End = styled.div`
  text-align: right;
`

export const Name = styled.div`
  font-size: ${firstLineFontSize}px;
  text-align: right;
  color: ${p => p.theme.colors.lightText};
`

export const Time = styled.div`
  font-size: ${firstLineFontSize}px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
`

export const Minute = styled.span`
  font-weight: normal;
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
