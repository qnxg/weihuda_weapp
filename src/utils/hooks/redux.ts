import { useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from '@/models'
import type { TypedUseSelectorHook} from 'react-redux';

/** 没什么别的，就是加了type的`useDispatch` */
export const useAppDispatch: () => AppDispatch = useDispatch

/** 没什么别的，就是加了type的`useSelector` */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
