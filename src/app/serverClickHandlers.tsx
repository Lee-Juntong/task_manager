"use server";
import { prisma } from "@/db";

//Toggle the complete status of a task
export async function handleComplteToggleClick(id: string) {
  "use server";
  const task = await prisma.task.findUnique({
    where: { id }
  });
  if (task) {
    await prisma.task.update({
      where: { id },
      data: { complete: !task.complete }
    });
  }
}

//Delete a task
export async function handleDeleteClick(id: string) {
  "use server";
  await prisma.task.delete({
    where: { id }
  });
}
