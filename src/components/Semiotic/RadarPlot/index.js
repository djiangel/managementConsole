import * as React from 'react';
import OrdinalFrame from 'semiotic/lib/OrdinalFrame';

type Props = {
  frameProps?: any
};

const RadarPlot = ({ frameProps }: Props) => <OrdinalFrame {...frameProps} />;

export default RadarPlot;

// FRAME PROPS EXAMPLE
// const frameProps = {
//     /* --- Data --- */
//       data: [{ name: "Pikachu", color: "#e0d33a", attribute: "attack", value: 55, defense: 40, speed: 90, hp: 35 },
//         { name: "Pikachu", color: "#e0d33a", attribute: "defense", value: 40 }, ... ],

//     /* --- Size --- */
//       size: [500,450],
//       margin: { left: 40, top: 50, bottom: 75, right: 120 },

//     /* --- Layout --- */
//       type: "point",
//       connectorType: function(e){return e.name},
//       projection: "radial",

//     /* --- Process --- */
//       oAccessor: "attribute",
//       rAccessor: "value",
//       rExtent: [0],

//     /* --- Customize --- */
//       style: function(e){return{fill:e.color,stroke:"white",strokeOpacity:.5}},
//       connectorStyle: function(e){return{fill:e.source.color,stroke:e.source.color,strokeOpacity:.5,fillOpacity:.5}},
//       title: "Pokemon Base Stats",
//       foregroundGraphics:  [
//         <g transform="translate(440, 73)" key="legend">
//           <text key={1} fill={"#ac58e5"}>
//             New York
//           </text>
//           <text key={1} y={20} fill={"#E0488B"}>
//             Las Vegas
//           </text>
//           <text key={1} y={40} fill={"#9fd0cb"}>
//             San Diego
//           </text>
//           <text key={1} y={60} fill={"#e0d33a"}>
//             Denver
//           </text>
//           <text key={1} y={80} fill={"#7566ff"}>
//             Oakland
//           </text>
//         </g>
//       ],
//       axes: true,

//     /* --- Interact --- */
//       pieceHoverAnnotation: true,

//     /* --- Annotate --- */
//       oLabel: true
//     }
