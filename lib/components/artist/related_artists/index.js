/* @flow */
'use strict'

import Relay from 'react-relay'
import React from 'react'
import { StyleSheet, View, Dimensions } from 'react-native'

import SerifText from '../../text/serif'
import RelatedArtist from './related_artist'

class RelatedArtists extends React.Component {
  state: {
    columns: number,
    imageSize: Object;
  };

  constructor(props) {
    super(props)
    this.state = this.layoutState()
  }

  layoutState() : Object {
    const width = Dimensions.get('window').width
    const isPad = width > 700
    const isPadHorizontal = width > 1000

    // TODO: Document what these margins are based on.
    let columnCount
    let margins
    if (isPad) {
      if (isPadHorizontal) {
        columnCount = 4
        margins = 140
      } else {
        columnCount = 3
        margins = 100
      }
    } else {
      columnCount = 2
      margins = 60
    }

    const imageWidth = (width - margins) / columnCount
    const imageHeight = imageWidth / 1.5

    return {
      columns: columnCount,
      imageSize: {
        width: Math.floor(imageWidth),
        height: Math.floor(imageHeight),
      },
    }
  }

  onLayout = (e) => {
    const newLayoutState = this.layoutState()
    if (this.state.columns !== newLayoutState.columns) {
      this.setState(newLayoutState)
    }
  }

  render() {
    return (
      <View style={styles.container} onLayout={this.onLayout}>
        <SerifText style={styles.heading}>Related Artists</SerifText>
        <View style={styles.artistContainer}>
          { this.renderArtists() }
        </View>
      </View>
    )
  }

  renderArtists() {
    const artists = this.props.artists
    const artistViews = artists.map(artist => {
      return <RelatedArtist key={artist.__id} artist={artist} imageSize={this.state.imageSize} />
    })

    const numberOfTrailingViews = artists.length % this.state.columns
    if (numberOfTrailingViews > 0) {
      const extraRequiredViews = this.state.columns - numberOfTrailingViews
      for (let i = 0; i < extraRequiredViews; i++) {
        artistViews.push(<View key={'related-artist-spacer-' + i} style={this.state.imageSize} />)
      }
    }

    return artistViews
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
  },
  artistContainer: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-around',
    marginTop: 12,
    marginLeft: -10,
    marginRight: -10,
  },
  heading: {
    fontSize: 20,
  }
})

export default Relay.createContainer(RelatedArtists, {
  fragments: {
    artists: () => Relay.QL`
      fragment on Artist @relay(plural: true) {
        __id
        ${RelatedArtist.getFragment('artist')}
      }
    `
  }
})
