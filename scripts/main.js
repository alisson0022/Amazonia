class Sound {

  constructor(title, emoji, file, delay) {
    this.title = title;
    this.emoji = emoji;
    this.file = file;
    this.delay = delay;
  }

  hasDelay() {
    return delay > 0;
  }
}

const soundMap = new Map(Object.entries(
  {
    "rain": new Sound("Rain", "☂️", "/sounds/rain.mp3", 0),
    "thunder": new Sound("Thunder", "⚡", "/sounds/thunder.mp3", 10),
    "wind": new Sound("Wind", "🍃", "/sounds/wind.mp3", 0),
    "crickets": new Sound("Crickets", "🦗", "/sounds/crickets.mp3", 0),
    "fire": new Sound("Fire", "🔥", "/sounds/fire.mp3", 0)
  }
));

/* Init sounds from map */
soundMap.forEach((sound, _) => {
  const soundButton = document.createElement("button");
  soundButton.textContent = sound.title;
  soundButton.setAttribute("class", "button sound-button");
  const emojiSpan = document.createElement("span");
  emojiSpan.textContent = sound.emoji;
  soundButton.appendChild(emojiSpan);
  document.getElementById("available-sounds").appendChild(soundButton);
})

/*
 - Playing sound object

 <object>: {
  "sound": <sound class instance>
  "audio": <audio object>
 }
*/
const playingSounds = new Map();

function isPaused() {
  if (playingSounds.size < 1) {
    return false;
  }

  let isPaused = true;
  playingSounds.forEach((value, _) => {
    if (!value.audio.paused) {
      isPaused = false;
      return;
    }
  });
  return isPaused;
}

function playSound(key, button) {
  if (!soundMap.has(key)) {
    alert(`The sound ${key} you're trying to play doesn't exist.`);
    return;
  }

  if (playingSounds.has(key)) {
    alert(`The sound ${key} is already being played.`);
    return;
  }

  const sound = soundMap.get(key);
  const audio = new Audio(sound.file);
  
  if (!isPaused()) {
    audio.play();
  }

  playingSounds.set(key, {
    "sound": sound,
    "audio": audio
  })

  button.classList.add("playing");
}

function removeSound(key, button) {
  const playingSound = playingSounds.get(key);
  playingSound.audio.pause();

  playingSounds.delete(key);

  button.classList.remove("playing");
}
const clearToggle = document.getElementById("clear-toggle")
const pauseToggle = document.getElementById("pause-toggle")
const resumeToggle = document.getElementById("resume-toggle")

clearToggle.addEventListener("click", () => {
  if (playingSounds.size < 1) {
    alert("The ambience is not set yet.");
    return;
  }

  playingSounds.forEach((playingSound, _) => {
    playingSound.audio.pause();
  });

  playingSounds.clear();

  // Removing CSS
  for(let soundButton of soundButtons) {
    soundButton.classList.remove("playing");
  }

  clearToggle.classList.remove("clear");
  pauseToggle.classList.remove("pause");
  resumeToggle.classList.remove("resume");
});

pauseToggle.addEventListener("click", () => {
  if (playingSounds.size < 1) {
    alert("The ambience is not set yet.");
    return;
  }

  if (isPaused()) {
    alert("The ambience is already paused.");
    return;
  }

  playingSounds.forEach((playingSound, _) => {
    playingSound.audio.pause();
  });

  pauseToggle.classList.remove("pause");
  resumeToggle.classList.add("resume");
});

resumeToggle.addEventListener("click", () => {
  if (playingSounds.size < 1) {
    alert("The ambience is not set yet.");
    return;
  }

  if (!isPaused()) {
    alert("The ambience is not paused.");
    return;
  }
  
  playingSounds.forEach((playingSound, _) => {
    playingSound.audio.play();
  });

  pauseToggle.classList.add("pause");
  resumeToggle.classList.remove("resume");
});

const soundButtons = document.getElementsByClassName("sound-button");
for (let soundButton of soundButtons) {
  soundButton.addEventListener("click", () => {
    const key = soundButton.childNodes[0].nodeValue.toLowerCase(); // Gets only the sound title text, excluding the emoji span.

    // Removing sound
    if (playingSounds.has(key)) {
      removeSound(key, soundButton);
      if (playingSounds.size < 1) {
        clearToggle.classList.remove("clear");
        pauseToggle.classList.remove("pause");
        resumeToggle.classList.remove("resume");
      }
      return;
    }

    // Playing sound
    playSound(key, soundButton);
    if (!isPaused() && playingSounds.size >= 1) {
      clearToggle.classList.add("clear");
      pauseToggle.classList.add("pause");
    }
  });
}
