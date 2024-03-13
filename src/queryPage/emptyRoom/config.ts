import { EmptyRoomState, Radio } from './interface';

export const radio: Radio[] = [
  {
    checked: true,
    id: '01,02',
    text: ['1-2节', '8 : 00-9 : 40']
  },
  {
    checked: false,
    id: '03,04',
    text: ['3-4节', '10 : 00-11 : 40']
  },
  {
    checked: false,
    id: '05,06',
    text: ['5-6节', '14 : 30-16 : 00']
  },
  {
    checked: false,
    id: '07,08',
    text: ['7-8节', '16 : 10-17 : 40']
  },
  {
    checked: false,
    id: '09,10,11',
    text: ['9-11节', '19 : 00-21 : 35']
  }
];

export function initFunction(weekNum: number, dayOfWeek: number): EmptyRoomState {
  const temp = [0];
  let tempWeek = 0;
  if (weekNum >= 0) {
    tempWeek = weekNum > 17 ? 17 : weekNum;
  }
  temp.push(tempWeek);
  temp.push(dayOfWeek);

  return {
    pickerValue: temp,
    radioValue: radio
  };
}
