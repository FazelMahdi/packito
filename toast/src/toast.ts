import { bus, ToastEvent } from '@baya/util';
import type VueI18n from 'vue-i18n';
import { Component, Vue } from 'vue-property-decorator';
import { VSnackbar, VBtn, VIcon } from 'vuetify/lib';

const defaultOptions = {
  serverErrorPath: 'serverError',
  i18n: { t: (k: string) => k } as VueI18n,
};

export type Options = Partial<typeof defaultOptions>;

export function createToaster(options?: Options) {
  const combinedOpts: Required<Options> = { ...defaultOptions, ...options };
  const { i18n } = combinedOpts;
  let { serverErrorPath } = combinedOpts;
  if (serverErrorPath) serverErrorPath = serverErrorPath.replace(/\.?$/, '.');

  const toast = {
    success(title: string, msg?: string) {
      bus.emit<'toast'>('toast', {
        type: 'success',
        title: i18n.t(title) as string,
        message: msg ? (i18n.t(msg) as string) : undefined,
      });
    },
    error(title: string, msg?: string) {
      bus.emit<'toast'>('toast', {
        type: 'error',
        title: i18n.t(title) as string,
        message: msg ? (i18n.t(msg) as string) : undefined,
      });
    },
    warning(title: string, msg?: string) {
      bus.emit<'toast'>('toast', {
        type: 'warning',
        title: i18n.t(title) as string,
        message: msg ? (i18n.t(msg) as string) : undefined,
      });
    },
    info(title: string, msg?: string) {
      bus.emit<'toast'>('toast', {
        type: 'info',
        title: i18n.t(title) as string,
        message: msg ? (i18n.t(msg) as string) : undefined,
      });
    },
    instant(message: string, err = false) {
      //   const option = {
      //     positionClass: 'toast-bottom-right',
      //     timeOut: 1500,
      //   };
      message = i18n.t(message) as string;
      const type = err ? 'error' : 'success';
      bus.emit<'toast'>('toast', { type, message });
    },
    serverError(msgs: string | string[]) {
      const errs = Array.isArray(msgs) ? msgs : [msgs];

      const message = errs
        .map((err) => i18n.t(`${serverErrorPath}${err}`))
        .map((err) => `خطا: ${err}`)
        .join('\n');

      bus.emit<'toast'>('toast', { type: 'error', message });
    },
    clear() {
      bus.emit<'toast'>('toast', { type: 'info' });
    },
  };

  return toast;
}

export const toast = createToaster();

export type Toastr = ReturnType<typeof createToaster>;

@Component({ components: { VSnackbar, VBtn, VIcon } })
export class Toast extends Vue {
  color: ToastEvent['type'] = 'info';
  title = '';
  message = '';

  show = false;

  setData({ type, title = '', message = '' }: ToastEvent) {
    this.title = title;
    this.message = message;
    this.color = type;
    this.show = true;
  }

  mounted() {
    bus.on<'toast'>('toast', this.setData);
  }

  beforeDestroy() {
    bus.off('toast', this.setData);
  }
}
