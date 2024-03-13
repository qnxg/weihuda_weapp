import { View } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import * as entities from 'entities';
import React, { useEffect, useState } from 'react';
import styles from './index.module.scss';
import fetchContent from './service';

const regCloseSelf = /\/ *>$/;

const fixImgStyle = ' style="" width="" mode="widthFix" show-menu-by-longpress >';
const fixImgStyleClose = ' style="" width="" mode="widthFix" show-menu-by-longpress />';
const regImage = /<img[^>]*>/gi;
export const fixImageStyle = (html: string): string => {
  return html.replace(regImage, (match) =>
    regCloseSelf.test(match) ? match.replace(regCloseSelf, fixImgStyleClose) : match.replace(/>$/gi, fixImgStyle)
  );
};

const Index: React.FC = () => {
  const router = useRouter();
  const [title, setTitle] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [content, setContent] = useState('');
  useEffect(() => {
    (async () => {
      const { id, title: _title, address: _address, date: _date } = router.params;
      await Taro.setNavigationBarTitle({
        title: _title as string
      });
      setTitle(_title as string);
      setDate(_date as string);
      setAddress(_address as string);
      let res = await fetchContent(id as string);
      // res = res.replace(/<img/gi, '<img style="position: relative; left: 50%; width: 80%; height: auto"');
      res = fixImageStyle(res);
      res = res.replace(
        /\/weihuda\/static\/froala-editor\/php\/upload/gi,
        'https://qnxg.net/weihuda/static/froala-editor/php/upload'
      );
      res = entities.decodeHTML5(res);
      setContent(res);
    })();
  }, [router]);

  return (
    <View className={styles.container}>
      <View className={styles.titleContainer}>
        <View className={styles.title}>{title}</View>
        <View className={styles.extra}>
          {address.length !== 0 ? (
            <View>
              <View className={styles.address} />
              {address}
            </View>
          ) : null}
          {date.length !== 0 ? (
            <View>
              <View className={styles.date} />
              {date}
            </View>
          ) : null}
        </View>
      </View>
      <View className={styles.contentContainer}>
        {content && <View className={styles.content} dangerouslySetInnerHTML={{ __html: content }} />}
      </View>
    </View>
  );
};

export default Index;
