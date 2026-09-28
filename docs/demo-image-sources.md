# Demonstration photography — provenance record

> Every photograph in `public/demo/vehicles/` is a **real, licensed photograph**
> published on Wikimedia Commons. Nothing in the showroom is vector artwork, a
> render, or a placeholder — and no photograph is of a different vehicle from
> the listing it illustrates.
>
> The machine-readable edition of this table is
> `src/lib/demo/demo-image-credits.ts` (used to render the on-page attribution
> lines), and `scripts/verify-demo-photography.ts` re-checks it against the
> files on disk: unique checksums, presence, format, resolution and credits.
>
> Access date for every file below: **2026-09-28**. All licences permit reuse
> with attribution; none carries a non-commercial restriction we would breach.

## Method

1. **Licence verification.** For every selected image, the actual Commons file
   description page was read through the Commons API (`extmetadata`: licence
   short name, artist, URL). Being on Commons was never treated as a licence —
   each entry records the licence Commons states for that file.
2. **Vehicle verification.** Make, model, generation, trim, colour and year come
   from the file title, its description, or a Commons colour category, and each
   demo listing was corrected to match the photographed donor where it differed
   (e.g. the Lexus is a Premium Plus because the donor is a Premium Plus).
3. **Coherent galleries.** Each gallery is one donor shoot, so an interior frame
   can never belong to a different car from the exterior frames beside it.
   Orientation (front/rear) is stated only where the source states it; the UI
   never labels a view.
4. **Local derivatives.** The shipped files are 1280px (long edge) progressive
   JPEGs re-encoded from the Commons originals. Crops exist only where the
   source file itself is a crop (the two Lexus frames).

## The eight galleries

### Mercedes-Benz GLE 450 (2019, AMG Line Premium+ 4MATIC, blue)

| Local frame | Commons file | Author | Licence |
|---|---|---|---|
| `mercedes-gle-exterior-front.jpg` | `File:2019 Mercedes-Benz GLE 450 AMG Line Premium+ 4MATIC 3.0 Front.jpg` | Vauxford | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) |
| `mercedes-gle-exterior-rear.jpg` | `File:2019 Mercedes-Benz GLE 450 AMG Line Premium+ 4MATIC 3.0 Rear.jpg` | Vauxford | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) |

File pages: [front](https://commons.wikimedia.org/wiki/File:2019_Mercedes-Benz_GLE_450_AMG_Line_Premium%2B_4MATIC_3.0_Front.jpg) · [rear](https://commons.wikimedia.org/wiki/File:2019_Mercedes-Benz_GLE_450_AMG_Line_Premium%2B_4MATIC_3.0_Rear.jpg).
W167 generation ✔ · donor trim matches listing ✔ · donor photographed in Weymouth, UK.
Colour: the source states "blue" only through its Commons colour category
(`Blue Mercedes-Benz SUVs`), so the listing says "Blue" instead of inventing a
factory paint name.

### BMW X5 (2023, xDrive40i M Sport, Mineral White Metallic)

| Local frame | Commons file | Author | Licence |
|---|---|---|---|
| `bmw-x5-exterior-01.jpg` | `File:BMW G05 X5 xDrive40i M Sport Mineral White Metallic (1).jpg` | Damian B Oh | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) |
| `bmw-x5-exterior-02.jpg` | `File:BMW G05 X5 xDrive40i M Sport Mineral White Metallic (4).jpg` | Damian B Oh | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) |
| `bmw-x5-exterior-03.jpg` | `File:BMW G05 X5 xDrive40i M Sport Mineral White Metallic (7).jpg` | Damian B Oh | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) |

Exterior-only: the numbered set (eight frames, one walkaround at the BMW
Driving Center, 25 May 2023) does not include an interior, and borrowing an
interior from a different donor would break gallery coherence — so the listing
shows three exterior angles. The source does not state the camera angle of any
frame, so local filenames and the UI stay neutral (`exterior-01/02/03`) and no
view is claimed. File pages: [(1)](https://commons.wikimedia.org/wiki/File:BMW_G05_X5_xDrive40i_M_Sport_Mineral_White_Metallic_(1).jpg) · [(4)](https://commons.wikimedia.org/wiki/File:BMW_G05_X5_xDrive40i_M_Sport_Mineral_White_Metallic_(4).jpg) · [(7)](https://commons.wikimedia.org/wiki/File:BMW_G05_X5_xDrive40i_M_Sport_Mineral_White_Metallic_(7).jpg).

### Lexus RX 350 (2023, Premium Plus AWD, Matador Red Mica)

| Local frame | Commons file | Author | Licence |
|---|---|---|---|
| `lexus-rx-exterior-front.jpg` | `File:2023 Lexus RX 350 Premium Plus in Matador Red Mica, front left (cropped).jpg` | Mr.choppers | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0) |
| `lexus-rx-exterior-rear.jpg` | `File:2023 Lexus RX 350 Premium Plus in Matador Red Mica, rear left (cropped).jpg` | Mr.choppers | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0) |

File pages: [front](https://commons.wikimedia.org/wiki/File:2023_Lexus_RX_350_Premium_Plus_in_Matador_Red_Mica%2C_front_left_(cropped).jpg) · [rear](https://commons.wikimedia.org/wiki/File:2023_Lexus_RX_350_Premium_Plus_in_Matador_Red_Mica%2C_rear_left_(cropped).jpg).
From the required starting category `Category:Lexus_RX_350_(TALA10/TALA15)`;
AL30/TALA10 generation ✔ · trim, drivetrain, engine (2.4-litre turbo, 275hp),
model year, paint and even the black leather interior are stated in the source
description — every one matches the listing because the listing was set to the
donor. Not an RX 350h, 450h, 300 or an older-generation RX.

### Range Rover Sport P400 Dynamic SE (2023, L461, Fuji White)

| Local frame | Commons file | Author | Licence |
|---|---|---|---|
| `range-rover-sport-exterior-front.jpg` | `File:2023 Range Rover Sport P400 Dynamic SE in Fuji White, front left.jpg` | Mr.choppers | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0) |
| `range-rover-sport-exterior-rear.jpg` | `File:2023 Range Rover Sport P400 Dynamic SE in Fuji White, rear left.jpg` | Mr.choppers | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0) |

File pages: [front](https://commons.wikimedia.org/wiki/File:2023_Range_Rover_Sport_P400_Dynamic_SE_in_Fuji_White%2C_front_left.jpg) · [rear](https://commons.wikimedia.org/wiki/File:2023_Range_Rover_Sport_P400_Dynamic_SE_in_Fuji_White%2C_rear_left.jpg).
Same donor vehicle and same shoot (front-left + rear-left pair, both stating
the P400 Dynamic SE / AJ20P6 mild-hybrid drivetrain ✔). The listing was
corrected from Santorini Black to Fuji White to match the photographed car; P400
trim and 2023 year are donor-stated and unchanged. A second, larger Santorini
Black set exists (56 numbered frames, Damian B Oh) but its frames carry no
per-file view statements, so the precisely labelled pair was preferred.

### Toyota Land Cruiser LC300 ZX (2021, 3.4 V6, silver)

| Local frame | Commons file | Author | Licence |
|---|---|---|---|
| `toyota-land-cruiser-exterior-front.jpg` | `File:2021 Toyota Land Cruiser 300 3.4 ZX (Colombia) front view 01.png` | Autosdeprimera | [CC BY 3.0](https://creativecommons.org/licenses/by/3.0) |
| `toyota-land-cruiser-exterior-rear.jpg` | `File:2021 Toyota Land Cruiser 300 3.4 ZX (Colombia) rear view 01.png` | Autosdeprimera | [CC BY 3.0](https://creativecommons.org/licenses/by/3.0) |
| `toyota-land-cruiser-interior.jpg` | `File:2021 Toyota Land Cruiser 300 (Colombia) interior.png` | Autosdeprimera | [CC BY 3.0](https://creativecommons.org/licenses/by/3.0) |

File pages: [front](https://commons.wikimedia.org/wiki/File:2021_Toyota_Land_Cruiser_300_3.4_ZX_(Colombia)_front_view_01.png) · [rear](https://commons.wikimedia.org/wiki/File:2021_Toyota_Land_Cruiser_300_3.4_ZX_(Colombia)_rear_view_01.png) · [interior](https://commons.wikimedia.org/wiki/File:2021_Toyota_Land_Cruiser_300_(Colombia)_interior.png).
J300 generation ✔ · ZX trim and V35A-FTS twin-turbo V6 ✔ · a single
photographer's Colombian set (exterior frames September 2021, interior August
2021). Colour is silver only through the Commons colour category
(`Silver Toyota SUVs`), so the listing says "Silver" rather than inventing
"Precious White Pearl". The interior frame is predominantly dark and
low-chroma on analysis, so the listing's interior says "Black Leather" rather
than the beige it used to claim — the source states no interior colour name.

### Mercedes-Benz C 300 d (2022, AMG Line, white)

| Local frame | Commons file | Author | Licence |
|---|---|---|---|
| `mercedes-c300-exterior-front.jpg` | `File:Mercedes-Benz C 300 d AMG Line (W 206) – f 10032024.jpg` | M 93 | [CC BY-SA 3.0 DE](https://creativecommons.org/licenses/by-sa/3.0/de/) |
| `mercedes-c300-exterior-rear.jpg` | `File:Mercedes-Benz C 300 d AMG Line (W 206) – h 10032024.jpg` | M 93 | [CC BY-SA 3.0 DE](https://creativecommons.org/licenses/by-sa/3.0/de/) |
| `mercedes-c300-exterior-rear-2.jpg` | `File:Mercedes-Benz C 300 d AMG Line (W 206) – h2 10032024.jpg` | M 93 | [CC BY-SA 3.0 DE](https://creativecommons.org/licenses/by-sa/3.0/de/) |

File pages: [f](https://commons.wikimedia.org/wiki/File:Mercedes-Benz_C_300_d_AMG_Line_(W_206)_%E2%80%93_f_10032024.jpg) · [h](https://commons.wikimedia.org/wiki/File:Mercedes-Benz_C_300_d_AMG_Line_(W_206)_%E2%80%93_h_10032024.jpg) · [h2](https://commons.wikimedia.org/wiki/File:Mercedes-Benz_C_300_d_AMG_Line_(W_206)_%E2%80%93_h2_10032024.jpg).
W206 generation ✔ · three frames of one white car on one day (10 March 2024);
"f" = Front, "h"/"h2" = Heck (German for rear). The white is Commons-verified
(`White Mercedes-Benz sedans`) and the set is rated a Commons Quality Image.
The listing was changed from the petrol "C300 AMG Line Premium Plus" to the
actual "C 300 d AMG Line". Model-year is not stated by the source; the kept
2022 is inside the W206 generation range.

### Porsche Cayenne S (2018, 9YA, black)

| Local frame | Commons file | Author | Licence |
|---|---|---|---|
| `porsche-cayenne-exterior-front.jpg` | `File:2018 Porsche Cayenne S Front.jpg` | Vauxford | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) |
| `porsche-cayenne-exterior-rear.jpg` | `File:2018 Porsche Cayenne S Rear.jpg` | Vauxford | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) |
| `porsche-cayenne-interior.jpg` | `File:2018 Porsche Cayenne S Interior.jpg` | Vauxford | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) |

File pages: [front](https://commons.wikimedia.org/wiki/File:2018_Porsche_Cayenne_S_Front.jpg) · [rear](https://commons.wikimedia.org/wiki/File:2018_Porsche_Cayenne_S_Rear.jpg) · [interior](https://commons.wikimedia.org/wiki/File:2018_Porsche_Cayenne_S_Interior.jpg).
One donor car, one photographer, one shoot (Solihull, UK): labelled front,
rear and cockpit views, including the only interior frame anywhere in this
fleet that is provably the same car as its exterior frames (Commons also files
it under `Porsche automobile cockpits`). Third-generation 9YA ✔.

Per the brief, the listing was changed to match the photos rather than the
photos being passed off as a 2023 Base: it is a **2018 Cayenne S**. Generation
mixing was rejected — the newer facelift files (PO536 FL e-hybrid, IAA 2023 S)
would not be a coherent gallery with these.

Colour: the source states no paint name. Every body panel sampled across the
frames is dark and low-chroma (median luminance in the car's range of a
verified-black reference), so the listing says "Black" instead of the light
"Chalk Grey" it used to claim. The interior frame is dark with a strong red
component, consistent with the kept "Black / Bordeaux Red Two-Tone" interior —
the source states no interior colour name.

### BMW 740d xDrive Excellence (2024, G70, black)

| Local frame | Commons file | Author | Licence |
|---|---|---|---|
| `bmw-7-series-exterior-front.jpg` | `File:BMW 740d xDrive Excellence (G70) front.jpg` | Tokumeigakarinoaoshima | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) |
| `bmw-7-series-exterior-rear.jpg` | `File:BMW 740d xDrive Excellence (G70) rear.jpg` | Tokumeigakarinoaoshima | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) |

File pages: [front](https://commons.wikimedia.org/wiki/File:BMW_740d_xDrive_Excellence_(G70)_front.jpg) · [rear](https://commons.wikimedia.org/wiki/File:BMW_740d_xDrive_Excellence_(G70)_rear.jpg).
Same donor vehicle, same shoot, same timestamp (31 January 2024, Osaka): the
source describes them, in Japanese, as photographed from the front
(フロント) and rear (リア). G70 generation ✔ · black (`Black BMW sedans` ✔,
so the listing dropped the unverifiable "Carbon Black Metallic"). The listing
was changed from "740i M Sport" to the actual "740d xDrive Excellence".

## What was deliberately left out

- **No interior where none exists for the donor.** GLE, X5, Lexus, Range Rover
  Sport, C 300 d and 7 Series carry exterior angles only. Borrowing an interior
  from a different unit (however tempting — e.g. a G05 interior exists, just not
  from the listed white car) would create exactly the exterior/interior mismatch
  this work forbids.
- **No guessed paint names.** Where the source states a colour family only
  (or a Commons colour category is the evidence), the listing uses that plain
  word. Factory paint names appear only where the source prints them.
- **No view claims where the source is silent.** The three X5 frames come from
  an eight-frame walkaround whose files carry no per-file view statements, so
  their filenames and the UI stay neutral and the gallery alt text reads
  "photograph N of M".

## Files touched

- `public/demo/vehicles/<slug>/` — 20 real photographs, 1280px JPEGs.
- `src/lib/demo/demo-data.ts` — listings corrected to their donors, galleries attached.
- `src/lib/demo/demo-image-credits.ts` — machine-readable provenance driving the on-page attribution.
- `src/components/site/{vehicle-card,vehicle-gallery,cinematic-hero}.tsx` — real photographs + required attribution lines; the vector artwork path is gone.
- `scripts/verify-demo-photography.ts` — `npx tsx scripts/verify-demo-photography.ts`.



