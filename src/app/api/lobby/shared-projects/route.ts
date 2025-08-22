import { NextRequest, NextResponse } from 'next/server'
import { sharedProjectOperations } from '@/lib/database-operations'

export async function GET(request: NextRequest) {
  try {
    const projects = await sharedProjectOperations.getAll()
    return NextResponse.json(projects)
  } catch (error) {
    console.error('Error fetching shared projects:', error)
    return NextResponse.json(
      { message: 'Failed to fetch shared projects' },
      { status: 500 }
    )
  }
}