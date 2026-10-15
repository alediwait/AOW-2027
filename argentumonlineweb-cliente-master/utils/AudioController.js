// AudioController — gestión centralizada de música y efectos (MP3).
//
// - Música de fondo en loop (un solo <audio>).
// - SFX con pool de canales para overlaps sin cortar la música.
// - Respeta la política de Autoplay: el audio se desbloquea con el primer
//   gesto del usuario (pointerdown/keydown); la música pendiente arranca sola.
// - Archivos faltantes: se avisa por consola una vez, sin romper el juego.
// - Mute global persistido en localStorage + suscripción para React.
//
// Uso:
//   import AudioController from '../utils/AudioController';
//   AudioController.startMusic();
//   AudioController.playSfxById(idSound); // ID del servidor (vars.arSounds)
//   AudioController.toggleMute();

const MUSIC_SRC = "/static/audio/music/main-theme.mp3";
const SFX_BASE = "/static/audio/sfx/";
const SFX_CHANNELS = 8;
const MUTE_KEY = "aow_muted";

// IDs de sonido del servidor (vars.arSounds) -> archivo MP3
const SOUND_MAP = {
    2: "swing.mp3",
    3: "warp.mp3",
    5: "puerta.mp3",
    6: "nivel.mp3",
    10: "impacto.mp3",
    11: "muertemago.mp3",
    12: "impacto2.mp3",
    13: "talar.mp3",
    14: "fogata.mp3",
    15: "minero.mp3",
    21: "ave.mp3",
    22: "ave.mp3",
    34: "ave.mp3",
    25: "sacararma.mp3",
    28: "grillo.mp3",
    29: "grillo.mp3",
    37: "escudo.mp3",
    46: "beber.mp3"
};

const SPELL_FALLBACK = "hechizo.mp3";

class AudioController {
    constructor() {
        this.music = null;
        this.sfxPool = [];
        this.sfxIndex = 0;
        this.missingFiles = {};
        this.listeners = [];

        this.muted =
            typeof window !== "undefined" &&
            window.localStorage.getItem(MUTE_KEY) === "1";

        this.volume = 0.5;
        this.unlocked = false;
        this.musicPending = false;

        if (typeof window !== "undefined") {
            const unlock = () => this.unlock();
            window.addEventListener("pointerdown", unlock, { once: true });
            window.addEventListener("keydown", unlock, { once: true });
        }
    }

    // Llamado con el primer gesto del usuario (o manualmente)
    unlock() {
        if (this.unlocked) return;
        this.unlocked = true;

        if (this.musicPending) {
            this.musicPending = false;
            this.startMusic();
        }
    }

    get isMuted() {
        return this.muted;
    }

    subscribe(cb) {
        this.listeners.push(cb);

        return () => {
            this.listeners = this.listeners.filter(fn => fn !== cb);
        };
    }

    notify() {
        this.listeners.forEach(fn => {
            try {
                fn(this.muted);
            } catch (e) {
                console.error(e);
            }
        });
    }

    setMuted(muted) {
        this.muted = !!muted;

        try {
            window.localStorage.setItem(MUTE_KEY, this.muted ? "1" : "0");
        } catch (e) {
            // localStorage no disponible: se ignora
        }

        if (this.music) {
            this.music.muted = this.muted;
        }

        this.sfxPool.forEach(audio => {
            audio.muted = this.muted;
        });

        this.notify();
    }

    toggleMute() {
        this.setMuted(!this.muted);

        return this.muted;
    }

    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));

        if (this.music) {
            this.music.volume = this.volume;
        }
    }

    ensureMusic() {
        if (this.music || typeof window === "undefined") return;

        const audio = new Audio();
        audio.src = MUSIC_SRC;
        audio.loop = true;
        audio.preload = "auto";
        audio.volume = this.volume;
        audio.muted = this.muted;

        audio.addEventListener("error", () => {
            this.warnMissing(MUSIC_SRC);
        });

        this.music = audio;
    }

    startMusic() {
        if (typeof window === "undefined") return;

        // Autoplay policy: diferir hasta el primer gesto del usuario
        if (!this.unlocked) {
            this.musicPending = true;
            return;
        }

        this.ensureMusic();

        if (!this.music) return;

        const promise = this.music.play();

        if (promise && promise.catch) {
            promise.catch(() => {
                // Bloqueado por el navegador: reintentar en el próximo gesto
                this.musicPending = true;
            });
        }
    }

    stopMusic() {
        this.musicPending = false;

        if (this.music) {
            this.music.pause();
        }
    }

    nextChannel() {
        if (typeof window === "undefined") return null;

        while (this.sfxPool.length < SFX_CHANNELS) {
            const audio = new Audio();
            audio.preload = "auto";
            audio.muted = this.muted;

            audio.addEventListener("error", () => {
                if (audio.src) this.warnMissing(audio.src);
            });

            this.sfxPool.push(audio);
        }

        const channel = this.sfxPool[this.sfxIndex];
        this.sfxIndex = (this.sfxIndex + 1) % this.sfxPool.length;

        return channel;
    }

    playSfx(name) {
        if (typeof window === "undefined" || this.muted) return;
        if (!this.unlocked || !name) return;
        if (this.missingFiles[SFX_BASE + name]) return;

        const channel = this.nextChannel();
        if (!channel) return;

        channel.src = SFX_BASE + name;
        channel.volume = this.volume;

        const promise = channel.play();

        if (promise && promise.catch) {
            promise.catch(() => {
                // Sin gesto previo o archivo inválido: no es fatal
            });
        }
    }

    // ID numérico enviado por el servidor (vars.arSounds)
    playSfxById(idSound) {
        const file = SOUND_MAP[idSound] || SPELL_FALLBACK;
        this.playSfx(file);
    }

    warnMissing(src) {
        if (this.missingFiles[src]) return;
        this.missingFiles[src] = true;

        console.warn(
            `[Audio] Falta el archivo ${src}. Agrégalo según public/static/audio/README.md`
        );
    }
}

const instance = new AudioController();

export default instance;
