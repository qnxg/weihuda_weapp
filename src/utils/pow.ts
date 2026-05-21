import CryptoJS from 'crypto-js'

import { POW_WORKER_SCRIPT } from '@/utils/worker/paths'
import {
  isWorkerUnsupportedError,
  runWorkerTask,
} from '@/utils/worker/runWorkerTask'

interface PowSolveRequest {
  type: 'solve'
  challenge: string
  difficulty: number
}

interface PowWorkerResultMessage {
  type: 'result'
  nonce: number
}

interface PowWorkerErrorMessage {
  type: 'error'
  message: string
}

type PowWorkerMessage = PowWorkerResultMessage | PowWorkerErrorMessage

function parsePowWorkerMessage(message: TaroGeneral.IAnyObject): number {
  const data = message as PowWorkerMessage
  if (data.type === 'result') {
    return data.nonce
  }
  if (data.type === 'error') {
    throw new Error(data.message || '工作量证明失败')
  }
  throw new Error('工作量证明失败')
}

function solvePowOnMainThread(
  challenge: string,
  difficulty: number
): Promise<number> {
  return new Promise(resolve => {
    resolve(solvePowChallenge(challenge, difficulty))
  })
}

/**
 * 计算工作量证明 nonce：优先 Taro Worker，不支持时回退主线程
 *（Windows 微信开发者工具不支持 Worker，需在真机验证 Worker 路径）
 */
export function solvePowInWorker(
  challenge: string,
  difficulty: number
): Promise<number> {
  const payload: PowSolveRequest = {
    type: 'solve',
    challenge,
    difficulty,
  }
  return runWorkerTask(POW_WORKER_SCRIPT, payload, parsePowWorkerMessage).catch(
    err => {
      if (isWorkerUnsupportedError(err)) {
        return solvePowOnMainThread(challenge, difficulty)
      }
      throw err
    }
  )
}

function sha256(ascii: string): string {
  return CryptoJS.SHA256(ascii).toString(CryptoJS.enc.Hex)
}

export function solvePowChallenge(
  challenge: string,
  difficulty: number
): number {
  let i = 0
  const prefix = '0'.repeat(difficulty)
  while (true) {
    const hash = sha256(`${challenge}:${i}`)
    if (hash.startsWith(prefix)) {
      return i
    }
    i++
  }
}
