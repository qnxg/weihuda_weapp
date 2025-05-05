import Button from "@/components/Button";
import CheckSortListDisplay from "@/components/CheckSortList"
import { CardEnum } from "@/pages/index/components/CardList/index.config";
import { computeFinalCardDisplay, saveCardSettings } from "@/utils/storage/userSettings/customAccessors/computeFinalCardDisplay";
import { DEFAULT_INDEX_CARD_SETTINGS } from "@/utils/storage/userSettings/defaults/indexCardSettings";
import { useCallback, useState } from "react"

const Index: React.FC = () => {
    // Set的顺序是其插入顺序，刚好和我们这里想要的行为相同
    const [cardSettings, setCardSettings] = useState(computeFinalCardDisplay);
    const mapSettings = (s: Set<CardEnum>) =>
        Array.from(s.keys().map(k => ({
            key: k,
            node: k
        })));
    const checked = mapSettings(cardSettings[0]);
    const unchecked = mapSettings(cardSettings[1]);

    const handleCheck = useCallback((k: CardEnum) => {
        cardSettings[1].delete(k);
        cardSettings[0].add(k);
        setCardSettings([cardSettings[0], cardSettings[1]]);
    }, [cardSettings]);

    const handleUncheck = useCallback((k: CardEnum) => {
        cardSettings[0].delete(k);
        cardSettings[1].add(k);
        setCardSettings([cardSettings[0], cardSettings[1]]);
    }, [cardSettings]);

    const handleSave = useCallback(() => {
        saveCardSettings(cardSettings[0], cardSettings[1])
    }, [cardSettings]);

    const handleCheckAll = useCallback(() => {
        cardSettings[1].forEach(k => {
            cardSettings[0].add(k);
        });
        cardSettings[1].clear();
        setCardSettings([cardSettings[0], cardSettings[1]]);
    }, [cardSettings]);

    const handleUncheckAll = useCallback(() => {
        cardSettings[0].forEach(k => {
            cardSettings[1].add(k);
        });
        cardSettings[0].clear();
        setCardSettings([cardSettings[0], cardSettings[1]]);
    }, [cardSettings]);

    const handleReset = useCallback(() => {
        setCardSettings([
            new Set(DEFAULT_INDEX_CARD_SETTINGS.show),
            new Set(DEFAULT_INDEX_CARD_SETTINGS.dontShow)
        ])
    }, []);

    return <>
        <Button onClick={handleSave}>保存</Button>
        <Button onClick={handleCheckAll}>全选</Button>
        <Button onClick={handleUncheckAll}>全不选</Button>
        <Button onClick={handleReset}>重置为默认</Button>
        <CheckSortListDisplay
            checked={checked}
            unchecked={unchecked}
            onCheck={handleCheck}
            onUncheck={handleUncheck}
        />
    </>
}

export default Index