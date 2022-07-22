import * as React from 'react';
import NetworkFrame from 'semiotic/lib/NetworkFrame';

type Props = {
  frameProps?: any
};

const Hierarchy = ({ frameProps }: Props) => <NetworkFrame {...frameProps} />;

export default Hierarchy;

//FRAME PROPS EXAMPLE
// const theme = ["#ac58e5","#E0488B","#9fd0cb","#e0d33a","#7566ff","#533f82","#7a255d","#365350","#a19a11","#3f4482"]
// const frameProps = {
// /* --- Data --- */
//   edges: { name: "flare", children: [{ name: "analytics", children: [{ name: "cluster", children: [{ name: "AgglomerativeCluster", value: 3938 },
//               { name: "CommunityStructure", value: 3812 } ] },
//           { name: "graph", children: [{ name: "BetweennessCentrality", value: 3534 },
//               { name: "LinkDistance", value: 5731 } ] } ] },
//       { name: "animate", children: [{ name: "Easing", value: 17010 },
//           { name: "FunctionSequence", value: 5842 } ] } ] },

// /* --- Size --- */
//   size: [700,400],
//   margin: 10,

// /* --- Layout --- */
//   networkType: "tree",

// /* --- Process --- */
//   nodeIDAccessor: "name",

// /* --- Customize --- */
//   nodeStyle: d => ({
//     fill: theme[d.depth],
//     stroke: theme[d.depth],
//     fillOpacity: 0.6
//   }),
//   edgeStyle: d => ({
//     fill: theme[d.source.depth],
//     stroke: theme[d.source.depth],
//     opacity: 0.5
//   }),
//   filterRenderedNodes: d => d.depth !== 0,

// /* --- Interact --- */
//   hoverAnnotation: [
//     { type: "desaturation-layer", style: { fill: "white", fillOpacity: 0.25 } },
//     {
//       type: "highlight",
//       style: d => ({
//         fill: theme[d.depth],
//         stroke: theme[d.depth],
//         fillOpacity: 0.6
//       })
//     },
//     { type: "frame-hover" }
//   ],

// /* --- Annotate --- */
//   tooltipContent: d => (
//     <div className="tooltip-content">
//       {d.parent ? <p>{d.parent.data.name}</p> : undefined}
//       <p>{d.data.name}</p>
//     </div>),
//   nodeLabels: d => {
//     return d.depth > 1 ? null : (
//       <g transform="translate(0,-15)">
//         <text
//           fontSize="12"
//           textAnchor="middle"
//           strokeWidth={2}
//           stroke="white"
//           fill="white"
//         >
//           {d.id}
//         </text>
//         <text fontSize="12" textAnchor="middle" fill={theme[d.depth]}>
//           {d.id}
//         </text>
//       </g>
//     )
//   }
// }
