import {component$, useClientEffect$, useRef, useStore, useTask$} from "@builder.io/qwik";
import {BubbleData} from "~/models/BubbleData";

interface CircleData {
    disabled: boolean,
    sourcePower : number,
    destPower : number,
    delta:number,
    posX : number,
    posY : number
}
export default component$((props: { pathDAttribute:string, sensorName:string, source: BubbleData, dest: BubbleData }) => {
    const refPath = useRef<SVGPathElement>();
    const circleData = useStore<CircleData>({
        destPower:0,
        sourcePower:0,
        disabled:true,
        delta:0,
        posX:0,
        posY:0
    })
    useTask$(({ track }) => {
        // rerun this function  when `value` property changes.
        track(() => props.source.mainValue);
        if (props.source.mainUnitOfMeasurement?.startsWith("k")) {
            circleData.sourcePower = props.source.mainValue*1000;
        } else {
            circleData.sourcePower = props.source.mainValue
        }
    })
    useTask$(({ track }) => {
        // rerun this function  when `value` property changes.
        track(() => props.dest.mainValue);
        if (props.dest.mainUnitOfMeasurement?.startsWith("k")) {
            circleData.destPower = props.dest.mainValue*1000;
        } else {
            circleData.destPower = props.dest.mainValue
        }
    })

    useClientEffect$(() => {
        const update = () => {
            circleData.disabled = circleData.sourcePower == 0 || circleData.destPower == 0
            if (props.source.entityName === "generation_entity"
                && props.dest.entityName === "grid_entity"
                && props.dest.mainValue > 0) {
                circleData.disabled = true; // if we take power from grid, we don't circle on line between solar and grid
            }
            circleData.delta += 0.03;
            if (circleData.delta > 1) circleData.delta = 0;
            const point = refPath.current?.getPointAtLength(circleData.delta * refPath.current?.getTotalLength())
            circleData.posX = point?.x || 0;
            circleData.posY = point?.y || 0;
        };
        update();
        const tmrId = setInterval(update, 50);
        return () => clearInterval(tmrId);
    });

    const entity = {startPosition:100, color:"red"};
    return (<svg>
        {!circleData.disabled &&
            <circle r="4" cx={circleData.posX} cy={circleData.posY} fill={entity.color} id={props.sensorName + '_circle'}></circle>}
        <path ref={refPath} d={props.pathDAttribute} id={props.sensorName + '_line'}></path>
    </svg>);
})