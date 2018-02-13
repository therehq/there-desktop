import Raven from 'raven-js'

export const configRaven = () => {
  Raven.config(process.env.SENTRY_DSN).install()
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
