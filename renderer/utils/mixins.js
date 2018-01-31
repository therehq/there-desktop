import { css } from 'styled-components'

export const truncate = css`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const transition = (...props) => css`
  transition: ${props.map((p, i) => {
    let propTransition = `${p} 90ms ease-out, `

    if (i === props.length - 1) {
      propTransition = propTransition.split(',')[0]
    }

    return propTransition
  })};
`
