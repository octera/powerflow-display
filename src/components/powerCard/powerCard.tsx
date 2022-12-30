import {component$, useStore, useStyles$, useTask$} from "@builder.io/qwik";
import Bubble from "~/components/bubble/bubble";
import CircleAndLine from "~/components/circleAndLine/circleAndLine";
import Appliance from "~/components/appliance/appliance";
import {BubbleData, DefaultBubbleData} from "~/models/BubbleData";
import styles from './powerCard.css?inline';
import {roundValue, showKW} from "~/utils";

export interface PowerData {
    grid:number,
    house:number,
    solar:number,
    heat:number
}

export default component$((props: { powerData:PowerData }) => {
    useStyles$(styles);

    const pxRate = 5.5;
    const half = 22 * pxRate;
    const gap = 2 * pxRate;
    const bateryEnabled = false;

    const threshold_in_k = 1;
    /*const generationEntities = ['generation_to_grid_entity', 'generation_to_house_entity', 'generation_to_battery_entity'];
    const gridEntities = ['-generation_to_grid_entity', 'grid_to_house_entity', '-battery_to_grid_entity', 'grid_to_battery_entity'];
    const houseEntities = ['generation_to_house_entity', 'grid_to_house_entity', 'battery_to_house_entity'];
    const batteryEntities = ['generation_to_battery_entity', 'grid_to_battery_entity', '-battery_to_house_entity', '-battery_to_grid_entity'];
*/
    const houseData = useStore<BubbleData>(() => {
        const bubbleData = DefaultBubbleData();
        bubbleData.cssSelector = 'acc_right';
        bubbleData.icon = "fa-solid fa-house";
        bubbleData.entityName= "house_entity"
        return bubbleData;
    }, {recursive:true, reactive:true})

    const solarData = useStore<BubbleData>(() => {
        const bubbleData = DefaultBubbleData();
        bubbleData.cssSelector = 'acc_top';
        bubbleData.icon = "fa-solid fa-solar-panel";
        bubbleData.entityName = "generation_entity"
        return bubbleData;
    }, {recursive:true, reactive:true})

    const gridData = useStore<BubbleData>(() => {
        const bubbleData = DefaultBubbleData();
        bubbleData.cssSelector = 'acc_left';
        bubbleData.icon = "fa-solid fa-tower-broadcast";
        bubbleData.entityName = "grid_entity"
        bubbleData.mainValue = props.powerData.grid;
        return bubbleData;
    }, {recursive:true, reactive:true})

    const appliance1Data = useStore<BubbleData>(() => {
        const bubbleData = DefaultBubbleData();
        bubbleData.cssSelector = 'acc_appliance1';
        bubbleData.icon = "fa-solid fa-fire";
        bubbleData.entityName = "appliance1_consumption_entity"
        return bubbleData;
    }, {recursive:true, reactive:true})

    const appliance2Data = useStore<BubbleData>(() => {
        const bubbleData = DefaultBubbleData();
        bubbleData.cssSelector = 'acc_appliance2';
        bubbleData.icon = "fa-solid fa-bottle-water";
        return bubbleData;
    }, {recursive:true, reactive:true})

    const batteryData = useStore<BubbleData>(() => {
        const bubbleData = DefaultBubbleData();
        bubbleData.cssSelector = 'acc_bottom';
        bubbleData.icon = "fa-solid fa-battery-full";
        return bubbleData;
    }, {recursive:true, reactive:true})

    useTask$(({ track }) => {
        // rerun this function  when `value` property changes.
        track(() => props.powerData.grid);
        const value = props.powerData.grid;
        if (showKW(threshold_in_k, value)) {
            gridData.mainValue = roundValue(value) / 1000;
            gridData.mainUnitOfMeasurement = 'kW';
        } else {
            gridData.mainValue = value;
            gridData.mainUnitOfMeasurement = 'W';
        }
    });
    useTask$(({ track }) => {
        // rerun this function  when `value` property changes.
        track(() => props.powerData.solar);
        const value = props.powerData.solar;
        if (showKW(threshold_in_k, value)) {
            solarData.mainValue = roundValue(value) / 1000;
            solarData.mainUnitOfMeasurement = 'kW';
        } else {
            solarData.mainValue = value;
            solarData.mainUnitOfMeasurement = 'W';
        }
    });
    useTask$(({ track }) => {
        // rerun this function  when `value` property changes.
        track(() => props.powerData.house);
        const value = props.powerData.house;
        if (showKW(threshold_in_k, value)) {
            houseData.mainValue = roundValue(value) / 1000;
            houseData.mainUnitOfMeasurement = 'kW';
        } else {
            houseData.mainValue = value;
            houseData.mainUnitOfMeasurement = 'W';
        }
    });
    useTask$(({ track }) => {
        // rerun this function  when `value` property changes.
        track(() => props.powerData.heat);
        const value = props.powerData.heat;
        if (showKW(threshold_in_k, value)) {
            appliance1Data.mainValue = roundValue(value) / 1000;
            appliance1Data.mainUnitOfMeasurement = 'kW';
        } else {
            appliance1Data.mainValue = value;
            appliance1Data.mainUnitOfMeasurement = 'W';
        }
    });


    return (
        <div id="tesla-style-solar-power-card">
          <Bubble pxRate={pxRate} bubbleData={solarData}/>
          <div class="acc_center">
            <div class="acc_center_container">
              <Bubble pxRate={pxRate} bubbleData={gridData}/>
              <div
                class="acc_line power_lines"
                style={{
                height:42 * pxRate + 'px',
                width:42 * pxRate + 'px',
                top:0 * pxRate + 'px',
                left:28 * pxRate + 'px',
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox={'0 0 ' + 42 * pxRate + ' ' + 42 * pxRate}
                  preserveAspectRatio="xMinYMax slice"
                  style={{
                      height: 42 * pxRate + 'px',
                      width:42 * pxRate + 'px'
                  }}
                >
                    <CircleAndLine
                        sensorName="generation_to_house_entity"
                        pathDAttribute={
                            'M' +
                            (half - pxRate + gap) +
                            ',0' +
                            'C' +
                            (half - pxRate + gap) +
                            ',' +
                            (half - gap) +
                            ' ' +
                            (half - pxRate + gap) +
                            ',' +
                            (half - gap) +
                            ' ' +
                            half * 2 +
                            ',' +
                            (half - gap)
                        }
                        source={solarData}
                        dest={houseData}
                    />
                    <CircleAndLine
                        sensorName="grid_to_house_entity"
                        pathDAttribute={
                            'M0,' +
                            half +
                            ' ' +
                            'C' +
                            (half - pxRate) +
                            ',' +
                            half +
                            ' ' +
                            (half - pxRate) +
                            ',' +
                            half +
                            ' ' +
                            (half - pxRate) * 2 +
                            ',' +
                            half
                        }
                        source={gridData}
                        dest={houseData}
                    />
                    <CircleAndLine
                        sensorName="generation_to_grid_entity"
                        pathDAttribute={
                            'M' +
                            (half - pxRate - gap) +
                            ',0 ' +
                            'C' +
                            (half - pxRate - gap) +
                            ',' +
                            (half - gap) +
                            ' ' +
                            (half - pxRate - gap) +
                            ',' +
                            (half - gap) +
                            ' 0,' +
                            (half - gap)
                        }
                        source={solarData}
                        dest={gridData}
                    />
                    { bateryEnabled && <CircleAndLine
                        sensorName="grid_to_battery_entity"
                        pathDAttribute={
                            'M0,' +
                            (half + gap) +
                            ' ' +
                            'C' +
                            (half - pxRate - gap) +
                            ',' +
                            (half + gap) +
                            ' ' +
                            (half - pxRate - gap) +
                            ',' +
                            (half + gap) +
                            ' ' +
                            (half - pxRate - gap) +
                            ',' +
                            half * 2
                        }
                        source={gridData}
                        dest={batteryData}
                    />
                    }
                    { bateryEnabled && <CircleAndLine
                        sensorName="battery_to_grid_entity"
                        pathDAttribute={
                            'M' +
                            (half - pxRate - gap) +
                            ',' +
                            half * 2 +
                            ' ' +
                            'C' +
                            (half - pxRate - gap) +
                            ',' +
                            (half + gap) +
                            ' ' +
                            (half - pxRate - gap) +
                            ',' +
                            (half + gap) +
                            ' ' +
                            '0,' +
                            (half + gap)
                        }
                        source={batteryData}
                        dest={gridData}
                    />
                    }
                    { bateryEnabled && <CircleAndLine
                        sensorName="generation_to_battery_entity"
                        pathDAttribute={
                            'M' +
                            (half - pxRate) +
                            ',0 ' +
                            'C' +
                            (half - pxRate) +
                            ',0 ' +
                            (half - pxRate) +
                            ',' +
                            half * 2 +
                            ' ' +
                            (half - pxRate) +
                            ',' +
                            half * 2
                        }
                        source={solarData}
                        dest={batteryData}
                    />
                    }
                    { bateryEnabled && <CircleAndLine
                        sensorName="battery_to_house_entity"
                        pathDAttribute={
                            'M' +
                            (half - pxRate + gap) +
                            ',' +
                            half * 2 +
                            ' ' +
                            'C' +
                            (half - pxRate + gap) +
                            ',' +
                            (half + gap) +
                            ' ' +
                            (half - pxRate + gap) +
                            ',' +
                            (half + gap) +
                            ' ' +
                            half * 2 +
                            ',' +
                            (half + gap)
                        }
                        source={batteryData}
                        dest={houseData}
                    />
                    }
                </svg>
              </div>
                <Bubble pxRate={pxRate} bubbleData={houseData}/>

                <Bubble pxRate={pxRate} bubbleData={appliance1Data}/>
                <Appliance pxRate={pxRate} applianceNumber={1} pathDAttribute={'M5,' + 12 * pxRate + ' C5,' + 12 * pxRate + ' 5,0 5,0'}
                    sourceData={houseData}
                    destData={appliance1Data}
                />

                {false && <Bubble pxRate={pxRate} bubbleData={appliance2Data}/>}
                {false && <Appliance pxRate={pxRate} applianceNumber={2} pathDAttribute={'M5,0 C5,0 5,' + 11 * pxRate + ' 5,' + 11 * pxRate}
                             sourceData={houseData}
                             destData={appliance2Data}
                />}
            </div>
          </div>
            {bateryEnabled && <div class="acc_bottom">
                    <Bubble pxRate={pxRate} bubbleData={batteryData}/>
                </div>
            }
        </div>
)
})