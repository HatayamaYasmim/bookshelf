import type { ReadingDashboardResponse } from "../types/dashboard";
import { apiFetch } from "./api";

export async function getReadingDashboard(): Promise<ReadingDashboardResponse> {
    const response = await apiFetch('/dashboard/reading')

    if(!response.ok) {
        throw new Error('Failed to load reading dashboard')
    }
    return response.json()
}