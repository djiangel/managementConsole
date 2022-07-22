import * as React from 'react';
import OrdinalFrame from 'semiotic/lib/OrdinalFrame';

type Props = {
  frameProps?: any
};

const PieChart = ({ frameProps }: Props) => <OrdinalFrame {...frameProps} />;

export default PieChart;

// FRAME PROPS EXAMPLE
// const frameProps = {
//     /* --- Data --- */
//       data: [{ user: "Jason", tweets: 40, retweets: 5, favorites: 15 },
//         { user: "Susie", tweets: 5, retweets: 25, favorites: 100 } ],

//     /* --- Size --- */
//       size: [300,300],
//       margin: 70,

//     /* --- Layout --- */
//       type: "bar",
//       projection: "radial",
//       dynamicColumnWidth: "tweets",

//     /* --- Process --- */
//       oAccessor: "user",

//     /* --- Customize --- */
//       style: { fill: "#ac58e5", stroke: "white" },
//       title: "Tweets",

//     /* --- Annotate --- */
//       oLabel: true
//     }
