"use client";
import { Dispatch, SetStateAction } from "react";
import SubmitButton from "components/SubmitButton";
import { useSet } from "hooks/useSet";

const SetTask: React.FC<{ close: Dispatch<SetStateAction<boolean>> }> = ({
  close,
}) => {
  const formAction = useSet(close, "task");
  return (
    <form
      className="z-20 absolute mx-[47%] flex flex-col m-auto bg-white rounded-md shadow-lg p-5 gap-3"
      action={formAction}
    >
      <label htmlFor="title" className="font-semibold">
        Title
      </label>
      <input
        type="text"
        name="title"
        id="title"
        className="p-2 border border-gray-300 rounded-md"
      />

      <label htmlFor="course" className="font-semibold">
        Course
      </label>
      <input
        type="text"
        name="course"
        id="course"
        className="p-2 border border-gray-300 rounded-md"
      />

      <label htmlFor="date" className="font-semibold">
        Deadline
      </label>
      <input
        type="date"
        name="date"
        id="date"
        className="p-2 border border-gray-300 rounded-md"
      />

      <label htmlFor="description" className="font-semibold">
        Description
      </label>
      <input
        type="text"
        name="description"
        id="description"
        className="p-2 border border-gray-300 rounded-md"
      />

      <SubmitButton text="Save" />
      <button
        onClick={() => close((prev) => !prev)}
        type="button"
        className="btn-outlined-gray block mx-auto"
      >
        Close
      </button>
    </form>
  );
};

export default SetTask;
