import React from 'react'
import styled from 'styled-components'

const TinyButton = props => <Wrapper {...props} />

export default TinyButton

const height = '25px'
const textColor = p =>
  p.primary ? p.theme.colors.lightText : p.theme.colors.lightMutedText
const background = p => (p.primary ? 'rgba(255, 255, 255, 0.1)' : 'transparent')

const Wrapper = styled.button`
  display: inline-block;
  height: ${height};
  line-height: ${height};
  padding: 0 7px;
  box-sizing: border-box;
  font-size: 13px;

  border: none;
  outline: none;
  cursor: pointer;
  border-radius: 3px;
  background: ${background};
  color: ${textColor};
  transition: transform 80ms, color 80ms, background 100ms ease-out;

  &:hover,
  &:focus {
    background: rgba(255, 255, 255, 0.2);
    color: ${p => p.theme.colors.lightText};
  }

  &:active {
    background: rgba(255, 255, 255, 0.15);
    transform: scale(0.97);
  }
`
