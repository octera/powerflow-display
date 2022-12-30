import {component$} from "@builder.io/qwik";
import {BubbleData} from "~/models/BubbleData";

export default component$((props: { bubbleData:BubbleData, pxRate:number }) => {

    function getBatteryIcon(batteryValue: number, batteryChargeDischargeValue: number) {
        let TempSocValue = batteryValue;
        if (batteryValue <= 5) TempSocValue = 0;

        const batteryStateRoundedValue = Math.ceil(TempSocValue / 10) * 10;
        let batteryStateIconString = '-' + batteryStateRoundedValue.toString();

        // show charging icon beside battery state
        let batteryCharging: string = '-charging';
        if (batteryChargeDischargeValue <= 0) {
            batteryCharging = '';
        }

        if (batteryStateRoundedValue === 100) batteryStateIconString = ''; // full
        if (batteryStateRoundedValue <= 5) batteryStateIconString = '-outline'; // empty
        return 'mdi:battery' + batteryCharging + batteryStateIconString;
    }

    if (props.bubbleData.extraValue !== undefined) {
        if (props.bubbleData.icon === 'mdi:battery-medium' || props.bubbleData.icon === 'mdi:battery'){
            props.bubbleData.icon = getBatteryIcon(parseFloat(props.bubbleData.extraValue), props.bubbleData.mainValue);
        }
    }

    return (<div class={"acc_td "+ props.bubbleData.cssSelector}>
        <div
            class={"acc_container "+ props.bubbleData.entityName}
            style={{width:15 * props.pxRate + 'px',
                    height:15 * props.pxRate + 'px',
                    padding: 2 * props.pxRate + 'px',
                }}
        >
            <i class={"acc_icon " + props.bubbleData.icon}></i>
            <div class="acc_text"
                 style={{
                     fontSize: 5 * props.pxRate + 'px',
                    }}
            >
                {props.bubbleData.mainValue} {props.bubbleData.mainUnitOfMeasurement}
            </div>
        </div>
    </div>)
})
