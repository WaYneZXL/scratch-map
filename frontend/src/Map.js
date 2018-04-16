import React from 'react';
import ReactDOM from 'react-dom'
// import Marker from './Marker';
// var MarkerClusterer = require('node-js-marker-clusterer');
// import {GoogleApiWrapper} from 'google-maps-react';


const style = {
  width: '90vw',
  height: '75vh'
}

const locations = [
    { user: "Chris", name: "Yale School of Management", position: {lat: 41.315128, lng: -72.920231}, review: "Yale SOM rocks" },
    { user: "Ed", name: "Yale Law School", position: {lat: 41.3120, lng: -72.9281}, review: "This is Yale Law School" },
    { user: "Xiaolong", name: "Yale School of Medicine", position: {lat: 41.3032, lng:  -72.9338}, review: "This is Yale School of Madicine"},
    { user: "Khubaib", name: "Frank Pepe Pizza", position: {lat: 41.302988, lng:  -72.916942}, review: "I love Frank Pepe!"},
    { user: "Kyle", name: "Union Station", position: {lat: 41.297550, lng:  -72.926629}, review: "It's super convenient to go to New York"},
  ]

// // a helper function to
// const camelize = function(str) {
//   return str.split(' ').map(function(word){
//     return word.charAt(0).toUpperCase() + word.slice(1);
//   }).join('');
// }
// // camelize('i love you'); // ILoveYou
// // camelize('say hello'); // SayHello
//
// const evtNames = ['ready', 'click', 'dragend'];

export class Map extends React.Component {
  // initiate state
  constructor(props) {
    super(props);
    const {lat, lng} = this.props.initialCenter;
    this.state = {
      currentLocation: {
        lat: lat,
        lng: lng
      }
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.google !== this.props.google) {
      this.loadMap();
    }
    // if map not centered
    if (prevState.currentLocation !== this.state.currentLocation) {
      this.recenterMap();
    }
  }

  componentDidMount() {
  // check if we should use current location
    if (this.props.centerAroundCurrentLocation) {
        if (navigator && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((pos) => {
                const coords = pos.coords;
                this.setState({
                    currentLocation: {
                        lat: coords.latitude,
                        lng: coords.longitude
                    }
                })
            })
        }
    }
  this.loadMap();
  }

  recenterMap() {
    const map = this.map;
    const curr = this.state.currentLocation;

    const google = this.props.google;
    const maps = google.maps;

    if (map) {
        let center = new maps.LatLng(curr.lat, curr.lng)
        map.panTo(center)
    }
  }

  loadMap() {
    if (this.props && this.props.google) {
      // google is available
      const {google} = this.props;
      const maps = google.maps;

      const mapRef = this.refs.map;
      const node = ReactDOM.findDOMNode(mapRef);

      // use propstyes to define center and zoom
      let {initialCenter, zoom} = this.props;
      const {lat, lng} = this.state.currentLocation;
      const center = new maps.LatLng(lat, lng);
      const mapConfig = Object.assign({}, {
        center: center,
        zoom: zoom
      })
      this.map = new maps.Map(node, mapConfig);

      // event handeler
      // evtNames.forEach(e => {
      //   this.map.addListener(e, this.handleEvent(e));
      // })
      // maps.event.trigger(this.map, 'ready');

      let map = this.map
      locations.forEach( location => {
        var marker = new google.maps.Marker({
          position: {lat: location.position.lat, lng: location.position.lng},
          map: map,
          title: location.name,
          animation: google.maps.Animation.DROP,
        });
        var commentString = location.user + ": " + location.review
        var infowindow = new google.maps.InfoWindow({
          content: commentString
        });

        // var markers = [
        //     {lat: 41.315128, lng: -72.920231},
        //     {lat: 41.3120, lng: -72.9281},
        //     {lat: 41.3032, lng:  -72.9338},
        //   ]
        // var markerCluster = new MarkerClusterer(map, markers, {imagePath: 'https://raw.githubusercontent.com/googlemaps/v3-utility-library/master/markerclusterer/images/m1.png'});

        marker.addListener('click', function() {
          infowindow.open(map, marker);
        });
        marker.setMap(map);
      })
    }
  }

  // handle events
  // handleEvent(evtName) {
  //   let timeout;
  //   const handlerName = `on${camelize(evtName)}`;
  //
  //   return (e) => {
  //     if (timeout) {
  //       clearTimeout(timeout);
  //       timeout = null;
  //     }
  //     timeout = setTimeout(() => {
  //       if (this.props[handlerName]) {
  //         this.props[handlerName](this.props, this.map, e);
  //       }
  //     }, 0);
  //   }
  // }

  // Cloning the props of parent to children components
  // renderChildren() {
  //   const {children} = this.props;
  //   if (!children) return;
  //   return React.Children.map(children, c => {
  //     return React.cloneElement(c, {
  //       map: this.map,
  //       google: this.props.google,
  //       mapCenter: this.state.currentLocation
  //     });
  //   })
  // }

  render() {
    return (
      <div ref='map' style={style}>
        Loading map...
      </div>
    )
  }
}

Map.propTypes = {
  google: React.PropTypes.object,
  zoom: React.PropTypes.number,
  initialCenter: React.PropTypes.object,
  centerAroundCurrentLocation: React.PropTypes.bool,
  // onMove: React.PropTypes.func
}

Map.defaultProps = {
  zoom: 13,
  // New Haven, by default
  initialCenter: {
    lat: 41.3083,
    lng: -72.9279
  },
  centerAroundCurrentLocation: false,
}

export default Map
