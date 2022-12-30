export interface BubbleData {
    mainValue: number,
    mainUnitOfMeasurement: string | undefined,
    icon:string | undefined,
    cssSelector: string | undefined,
    entityName: string | undefined,
    extraValue: string | undefined,
    noEntitiesWithValueFound: boolean
}

export const DefaultBubbleData = () => {
    const r:BubbleData = {
        mainValue:0,
        noEntitiesWithValueFound:true,
        icon:undefined,
        cssSelector:undefined,
        entityName:undefined,
        extraValue:undefined,
        mainUnitOfMeasurement:"W"
    }
    return r;
}