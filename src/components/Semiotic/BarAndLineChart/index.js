import * as React from 'react';
import OrdinalFrame from 'semiotic/lib/OrdinalFrame';

type Props = {
  frameProps?: any
};

const BarAndLineChart = ({ frameProps }: Props) => (
  <OrdinalFrame {...frameProps} />
);

export default BarAndLineChart;

// FRAME PROPS EXAMPLE
// const frameProps = {
//     /* --- Data --- */
//       data: [{ sales: 5, leads: 150, month: "Jan" },
//         { sales: 7, leads: 100, month: "Feb" } ],

//     /* --- Size --- */
//       size: [700,500],
//       margin: { top: 60, bottom: 50, left: 60, right: 60 },

//     /* --- Layout --- */
//       type: {
//         type: "point",
//         customMark: d => {
//           if (d.rIndex === 1) {
//             return <circle r={6} fill={"#E0488B"} />;
//           }
//           return <rect height={d.scaledValue} width={20} x={-10} fill={"#ac58e5"} />;
//         }
//       },
//       connectorType: function(e){return 0!==e.rIndex&&e.rIndex},
//       oPadding: 10,

//     /* --- Process --- */
//       oAccessor: "month",
//       rAccessor: ["leads","sales"],
//       rExtent: [0],

//     /* --- Customize --- */
//       style: { fill: "#ac58e5", opacity: 1, stroke: "white" },
//       connectorStyle: { stroke: "#E0488B", strokeWidth: 3 },
//       title:
//       (
//         <text>
//           <tspan fill={"#E0488B"}>Sales</tspan> vs{" "}
//           <tspan fill={"#ac58e5"}>Leads</tspan>
//         </text>
//       )
//       ,
//       axes:
//       [
//         {
//           key: "leads-axis",
//           orient: "right",
//           ticks: 3,
//           tickValues: [0, 25, 50, 75, 100, 125, 150, 175, 200],
//           label: (
//             <text fontWeight="bold" fill={"#ac58e5"}>
//               Leads
//             </text>
//           )
//         },
//         {
//           key: "sales-axis",
//           orient: "left",
//           tickValues: [0, 1, 2, 3, 4, 5, 6, 7],
//           label: (
//             <text fontWeight="bold" fill={"#E0488B"}>
//               Sales
//             </text>
//           )
//         }
//       ]
//       ,
//       multiAxis: true,

//     /* --- Draw --- */
//       renderOrder: ["pieces","connectors"],

//     /* --- Interact --- */
//       pieceHoverAnnotation: [{ type: "highlight", style: { stroke: "white", fill: "none", strokeWidth: 4, strokeOpacity: 0.5 } },
//         { type: "frame-hover" }],

//     /* --- Annotate --- */
//       tooltipContent: d => {
//         const bothValues = [
//           <div style={{ color: "#ac58e5" }} key={"1"}>
//             Leads: {d.leads}
//           </div>,
//           <div style={{ color: "#E0488B" }} key="2">
//             Sales: {d.sales}
//           </div>
//         ];
//         const content = d.rIndex === 0 ? bothValues : bothValues.reverse();
//         return (
//           <div style={{ fontWeight: 900 }} className="tooltip-content">
//             {content}
//           </div>
//         );
//       }
//       ,
//       oLabel: true
//     }
