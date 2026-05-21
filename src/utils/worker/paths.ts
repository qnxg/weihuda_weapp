/** Worker 根目录，与 app.config.ts 中 workers 字段一致 */
export const WORKERS_ROOT = 'workers'

/** 工作量证明 Worker 入口（相对小程序根目录的绝对路径） */
export const POW_WORKER_SCRIPT = `${WORKERS_ROOT}/pow/index.js`
