import { prisma } from "@/db";
import { DateTime } from "luxon";
import Link from "next/link";
import { redirect } from "next/navigation";

const error_msg = "Task not found! You are not entering this page the right way!"

async function updateTask(id: string, data: FormData) {
    "use server"
    const title = data.get("title")?.valueOf();
    const description = (data.get("description")?.valueOf() || "").toString() // use toString() to ensure description is always a string
    const dueDateString = (data.get("dueDate")?.valueOf() || "").toString()

    const dueDate = new Date(dueDateString)

    if (typeof title !== "string" || title.length === 0) {
        throw new Error("Wrong title");
    }

    await prisma.task.update({
        where: { id },
        data: { title: title, description: description, dueDate: dueDate }
    })
    redirect("/");
}

async function findTask(id: string) {
    "use server"
    return await prisma.task.findUnique({
        where: { id }
    })
}

//func must be a function, taking str and FormData as arguments
async function actionWrapper(str: string, func: any) {
    "use server"
    return async function (formData: FormData): Promise<void> {
        "use server"
        await func(str, formData)
    }
}

export default async function Page({
    searchParams
  }: {
    searchParams?: { id?: string }
  }) {

    const id = searchParams?.id

    if (typeof id !== "string") {
        return (
            <h1>
                <p>{error_msg}</p>
                <p>not a string</p>
            </h1>)
    }
    let current_task;

    try {
        current_task = await findTask(id);
    } catch (e) {
        return (
            <h1>
                <p>{error_msg}</p>
                <p>can't find task</p>
            </h1>
        );
    }

    if (!current_task) {
        return (
            <h1>
                {error_msg}
            </h1>
        );
    }
    const updateTask_action = await actionWrapper(id, updateTask)
    const current_due_date_DT = DateTime.fromJSDate(current_task.dueDate).toISODate()
    if (!current_due_date_DT) {
        return (
            <h1>
t                <p>This task is not created properly as due date is missing.</p>
                <p>Consider checking the logic of creating tasks</p>
            </h1>
        );
    }
    return (
        <>
            <header className="flex justify-between items-center mb-4">
                <h1 className="text-2xl">Update</h1>
            </header>
            <form action={updateTask_action} className="flex gap-2 flex-col">

                <input
                    type="text"
                    name="title"
                    className="border border-slate-300 bg-transparent rounded px-2 py-1 outline-none focus-within:border-slate-100"
                    placeholder="Title"
                    maxLength={50}
                    defaultValue={current_task.title}
                    required
                />
                <input
                    type="text"
                    name="description"
                    className="border border-slate-300 bg-transparent rounded px-2 py-1 outline-none focus-within:border-slate-100"
                    placeholder="Description (optional)"
                    defaultValue={current_task.description}
                />
                <input
                    //the format shown in the date input field is left as default, so it will be depending on the user's browser/system settings
                    type="date"
                    name="dueDate"
                    max="2100-12-31"
                    min="2000-01-01"
                    defaultValue={current_due_date_DT}
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
                        Update
                    </button>
                </div>
            </form>
        </>
    )
}