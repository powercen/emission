/* @flow */
'use strict'

import Relay from 'react-relay'
import React from 'react'
import { View, StyleSheet } from 'react-native'

import Biography from './biography'
import Articles from './articles'
import RelatedArtists from './related_artists'
import Separator from '../separator'

class About extends React.Component {
  render() {
    return (
      <View>
        { this.biography() }
        { this.articles() }
        { this.relatedArtists() }
      </View>
    )
  }

  biography() {
    if (this.props.artist.has_metadata) {
      return (
        <View>
          <Biography artist={this.props.artist} />
          <Separator style={styles.sectionSeparator} />
        </View>
      )
    }
  }

  relatedArtists() {
    return this.props.artist.related_artists.length ? <RelatedArtists artists={this.props.artist.related_artists}/> : null
  }

  articles() {
    if (this.props.artist.articles.length) {
      return (
        <View>
          <Articles articles={this.props.artist.articles} />
          <Separator style={styles.sectionSeparator} />
        </View>
      )
    }
  }
}

const styles = StyleSheet.create({
  sectionSeparator: {
    marginBottom: 20,
  }
})

export default Relay.createContainer(About, {
  fragments: {
    artist: () => Relay.QL`
      fragment on Artist {
        has_metadata
        ${Biography.getFragment('artist')}
        related_artists: artists(size: 16) {
          ${RelatedArtists.getFragment('artists')}
        }
        articles {
          ${Articles.getFragment('articles')}
        }
      }
    `,
  }
})
