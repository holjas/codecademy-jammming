import React from "react";
import "./App.css";
import SearchBar from "../SearchBar/SearchBar";
import SearchResults from "../SearchResults/SearchResults";
import Playlist from "../Playlist/Playlist";
import Spotify from "../../util/Spotify";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],
      // {
      //   name: "person name1",
      //   artist: "artist name1",
      //   album: "album name1",
      //   id: "id name1",
      // },

      playlistName: "Playlist Name",
      playlistTracks: [],
      // {
      //   name: "playlist name1",
      //   artist: "playlist artist1",
      //   album: "playlist album1",
      //   id: "playlist id1",
      // },
      // {
      //   name: "playlist name2",
      //   artist: "playlist artist2",
      //   album: "playlist album2",
      //   id: "playlist id2",
      // },
    };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  addTrack(track) {
    let newList = this.state.playlistTracks;
    if (newList.find((newTrack) => newTrack.id === track.id)) {
      return;
    }
    newList.push(track);
    this.setState({ playlistTracks: newList });
  }

  removeTrack(track) {
    let newList = this.state.playlistTracks;
    newList = newList.filter((item) => item.id !== track.id);
    this.setState({ playlistTracks: newList });
  }

  updatePlaylistName(name) {
    this.setState({ playlistName: name });
  }

  savePlaylist() {
    const trackURIs = this.state.playlistTracks.map((track) => track.uri);
    Spotify.savePlaylist(this.state.playlistName, trackURIs);
    this.setState({ playlistName: "New Playlist", playlistTracks: [] });
  }

  search(term) {
    Spotify.search(term).then((items) => {
      this.setState({ searchResults: items });
    });
    console.log(term);
  }

  render() {
    return (
      <div>
        <h1>
          Ja<span className="highlight">mmm</span>ing
        </h1>
        <div className="App">
          {/* <!-- Add a SearchBar component --> */}
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            {/* <!-- Add a SearchResults component --> */}
            <SearchResults
              searchResults={this.state.searchResults}
              onAdd={this.addTrack}
            />

            {/* <!-- Add a Playlist component --> */}
            <Playlist
              playlistName={this.state.playlistName}
              playlistTracks={this.state.playlistTracks}
              onRemove={this.removeTrack}
              onNameChange={this.updatePlaylistName}
              onSave={this.savePlaylist}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
