import HelloHandwritingMulti from "./components/HelloHandwritingMulti";
import { HELLO_PATHS, HELLO_VIEWBOX, HELLO_META } from "./assets/hello_paths";

export default function App() {
  return (
    <div
      style={{
        background: "linear-gradient(to bottom right, #6a5acd, #00bcd4)",
        width: "100vw",
        height: "100vh",
        display: "grid",
        placeItems: "center",
      }}
    >
      <HelloHandwritingMulti
        paths={HELLO_PATHS}
        viewBox={HELLO_VIEWBOX}
        stroke={HELLO_META.stroke}
        strokeWidth={HELLO_META.strokeWidth}
        delaySec={0.2}
        drawSec={2.0}
        gapSec={0.05}
        width={600}
        height={200}
      />
    </div>
  );
}
