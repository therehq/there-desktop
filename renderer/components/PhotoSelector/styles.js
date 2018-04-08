import styled, { keyframes } from 'styled-components'
import Dropzone from 'react-dropzone'

// Local
import Image from '../../vectors/Image'

export const StyledDropZone = styled(Dropzone)`
  cursor: pointer;
`

const beap = keyframes`
  from { opacity: 1; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(0.8); }
  to { opacity: 1; transform: scale(1); }
`

export const Loading = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 20px;
  background: white;
  animation: ${beap} 1s infinite ease;
`

export const Overlay = styled.span`
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  background: ${p => (p.light ? `transparent` : `rgba(0, 0, 0, 0.3)`)};
  color: white;
  opacity: ${p => (p.visible ? 1 : 0)};
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 150ms ease;
`

export const Photo = styled.div`
  --size: ${p => p.theme.sizes.photoSelector}px;

  position: relative;
  width: var(--size);
  height: var(--size);
  overflow: hidden;

  object-fit: cover;
  background: linear-gradient(45deg, #eee 0%, #f7f7f7 100%);
  border-radius: var(--size);

  img {
    display: block;
    width: var(--size);
    height: var(--size);
  }

  &:hover {
    ${Overlay} {
      opacity: 1;
    }
  }
`

export const BlackImage = styled(Image)`
  path {
    fill: #999;
  }
`

export const WhiteImage = styled(Image)`
  path {
    fill: white;
  }
`

// Helpers for forms
export const PhotoOptions = styled.div`
  width: ${p => p.theme.sizes.photoSelector}px;
  margin-top: 5px;
  display: flex;
  align-items: stretch;
  justify-content: center;
`

export const PhotoBtn = styled.button`
  display: block;
  line-height: 1;
  padding: 4px 0 5px 0;
  width: 21px;
  text-align: center;
  background: transparent;
  transition: all 150ms ease;
  border: none;
  cursor: pointer;
  margin-left: 3px;
  border-radius: 3px;

  &:first-child {
    margin-left: 0;
  }

  svg {
    vertical-align: middle;
    path {
      fill: #aaa;
    }
  }

  &:hover {
    background: #e5e5e5;
  }
`
