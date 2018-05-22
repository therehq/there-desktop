import { css } from 'styled-components'

export const truncate = css`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const transition = (...props) => css`
  transition: ${props.join(` 170ms ease, `)} 170ms ease;
`
