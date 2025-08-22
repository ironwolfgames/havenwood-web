import { NextRequest, NextResponse } from 'next/server'
import { adminOperations, factionOperations } from '@/lib/database-operations'

export async function GET(request: NextRequest) {
  try {
    // Try to get existing factions first
    let factions = await factionOperations.getAll()
    
    // If no factions exist, seed them
    if (factions.length === 0) {
      factions = await adminOperations.seedFactions()
    }
    
    return NextResponse.json(factions)
  } catch (error) {
    console.error('Error fetching factions:', error)
    return NextResponse.json(
      { message: 'Failed to fetch factions' },
      { status: 500 }
    )
  }
}