import React from 'react'
import styled from 'styled-components'

const AreaSeparator = ({ area = 'Europe', ...rest }) => (
  <Wrapper {...rest}>{area}</Wrapper>
)
export default AreaSeparator

export const height = 22

const Wrapper = styled.div`
  height: ${height}px;
  margin-top: 10px;
  padding: 0 ${p => p.theme.sizes.sidePadding}px;
  overflow: hidden; /* for safety, to not leak elements into whole UI */
  font-size: ${p => p.theme.sizes.fontSizeTiny}px;
  line-height: ${height}px;

  /* background: rgba(255, 255, 255, 0.05); */
  color: ${p => p.theme.colors.lightMutedText};
`
