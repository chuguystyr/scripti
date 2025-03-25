import Modal from "components/Modal"
import { addMajor } from "server/actions/account"
const AddMajorModal = () => {
  return (
    <Modal>
      <form
        action={addMajor}
        className="flex flex-col w-fit mx-auto mb-4 rounded-md p-2 gap-4 bg-white"
      >
        <label htmlFor="major" className="text-center font-semibold">
          Major
        </label>
        <input
          type="text"
          name="major"
          id="major"
          className="input bg-slate-300"
        />
        <button type="submit" className="btn-filled">
          Add
        </button>
      </form>
    </Modal>
  )
}
export default AddMajorModal
