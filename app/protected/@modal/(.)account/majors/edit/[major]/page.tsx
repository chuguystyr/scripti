import Modal from "components/Modal"
import { editMajor } from "server/actions/account"

const EditMajorModal: React.FC<{
  params: Promise<{ major: string }>
}> = async ({ params }) => {
  const { major } = await params
  const decodedMajor = decodeURI(major)
  return (
    <Modal>
      <form
        action={editMajor}
        className="flex flex-col w-fit mx-auto mb-4 rounded-md p-2 gap-4 bg-white"
      >
        <label htmlFor="major" className="text-center font-semibold">
          Major
        </label>
        <input
          defaultValue={decodedMajor}
          name="newMajor"
          id="newMajor"
          className="input bg-slate-300"
        />
        <input type="hidden" value={decodedMajor} name="major" readOnly />
        <button type="submit" className="btn-filled">
          Save
        </button>
      </form>
    </Modal>
  )
}

export default EditMajorModal
