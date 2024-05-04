import { prisma } from "@/db";
import Link from "next/link";
import { redirect } from "next/navigation";

//Create a new task based on user input
//After creating the task, redirect to the home page
async function createtask(data: FormData) {
    "use server"
    const title = data.get("title")?.valueOf();
    const description = (data.get("description")?.valueOf() || "").toString() // use toString() to ensure description is always a string
    const dueDateString = (data.get("dueDate")?.valueOf() || "").toString()

    const dueDate = new Date(dueDateString)

    if (typeof title !== "string" || title.length === 0) {
        throw new Error("Wrong title");
    }

    await prisma.task.create({
        data: {
            title,
            description,
            complete: false,
            dueDate,
        },
    });
    redirect("/");
}

export default function Page() {
    
    return (
        <>
            <header style={{ fontSize: '1.5rem', fontFamily: 'Cursive' }} className="flex justify-between items-center mb-4">
                <h1 className="text-2xl">New Task</h1>
            </header>
            <form action={createtask} className="flex gap-2 flex-col">

                <input
                    type="text"
                    name="title"
                    className="border border-slate-300 bg-transparent rounded px-2 py-1 outline-none focus-within:border-slate-100"
                    placeholder="Title"
                    maxLength={50}
                    required
                />
                <input
                    type="text"
                    name="description"
                    className="border border-slate-300 bg-transparent rounded px-2 py-1 outline-none focus-within:border-slate-100"
                    placeholder="Description (optional)"
                />
                <input
                    type="date"
                    name="dueDate"
                    max="2100-12-31"
                    min="2000-01-01"
                    className="border border-slate-300 bg-transparent rounded px-2 py-1 outline-none focus-within:border-slate-100"
                    required
                />
                <div className="flex gap-1 justify-end">
                    <Link
                        href=".."
                        className="border border-slate-300 text-slate-300 px-2 py-1 rounded hover:bg-slate-700 focus-within:bg-slate-700 outline-none"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        className="border border-slate-300 text-slate-300 px-2 py-1 rounded hover:bg-slate-700 focus-within:bg-slate-700 outline-none"
                    >
                        Create
                    </button>
                </div>
            </form>
        </>
    )
}