// "use client";
// import CourseCard from "components/CourseCard";
// import SetCourse from "components/SetCourse";
// import { useState } from "react";

// interface Props {
//   title: string;
//   teacherLectures: string;
//   lecturesLink: string;
//   teacherPractices: string;
//   practicesLink: string;
//   controlForm: string;
//   notes: string;
//   id: string;
// }

// const Courses = ({ courses }: { courses: Props[] }) => {
//   const [show, setShow] = useState(false);
//   return (
//     <>
//       {courses.length === 0 ?
//         <>
//           {!show && (
//             <p className="text-center">
//               Looks like you&apos;re first time here.
//               <br />
//               Let&apos;s add some courses to use in schedule
//             </p>
//           )}
//           {!show && (
//             <button
//               type="button"
//               className="btn-filled block mx-auto w-10 mt-5"
//               onClick={() => setShow((prev) => !prev)}
//             >
//               Add Courses
//             </button>
//           )}
//           {show && <SetCourse close={setShow} />}
//         </>
//       : <>
//           <div className="flex flex-col md:flex-row items-center my-4">
//             <input
//               type="text"
//               className="py-2 px-4 rounded-md border border-gray-300 w-full mr-5 md:w-auto"
//               placeholder="Search"
//             />
//             <div className="w-[20vw] flex gap-3 mt-3 md:mt-0">
//               <button type="button" className="btn-filled">
//                 Search
//               </button>
//               <button
//                 type="button"
//                 className="btn-filled"
//                 onClick={() => setShow((prev) => !prev)}
//               >
//                 Add Course
//               </button>
//               {show && <SetCourse close={setShow} />}
//             </div>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
//             {courses &&
//               courses.map((course, index) => {
//                 return <CourseCard key={index} {...course} />;
//               })}
//           </div>
//         </>
//       }
//     </>
//   );
// };

// export default Courses;
