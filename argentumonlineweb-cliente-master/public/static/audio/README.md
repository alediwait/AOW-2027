# Audio — Argentum Online Web

Coloca aquí tus archivos MP3. El `AudioController` (`utils/AudioController.js`)
los busca en estas rutas y **tolera archivos faltantes** (avisa por consola
sin romper el juego), así puedes agregar sonidos de a poco.

## Música de fondo (loop)

| Archivo | Uso |
|---|---|
| `music/main-theme.mp3` | Música principal, suena en loop al entrar a `/play` |

## Efectos (SFX)

El servidor envía sonidos por ID (`vars.arSounds` en el backend). Mapeo usado
por `AudioController.playSfxById(id)`:

| ID(s) | Archivo | Evento |
|---|---|---|
| 2 | `sfx/swing.mp3` | Ataque cuerpo a cuerpo |
| 3 | `sfx/warp.mp3` | Teleport |
| 5 | `sfx/puerta.mp3` | Puertas |
| 6 | `sfx/nivel.mp3` | Subir de nivel |
| 10, 12 | `sfx/impacto.mp3`, `sfx/impacto2.mp3` | Impactos |
| 11 | `sfx/muertemago.mp3` | Muerte de mago |
| 13 | `sfx/talar.mp3` | Talar / leñar |
| 14 | `sfx/fogata.mp3` | Pescar / fogata |
| 15 | `sfx/minero.mp3` | Minería |
| 21, 22, 34 | `sfx/ave.mp3` | Aves ambiente |
| 25 | `sfx/sacararma.mp3` | Equipar arma |
| 28, 29 | `sfx/grillo.mp3` | Grillos ambiente |
| 37 | `sfx/escudo.mp3` | Bloqueo con escudo |
| 46 | `sfx/beber.mp3` | Pociones / bebidas |
| otros | `sfx/hechizo.mp3` | Hechizos (fallback) |

## Notas

- Formato: MP3 (máxima compatibilidad entre navegadores).
- Los navegadores exigen un gesto del usuario (click/tecla) antes de sonar:
  el controlador desbloquea el audio con el primer `pointerdown`/`keydown`
  y arranca la música pendiente automáticamente.
- Mute global: botón de volumen en `/play` (persiste en `localStorage`).
