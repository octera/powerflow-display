import {component$} from "@builder.io/qwik";
import CircleAndLine from "~/components/circleAndLine/circleAndLine";
import {BubbleData} from "~/models/BubbleData";

export default component$((props: { applianceNumber:number, pxRate:number, pathDAttribute: string, sourceData : BubbleData, destData : BubbleData }) => {
    const height = 11;
    let top, bottom : string
    if (props.applianceNumber === 1) {
        top= 22.5 * props.pxRate - 10 + 'px;';
    } else {
        bottom= 15 * props.pxRate + 'px;';
    }
    // @ts-ignore
    return (<div
        class={"acc_line acc_appliance" + props.applianceNumber + "_line"}
        style={{
        height:(height * props.pxRate)-((props.applianceNumber-1)*5)+'px',
        width:"10px",
        right:(9.5 * props.pxRate) + 6 + 'px',
        top,
        bottom,
        position:"absolute"
        }}
    >
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox={'0 0 '+ ((12*props.pxRate)-((props.applianceNumber-1)*5)) + ' ' +((12*props.pxRate)-((props.applianceNumber-1)*5))}
            preserveAspectRatio="xMinYMax slice"
            style={{
                height:(height * props.pxRate)-((props.applianceNumber-1)*5)+'px',
                width:"10px"
            }}
            class="acc_appliance${applianceNumber}_line_svg"
        >
            <CircleAndLine
                sensorName={'appliance' + props.applianceNumber + '_consumption_entity'}
                pathDAttribute={props.pathDAttribute}
                source={props.sourceData}
                dest={props.destData}
            />
        </svg>
    </div>);
})