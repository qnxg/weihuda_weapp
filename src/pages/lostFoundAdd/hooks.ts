import useGraphql from '@/hooks/useGraphql';
import { useState } from 'react';
import Taro from '@tarojs/taro';

const useSendAddLostFound = () => {
  const [reqData, setReqData] = useState({});
  // 给后端发送请求
  const { run } = useGraphql(
    {
      operationName: 'addLostFound',
      query: `
            mutation addLostFound($data: InputLostFound) {
              addLostFound(data: $data){
                id
                type
                name
                desc
                images {
                  num
                  url
                }
                image_cound
                contact
                stu_id
                card_num
                status
                createTime
                image_count
                place
              }
            }
          `,
      variables: {
        data: reqData
      }
    },
    {
      manual: true,
      onSuccess() {
        // 发布成功了
        Taro.showToast({
          icon: 'success',
          title: '发布成功',
          duration: 500,
          success() {
            setTimeout(() => {
              // 返回

              Taro.eventCenter.trigger('lfArticlePublishDone');
              Taro.navigateBack({ delta: 1 });
            }, 500);
          }
        });
      },
      onError: () => {
        Taro.showToast({
          icon: 'none',
          title: '服务器发生错误'
        });
      }
    }
  );
  return {
    reqData,
    setReqData,
    run
  };
};

export default useSendAddLostFound;
