import { sleep } from './util';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import type Vue from 'vue';

function createHub(url: string) {
  const hub = new HubConnectionBuilder().withUrl(url).build();

  async function connect() {
    try {
      await hub.start();
    } catch (err) {
      if (err instanceof Error) {
        console.debug(
          `Error while starting signalr connection: "${err.message}". trying to reconnect...`,
        );
      }
      await sleep();
      connect();
    }
  }

  hub.onclose((e) => {
    if (!e) return console.debug(`signalr connection stopped`);
    console.debug(
      `signalr connection closed with error. trying to reconnect...`,
    );
    connect();
  });

  connect();
  return hub;
}

type Handler = (...args: any[]) => void;

let hub: HubConnection | undefined;
const allHandlers = new Map<Vue, Map<Handler, Set<string>>>();

let currentUrl = '/live-data';
export async function setUrl(url: string) {
  currentUrl = url;
  if (hub != null) {
    await hub.stop();
    hub.baseUrl = url;
    await hub.start();
  }
}

export async function stopHubConnection() {
  allHandlers.clear();
  await hub?.stop();
  hub = undefined;
}

export function connectHub(vm: Vue) {
  if (!allHandlers.has(vm))
    allHandlers.set(vm, new Map<Handler, Set<string>>());
  const vmHandlers = allHandlers.get(vm)!;
  
  const instance = {
    on(fn: Handler, ...events: string[]) {
      if (!hub) hub = createHub(currentUrl);
      if (!vmHandlers.has(fn)) vmHandlers.set(fn, new Set());
      const eventSet = vmHandlers.get(fn)!;
      for (const event of events) {
        hub.on(event, fn);
        eventSet.add(event);
      }
      return instance;
    },
    off(fn: Handler, ...events: string[]) {
      if (!hub) return;
      if (!vmHandlers.has(fn))
        throw new Error(
          'فانکشن داده شده متصل نیست یا همان اینستنس که متصل شده بود نیست',
        );
      const eventSet = vmHandlers.get(fn)!;
      for (const event of events) {
        hub.off(event, fn);
        eventSet.delete(event);
      }
      if (!eventSet.size) vmHandlers.delete(fn);
      return instance;
    },
    stop() {
      return stopHubConnection();
    },
  };

  vm.$once('hook:destroyed', async () => {
    if (!hub) return;

    for (const [fn, eventSet] of vmHandlers) {
      for (const event of eventSet) {
        hub.off(event, fn);
      }
      eventSet.clear();
    }

    vmHandlers.clear();
    allHandlers.delete(vm);
    if (!allHandlers.size) await stopHubConnection();
  });

  return instance;
}
