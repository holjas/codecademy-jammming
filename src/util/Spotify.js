let userAccessToken;
const clientId = ""; //see .gitignore
const redirectURI = "http://localhost:3000/";

const Spotify = {
  getAccessToken() {
    if (userAccessToken) {
      return userAccessToken;
    }
    // if the access token is not already set...
    const tokenAccess = window.location.href.match(/access_token=([^&]*)/);
    const tokenExpires = window.location.href.match(/expires_in=([^&]*)/);

    if (tokenAccess && tokenExpires) {
      userAccessToken = tokenAccess[1];
      const tokenExpiresNumber = Number(tokenExpires[1]);
      window.setTimeout(
        () => (userAccessToken = ""),
        tokenExpiresNumber * 1000
      );
      window.history.pushState("Access Token", null, "/");
      return userAccessToken;
    } else {
      const accessURL = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
      window.location = accessURL;
    }
  },

  search(term) {
    const accessToken = Spotify.getAccessToken();
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((jsonResponse) => {
        if (!jsonResponse.tracks) {
          return [];
        }
        return jsonResponse.tracks.items.map((item) => ({
          id: item.id,
          name: item.name,
          artist: item.artists[0].name,
          album: item.album.name,
          uri: item.uri,
        }));
      });
  },

  savePlaylist(name, trackURI) {
    if (!name || !trackURI.length) {
      return;
    }
    const accessToken = Spotify.getAccessToken();
    const headers = { Authorization: `Bearer ${accessToken}` };
    let userId;
    return fetch("https://api.spotify.com/v1/me", { headers: headers })
      .then((response) => response.json())
      .then((jsonResponse) => {
        userId = jsonResponse.id;
        return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
          headers: headers,
          method: "POST",
          body: JSON.stringify({ name: name }),
        })
          .then((response) => response.json())
          .then((jsonResponse) => {
            const playlistId = jsonResponse.id;
            return fetch(
              `https://api.spotify.com//v1/users/${userId}/playlists/${playlistId}/tracks`,
              {
                headers: headers,
                method: "POST",
                body: JSON.stringify({ uris: trackURI }),
              }
            );
          });
      });
  },
};

export default Spotify;
