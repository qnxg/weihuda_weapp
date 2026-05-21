import Taro from '@tarojs/taro'

function unwrapWorkerMessage(
  res: Taro.Worker.OnMessageCallbackResult | TaroGeneral.IAnyObject
): TaroGeneral.IAnyObject | undefined {
  if (res && typeof res === 'object' && 'message' in res) {
    const wrapped = res as Taro.Worker.OnMessageCallbackResult
    if (wrapped.message !== undefined && wrapped.message !== null) {
      return wrapped.message
    }
  }
  if (res && typeof res === 'object' && 'type' in res) {
    return res as TaroGeneral.IAnyObject
  }
  return undefined
}

export function isWorkerUnsupportedError(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err)
  return /not support|不支持|Worker 返回数据无效/i.test(msg)
}

/**
 * 通过 Taro.createWorker 执行一次性 Worker 任务（完成后自动 terminate）
 *
 * @see https://docs.taro.zone/docs/apis/worker/createWorker
 */
export function runWorkerTask<TResponse>(
  scriptPath: string,
  payload: TaroGeneral.IAnyObject,
  parseMessage: (message: TaroGeneral.IAnyObject) => TResponse
): Promise<TResponse> {
  return new Promise((resolve, reject) => {
    let worker: Taro.Worker
    try {
      worker = Taro.createWorker(scriptPath)
    } catch (err) {
      reject(err instanceof Error ? err : new Error(String(err)))
      return
    }

    let settled = false

    const finish = () => {
      if (settled) {
        return
      }
      settled = true
      worker.terminate()
    }

    worker.onProcessKilled(() => {
      finish()
      reject(new Error('Worker 线程被系统回收'))
    })

    worker.onMessage(res => {
      finish()
      const message = unwrapWorkerMessage(res)
      if (!message) {
        reject(new Error('Worker 返回数据无效'))
        return
      }
      try {
        resolve(parseMessage(message))
      } catch (err) {
        reject(err instanceof Error ? err : new Error(String(err)))
      }
    })

    try {
      worker.postMessage(payload)
    } catch (err) {
      finish()
      reject(err instanceof Error ? err : new Error(String(err)))
    }
  })
}
