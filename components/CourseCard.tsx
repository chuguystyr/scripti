"use client";
import Link from "next/link";
import { RiDeleteBin7Fill } from "react-icons/ri";
import { FaEdit, FaWindowClose } from "react-icons/fa";
import { useEffect, useState } from "react";
import { editCourse, deleteCourse } from "utils/serverActions";
import { useFormState } from "react-dom";
import SubmitButton from "./SubmitButton";
import { useRouter } from "next/navigation";

interface Props {
  title: string;
  teacherLectures: string;
  lecturesLink: string;
  teacherPractices: string;
  practicesLink: string;
  controlForm: string;
  notes: string;
  id: string;
}

const CourseCard = (props: Props) => {
  const router = useRouter();
  const [editable, setEditable] = useState(false);
  const [data, setData] = useState<Props>(props);
  const [state, formAction] = useFormState(editCourse, { message: "" });
  useEffect(() => {
    if (state.message) {
      setEditable(false);
    }
  }, [state]);
  return (
    <div className="card w-fit h-fit p-4 bg-white shadow rounded">
      {!editable ?
        <>
          <div className="flex justify-between">
            <h1 className="text-center text-lg font-bold mb-3">
              {props.title}
            </h1>
            <FaEdit
              className="inline-block ml-[15vw] cursor-pointer"
              onClick={() => setEditable(true)}
            />
            <RiDeleteBin7Fill
              className="cursor-pointer"
              onClick={() => {
                deleteCourse(props.id);
                router.refresh();
              }}
            />
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="block mx-auto font-mono font-semibold">
              {props.controlForm}
            </span>
          </div>
          <div className="grid grid-cols-[1fr_2fr_0.5fr] gap-2 mb-2">
            <span>Lectures</span>
            <span>{props.teacherLectures}</span>
            <Link
              href={props.lecturesLink}
              className="text-blue-600 hover:text-blue-800"
            >
              Link
            </Link>
          </div>
          <div className="grid grid-cols-[1fr_2fr_0.5fr] gap-2 mb-2">
            <span>Practices</span>
            <span>{props.teacherPractices}</span>
            <Link
              href={props.practicesLink}
              className="text-blue-600 hover:text-blue-800"
            >
              Link
            </Link>
          </div>
          {props.notes && (
            <div className="grid grid-cols-[1fr_2fr_0.5fr] gap-2 mb-2">
              <span>Notes</span>
              <p className="col-span-2">{props.notes}</p>
            </div>
          )}
        </>
      : <form
          action={formAction}
          className="z-20 absolute  flex flex-col bg-white rounded-md shadow-lg p-5 gap-3"
        >
          <FaWindowClose
            className="cursor-pointer block mx-auto mb-1 text-gray-600 hover:text-gray-800"
            onClick={() => setEditable(false)}
          />
          <div className="grid grid-cols-2 gap-4">
            <input
              className="text-center font-bold p-2 rounded border border-gray-300 w-full"
              type="text"
              placeholder="Course Title"
              value={data.title}
              onChange={(e) => setData({ ...data, title: e.target.value })}
              name="title"
            />
            <select
              className="p-2 rounded border border-gray-300 w-full text-center"
              value={data.controlForm}
              onChange={(e) =>
                setData({ ...data, controlForm: e.target.value })
              }
              name="controlForm"
            >
              <option value="exam">Exam</option>
              <option value="offset">Offset</option>
            </select>
            <input
              className="p-2 rounded border border-gray-300 w-full text-center"
              type="text"
              value={data.teacherLectures}
              onChange={(e) =>
                setData({ ...data, teacherLectures: e.target.value })
              }
              placeholder="Teacher of Lectures"
              name="teacherLectures"
            />
            <input
              className="text-center p-2 rounded border border-gray-300 w-full"
              type="text"
              placeholder="Lectures Link"
              value={data.lecturesLink}
              onChange={(e) =>
                setData({ ...data, lecturesLink: e.target.value })
              }
              name="lecturesLink"
            />
            <input
              className="text-center p-2 rounded border border-gray-300 w-full"
              type="text"
              placeholder="Teacher Practices"
              value={data.teacherPractices}
              onChange={(e) =>
                setData({ ...data, teacherPractices: e.target.value })
              }
              name="teacherPractices"
            />
            <input
              className="text-center p-2 rounded border border-gray-300 w-full"
              type="text"
              placeholder="Practices Link"
              value={data.practicesLink}
              onChange={(e) =>
                setData({ ...data, practicesLink: e.target.value })
              }
              name="practicesLink"
            />
            <textarea
              className="p-2 rounded border border-gray-300 w-full"
              placeholder="Notes about the course"
              value={data.notes}
              onChange={(e) => setData({ ...data, notes: e.target.value })}
              name="notes"
            ></textarea>
            <input type="text" name="id" value={props.id} hidden />
            <SubmitButton text="Save" />
          </div>
        </form>
      }
    </div>
  );
};

export default CourseCard;
