import type {
  StreamingConfigMessage,
  StreamingReadyToStopMessage,
  StreamingServerMessage,
  StreamingSnapshotMessage,
  StreamingUpdateMessage,
} from './streaming.type';

export function isStreamingConfigMessage(
  message: StreamingServerMessage
): message is StreamingConfigMessage {
  return message.type === 'config';
}

export function isStreamingSnapshotMessage(
  message: StreamingServerMessage
): message is StreamingSnapshotMessage {
  return message.type === 'snapshot';
}

export function isStreamingUpdateMessage(
  message: StreamingServerMessage
): message is StreamingUpdateMessage {
  return message.type === 'diff';
}

export function isStreamingReadyToStopMessage(
  message: StreamingServerMessage
): message is StreamingReadyToStopMessage {
  return message.type === 'ready_to_stop';
}