import React from 'react';
import ReactDOM from 'react-dom'

const evtNames = ['click', 'mouseover'];
//create marker component
export class Marker extends React.Component {
  componentDidUpdate(prevProps) {
// The relevant props have changed
    if ((this.props.map !== prevProps.map) ||
      (this.props.position !== prevProps.position)) {
        this.renderMarker();
    }
  }

  componentWillUnmount() {
    if (this.marker) {
      this.marker.setMap(null);
    }
  }

  renderMarker() {
    //If no position is passed, we'll use the mapCenter
    let {
      map, google, position, mapCenter
    } = this.props;
    let pos = position || mapCenter;
    position = new google.maps.LatLng(pos.lat, pos.lng);
    const pref = {
      map: map,
      position: position
    };
    this.marker = new google.maps.Marker(pref);

    evtNames.forEach(e => {
      this.marker.addListener(e, this.handleEvent(e));
    })
  }

  handleEvent(evtName) {
    return (e) => {
      const handlerName = evtName
      if (this.props[handlerName]) {
        this.props[handlerName](this.props, this.marker, e);
      }
    }
  }

  render() {
    return null;
  }
}

Marker.propTypes = {
  position: React.PropTypes.object,
  map: React.PropTypes.object
}

export default Marker
