// import React, { useState } from "react";
// import PullToRefresh from "react-simple-pull-to-refresh";

// const CustomRefresh = () => {
//     const [pullProgress, setPullProgress] = useState(0);

//     const radius = 20;
//     const circumference = 2 * Math.PI * radius;
//     const offset = circumference - pullProgress * circumference;

//     const icon = (
//         <div className="flex justify-center items-center h-20">
//             <svg height={50} width={50}>
//                 <circle
//                     cx={25}
//                     cy={25}
//                     r={radius}
//                     stroke="#0ea5e9"
//                     strokeWidth={4}
//                     fill="none"
//                     strokeDasharray={circumference}
//                     strokeDashoffset={offset}
//                     style={{ transition: "stroke-dashoffset 0.1s ease" }}
//                 />
//             </svg>
//         </div>
//     );

//     const loading = (
//         <div className="flex justify-center items-center h-20">
//             <svg
//                 className="animate-spin h-6 w-6 text-blue-500"
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="none"
//                 viewBox="0 0 24 24"
//             >
//                 <circle
//                     className="opacity-25"
//                     cx="12"
//                     cy="12"
//                     r="10"
//                     stroke="currentColor"
//                     strokeWidth="4"
//                 />
//                 <path
//                     className="opacity-75"
//                     fill="currentColor"
//                     d="M4 12a8 8 0 018-8v8z"
//                 />
//             </svg>
//         </div>
//     );

//     return (
//         <PullToRefresh
//             onRefresh={() => new Promise(res => setTimeout(res, 2000))}
//             pullDownThreshold={80}
//             resistance={2.5}
//             icon={icon}
//             loading={loading}
//         >
//             <div className="p-6 bg-white rounded shadow max-w-md mx-auto">
//                 <h2 className="text-xl font-bold">Pull me down 😎</h2>
//                 <p className="text-gray-600">Custom circular refresh in action</p>
//             </div>
//         </PullToRefresh>
//     );
// };

// export default CustomRefresh;
