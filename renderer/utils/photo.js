import config from '../../config'

export const getPhotoUrl = (
  { photoUrl, photoCloudObject, twitterHandle, countryFlagIcon },
  returnType = false
) => {
  let derivedPhotoUrl = null
  let type = null

  if (twitterHandle && twitterHandle.trim()) {
    // Use Twitter avatar
    derivedPhotoUrl = `${config.restEndpoint}/twivatar/${twitterHandle}`
    type = 'twitter'
  } else if (photoCloudObject) {
    // Use the bucket URL from Google Cloud Storage
    derivedPhotoUrl = `${config.googleCloudStorage}/${photoCloudObject}`
    type = 'cloud'
  } else if (photoUrl) {
    derivedPhotoUrl = photoUrl
    type = 'none'
  } else if (countryFlagIcon) {
    derivedPhotoUrl = countryFlagIcon
    type = 'flag'
  }

  return returnType ? [type, derivedPhotoUrl] : derivedPhotoUrl
}
