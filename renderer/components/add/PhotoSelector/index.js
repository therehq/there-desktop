import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

// Local
import {
  StyledDropZone,
  Photo,
  Overlay,
  Loading,
  BlackImage,
  WhiteImage,
} from './styles'

export default class PhotoSelector extends PureComponent {
  static propTypes = {
    photoUrl: PropTypes.string,
    uploading: PropTypes.bool,
    onAccept: PropTypes.func,
    onError: PropTypes.func,
  }

  static defaultProps = {
    onAccept: () => {},
    onError: () => {},
  }

  accept = 'image/jpeg,image/png,image/gif'

  render() {
    const { photoUrl, uploading } = this.props

    return (
      <StyledDropZone
        multiple={false}
        accept={this.accept}
        maxSize={2048 * 1024}
        style={{}}
        onDrop={this.dropped}
      >
        <Photo>
          {photoUrl && <img src={photoUrl} />}
          <Overlay
            visible={uploading || !photoUrl}
            light={!photoUrl && !uploading}
          >
            {uploading ? (
              <Loading />
            ) : !photoUrl ? (
              <BlackImage />
            ) : (
              <WhiteImage />
            )}
          </Overlay>
        </Photo>
      </StyledDropZone>
    )
  }

  dropped = acceptedFiles => {
    if (acceptedFiles.length === 0) {
      return
    }

    const photoFile = acceptedFiles[0]
    this.props.onError('')
    this.props.onAccept(photoFile)
  }
}
