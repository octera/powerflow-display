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
      store.client!.subscribe("powerinfo/grid");
      store.client!.subscribe("powerinfo/house");
      store.client!.subscribe("powerinfo/solar");
      store.client!.subscribe("powerinfo/heat");

      store.client!.on('message', (topic, payload) => {
        switch (topic) {
          case "powerinfo/grid":
            powerStore.grid=parseFloat(payload.toString());
            break;
          case "powerinfo/house":
            powerStore.house=parseFloat(payload.toString());
            break;
          case "powerinfo/solar":
            powerStore.solar=parseFloat(payload.toString());
            break;
          case "powerinfo/heat":
            powerStore.heat=parseFloat(payload.toString());
            break;
        }
      })
    }

    const client = mqtt.connect("mqtt://192.168.0.20:9001");
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
