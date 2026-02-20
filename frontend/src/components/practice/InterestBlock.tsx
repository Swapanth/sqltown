// import React, { useState } from "react";

// const InterestBlock: React.FC<{ onView?: () => void }> = ({ onView }) => {
//   const isFullscreen = !onView;
//   const examples = [
//     {
//       title: "Get all customers",
//       query: "SELECT * FROM Customers LIMIT 10;",
//     },
//     {
//       title: "Top rated restaurants",
//       query: "SELECT * FROM Restaurants WHERE rating > 4.5 ORDER BY rating DESC;",
//     },
//     {
//       title: "Recent orders",
//       query: "SELECT * FROM Orders ORDER BY order_date DESC LIMIT 5;",
//     },
//     {
//       title: "Count menu items",
//       query: "SELECT category, COUNT(*) as count FROM MenuItems GROUP BY category;",
//     },
//   ];

//   const [copied, setCopied] = useState<number | null>(null);

//   const copyQuery = (query: string, index: number) => {
//     navigator.clipboard.writeText(query);
//     setCopied(index);
//     setTimeout(() => setCopied(null), 2000);
//   };

//   return (
//     <div className={`bg-white p-4 rounded shadow ${!isFullscreen ? 'mb-4' : 'h-full overflow-auto'}`}>
//       <div className="flex justify-between items-center mb-3">
//         <h2 className={`font-semibold ${isFullscreen ? 'text-xl' : 'text-lg'}`}>
//           {isFullscreen ? '' : '⚡ Quick Queries'}
//         </h2>
//         {onView && (
//           <button onClick={onView} className="text-blue-500 text-sm hover:underline">
//             View More
//           </button>
//         )}
//       </div>

//       <div className="space-y-2">
//         {(isFullscreen ? examples : examples.slice(0, 3)).map((example, i) => (
//           <div key={i} className="bg-gray-50 p-2 rounded border">
//             <div className="flex justify-between items-center mb-1">
//               <span className="text-xs font-semibold text-gray-700">
//                 {example.title}
//               </span>
//               <button
//                 onClick={() => copyQuery(example.query, i)}
//                 className="text-xs text-blue-500 hover:underline"
//               >
//                 {copied === i ? "✓ Copied" : "Copy"}
//               </button>
//             </div>
//             <code className="text-xs text-gray-600 block overflow-x-auto">
//               {example.query}
//             </code>
//           </div>
//         ))}
//       </div>

//       {!isFullscreen && (
//         <p className="text-xs text-gray-500 mt-3 italic">
//           Click any query to copy and paste into the terminal
//         </p>
//       )}
//     </div>
//   );
// };

// export default InterestBlock;
