import CryptoJS from 'crypto-js'
import forge from 'node-forge'

/**
 * 绑定密码 RSA 公钥
 */
export const BIND_RSA_PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA0Z0KfeZ0d5zXaL0LvCKP
o6FtvbUeOE28y1k7OWnMNAkkkKrsUAlgVSWxBjUXUgsz24J6Ce4F0vmVlJjrpQnF
/08vlUKu/3F3nN56wYzxNXar177ms0qQ9pZYR3d3kHjWAfq8IWpyJqgbJpa+QcJP
IYjVN0ZL/wQ7yDV19zCTC7uqZsjoqgXT2oyutjCCfUn9a6PNOthtPS5TjazhOVSq
C5GA8kvKKPuMPjGoX4ANdtaikfpSaw0WF4EiViJJ3PEl7fEw35vzE4A3notWUuTh
5E4NN28Re4oD3ZB5lmL32lkJRgjUAdZgnbi5SBHsNRoGu+QGKrFOCmyqMpoDKIwU
BwIDAQAB
-----END PUBLIC KEY-----`

let cachedPublicKey: forge.pki.rsa.PublicKey | null = null

function getPublicKey(): forge.pki.rsa.PublicKey {
  if (!cachedPublicKey) {
    cachedPublicKey = forge.pki.publicKeyFromPem(BIND_RSA_PUBLIC_KEY)
  }
  return cachedPublicKey
}

/**
 * 使用 RSA-2048 公钥加密绑定密码（PKCS#1 v1.5），输出 Base64
 *
 * crypto-js 仅支持对称算法，RSA 由 node-forge 完成，密文 Base64 由 crypto-js 编码
 */
export function encryptBindPassword(plainPassword: string): string {
  const encryptedBinary = getPublicKey().encrypt(
    forge.util.encodeUtf8(plainPassword),
    'RSAES-PKCS1-V1_5'
  )
  return CryptoJS.enc.Base64.stringify(
    CryptoJS.enc.Latin1.parse(encryptedBinary)
  )
}
