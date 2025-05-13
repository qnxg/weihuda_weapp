import { View } from '@tarojs/components';
import classNames from 'classnames';
import React from 'react';

import styles from './index.module.scss';
import type { CSSProperties } from 'react';

interface Props {
  children: React.ReactNode;
  current: number;
  index: number;
  style?: CSSProperties | string;
}

const Index: React.FC<Props> = (props) => {
  return (
    <View
      className={classNames({
        [styles.item]: true,
        [styles.select]: props.current === props.index,
        [styles.unselect]: props.current !== props.index
      })}
      style={{ width: `${props.index > props.current ? '0' : '100%'}` }}
    >
      {props.children}
    </View>
  );
};

export default Index;
