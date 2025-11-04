import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

const validStatuses = [
  'AVAILABLE',
  'BOOKED',
  'RESERVED',
  'UNDER_MAINTENANCE',
  'OUT_OF_SERVICE',
]

export async function PATCH(req, { params }) {
  const bedId = params.bedId

  try {
    const body = await req.json()
    const status = body.status

    // Validate status
    if (!status) {
      return NextResponse.json({ error: 'Status is required' }, { status: 400 })
    }

    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
        { status: 400 }
      )
    }

    // Update bed status
    const updatedBed = await db.bed.update({
      where: { id: bedId },
      data: { status },
    })

    return NextResponse.json(updatedBed)
  } catch (error) {
    console.error('Error updating bed status:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
