import React, { Component } from 'react';

class Gif extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loaded: false
    }
  }

  render() {
    // const images = this.props.images
    const {images} = this.props;
    const {loaded} = this.state;
    return (
      <video
        // when we have the loaded state as true, we add a loaded class
        className={`grid-item video ${loaded && 'loaded'}`}
        autoPlay
        loop
        src={images.original.mp4}
        // when video loads we set the loaded state to be true.
        onLoadedData={() => this.setState({loaded: true})}
      />
    );
  }
}

export default Gif;