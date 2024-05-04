"use client"
import React, { useState } from 'react';
import { Task } from '@prisma/client';
import { taskList } from '@/app/taskList';

//Takes in the list name and the list of tasks
//Returns a collapsible list where the user can toggle the display of the list
export function CollapsibleList({ listName, tasks }: { listName: string, tasks: Task[] }) {
    const [show, setShow] = useState(false)
    const handleDisplayToggle = () => {
        setShow(!show)
    }
    return (
        <div>
            <h2 style={{ fontSize: '1.5rem', fontFamily: 'Palatino'}}>
                {listName}
                <button
                    onClick={handleDisplayToggle}
                    className=" hover:scale-125 text-fuchsia-400 font-bold"
                >
                    {show ? "▾" : "▴"}
                </button>
            </h2>

            <div className={show ? "block" : "hidden"}>
                {taskList(tasks)}
            </div>
        </div>
    );
}