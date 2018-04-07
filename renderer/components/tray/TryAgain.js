// Local
import Banner from './Banner'
import Title from './Title'
import Desc from './Desc'
import TinyButton from '../TinyButton'

export default ({ onTryAgainClick, onHelpClick }) => (
  <Banner>
    <Title>Couldn't load! 😣</Title>
    <Desc>
      It might be a problem from our side, or your network. <br />
    </Desc>

    <div style={{ marginTop: 20 }}>
      <TinyButton primary={true} onClick={onTryAgainClick}>
        📡 Try Again
      </TinyButton>
      <TinyButton
        style={{ marginLeft: 7 }}
        primary={false}
        onClick={onHelpClick}
      >
        💬 Help
      </TinyButton>
    </div>
  </Banner>
)
