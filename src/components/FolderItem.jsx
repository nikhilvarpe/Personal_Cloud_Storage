import { FolderIcon, Trash } from "lucide-react";
import { Link } from "react-router-dom";

export default function FolderItem({ folder, onDelete }) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-md border p-3">
      <Link
        to={{
          pathname: `/folder/${folder.id}`,
          state: { folder: folder },
        }}
        className="flex flex-grow items-center gap-2 truncate"
      >
        <FolderIcon />
        <span className="truncate">{folder.name}</span>
      </Link>
      <button
        className="btn btn-sm btn-error btn-outline"
        onClick={() => onDelete(folder)}
      >
        <Trash size={16} />
      </button>
    </div>
  );
}
