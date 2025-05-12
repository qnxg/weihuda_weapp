import Button from "@/components/Button";
import CheckSortListDisplay from "@/components/CheckSortList"
import { CardEnum } from "@/pages/index/components/CardList/index.config";
import { saveCardSettings, useFinalCardDisplay } from "@/utils/storage/userSettings/customAccessors/computeFinalCardDisplay";
import { DEFAULT_INDEX_CARD_SETTINGS } from "@/utils/storage/userSettings/defaults/indexCardSettings";
import { Text, View } from "@tarojs/components";
import { useCallback, useEffect, useState } from "react"
import Taro from "@tarojs/taro";
import Card from "@/components/Card";

import style from './index.module.scss'

const Index: React.FC = () => {
    // Set的顺序是其插入顺序，刚好和我们这里想要的行为相同
    const [cardSettings, setCardSettings] =
        useState<[Set<CardEnum>, Set<CardEnum>]>([new Set(), new Set()]);

    const currentSettings = useFinalCardDisplay([])
    useEffect(() => {
        setCardSettings(currentSettings);
    }, [currentSettings])

    const mapSettings = (s: Set<CardEnum>) =>
        Array.from(s.keys().map(k => ({
            key: k,
            node: k
        })));
    const checked = mapSettings(cardSettings[0]);
    const unchecked = mapSettings(cardSettings[1]);

    const [canSave, setCanSave] = useState(false);
    const [saving, setSaving] = useState(false);
    const [shouldRelaunchIndex, setShouldRelaunchIndex] = useState(false);

    // 在设置后reLaunch到首页
    // 作用：
    // 1. 用户不用在首页手动刷新才能看到卡片变化
    Taro.useUnload(() => {
        if (shouldRelaunchIndex) {
            void Taro.reLaunch({ url: '/pages/index/index' })
        }
    })

    const handleCheck = useCallback((k: CardEnum) => {
        setCanSave(true)
        cardSettings[1].delete(k);
        cardSettings[0].add(k);
        setCardSettings([cardSettings[0], cardSettings[1]]);
    }, [cardSettings]);

    const handleUncheck = useCallback((k: CardEnum) => {
        setCanSave(true)
        cardSettings[0].delete(k);
        cardSettings[1].add(k);
        setCardSettings([cardSettings[0], cardSettings[1]]);
    }, [cardSettings]);

    const handleSave = useCallback(() => {
        void (async () => {
            setSaving(true);
            try {
                await saveCardSettings(cardSettings[0], cardSettings[1])
                setCanSave(false)
                setShouldRelaunchIndex(true)
            } finally {
                setSaving(false)
            }
        })();
    }, [cardSettings]);

    const handleCheckAll = useCallback(() => {
        setCanSave(true)
        cardSettings[1].forEach(k => {
            cardSettings[0].add(k);
        });
        cardSettings[1].clear();
        setCardSettings([cardSettings[0], cardSettings[1]]);
    }, [cardSettings]);

    const handleUncheckAll = useCallback(() => {
        setCanSave(true)
        cardSettings[0].forEach(k => {
            cardSettings[1].add(k);
        });
        cardSettings[0].clear();
        setCardSettings([cardSettings[0], cardSettings[1]]);
    }, [cardSettings]);

    const handleReset = useCallback(() => {
        setCanSave(true)
        setCardSettings([
            new Set(DEFAULT_INDEX_CARD_SETTINGS.show),
            new Set(DEFAULT_INDEX_CARD_SETTINGS.dontShow)
        ])
    }, []);

    return <>
        <Card>
            <Text className={style.hint}>点击列表可以切换首页卡片显示状态</Text>
        </Card>
        <View className={style.actionButtonsContainer}>
            <Button
                theme="primary"
                disabled={!canSave}
                className={style.actionButton}
                onClick={handleSave}
                loading={saving}
            >
                保存
            </Button>
            <Button
                theme="default"
                className={style.actionButton}
                onClick={handleCheckAll}
            >
                全选
            </Button>
            <Button

                theme="default"
                className={style.actionButton}
                onClick={handleUncheckAll}
            >
                全不选
            </Button>
            <Button
                theme="default"
                className={style.actionButton}
                onClick={handleReset}
            >
                重置为默认
            </Button>
        </View>
        <CheckSortListDisplay
            checked={checked}
            unchecked={unchecked}
            onCheck={handleCheck}
            onUncheck={handleUncheck}
        />
    </>
}

export default Index