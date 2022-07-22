import * as React from 'react';
import OrdinalFrame from 'semiotic/lib/OrdinalFrame';

type Props = {
  frameProps?: any
};

const BarChart = ({ frameProps }: Props) => <OrdinalFrame {...frameProps} />;

export default BarChart;

// FRAME PROPS EXAMPLE
// const frameProps = {
//     /* --- Data --- */
//       data: [{ user: "Jason", tweets: 10, retweets: 5, favorites: 15 },
//         { user: "Susie", tweets: 5, retweets: 100, favorites: 100 }],

//     /* --- Size --- */
//       size: [200,200],

//     /* --- Layout --- */
//       type: "bar",

//     /* --- Process --- */
//       oAccessor: "user",
//       rAccessor: "tweets",

//     /* --- Customize --- */
//       style: { fill: "#ac58e5", stroke: "white" },
//       title: "Tweets",

//     /* --- Annotate --- */
//       oLabel: true
//     }
