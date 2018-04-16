import React from 'react';
// import ReactDOM from 'react-dom'
import {GoogleApiWrapper} from 'google-maps-react';
// import Marker from './Marker';
import Map from './Map';

// set default style as 90% width and 75% height
const style = {
  width: '90vw',
  height: '75vh'
}

export class Container extends React.Component {
  render() {
    if (!this.props.loaded) {
      return <div>loading</div>
    }
    return (
      <div style={style}>
        <Map google={this.props.google} />
      </div>
    )
  }
}

//export google api wrapper with my token
export default GoogleApiWrapper({
  apiKey: 'AIzaSyBqTDlCxBYbIfezq2NbOvNi1-nQBabnyOg',
})(Container)
