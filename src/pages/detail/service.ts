import Taro from '@tarojs/taro';
import { urlArticleContent } from '@/utils/url';

export default async function (id: string) {
  const res = await Taro.request({
    url: urlArticleContent,
    data: {
      id: id
    }
  });
  return res.data;
}
