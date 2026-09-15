import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { Trash2 } from 'lucide-react'
const DeleteAction = ({ handleDelete, row, deleteType }) => {
    return (
        <DropdownMenuItem
            key="delete"
            onClick={() => handleDelete([row.original._id], deleteType)}
            className='cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive'
        >
            <Trash2 className='size-4' />
            Delete
        </DropdownMenuItem>
    )
}

export default DeleteAction