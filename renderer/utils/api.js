// Utilities
import config from '../../config'
import { getToken } from '../utils/store'

export const getHeaders = contentType => {
  const headers = {}

  if (contentType) {
    headers['Content-type'] = contentType
  }

  // Set authorization token if authorized
  const token = getToken()
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  return headers
}

export const uploadManualPhotoFile = async file => {
  const body = new FormData()
  body.append('photo', file)

  return await fetch(`${config.apiUrl}/rest/upload-manual-photo`, {
    headers: getHeaders(),
    method: 'post',
    body,
  })
}

export const loginByEmail = async (email, socketId) => {
  const body = JSON.stringify({ email, socketId })

  return await fetch(`${config.apiUrl}/auth/email`, {
    headers: getHeaders('application/json'),
    method: 'post',
    body,
  })
}

export const loginAnonymously = async () => {
  return await fetch(`${config.apiUrl}/auth/anonymous`, {
    headers: getHeaders('application/json'),
    method: 'post',
  })
}
