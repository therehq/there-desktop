import { css } from 'styled-components'

export const truncate = css`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const transition = (...props) => css`
  transition: ${props.join(` 150ms ease, `)} 100ms ease;
`
