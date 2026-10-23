# 3D Driving

Browser mein chalne wala 3D driving game. Aapka ghar ek endless shehar ke beech mein hai. Ghar se niklo, garage se gaadi uthao, ya phone se koi bhi gaadi bulao.

Ye [Three.js](https://threejs.org/) se bana hai, aur pura game ek hi `index.html` file mein hai.

## Features
- **Endless city**: aap jitna aage jaoge, shehar utna aage banta rahega (sadkein, buildings, park, street lights)
- **Mera Ghar**: garage, driveway aur "MERA GHAR" board ke saath. Wahan aapki hatchback aur bike khadi milegi.
- **18 vehicles**: cars, bikes, scooty, police, ambulance, pickup, bus, truck, auto rickshaw
- **Phone**: `P` dabao. **Code** tab mein har gaadi ka number hai. Us number par call karo to wahi gaadi aapke paas aa jayegi.
- Shehar mein traffic, horn, aur do camera modes

## Controls
| Key | Kaam |
| --- | --- |
| `W A S D` / Arrows | Chalo, gaadi chalao, mudo |
| `E` | Gaadi mein baitho / utro |
| `P` | Phone kholo |
| `Space` | Handbrake |
| `Shift` | Paidal daudo |
| `H` | Horn |
| `C` | Camera badlo |

Phone par on-screen buttons milte hain.

## Gaadi codes
| Number | Gaadi |
| --- | --- |
| 1001 | Chhotu Hatchback |
| 1002 | Raja Sedan |
| 1003 | Kaali-Peeli Taxi |
| 1004 | Pahadi SUV |
| 1005 | Toofan GT |
| 1006 | Jungle Jeep |
| 1007 | Neela Coupe |
| 2001 | Daily Bike |
| 2002 | Scooty |
| 2003 | Bijli Sports Bike |
| 2004 | Cruiser Bike |
| 2005 | Laal Racer |
| 3001 | Police Interceptor |
| 3002 | Ambulance |
| 4001 | Kisan Pickup |
| 4002 | City Bus |
| 4003 | Bharat Truck |
| 5001 | Auto Rickshaw |

## Kaise chalayein
- **Local**: `index.html` ko browser mein kholo.
- **GitHub Pages**: repo ki **Settings → Pages** mein Source **Deploy from a branch** chuno, branch `main` aur folder `/ (root)` select karo, phir Save karo. Thodi der mein game `https://kainatmirza329-beep.github.io/3D-Driving/` par live ho jayega.

## Nayi gaadi kaise jodein
`index.html` mein `SPECS` list mein ek nayi line jodo. Usme naya `num` (phone number), `name`, `color` aur speed (`max`, `acc`, `turn`) do. Gaadi apne aap phone ke Code tab mein aa jayegi.
