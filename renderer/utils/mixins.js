import { css } from 'styled-components'

export const truncate = css`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const transition = (...props) => css`
  transition: ${props.join(` 100ms ease-out, `)} 100ms ease-out;
`
