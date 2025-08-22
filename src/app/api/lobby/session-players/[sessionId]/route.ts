import { NextRequest, NextResponse } from 'next/server'
import { sessionPlayerOperations } from '@/lib/database-operations'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params
    const players = await sessionPlayerOperations.getSessionPlayers(sessionId)
    return NextResponse.json(players)
  } catch (error) {
    console.error('Error fetching session players:', error)
    return NextResponse.json(
      { message: 'Failed to fetch session players' },
      { status: 500 }
    )
  }
}