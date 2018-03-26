import Document, { Head, Main, NextScript } from 'next/document'
import { ServerStyleSheet, injectGlobal } from 'styled-components'

// Local
import { configRaven } from '../utils/errorHandlers'
import theme from '../utils/styles/theme'

// Styles
import globalStyles from '../utils/styles/globalStyles'

injectGlobal`
  ${globalStyles}

  /**
  * wenk - Lightweight tooltip for the greater good
  * @link https://tiaanduplessis.github.io/wenk/
  * @license MIT
  */
  [data-wenk]{position:relative}
  [data-wenk]:after {
    position: absolute;
    font-size: 12px;
    border-radius: 0.4rem;
    content: attr(data-wenk);
    padding: 8px 11px;
    padding: 0.5rem 0.67rem;
    background-color: hsla(0, 5%, 7%, 0.8);
    -webkit-box-shadow: 0 0 14px rgba(0, 0, 0, 0.1);
    box-shadow: 0 0 14px rgba(0, 0, 0, 0.1);
    color: #fff;
    line-height: 18px;
    line-height: 1.2rem;
    text-align: left;
    z-index: 1;
    pointer-events: none;
    display: block;
    visibility: hidden;
    -webkit-transition: all 0.3s;
    transition: all 0.3s;
    bottom: 100%;
    left: 50%;
    -webkit-transform: translate(-50%, 10px);
    transform: translate(-50%, 10px);
    white-space: pre;
    width: auto;
    opacity: 0;
  }
  [data-wenk-dark]::after {
    background: ${theme.colors.lighter};
    color: ${theme.colors.lightText};
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.18);
  }
  [data-wenk]:hover{overflow:visible}[data-wenk]:hover:after{display:block;opacity:1;visibility:visible;-webkit-transform:translate(-50%,-10px);transform:translate(-50%,-10px)}[data-wenk].wenk--bottom:after,[data-wenk][data-wenk-pos=bottom]:after{bottom:auto;top:100%;left:50%;-webkit-transform:translate(-50%,-10px);transform:translate(-50%,-10px)}[data-wenk].wenk--bottom:hover:after,[data-wenk][data-wenk-pos=bottom]:hover:after{-webkit-transform:translate(-50%,10px);transform:translate(-50%,10px)}[data-wenk].wenk--left:after,[data-wenk][data-wenk-pos=left]:after{bottom:auto;left:auto;top:50%;right:100%;-webkit-transform:translate(10px,-50%);transform:translate(10px,-50%)}[data-wenk].wenk--left:hover:after,[data-wenk].wenk--right:after,[data-wenk][data-wenk-pos=left]:hover:after,[data-wenk][data-wenk-pos=right]:after{-webkit-transform:translate(-10px,-50%);transform:translate(-10px,-50%)}[data-wenk].wenk--right:after,[data-wenk][data-wenk-pos=right]:after{bottom:auto;top:50%;left:100%}[data-wenk].wenk--right:hover:after,[data-wenk][data-wenk-pos=right]:hover:after{-webkit-transform:translate(10px,-50%);transform:translate(10px,-50%)}[data-wenk].wenk-length--small:after,[data-wenk][data-wenk-length=small]:after{white-space:normal;width:80px}[data-wenk].wenk-length--medium:after,[data-wenk][data-wenk-length=medium]:after{white-space:normal;width:150px}[data-wenk].wenk-length--large:after,[data-wenk][data-wenk-length=large]:after{white-space:normal;width:260px}[data-wenk].wenk-length--fit:after,[data-wenk][data-wenk-length=fit]:after{white-space:normal;width:100%}[data-wenk].wenk-align--right:after,[data-wenk][data-wenk-align=right]:after{text-align:right}[data-wenk].wenk-align--center:after,[data-wenk][data-wenk-align=center]:after{text-align:center}[data-wenk=""]:after{visibility:hidden!important}
`

// Setup Raven
configRaven()

export default class MyDocument extends Document {
  static getInitialProps({ renderPage }) {
    const sheet = new ServerStyleSheet()
    const page = renderPage(App => props =>
      sheet.collectStyles(<App {...props} />)
    )
    const styleTags = sheet.getStyleElement()
    return { ...page, styleTags }
  }

  render() {
    return (
      <html>
        <Head>
          <title>There</title>

          {/* <link rel="stylesheet" href="/_next/static/style.css" /> */}
          {this.props.styleTags}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    )
  }
}
