import type {TranscriptionSegment} from '../types/apiResponse.types'

export const fullText = (segments : TranscriptionSegment[]) => {
    return segments.map(s => s.text).join('');
}