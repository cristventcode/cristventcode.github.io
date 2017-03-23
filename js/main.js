$(document).ready(function () {
    // Declaring variables from element IDs
    var getButton = document.getElementById("get-artist"),
        albumList = document.getElementById("artist-list"),
        detailsList = document.getElementById("details-list"),
        clearButton = document.getElementById("clear-results"),
        searchName = document.getElementById("search-person"),
        detailsHolder = document.getElementById("details-holder"),
        albumsHolder = document.getElementById("albums-holder"),
        songList = document.getElementById("song-list"),
        currentAlbums = [];

    // Album constructor to create new album objects 
    var Album = function Album(artist, albumId, albumTitle, albumArtSmall, albumArtLarge, releaseDate, albumGenre, albumPrice, albumLink) {
        this.artist = artist;
        this.albumId = albumId;
        this.albumTitle = albumTitle;
        this.releaseDate = releaseDate;
        this.albumGenre = albumGenre;
        this.albumPrice = albumPrice;
        this.albumArtSmall = albumArtSmall;
        this.albumArtLarge = albumArtLarge;
        this.albumLink = albumLink;
        this.dataUri = "https://itunes.apple.com/lookup?id=" + this.albumId + "&entity=song&callback=?";
        this.songList = getSongs(this.dataUri);
    }

    // Accepts album URI to get JSON file with album song list. Returns song list as array.
    var getSongs = function getSongs(dataUri) {
        var allSongs = [];
        $.getJSON(dataUri, function (returnData) {
            var dataList = returnData.results;
            dataList.forEach(function (song) {
                allSongs.push(song.trackName);
            });
        });
        return allSongs;
    };

    // Render content for albums-holder and get objects ready for array push.
    // Accepts JSON response data
    var renderList = function (eventData) {
        //Clear and hide holder. Ready incase of new artist search
        albumsHolder.classList.remove("hidden");
        albumList.innerText = " ";

        // Report back when reponse is empty
        if (!eventData) {
            console.log("Error: No data passed to renderList method");
            alert("Didnt find any Artists");
            return false;
        }
        eventData.forEach(function (event) {
            if (event.collectionName !== undefined) {
                // Filters album releaseDate data. New date is yyyy/mm/dd
                var getDate = event.releaseDate;
                event.releaseDate = getDate.substring(0, getDate.lastIndexOf('T'));

                // Filling array. Use Albums constructor to create new album object
                currentAlbums.push(new Album(event.artistName, event.collectionId, event.collectionName, event.artworkUrl60,
                    event.artworkUrl100, event.releaseDate, event.primaryGenreName, event.collectionPrice, event.collectionViewUrl));

                // Create list and anchor elements
                var newItem = document.createElement("li"),
                    newAnchor = document.createElement("a");

                // Fill created elements and append to album-list on page.
                newItem.classList.add("list-group-item");
                newAnchor.id = event.collectionId;
                newAnchor.addEventListener("click", showDetails);
                newAnchor.innerText = event.collectionName;
                newItem.appendChild(newAnchor);
                albumList.appendChild(newItem);
            };
        });

        // Show album-list holder after filling elements
        albumList.style.display = "block";
    };

    // On album name click
    // Album details displayed in details-holder 
    var showDetails = function showDetails(clicked) {
        var albumArt = document.getElementById("details-album-art"),
            artist = document.getElementById("details-artist"),
            album = document.getElementById("details-album"),
            releaseDate = document.getElementById("details-release"),
            genre = document.getElementById("details-genre"),
            price = document.getElementById("details-price"),
            songList = document.getElementById("song-list"),
            buynowLink = document.getElementById("buynow-link");

        // Close and clear song list if open and filled 
        songList.classList.remove("in");
        songList.innerHTML = " ";

        // Display hidden details-holder
        detailsHolder.classList.remove("hidden");
        detailsList.style.display = "block";

        // Find matching ID. Set matched object to new variable.
        var albumDetails = " ";
        for (var x = 0; x < currentAlbums.length; x++) {
            if (clicked.currentTarget.id == currentAlbums[x].albumId) {
                albumDetails = currentAlbums[x];
                break;
            };
        }

        // Set shorter named variable. Set content using matched objects data.
        var x = albumDetails;
        albumArt.src = x.albumArtLarge;
        artist.innerHTML = x.artist;
        album.innerText = x.albumTitle;
        releaseDate.innerText = x.releaseDate;
        genre.innerText = x.albumGenre;
        buynowLink.href = x.albumLink;

        // Filter price if undefined in matched oject data.
        if (x.albumPrice !== undefined) {
            price.innerText = "$" + x.albumPrice;
        } else {
            price.innerText = "N/A";
        }

        // Fill song list in details-holder. Using forEach loop on songList array.
        var counter = 1;
        x.songList.forEach(function (element) {
            if (element !== undefined) {
                var songItem = document.createElement("li"),
                    number = document.createElement("span");

                number.classList.add("song-number");
                number.innerText = counter++;
                songItem.classList.add("list-group-item");
                songItem.innerText = element;
                songItem.appendChild(number);
                songList.appendChild(songItem);
            };
        });
    };

    // On search button click
    // Rehides details-holder if open. Filters input value and creates URI. 
    // Get JSON data. Send JSON results to renderlist function.
    getButton.addEventListener("click", function () {
        detailsHolder.classList.add("hidden");
        var name = (searchName.value).toLowerCase();
        name = name.replace(/ /g, "+");
        var dataUri = "https://itunes.apple.com/search?term=" + name + "&entity=album&limit=5&callback=?";
        $.getJSON(dataUri, function (returnData) {
            renderList(returnData.results);
        });
    });

    // On clear button click
    // Clears out result data. Rehides albums-holder and details-holder.
    clearButton.addEventListener("click", function () {
        albumList.innerText = " ";
        albumList.style.display = "none";
        detailsList.style.display = "none";
        detailsHolder.classList.add("hidden");
        albumsHolder.classList.add("hidden");
        songList.classList.remove("in");
        songList.innerHTML = " ";
    });

});