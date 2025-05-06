import { View } from '@tarojs/components';

/**
 * Radio组件的属性
 */
export interface RadioProps {
  /**
   *单选框的值
   */
  value: string;
  /**
   * 单选框右侧显示的文本
   */
  label?: string;
  /**
   * 选中状态
   */
  checked?: boolean;
  /**
   * 选中时的回调，把新值传递给该函数的第一个参数
   */
  handleClick?: Function;
  /**
   * 内联样式
   */
  style?: any;
  /**
   * 类名
   */
  className?: string;
}

/**
 * 一个单选框，你应该跟RadioGroups组件配合使用该组件，而不应该单独使用，详情见RadioGroups组件的使用方法
 */
const Radio: React.FC<RadioProps> = (props) => {
  let { label, value, checked, style, className } = props;
  if (label === undefined) label = value;
  if (checked === undefined) checked = false;

  const click = () => {
    props.handleClick && props.handleClick(value);
  };

  return (
    <View className={className} style={{ display: 'flex', alignItems: 'center', ...style }} onClick={click}>
      <View
        style={{
          position: 'relative',
          borderRadius: '50%',
          border: '1px solid #328CCB',
          width: '1em',
          height: '1em',
          marginRight: '8px'
        }}
      >
        <View
          style={{
            position: 'absolute',
            width: '75%',
            height: '75%',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            background: '#328CCB',
            borderRadius: '50%',
            display: checked ? 'block' : 'none'
          }}
        ></View>
      </View>
      <View>{label}</View>
    </View>
  );
};

/**
 * 单选框组组件属性，配合Radio组件使用
 */
export interface RadioGroupsProps {
  /**
   * 当前被选中的单选框的value值
   */
  current: string;
  /**
   * 选中新单选框时的回调，新值会传递给该函数的第一个参数
   */
  onChange?: Function;
  /**
   * 子组件，该组件内只能包含Radio组件
   */
  children?: JSX.Element[] | any;
  /**
   * 内联样式
   */
  style?: any;
  /**
   * 类名
   */
  className?: string;
}

/**
 * 单选框组组件
 * @example
 * const [curr, setCurr] = useState('1');
 *
 * const change = (newVal) => {
 *  setCurr(newVal);
 * };
 *
 * <RadioGroups current={curr} onChange={change} style={{ display: 'flex' }}>
 *  <Radio style={{ marginRight: '16px' }} label='选项一' value='1' />;
 *  <Radio style={{ marginRight: '16px' }} label='选项二' value='2' />;
 * </RadioGroups>
 */
const RadioGroups: React.FC<RadioGroupsProps> = (props) => {
  const { children, current, style } = props;
  const handleClick = (val) => {
    props.onChange && props.onChange(val);
  };
  return (
    <View style={style}>
      {children.map((v) => {
        let { label, value, checked, style: style1 } = v.props;
        if (label === undefined) label = value;
        if (checked === undefined) {
          checked = value == current;
        }
        return (
          <Radio style={style1} key={value} label={label} value={value} checked={checked} handleClick={handleClick} />
        );
      })}
    </View>
  );
};

export { Radio, RadioGroups };
