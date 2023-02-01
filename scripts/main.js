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
  audio.play();

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

function pause() {
  playingSounds.forEach((playingSound, key) => {
    playingSound.audio.pause();
  });
}

function resume() {
  playingSounds.forEach((playingSound, key) => {
    playingSound.audio.play();
  });
}

const pauseToggle = document.getElementById("pause-toggle")
pauseToggle.addEventListener("click", () => {
  if (playingSounds.size < 1) {
    return;
  }

  pause();
});

const resumeToggle = document.getElementById("resume-toggle")
resumeToggle.addEventListener("click", () => {
  if (playingSounds.size < 1) {
    return;
  }

  resume();
});

const soundButtons = document.getElementsByClassName("sound-button");
for (let i = 0; i < soundButtons.length; i++) {
  const button = soundButtons.item(i);
  button.addEventListener("click", () => {
    const key = button.childNodes[0].nodeValue.toLowerCase();

    // Removing sound
    if (playingSounds.has(key)) {
      removeSound(key, button);
      if (playingSounds.size < 1) {
        pauseToggle.classList.remove("pause");
        resumeToggle.classList.remove("resume");
      }
      return;
    }

    // Playing sound
    playSound(key, button);
    if (playingSounds.size === 1) {
      pauseToggle.classList.add("pause");
      resumeToggle.classList.add("resume");
    }
  });
}
