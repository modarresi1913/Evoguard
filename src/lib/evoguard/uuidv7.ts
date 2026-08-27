import { v7 as uuidv7 } from 'uuid';

export function generateDecisionId(): string {
  return uuidv7();
}

export function parseDecisionId(id: string): { timestamp: number; version: number } {
  const bytes = Buffer.from(id.replace(/-/g, ''), 'hex');
  const ms =
    ((bytes[0] & 0x0f) << 56) |
    (bytes[1] << 48) |
    (bytes[2] << 40) |
    (bytes[3] << 32) |
    (bytes[4] << 24) |
    (bytes[5] << 16);
  return {
    timestamp: ms,
    version: (bytes[0] >> 4) & 0x0f,
  };
}
