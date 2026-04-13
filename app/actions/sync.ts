"use server"

import { auth } from "@/auth";
import { getTenantContext } from "@/lib/tenantDb";
import dbConnect from "@/lib/mongodb";
import mongoose from "mongoose";

export async function syncDeelContractors() {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    await dbConnect();
    
    // Fetch the account to get the access token
    const db = mongoose.connection.db;
    if (!db) throw new Error("Database connection failed");
    
    const account = await db.collection("accounts").findOne({ 
      userId: new mongoose.Types.ObjectId(session.user.id),
      provider: "deel"
    });

    if (!account || !account.access_token) {
      throw new Error("No Deel account connected");
    }

    // In a real app, check if token is expired and refresh it using refresh_token
    // if (account.expires_at * 1000 < Date.now()) { ... refresh logic ... }

    // Mock fetching from Deel API
    // const response = await fetch("https://api.deel.com/rest/v2/contracts", {
    //   headers: { Authorization: `Bearer ${account.access_token}` }
    // });
    // const data = await response.json();
    
    // Mock data for demonstration
    const mockContractors = [
      { id: "deel_1", name: "Alice Smith", email: "alice@example.com", country: "US", job_title: "Frontend Developer" },
      { id: "deel_2", name: "Bob Jones", email: "bob@example.com", country: "UK", job_title: "Backend Developer" },
    ];

    const { Contractor } = await getTenantContext();

    for (const c of mockContractors) {
      await Contractor.findOneAndUpdate(
        { deelId: c.id },
        { 
          name: c.name, 
          email: c.email, 
          country: c.country, 
          job_title: c.job_title 
        },
        { upsert: true, new: true }
      );
    }

    return { success: true, count: mockContractors.length };
  } catch (error: any) {
    console.error("Sync error:", error);
    return { success: false, error: error.message };
  }
}
