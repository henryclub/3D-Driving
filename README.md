# 3D Driving

A 3D open-world driving and action game that runs in the browser and on Android. Your home sits in the middle of an endless city. Step outside, take the Fortuner or the Koenigsegg Jesko from your driveway, call any car or bike with your phone, run missions for cash, or cause trouble and outrun the police.

Built with [Three.js](https://threejs.org/). The game is a single `index.html` plus a local copy of `three.min.js`, so it also works offline.

## Download the Android APK
Every push to `main` builds a fresh APK automatically. Open the repo's **Releases** page, download `3D-Driving.apk` from the newest release, and open it on your phone. Android will ask you to allow installing from this source the first time.

## Features
- **Main menu and pause menu.** The game opens on a main menu with a Play button. In game, the ☰ button (or `Esc`) pauses with Resume, Restart and Leave to main menu. Full instructions are in the phone's **Help** tab.
- **Endless city.** Roads, buildings, parks and street lights keep generating as you drive, with traffic on the roads.
- **Your home.** It has a garage, a driveway and a "MY HOME" sign. A Toyota Fortuner, a Koenigsegg Jesko and a Royal Enfield are parked outside.
- **34 real-world vehicles at real size.** Cars are built from their real length, width, height and wheelbase, with curved bodies and each car's own front: BMW twin round headlights and kidney grille, Porsche round "frog-eye" lamps, Thar round lamps and slotted grille, G 63 round lamps with fender indicators, Audi's big single-frame grille, the Bugatti horseshoe, and more. Each one wears an **AZARR** badge where the maker's logo would be.
- **Weapons.** Pistol, machine gun, assault rifle, sniper rifle (with scope) and grenade launcher, picked from the bar at the top of the screen. Shoot or blast any car until it explodes.
- **Police and wanted stars.** Every crime adds a star (up to 5), shown just above your health bar. Police cars chase you for 2 minutes after your last crime. If you stop or get out, officers jump out and shoot. An officer goes down after 5 pistol shots.
- **Health and WASTED.** Your HP bar sits at the bottom and slowly heals. If it runs out, the screen shows a red **WASTED** and you wake up at home.
- **People on the streets.** Pedestrians walk the pavements. Shoot at them and they die or run away. Stand in front of a car in traffic to stop it, then press `E` to pull the driver out and take it.
- **Phone.** Press `P`. The **Garage** tab lists every vehicle's number. Call a number and that vehicle drops in beside you.
- **6 missions.** Taxi Rush, Hot Pizza Delivery, Checkpoint Race, Emergency Rescue, Police Patrol and Supercar Delivery. You earn cash, plus a bonus for time left on the clock.
- **Minimap**, **nitro**, **day/night mode** (windows light up at night and you get headlights), engine sound and a horn.
- Progress (cash, missions passed, settings) is saved in your browser.

## Controls
| Key | Action |
| --- | --- |
| `W A S D` / Arrows | Walk, drive and steer |
| `E` | Get in or out of a vehicle, or steal a car in traffic |
| Left click / `F` | Shoot |
| Right click (hold) / `Z` | Aim; with the sniper this opens the scope |
| `1`-`5`, `Q`, mouse wheel | Change weapon |
| `P` | Phone (the Help tab explains every control) |
| `Esc` | Pause menu |
| `M` | Missions |
| `Shift` | Nitro while driving, run on foot |
| `Space` | Handbrake |
| `H` | Horn |
| `C` | Change camera |
| `N` | Day / night |

On phones and tablets you get on-screen buttons: steering, gas, brake, nitro, FIRE, weapon, aim, phone and camera.

## Vehicle codes
| Number | Vehicle | Number | Vehicle |
| --- | --- | --- | --- |
| 1001 | Maruti Swift | 1301 | Lamborghini Huracán |
| 1002 | Honda Civic | 1302 | Ferrari F8 Tributo |
| 1003 | Hyundai Creta | 1303 | Porsche 911 |
| 1004 | Tata Nexon | 1304 | Ford Mustang GT |
| 1005 | Toyota Innova Crysta | 1305 | Bugatti Chiron |
| 1006 | Maruti Dzire Taxi | 1306 | Koenigsegg Jesko (1990 km/h, 2100+ on nitro) |
| | | 2001 | Hero Splendor Plus |
| 1101 | Toyota Fortuner | 2002 | Honda Activa |
| 1102 | Mahindra Thar | 2003 | Royal Enfield Classic 350 |
| 1103 | Mahindra Scorpio-N | 2004 | KTM Duke 390 |
| 1104 | Mercedes-Benz G 63 | 2005 | Kawasaki Ninja ZX-10R |
| 1105 | Range Rover | 2006 | Suzuki Hayabusa |
| 1106 | Toyota Land Cruiser | 2007 | Bajaj Pulsar 220F |
| 1201 | BMW M5 | 3001 | Police Bolero |
| 1202 | Mercedes-Benz S-Class | 3002 | Ambulance (Force Traveller) |
| 1203 | Audi A6 | 4001 | Mahindra Bolero Pickup |
| 1204 | BMW X5 | 4002 | Tata City Bus |
| | | 4003 | Tata Signa Truck |
| | | 5001 | Bajaj RE Auto Rickshaw |

## Run it
- **Locally:** open `index.html` in a browser.
- **Android:** see *Download the Android APK* above. The build is defined in `.github/workflows/android-apk.yml` (it wraps the game with Capacitor).
- **GitHub Pages:** go to **Settings → Pages**, set Source to **Deploy from a branch**, pick branch `main` and folder `/ (root)`, then save. The game will be live at `https://kainatmirza329-beep.github.io/3D-Driving/`.

## Add your own vehicle
Add a line to the `SPECS` list in `index.html` with a new `num` (its phone number), a `name`, a body template (`hatch`, `sedan`, `lux`, `csuv`, `suv`, `boxy`, `mpv`, `super`, `fastback`), a colour and its speed (`max`, `acc`, `turn`). It shows up in the phone's Garage tab automatically.

## Note
This is a fan-made game. Vehicle names belong to their respective manufacturers. The game is not affiliated with or endorsed by any of them, and it uses its own AZARR badge in place of real logos.
