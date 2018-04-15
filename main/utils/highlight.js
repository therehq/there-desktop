const states = {
  hide: false,
  close: false,
  show: true,
  minimize: false,
  restore: true,
  focus: true,
}

const windowLeft = () => {
  const windows = global.windows

  if (!windows) {
    return false
  }

  if (windows.main && windows.main.isVisible()) {
    return true
  }

  return false
}

module.exports = (win, tray, key) => {
  if (!tray) {
    return
  }

  for (const state in states) {
    if (!{}.hasOwnProperty.call(states, state)) {
      return
    }

    const highlighted = states[state]

    win.on(state, () => {
      // Don't toggle highlighting if one window is still open
      if (windowLeft(win)) {
        return
      }

      // Highlight the tray or don't
      tray.setHighlightMode(highlighted ? 'always' : 'selection')
    })
  }

  win.on('close', event => {
    if (key) {
      global.windows[key] = null
    } else {
      event.preventDefault()
      win.hide()
    }
  })
}
