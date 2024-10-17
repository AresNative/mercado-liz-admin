import { Tooltip } from "@nextui-org/react";
import { EyeIcon } from "@/assets/icons/eyeicon";
import { DeleteIcon } from "@/assets/icons/deleteicon";

export default function ItemWithActions({ id, setDisabled, column }) {
  return (
    <div className="flex items-center justify-between px-4 py-2 bg-cyan-600 text-white rounded-lg shadow">
      <span>{id}</span>
      <div className="flex space-x-2">
        <Tooltip content="Details">
          <span
            className="text-lg text-default-400 cursor-pointer active:opacity-50"
            onClick={() => alert(`Ver detalles de: ${id}`)}
            onMouseEnter={() => setDisabled(true)}
            onMouseLeave={() => setDisabled(false)}
          >
            <EyeIcon />
          </span>
        </Tooltip>
        <Tooltip content="Delete user" color="danger">
          <span
            className="text-lg text-danger cursor-pointer active:opacity-50"
            onClick={() => alert(`Eliminar: ${id}`)}
            onMouseEnter={() => setDisabled(true)}
            onMouseLeave={() => setDisabled(false)}
          >
            <DeleteIcon />
          </span>
        </Tooltip>
      </div>
    </div>
  );
}
