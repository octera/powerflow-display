import {
  component$,
  useClientEffect$,
  useStore,
  noSerialize,
  NoSerialize,
  useStylesScoped$
} from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import mqtt from "mqtt/dist/mqtt";
import styles from './index.css?inline';
import PowerCard, {PowerData} from "~/components/powerCard/powerCard";
import {IClientOptions} from "mqtt";

interface AppStore {
  client: NoSerialize<mqtt.MqttClient> | null
  connectionStatus : boolean
}

export default component$(() => {
  useStylesScoped$(styles);

  const store = useStore<AppStore>({
    client: null,
    connectionStatus: false
  }, { recursive: true });

  const powerStore = useStore<PowerData>({
    grid:0,
    heat:0,
    house:0,
    solar:0
  }, { recursive: true });

  useClientEffect$(() => {
    const initMqttClient = () => {
      store.client!.subscribe(import.meta.env.VITE_MQTT_GRID_TOPIC);
      store.client!.subscribe(import.meta.env.VITE_MQTT_HOUSE_TOPIC);
      store.client!.subscribe(import.meta.env.VITE_MQTT_SOLAR_TOPIC);
      store.client!.subscribe(import.meta.env.VITE_MQTT_HEAT_TOPIC);

      // @ts-ignore
      store.client!.on('message', (topic, payload) => {
        switch (topic) {
          case import.meta.env.VITE_MQTT_GRID_TOPIC:
            powerStore.grid=parseFloat(payload.toString());
            break;
          case import.meta.env.VITE_MQTT_HOUSE_TOPIC:
            powerStore.house=parseFloat(payload.toString());
            break;
          case import.meta.env.VITE_MQTT_SOLAR_TOPIC:
            powerStore.solar=parseFloat(payload.toString());
            break;
          case import.meta.env.VITE_MQTT_HEAT_TOPIC:
            powerStore.heat=parseFloat(payload.toString());
            break;
        }
      })
    }

    let options:IClientOptions = {
      username:import.meta.env.VITE_MQTT_WS_USER,
      password:import.meta.env.VITE_MQTT_WS_PWD}
    const client = mqtt.connect(import.meta.env.VITE_MQTT_WS_URL, options);
    client.on('connect', () => {
      console.log("connected");
      store.client = noSerialize(client);
      store.connectionStatus = true;
      initMqttClient();
    });
  });



  return (
    <div>
      <PowerCard powerData={powerStore}/>
    </div>
  );
});

export const head: DocumentHead = {
  title: 'Welcome to Qwik',
  meta: [
    {
      name: 'description',
      content: 'Qwik site description',
    },
  ],
};
