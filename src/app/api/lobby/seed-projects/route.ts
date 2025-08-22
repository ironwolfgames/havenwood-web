import { NextRequest, NextResponse } from 'next/server'
import { adminOperations } from '@/lib/database-operations'

export async function POST(request: NextRequest) {
  try {
    // Seed shared projects
    const sharedProjects = await adminOperations.seedSharedProjects()
    
    return NextResponse.json({
      message: 'Shared projects seeded successfully',
      projects: sharedProjects
    })
  } catch (error) {
    console.error('Error seeding shared projects:', error)
    return NextResponse.json(
      { message: 'Failed to seed shared projects', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}