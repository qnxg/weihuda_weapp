import { useState } from 'react';
import Taro from '@tarojs/taro';
import { View, Input, Textarea, Image, Button } from '@tarojs/components';
import styles from './index.module.scss';
import { Radio, RadioGroups } from '@/components/Radio';
import useSendAddLostFound from './hooks';
import { LostAndFoundArticle } from '@/pages/information/components/LostFoundCard';
import storage from '@/utils/storage';
import { dateFormat } from '@/utils/tool';
import { urlUploadImg } from '@/utils/url';

const Index: React.FC = () => {
  const list = [
    { label: '招领帖', value: 'found', checked: true },
    { label: '寻物帖', value: 'lost', checked: false }
  ];

  // 物品名称
  const [data, setData] = useState({
    type: 'found',
    name: '',
    place: '',
    desc: '',
    contact: '',
    imgUrl: ''
  });

  // 改变表单的内容
  const change = (key, newVal) => {
    setData({
      ...data,
      [key]: newVal
    });
  };

  // 选择图片
  const handleChoose = () => {
    Taro.chooseImage({
      count: 1,
      success(res) {
        const imgUrl = res.tempFilePaths[0];
        setData({
          ...data,
          imgUrl
        });
      }
    });
  };

  // 提交数据
  const { setReqData, run } = useSendAddLostFound();
  const submitData = (data) => {
    // 初始化
    let reqData: LostAndFoundArticle = {
      type: data.type,
      name: data.name,
      desc: data.desc,
      place: data.place,
      images: [],
      contact: data.contact,
      stu_id: storage.getUserInfo().stuId,
      status: 0,
      createTime: Date.now() + '',
      card_num: '',
      image_count: 0
    };

    // 赋值图片信息
    if (data.imgUrl !== '') {
      reqData.images.push({
        num: 0,
        url: data.imgUrl
      });
      reqData.image_count = 1;
    }

    setReqData(reqData);
    setTimeout(() => {
      (async () => {
        await run();
      })();
    }, 0);
  };

  // 点击提交按钮
  const handleSubmit = () => {
    // 验证
    if (data.name === '') {
      Taro.showToast({ title: '请先填写物品名称', icon: 'none' });
      return;
    }
    if (data.place === '') {
      Taro.showToast({ title: '请先填写捡/失物地点', icon: 'none' });
      return;
    }
    if (data.desc === '') {
      Taro.showToast({ title: '请先填写描述信息', icon: 'none' });
      return;
    }

    // 上传图片
    if (data.imgUrl !== '') {
      // 如果有图片那就先上传图片，拿到图片地址后再提交表单
      Taro.showToast({ title: '正在上传图片', icon: 'loading' });
      Taro.uploadFile({
        // url: 'http://localhost:4000/upload-img',
        url: urlUploadImg,
        filePath: data.imgUrl,
        name: 'file',
        header: {
          Authorization: storage.getToken().token
        },
        formData: {
          stu_id: storage.getUserInfo().stuId,
          time: `${dateFormat(Date.now()).ymd} timestamp: ${Date.now()}`
        },
        success(res) {
          let resData = JSON.parse(res.data);
          if (resData.status !== 'success') {
            Taro.showToast({ title: resData.err_msg, icon: 'none' });
            return;
          }
          Taro.showToast({ title: '上传图片成功', icon: 'none' });
          Taro.showToast({ title: '正在提交', icon: 'loading' });
          submitData({
            ...data,
            imgUrl: resData.data[0]
          });
        }
      });
    } else {
      // 没有选择图片直接提交
      Taro.showToast({ title: '正在提交', icon: 'loading' });
      submitData({
        ...data
      });
    }
  };

  return (
    <View className={styles.container}>
      <View className={styles.title}>类型：</View>
      <RadioGroups
        current={data.type}
        onChange={(newVal) => {
          change('type', newVal);
        }}
        style={{ display: 'flex' }}
      >
        {list.map((v) => {
          return <Radio style={{ marginRight: '16px' }} key={v.value} label={v.label} value={v.value} />;
        })}
      </RadioGroups>
      <View className={styles.title} style={{ marginTop: '30px;' }}>
        物品名称：
      </View>
      <Input
        value={data.name}
        onInput={(e) => {
          change('name', e.target.value);
        }}
        className={styles.input}
        type='text'
        placeholder='请输入物品名称，必填。'
      />
      <View className={styles.title} style={{ marginTop: '30px;' }}>
        {data.type === 'found' ? '捡物地点' : '失物地点'}
      </View>
      <Input
        value={data.place}
        onInput={(e) => {
          change('place', e.target.value);
        }}
        className={styles.input}
        type='text'
        placeholder={`请输入${data.type === 'found' ? '捡物地点' : '失物地点'}，必填。`}
      />
      <View className={styles.title} style={{ marginTop: '30px;' }}>
        描述：
      </View>
      <View className={styles.input}>
        <Textarea
          value={data.desc}
          onInput={(e) => {
            change('desc', e.target.value);
          }}
          placeholder='请填写描述信息，必填。'
        />
        <View className={styles.upload}>
          <View className={styles.content}>
            {data.imgUrl !== '' && (
              <View className={styles.image}>
                <Image src={data.imgUrl}></Image>
              </View>
            )}
            {data.imgUrl === '' && (
              <View className={styles.uploadButton} onClick={handleChoose}>
                <View className={styles.uploadIcon}></View>
                <View className={styles.placeholder}>请上传图片，选填。</View>
              </View>
            )}
          </View>
        </View>
      </View>
      <View className={styles.title} style={{ marginTop: '30px;' }}>
        联系方式：
      </View>
      <Input
        value={data.contact}
        onInput={(e) => {
          change('contact', e.target.value);
        }}
        className={styles.input}
        type='text'
        placeholder='请留下你的联系方式，选填。'
      />

      <View style={{ marginTop: '30px' }}>
        <Button onClick={handleSubmit} className={styles.submitButton}>
          提交
        </Button>
      </View>
    </View>
  );
};

export default Index;
