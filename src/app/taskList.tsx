import { TaskItem } from "@/components/TaskItem";
import { handleComplteToggleClick, handleDeleteClick } from "./serverClickHandlers";
import { Task } from "@prisma/client";

//takes in a list of Task and returns a <ul> representation of the list
export function taskList(tasks: Task[]) {
  return (
    <ul className="pl-4">
      {tasks.map((task) => (
        <TaskItem key={task.id} {...task} handleComplteToggleClick={handleComplteToggleClick} handleDeleteClick={handleDeleteClick} />
      ))}
    </ul>
  );
}
