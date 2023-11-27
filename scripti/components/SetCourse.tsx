'use client'
import { Dispatch, SetStateAction, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { setCourse } from '@/utils/serverActions';
import { useFormState } from 'react-dom';
import SubmitButton from './SubmitButton';

const SetCourse = ({close}:{close: Dispatch<SetStateAction<boolean>>}) => {
    const [state, formAction] = useFormState(setCourse, {message: ''});
    const router = useRouter();
    useEffect(() => {
        if (state.message) {
            router.refresh();
            close((prev) => !prev);
        }
    }, [state]);
    return (
<form className='z-20 absolute bg-white rounded-md shadow-lg p-5 gap-3'
action={formAction}>
    <div className="grid grid-cols-2 gap-4">
        <div>
            <label htmlFor="title" className='font-semibold'>Title</label>
            <input type="text" name="title" id="title" className='p-2 border border-gray-300 rounded-md w-full'/>
        </div>
        <div>
            <label htmlFor="controlForm" className='font-semibold'>Form of control</label>
            <select name="controlForm" id="controlForm" className='p-2 border border-gray-300 rounded-md w-full'>
                <option value="exam">Exam</option>
                <option value="offset">Offset</option>
            </select>
        </div>
        <div>
            <label htmlFor="teacherLectures" className='font-semibold'>Teacher Lectures</label>
            <input type="text" name="teacherLectures" id="teacherLectures" className='p-2 border border-gray-300 rounded-md w-full'/>
        </div>
        <div>
            <label htmlFor="lecturesLink" className='font-semibold'>Lectures Link</label>
            <input type="text" name="lecturesLink" id="lecturesLink" className='p-2 border border-gray-300 rounded-md w-full'/>
        </div>
        <div>
            <label htmlFor="teacherPractices" className='font-semibold'>Teacher Practices</label>
            <input type="text" name="teacherPractices" id="teacherPractices" className='p-2 border border-gray-300 rounded-md w-full'/>
        </div>
        <div>
            <label htmlFor="practicesLink" className='font-semibold'>Practices Link</label>
            <input type="text" name="practicesLink" id="practicesLink" className='p-2 border border-gray-300 rounded-md w-full'/>
        </div>
    </div>
    <div>
        <label htmlFor="notes" className='font-semibold'>Notes</label>
        <input type="text" name="notes" id="notes" className='p-2 border border-gray-300 rounded-md w-full'/>
    </div>
    <div className="flex justify-center gap-3 mt-4">
        <SubmitButton text='Add'/>
        <button onClick={() => close((prev) => !prev)} type="button" className='btn-outlined-gray'>Close</button>
    </div>
</form>

    )
}

export default SetCourse;