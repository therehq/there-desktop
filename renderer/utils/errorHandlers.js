import Raven from 'raven-js'
import config from '../../config'

export const configRaven = () => {
  Raven.config(config.sentryDSN).install()
}

/**
 *
 * @param {Function} children
 */
export const asyncErrorHandler = children => (...args) => {
  try {
    return children(...args)
  } catch (e) {
    Raven.captureException(e)
    console.error(e)
    return
  }
}

export const capture = Raven.captureException
