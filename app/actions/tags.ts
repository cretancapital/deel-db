"use server"

import { getTenantContext } from "@/lib/tenantDb";
import { revalidatePath } from "next/cache";

export async function addTagToContractor(contractorId: string, tag: string) {
  try {
    const { Contractor } = await getTenantContext();
    await Contractor.findOneAndUpdate(
      { _id: contractorId },
      { $addToSet: { tags: tag } }
    );
    revalidatePath("/dashboard/contractors");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function removeTagFromContractor(contractorId: string, tag: string) {
  try {
    const { Contractor } = await getTenantContext();
    await Contractor.findOneAndUpdate(
      { _id: contractorId },
      { $pull: { tags: tag } }
    );
    revalidatePath("/dashboard/contractors");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getAvailableTags() {
  try {
    const { Tag } = await getTenantContext();
    const tags = await Tag.find().lean();
    return { success: true, tags: tags.map(t => ({ id: t._id.toString(), name: t.name, color: t.color })) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createTag(name: string, color: string = "#e2e8f0") {
  try {
    const { Tag } = await getTenantContext();
    const tag = await Tag.create({ name, color });
    return { success: true, tag: { id: tag._id.toString(), name: tag.name, color: tag.color } };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
