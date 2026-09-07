import type { ReadingDashboardResponse } from "../types/dashboard";

const apiUrl = import.meta.env.VITE_API_URL;

export async function getReadingDashboard(): Promise<ReadingDashboardResponse> {
    const response = await fetch(`${apiUrl}/dashboard/reading`)

    if(!response.ok) {
        throw new Error('Failed to load reading dashboard')
    }
    return response.json()
}