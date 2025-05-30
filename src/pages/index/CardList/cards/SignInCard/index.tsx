import { Text, View } from "@tarojs/components";
import { useEffect } from "react";
import style from "./index.module.scss";
import { getJifenTotalApi } from "@/apis/jifen";
import Card from "@/components/Card";
import SignButton from "@/pages/jifen/components/Qiandao/SignButton";
import usePromise from "@/utils/hooks/usePromise";
import type CardProps from "../../CardProps";

const getJifenNum = async () => (await getJifenTotalApi()).jifen;

const SignInCard: React.FC<CardProps> = (props) => {
    // 首页的下拉刷新就不追踪签到按钮的加载状态了，因为签到按钮自己管理了加载状态。
    const { onLoadingStatusChange } = props;
    useEffect(() => {
        onLoadingStatusChange(false);
    }, [onLoadingStatusChange]);
    const [jifen, loadingJifen, error] = usePromise(
        getJifenNum,
        NaN,
        [props.reloadController]
    );
    return <Card>
        <View className={style.container}>
            <View className={style.icon} />
            <View className={style.text}>
                当前积分：{loadingJifen || error ? '未知' : +jifen}
            </View>
            <SignButton className={style.button} key={props.reloadController} />
        </View>
    </Card>
}

export default SignInCard