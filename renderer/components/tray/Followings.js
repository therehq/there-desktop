import React from 'react'

// Local
import Following from './Following'

class Followings extends React.Component {
  render() {
    return (
      <Following
        photo="/static/demo/profile-photo.jpg"
        timezone="GMT -3:30"
        firstName="Sara"
        lastName="Vieira"
        city="Vienna"
        fullLocation="Vienna, Austria"
        day="Tue"
        hour={3}
        minute={1}
      />
    )
  }
}

export default Followings
