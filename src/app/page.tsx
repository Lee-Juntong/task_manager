import { prisma } from "@/db";
import Link from "next/link";
import { CollapsibleList } from "@/components/CollapsibleList";

//Force vercel to read changes
//We do not need these if deployed locally
export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

function gettasks() {
  return prisma.task.findMany()
}

//If a is before b, return negative
function dateCompare(a: Date, b: Date) {
  const dateA = a.getTime()
  const dateB = b.getTime()
  return dateA - dateB
}

export default async function Home() {

  const tasks = await gettasks()
  const sortedTasks = tasks.sort((a, b) => dateCompare(a.dueDate, b.dueDate))

  const completedTasks = sortedTasks.filter((task) => task.complete)
  const overdueTasks = sortedTasks.filter((task) => (!task.complete && (dateCompare(task.dueDate, new Date()) < 0)))
  const upcomingTasks = sortedTasks.filter((task) => (!task.complete && (dateCompare(task.dueDate, new Date()) >= 0)))

  return (
    <>
      <header style={{ fontSize: '2rem', fontFamily: 'Cursive' }} className="flex justify-between items-center mb-4">
        <h1 style={{ fontSize: '3rem' }}>Task Manager</h1>
        <Link
          className="border border-orange-300 text-orange-400 px-2 py-1 rounded hover:bg-slate-700 focus-within:bg-slate-700 outline-none " href="/new">
          New Task
        </Link>
      </header>
      <CollapsibleList listName='Completed Tasks' tasks={completedTasks} />
      <CollapsibleList listName='Overdue Tasks' tasks={overdueTasks} />
      <CollapsibleList listName='Upcoming Tasks' tasks={upcomingTasks} />
    </>
  )
}
