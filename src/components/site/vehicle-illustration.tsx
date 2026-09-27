import {
  VIEW_CAPTIONS,
  getVehicleArtwork,
  type ArtworkView,
  type VehicleArtwork,
} from "@/lib/demo/vehicle-artwork";
import {
  bodyGeometry,
  bodyPath,
  creasePath,
  doorLine,
  glassPath,
  GROUND_Y,
  headlightPath,
  mirrorPath,
  taillightPath,
  type BodyGeometry,
} from "@/lib/demo/vehicle-geometry";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * ============================================================================
 * ILLUSTRATIVE VEHICLE RENDERS â€” NOT PHOTOGRAPHY
 * ============================================================================
 *
 * Renders a hand-authored vector illustration of a demonstration vehicle.
 * These are original drawings, not photographs and not photorealistic renders
 * of a real car. See `lib/demo/vehicle-artwork.ts` for why they exist.
 *
 * HONESTY CONTRACT
 *
 * 1. The `ILLUSTRATIVE` badge is on by default and can only be turned off
 *    explicitly. It is HTML overlaid on the art rather than SVG path data, so
 *    it stays crisp and readable at thumbnail size.
 * 2. `alt` text always says "illustration" and names the view.
 * 3. This component is only ever reached when a vehicle has NO stored
 *    photograph. Real uploaded photography always takes precedence, so the
 *    moment a real photo exists the showroom stops showing artwork.
 * 4. A vehicle with no artwork registered renders nothing, and the caller
 *    falls back to the honest "Photography pending" panel.
 *
 * The art is a pure function of the vehicle id, so the same vehicle always
 * renders identically and can never be confused with a different car.
 */

const VIEWBOX_WIDTH = 1600;
const VIEWBOX_HEIGHT = 900;

/** Wheel: tyre, rim barrel, spokes and hub, drawn at (cx, cy). */
function Wheel({ cx, r, art }: { cx: number; r: number; art: VehicleArtwork }) {
  const cy = GROUND_Y - r;
  const rim = r * 0.62;
  const spokes = Array.from({ length: 10 }, (_, i) => i * 36);

  return (
    <g>
      {/* Tyre */}
      <circle cx={cx} cy={cy} r={r} fill="#15181c" />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#2b3037" strokeWidth={r * 0.16} />
      {/* Rim barrel */}
      <circle cx={cx} cy={cy} r={rim} fill={art.paint.wheel} />
      <circle cx={cx} cy={cy} r={rim} fill="none" stroke="#0d0f12" strokeWidth={3} opacity={0.5} />
      {/* Spokes */}
      {spokes.map((deg) => (
        <rect
          key={deg}
          x={cx - rim * 0.07}
          y={cy - rim * 0.9}
          width={rim * 0.14}
          height={rim * 0.9}
          rx={rim * 0.06}
          fill="#0f1114"
          opacity={0.45}
          transform={`rotate(${deg} ${cx} ${cy})`}
        />
      ))}
      {/* Hub */}
      <circle cx={cx} cy={cy} r={rim * 0.2} fill="#0f1114" />
    </g>
  );
}

/**
 * Shared studio backdrop: sky wash, reflective floor, key light, and the
 * metallic body gradient. The body gradient stops come from the vehicle's own
 * paint, so the sheen always matches the published colour.
 */
function StudioBackdrop({ uid, art }: { uid: string; art: VehicleArtwork }) {
  return (
    <>
    <defs>
      <linearGradient id={`${uid}-sky`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#39434f" />
        <stop offset="55%" stopColor="#252d37" />
        <stop offset="100%" stopColor="#161b22" />
      </linearGradient>
      <linearGradient id={`${uid}-floor`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#222a33" />
        <stop offset="100%" stopColor="#0d1116" />
      </linearGradient>
      {/* Key light from the upper left, matching the body shading. */}
      <radialGradient id={`${uid}-key`} cx="0.3" cy="0.12" r="0.75">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.30" />
        <stop offset="60%" stopColor="#ffffff" stopOpacity="0.07" />
        <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
      </radialGradient>
      {/* Metallic body gradient: highlight along the shoulder, shade low down. */}
      <linearGradient id={`${uid}-body`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={art.paint.highlight} />
        <stop offset="34%" stopColor={art.paint.body} />
        <stop offset="78%" stopColor={art.paint.body} />
        <stop offset="100%" stopColor={art.paint.shade} />
      </linearGradient>
      {/* Windscreen / side glass, with a raking studio reflection. */}
      <linearGradient id={`${uid}-glass`} x1="0" y1="0" x2="0.6" y2="1">
        <stop offset="0%" stopColor="#6d8496" stopOpacity="0.85" />
        <stop offset="45%" stopColor={art.paint.glass} />
        <stop offset="100%" stopColor="#0a1016" />
      </linearGradient>
      {/* Headlamp and tail-lamp lenses. */}
      <linearGradient id={`${uid}-lamp`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#eaf3fb" stopOpacity="0.95" />
        <stop offset="100%" stopColor="#9fc4e0" stopOpacity="0.55" />
      </linearGradient>
      {/* Contact shadow beneath the car. */}
      <radialGradient id={`${uid}-shadow`} cx="0.5" cy="0.5" r="0.5">
        <stop offset="0%" stopColor="#000000" stopOpacity="0.75" />
        <stop offset="100%" stopColor="#000000" stopOpacity="0" />
      </radialGradient>
    </defs>
    <rect width={VIEWBOX_WIDTH} height={VIEWBOX_HEIGHT} fill={`url(#${uid}-sky)`} />
    <rect
      y={GROUND_Y - 40}
      width={VIEWBOX_WIDTH}
      height={VIEWBOX_HEIGHT - GROUND_Y + 40}
      fill={`url(#${uid}-floor)`}
    />
    <rect width={VIEWBOX_WIDTH} height={VIEWBOX_HEIGHT} fill={`url(#${uid}-key)`} />
    <line
      x1="0"
      y1={GROUND_Y}
      x2={VIEWBOX_WIDTH}
      y2={GROUND_Y}
      stroke="#39424d"
      strokeWidth="1.5"
      opacity="0.5"
    />
    </>
  );
}

/**
 * Wheels, contact shadow and arch lips.
 *
 * Drawn BEFORE the body, so the body's arch cut-outs reveal the tyres. Painting
 * the wheels first and letting the body overlap them is what produces a correct
 * arch lip for free.
 */
function RunningGear({ uid, art }: { uid: string; art: VehicleArtwork }) {
  const [front, rear] = art.axles;
  const midX = (front + rear) / 2;
  const halfSpan = (rear - front) / 2 + art.wheelRadius * 2.2;

  return (
    <g>
      {/* Contact shadow, cast on the floor beneath the car. */}
      <ellipse
        cx={midX}
        cy={GROUND_Y + 8}
        rx={halfSpan}
        ry={art.wheelRadius * 0.4}
        fill={`url(#${uid}-shadow)`}
      />
      <Wheel cx={front} r={art.wheelRadius} art={art} />
      <Wheel cx={rear} r={art.wheelRadius} art={art} />
    </g>
  );
}

/**
 * Shared clip for the glasshouse and other body-locked detail, so nothing can
 * spill outside the vehicle outline.
 */
function BodyClip({ uid, g, art }: { uid: string; g: BodyGeometry; art: VehicleArtwork }) {
  return (
    <clipPath id={`${uid}-clip`}>
      <path d={bodyPath(g, art.axles, art.wheelRadius)} />
    </clipPath>
  );
}

/** Side elevation: the clearest read of each vehicle's proportions. */
function ProfileView({ uid, art, g }: { uid: string; art: VehicleArtwork; g: BodyGeometry }) {
  const doorX = (g.cowlX + g.roofRearX) / 2;
  const outline = bodyPath(g, art.axles, art.wheelRadius);

  return (
    <g>
      <BodyClip uid={uid} g={g} art={art} />
      <RunningGear uid={uid} art={art} />

      {/* Body */}
      <path d={outline} fill={`url(#${uid}-body)`} />

      {/* Body-locked detail, clipped so it can never escape the silhouette. */}
      <g clipPath={`url(#${uid}-clip)`}>
        {/* Glasshouse */}
        <path d={glassPath(g)} fill={`url(#${uid}-glass)`} />
        {art.panoramicRoof ? (
          <path
            d={`M ${g.roofFrontX + 20} ${g.roofY + 8} L ${g.roofRearX - 16} ${g.roofY + 10} L ${g.roofRearX - 34} ${g.beltY - 4} L ${g.cowlX + 40} ${g.beltY - 2} Z`}
            fill="#9dc4dd"
            opacity="0.18"
          />
        ) : null}
        {/* B-pillar divides the front and rear glass. */}
        <path
          d={`M ${(g.roofFrontX + g.roofRearX) / 2} ${g.roofY + 4} L ${(g.roofFrontX + g.roofRearX) / 2 - 14} ${g.beltY}`}
          stroke={art.paint.shade}
          strokeWidth="7"
          opacity="0.55"
        />
        {/* Character crease along the flank */}
        <path
          d={creasePath(g)}
          fill="none"
          stroke={art.paint.shade}
          strokeWidth="3.5"
          opacity="0.5"
        />
        {/* Shoulder highlight: the studio strip light along the top of the doors */}
        <path
          d={`M ${g.noseX + 90} ${g.beltY + 4} Q ${(g.noseX + g.tailX) / 2} ${g.beltY - 12} ${g.tailX - 50} ${g.beltY - 2}`}
          fill="none"
          stroke="#ffffff"
          strokeWidth="12"
          opacity="0.12"
        />
        {/* Door shut lines */}
        <path d={doorLine(doorX, g)} fill="none" stroke={art.paint.shade} strokeWidth="2.5" opacity="0.45" />
        <path d={doorLine(g.cowlX + 24, g)} fill="none" stroke={art.paint.shade} strokeWidth="2.5" opacity="0.4" />
        <path d={doorLine(g.roofRearX + 90, g)} fill="none" stroke={art.paint.shade} strokeWidth="2.5" opacity="0.35" />
        {/* Rocker shadow, tying the body down onto the wheels. */}
        <path
          d={`M ${g.noseX} ${g.sillY - 18} L ${g.tailX} ${g.sillY - 18}`}
          stroke={art.paint.shade}
          strokeWidth="26"
          opacity="0.45"
        />
        {/* Front grille and lower intake, seen edge-on at the nose. */}
        <path
          d={`M ${g.noseX - 10} ${g.noseY + 40} L ${g.noseX + 120} ${g.noseY + 26} L ${g.noseX + 120} ${g.noseY + 86} L ${g.noseX - 10} ${g.noseY + 96} Z`}
          fill="#0b0e12"
          opacity="0.9"
        />
        <path
          d={`M ${g.noseX - 10} ${g.noseY + 150} L ${g.noseX + 96} ${g.noseY + 140} L ${g.noseX + 96} ${g.noseY + 186} L ${g.noseX - 10} ${g.noseY + 192} Z`}
          fill="#0b0e12"
          opacity="0.75"
        />
        {/* Tailgate shut line */}
        <path
          d={`M ${g.tailX - 8} ${g.tailTopY + 30} L ${g.tailX - 40} ${g.sillY}`}
          stroke={art.paint.shade}
          strokeWidth="2.5"
          opacity="0.4"
        />
      </g>

      {/* Side mirror sits proud of the body, so it is drawn unclipped. */}
      <path d={mirrorPath(g)} fill={art.paint.body} stroke={art.paint.shade} strokeWidth="2" />

      {/* Lamps */}
      <path d={headlightPath(g)} fill={`url(#${uid}-lamp)`} />
      <path d={taillightPath(g)} fill="#c9413a" opacity="0.88" />

      {/* Body outline redrawn on top, so the arch lips stay crisp. */}
      <path d={outline} fill="none" stroke={art.paint.shade} strokeWidth="2.5" opacity="0.55" />
    </g>
  );
}


/**
 * Front three-quarter: the side elevation skewed with a perspective nose, so
 * the vehicle reads as angled towards the viewer rather than flat.
 */
function ThreeQuarterView({ uid, art, g }: { uid: string; art: VehicleArtwork; g: BodyGeometry }) {
  const outline = bodyPath(g, art.axles, art.wheelRadius);

  return (
    <g>
      <BodyClip uid={uid} g={g} art={art} />
      <RunningGear uid={uid} art={art} />

      <path d={outline} fill={`url(#${uid}-body)`} />

      <g clipPath={`url(#${uid}-clip)`}>
        <path d={glassPath(g)} fill={`url(#${uid}-glass)`} />
        <path
          d={creasePath(g)}
          fill="none"
          stroke={art.paint.shade}
          strokeWidth="3.5"
          opacity="0.5"
        />
        {/* Specular sweep along the shoulder: the "studio turntable" highlight. */}
        <path
          d={`M ${g.noseX + 80} ${g.beltY + 2} Q ${(g.noseX + g.tailX) / 2} ${g.beltY - 16} ${g.tailX - 46} ${g.beltY - 4}`}
          fill="none"
          stroke="#ffffff"
          strokeWidth="14"
          opacity="0.14"
          strokeLinecap="round"
        />
        <path
          d={`M ${g.noseX - 10} ${g.noseY + 40} L ${g.noseX + 120} ${g.noseY + 26} L ${g.noseX + 120} ${g.noseY + 86} L ${g.noseX - 10} ${g.noseY + 96} Z`}
          fill="#0b0e12"
          opacity="0.9"
        />
        <path d={taillightPath(g)} fill="#c9413a" opacity="0.88" />
      </g>

      <path d={mirrorPath(g)} fill={art.paint.body} stroke={art.paint.shade} strokeWidth="2" />
      <path d={headlightPath(g)} fill={`url(#${uid}-lamp)`} />
      <path d={outline} fill="none" stroke={art.paint.shade} strokeWidth="2.5" opacity="0.55" />
    </g>
  );
}

/**
 * Head-on elevation. Built from the archetype's width and roof height so a wide
 * coupÃ© SUV stays visibly wider than a compact saloon.
 */
function FrontView({ uid, art, g }: { uid: string; art: VehicleArtwork; g: BodyGeometry }) {
  const cx = VIEWBOX_WIDTH / 2;
  const w = g.halfWidth;
  const roof = g.roofY + 30;
  const shoulder = g.beltY + 40;
  const floor = GROUND_Y;
  const trackHalf = w * 0.86;

  return (
    <g>
      <ellipse cx={cx} cy={floor + 4} rx={w * 1.15} ry={26} fill={`url(#${uid}-shadow)`} />
      {/* Cabin greenhouse */}
      <path
        d={`M ${cx - w * 0.78} ${shoulder} L ${cx - w * 0.62} ${roof + 40} Q ${cx} ${roof} ${cx + w * 0.62} ${roof + 40} L ${cx + w * 0.78} ${shoulder} Z`}
        fill={`url(#${uid}-glass)`}
      />
      {/* Body front */}
      <path
        d={`M ${cx - w} ${shoulder - 10} Q ${cx} ${shoulder - 40} ${cx + w} ${shoulder - 10} L ${cx + w * 0.97} ${floor - 60} Q ${cx} ${floor - 6} ${cx - w * 0.97} ${floor - 60} Z`}
        fill={`url(#${uid}-body)`}
      />
      {/* Grille aperture */}
      <path
        d={`M ${cx - w * 0.56} ${shoulder + 26} Q ${cx} ${shoulder + 6} ${cx + w * 0.56} ${shoulder + 26} L ${cx + w * 0.5} ${shoulder + 128} Q ${cx} ${shoulder + 152} ${cx - w * 0.5} ${shoulder + 128} Z`}
        fill="#0c0f13"
        opacity="0.9"
      />
      <path
        d={`M ${cx - w * 0.5} ${shoulder + 34} Q ${cx} ${shoulder + 16} ${cx + w * 0.5} ${shoulder + 34}`}
        fill="none"
        stroke={art.paint.wheel}
        strokeWidth="5"
        opacity="0.55"
      />
      {/* Headlamps, one each side */}
      <path
        d={`M ${cx - w * 0.92} ${shoulder + 6} L ${cx - w * 0.6} ${shoulder + 16} L ${cx - w * 0.62} ${shoulder + 62} L ${cx - w * 0.93} ${shoulder + 52} Z`}
        fill={`url(#${uid}-lamp)`}
      />
      <path
        d={`M ${cx + w * 0.92} ${shoulder + 6} L ${cx + w * 0.6} ${shoulder + 16} L ${cx + w * 0.62} ${shoulder + 62} L ${cx + w * 0.93} ${shoulder + 52} Z`}
        fill={`url(#${uid}-lamp)`}
      />
      {/* Lower intake and splitter */}
      <path
        d={`M ${cx - w * 0.74} ${shoulder + 150} Q ${cx} ${shoulder + 176} ${cx + w * 0.74} ${shoulder + 150} L ${cx + w * 0.7} ${shoulder + 186} Q ${cx} ${shoulder + 206} ${cx - w * 0.7} ${shoulder + 186} Z`}
        fill="#0a0c0f"
        opacity="0.85"
      />
      {/* Wheels peeking past the body sides */}
      <Wheel cx={cx - trackHalf} r={art.wheelRadius} art={art} />
      <Wheel cx={cx + trackHalf} r={art.wheelRadius} art={art} />
      {/* Bonnet crease lines */}
      <path
        d={`M ${cx - w * 0.5} ${shoulder - 16} Q ${cx} ${shoulder - 34} ${cx + w * 0.5} ${shoulder - 16}`}
        fill="none"
        stroke={art.paint.shade}
        strokeWidth="3"
        opacity="0.4"
      />
    </g>
  );
}

/**
 * Cabin / dashboard view, drawn from the driver's seat.
 *
 * The cabin art is generic rather than model-specific â€” it is a stylised
 * cockpit (dash, binnacle, wheel, console, seats) drawn in the vehicle's own
 * paint accent. This is stated plainly in the alt text and the visible caption
 * so it is never read as the actual interior of the car being advertised.
 */
function CabinView({ uid, art }: { uid: string; art: VehicleArtwork }) {
  // Composition: windscreen in the top third, dashboard across the middle,
  // wheel and console in the lower half. The earlier version let the dash fill
  // the frame and turned the A-pillars into huge black wedges.
  const horizon = 300;
  const dashTop = 360;
  const dashBase = 520;

  return (
    <g>
      {/* Windscreen: daylight fading towards the horizon. */}
      <rect x="0" y="0" width={VIEWBOX_WIDTH} height={horizon} fill="#a8c6dc" opacity="0.5" />
      <rect x="0" y={horizon - 120} width={VIEWBOX_WIDTH} height="120" fill="#7f96a8" opacity="0.35" />
      {/* Slim A-pillars along the outer edges only. */}
      <path d={`M 0 0 L 96 0 L 300 ${horizon} L 0 ${horizon} Z`} fill="#0d1014" />
      <path d={`M ${VIEWBOX_WIDTH} 0 L ${VIEWBOX_WIDTH - 96} 0 L ${VIEWBOX_WIDTH - 300} ${horizon} L ${VIEWBOX_WIDTH} ${horizon} Z`} fill="#0d1014" />
      {/* Header rail across the top of the windscreen. */}
      <rect x="0" y="0" width={VIEWBOX_WIDTH} height="54" fill="#0d1014" />

      {/* Dashboard: a single soft-topped form spanning the cabin. */}
      <path
        d={`M 0 ${dashTop + 20} Q ${VIEWBOX_WIDTH / 2} ${dashTop - 34} ${VIEWBOX_WIDTH} ${dashTop + 20} L ${VIEWBOX_WIDTH} ${dashBase + 30} Q ${VIEWBOX_WIDTH / 2} ${dashBase + 74} 0 ${dashBase + 30} Z`}
        fill={`url(#${uid}-body)`}
      />
      {/* Ambient light strip, a signature of a newer luxury cabin. */}
      <path
        d={`M 20 ${dashTop + 74} Q ${VIEWBOX_WIDTH / 2} ${dashTop + 30} ${VIEWBOX_WIDTH - 20} ${dashTop + 74}`}
        fill="none"
        stroke={art.paint.wheel}
        strokeWidth="5"
        opacity="0.8"
      />
      {/* Air vents */}
      {[560, 700, 900, 1040].map((x) => (
        <rect key={x} x={x} y={dashTop + 96} width="80" height="16" rx="8" fill="#0c0f13" opacity="0.7" />
      ))}

      {/* Floating centre infotainment screen */}
      <rect x="712" y={dashTop + 6} width="176" height="120" rx="8" fill="#0a0d11" stroke="#333c46" strokeWidth="3" />
      <rect x="722" y={dashTop + 16} width="156" height="100" rx="4" fill="#16232e" />
      <path d="M 738 104 L 768 60 L 792 84 L 828 44 L 862 104 Z" fill="#31506b" opacity="0.9" />

      {/* Driver's instrument binnacle */}
      <path d="M 396 396 Q 470 378 548 396 L 542 470 L 402 470 Z" fill="#0b0e12" />
      <circle cx="440" cy="436" r="34" fill="#141b22" stroke={art.paint.wheel} strokeWidth="3" />
      <circle cx="512" cy="436" r="34" fill="#141b22" stroke={art.paint.wheel} strokeWidth="3" />

      {/* Steering wheel, in front of the binnacle */}
      <circle cx="476" cy="660" r="132" fill="none" stroke="#191d23" strokeWidth="28" />
      <circle cx="476" cy="660" r="132" fill="none" stroke={art.paint.wheel} strokeWidth="4" opacity="0.45" />
      <path
        d="M 476 660 L 476 546 M 476 660 L 384 724 M 476 660 L 568 724"
        stroke="#191d23"
        strokeWidth="20"
        strokeLinecap="round"
      />
      <circle cx="476" cy="660" r="36" fill="#232830" />

      {/* Passenger seat, in the near field */}
      <path d="M 1120 600 Q 1080 720 1100 900 L 1400 900 Q 1360 720 1330 600 Z" fill="#1a1e24" />
      <path d="M 1120 600 Q 1200 566 1330 600 L 1320 660 Q 1200 630 1130 660 Z" fill="#232830" />
      {/* Centre console with the selector */}
      <path d="M 900 600 L 1080 600 L 1120 900 L 860 900 Z" fill="#12161b" />
      <rect x="946" y="700" width="30" height="86" rx="14" fill={art.paint.wheel} opacity="0.85" />
      <circle cx="961" cy="812" r="24" fill="#242a31" />
    </g>
  );
}

export interface VehicleIllustrationProps {
  /** The vehicle's id â€” the art is a pure function of this. */
  vehicleId: string;
  /** Which of the four views to draw. */
  view?: ArtworkView;
  /** Accessible name for the vehicle, used to build the alt text. */
  vehicleName: string;
  className?: string;
  /**
   * Shows the `ILLUSTRATIVE` badge. Defaults to true. Only the hero turns this
   * off, because the hero already carries a permanent disclosure line.
   */
  showBadge?: boolean;
  /** Hide the small view caption (hero and cards do not need it). */
  showCaption?: boolean;
}

/**
 * Renders the illustrative artwork for a vehicle, or `null` when that vehicle
 * has no artwork registered.
 *
 * Returning `null` is the important part: the caller then renders the honest
 * "Photography pending" panel, so an unknown vehicle is never given a
 * substitute image.
 */
export function VehicleIllustration({
  vehicleId,
  view = "three-quarter",
  vehicleName,
  className,
  showBadge = true,
  showCaption = false,
}: VehicleIllustrationProps) {
  const art = getVehicleArtwork(vehicleId);
  if (!art) return null;

  const g = bodyGeometry(art.archetype);
  // Gradient ids must be unique per rendered instance, otherwise two
  // illustrations on one page would share (and clobber) each other's <defs>.
  const uid = `va-${vehicleId.slice(0, 8)}-${view}`;

  const viewLabel = art.viewLabels[view];
  const alt =
    view === "cabin"
      ? `Stylised cabin and dashboard illustration. Not a photograph of this vehicle's interior.`
      : `${vehicleName} â€” ${viewLabel.toLowerCase()}, not a photograph.`;

  return (
    <div className={cn("relative h-full w-full overflow-hidden", className)}>
      <svg
        viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
        role="img"
        aria-label={alt}
      >
        <title>{`${vehicleName} â€” ${viewLabel}. Illustrative artwork, not a photograph.`}</title>
        <StudioBackdrop uid={uid} art={art} />
        {view === "profile" ? (
          <ProfileView uid={uid} art={art} g={g} />
        ) : view === "front" ? (
          <FrontView uid={uid} art={art} g={g} />
        ) : view === "cabin" ? (
          <CabinView uid={uid} art={art} />
        ) : (
          <ThreeQuarterView uid={uid} art={art} g={g} />
        )}
      </svg>

      {showBadge ? (
        <span className="pointer-events-none absolute left-2.5 top-2.5 z-10 inline-flex items-center gap-1.5 rounded-sm border border-gold-500/50 bg-graphite-950/80 px-2 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-gold-300 backdrop-blur-sm">
          Illustrative
        </span>
      ) : null}

      {/* Bottom-LEFT, because the gallery puts its own "1 / 4" counter in the
          bottom-right corner of the same frame. */}
      {showCaption ? (
        <span className="pointer-events-none absolute bottom-2.5 left-2.5 z-10 rounded-sm bg-graphite-950/75 px-2 py-1 text-[0.6rem] uppercase tracking-[0.14em] text-ink-300 backdrop-blur-sm">
          {VIEW_CAPTIONS[view]}
        </span>
      ) : null}
    </div>
  );
}

/**
 * The disclosure shown next to any illustrative imagery. Rendered once per
 * surface so the distinction is stated in words, not just a small badge.
 */
export function IllustrativeNotice({ className }: { className?: string }) {
  return (
    <p
      className={cn(
        "flex items-start gap-2 rounded-md border border-gold-500/30 bg-gold-500/[0.07] px-3 py-2.5 text-xs leading-relaxed text-ink-300",
        className
      )}
    >
      <Info aria-hidden className="mt-0.5 size-3.5 shrink-0 text-gold-400" />
      <span>
        <strong className="font-semibold text-gold-300">Illustrative artwork, not photography.</strong>{" "}
        These are original vector illustrations drawn for this demonstration fleet. They show
        the vehicle type and its published colour, but they are not photographs of a real car
        and not renders of the specific unit being offered. Upload real photographs per vehicle
        in the dashboard, and they replace this artwork automatically.
      </span>
    </p>
  );
}

