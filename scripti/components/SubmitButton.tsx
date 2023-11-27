'use client'

import { useFormStatus } from "react-dom";

const SubmitButton = ({text}:{text: string}) => {
    const { pending } = useFormStatus();
    return (
        <button type="submit" className="btn-filled" aria-disabled={pending}>
        {text}
        </button>
    );
}

export default SubmitButton;