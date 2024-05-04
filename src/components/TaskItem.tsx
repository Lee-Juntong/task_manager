"use client"
import { DateTime } from 'luxon';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

type TaskItemProps = {
    id: string
    title: string
    description: string
    dueDate: Date
    complete: boolean
    handleComplteToggleClick: (id: string) => void
    handleDeleteClick: (id: string) => void
}

//Renders a single task item
//Allow the user to toggle the display of the description, mark the task as complete, delete the task, and edit the task
//States are used for real time client side rendering
export function TaskItem({ id, title, description, dueDate, complete, handleComplteToggleClick, handleDeleteClick }: TaskItemProps) {
    //states
    const [showDescription, setShowDescription] = useState(false)
    const [client_taskComplete, setTaskComplete] = useState(complete)
    const [client_delete, setDelete] = useState(false)
    const [isConfirming, setConfirming] = useState(false)
    const [delete_msg_visible, setDelete_msg_visible] = useState(false)

    //client side handlers
    const handleToggleDescription = () => {
        setShowDescription(!showDescription)
    }
    const handleComplteToggleClick_client = () => {
        setTaskComplete(!client_taskComplete)
        handleComplteToggleClick(id)
    }
    const handleDeleteClick_client = () => {
        setDelete(true)
        setConfirming(false)
        handleDeleteClick(id)
        setDelete_msg_visible(true)
        setTimeout(() => {
            setDelete_msg_visible(false)
        }, 2000)
    }
    const handleDeletePreConfirmClick_client = () => {
        setConfirming(true)
    }

    //This is done at client side as it's not affecting the database yet
    //The update is done in the edit page, which is server side
    const router = useRouter()
    const handleEditClick = () => {
        router.push(`/edit?id=${id}`)
    }

    return (
        <li className="flex gap-1 items-center">

            <div>
                <p><strong style={{
                    fontSize: '1.5rem'
                }}
                    className={client_delete ? 'line-through text-red-700' : client_taskComplete ? 'line-through text-gray-400/75' : ''}
                >
                    {title}</strong>
                    <br />
                    <span className={client_delete ? 'line-through text-red-700' : client_taskComplete ? 'text-gray-400/75' : ''}>
                        Due Date: {DateTime.fromJSDate(dueDate).toFormat('dd LLL yyyy')}
                    </span>
                </p>

                <button
                    onClick={handleToggleDescription}
                    className={client_delete ? 'cursor-pointer  text-red-400' : "cursor-pointer text-blue-500"}
                >
                    {showDescription ? 'Hide Description' : 'Show Description'}
                </button>
                {showDescription && (
                    <div className={client_delete ? "text-red-700 mt-2" : "mt-2"}>
                        <strong>Description:</strong> {description}
                    </div>
                )}
            </div>
            {
                !client_delete && !isConfirming &&
                <div className="ml-auto space-x-2">
                    <button
                        className="border border-slate-300 text-slate-300 px-2 py-1 rounded hover:bg-slate-700 focus-within:bg-slate-700 outline-none"
                        onClick={handleComplteToggleClick_client}>
                        {client_taskComplete ? 'Not Done' : 'Done'}
                    </button>

                    <button
                        className="border border-slate-300 text-slate-300 px-2 py-1 rounded hover:bg-slate-700 focus-within:bg-slate-700 outline-none"
                        onClick={handleEditClick}
                    >
                        Edit
                    </button>

                    <button
                        className="border border-slate-300 text-slate-300 px-2 py-1 rounded hover:bg-slate-700 focus-within:bg-slate-700 outline-none"
                        onClick={handleDeletePreConfirmClick_client}>
                        Delete
                    </button>
                </div>
            }
            {isConfirming && (
                <div className="ml-auto modal space-x-2">
                    <p>Are you sure you want to delete this task?</p>
                    <button className="border border-slate-300 text-red-600 px-2 py-1 rounded hover:bg-slate-700 focus-within:bg-slate-700 outline-none"
                        onClick={handleDeleteClick_client}>
                        Confirm
                    </button>
                    <button className="border border-slate-300 text-green-500 px-2 py-1 rounded hover:bg-slate-700 focus-within:bg-slate-700 outline-none"
                        onClick={() => setConfirming(false)}>
                        Cancel
                    </button>
                </div>
            )}
            {
                client_delete &&
                <div
                    className={`ml-auto alert alert-success ${delete_msg_visible ? 'alert-shown' : 'alert-hidden'}`}
                    onTransitionEnd={() => setDelete_msg_visible(false)}
                >
                    <strong>Task Deleted!</strong>
                </div>
            }
        </li>
    )
}