

export const CAR_STATUS = ['pending', 'published', 'paused', 'finished', 'completed', 'sold'] as const
export type CarStatus = typeof CAR_STATUS[number] 