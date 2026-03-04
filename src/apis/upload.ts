import Taro from '@tarojs/taro'
import dayjs from 'dayjs'
import storage from '@/utils/storage/token'
import { urlUploadImg } from '@/utils/url'

export const uploadImgApi = (filePath: any) => {
  return new Promise<string>((resolve, reject) =>
    Taro.uploadFile({
      url:
        urlUploadImg ??
        (() => {
          throw new Error('图片上传URL未配置')
        })(),
      filePath: filePath,
      name: 'img',
      header: {
        Authorization: storage.getToken(),
      },
      formData: {
        from: 'mp',
        time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      },
      success(res) {
        const resData = JSON.parse(res.data)
        if (resData.code !== 200 || resData.data == null) {
          reject('图片上传失败')
          return
        }
        resolve(resData.data.url)
      },
    })
  )
}
