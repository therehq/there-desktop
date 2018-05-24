import config from '../../config'

export const getPhotoUrl = ({ photoUrl, photoCloudObject, twitterHandle }) => {
  if (twitterHandle && twitterHandle.trim()) {
    // Use Twitter avatar
    return `${config.restEndpoint}/twivatar/${twitterHandle}`
  } else if (photoCloudObject) {
    // Use the bucket URL from Google Cloud Storage
    return `${config.googleCloudStorage}/${photoCloudObject}`
  }

  return photoUrl
}
