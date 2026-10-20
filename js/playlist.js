
const songs = [
  "Blinding Lights",
  "Starboy",
  "One Dance",
  "Summertime Sadness Remix",
  "Levitating"
];

const playlist = document.getElementById("playlist");
const count = document.getElementById("count");

function showSongs() {
  playlist.innerHTML = "";

  for (const song of songs) {
    const li = document.createElement("li");
    li.textContent = song;

    if (song.includes("Remix")) {
      li.style.fontWeight = "bold";
      li.style.color = "red";
    }

    playlist.appendChild(li);
  }

  count.textContent = "Total songs: " + songs.length;
}

document.getElementById("addBtn").addEventListener("click", function() {
  const input = document.getElementById("songInput");
  const title = input.value.trim();

  if (title !== "") {
    songs.push(title);
    input.value = "";
    showSongs();
  }
});

showSongs();

