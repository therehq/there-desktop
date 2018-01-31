import { css } from 'styled-components'

export default css`
  html,
  body {
    padding: 0;
    margin: 0;
    height: 100%;
    width: 100%;
    font-family: caption, 'system-ui', 'Segoe UI', Roboto, Ubuntu, Helvetica,
      Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji',
      'Segoe UI Symbol';
    overflow: hidden;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  *,
  *:before,
  *:after {
    box-sizing: border-box;
  }

  div,
  img,
  button {
    user-drag: none;
    user-select: none;
    cursor: default;
  }

  ::selection {
    background: black;
    color: white;
  }

  #__next,
  [data-reactroot] {
    height: 100%;
  }

  a[href^="http://"],
  a[href^="https://"],
  a[href^="ftp://"] {
    -webkit-user-drag: auto;
  }

  input[type='submit'],
  input[type='reset'],
  input[type='button'],
  input[type='text'],
  button,
  textarea,
  a {
    -webkit-app-region: no-drag;
  }
`
