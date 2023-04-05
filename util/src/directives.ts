import type { DirectiveOptions } from 'vue';
import type { DirectiveBinding } from 'vue/types/options';
import { sleep } from './util';

const minimumDuration = 500;

async function removeLoading(el: HTMLElement) {
  const start = Number(el.dataset.loadingStart);
  delete el.dataset.loadingStart;
  const duration = Math.max(minimumDuration - Date.now() + start, 0);
  await sleep(duration);
  el.classList.remove('loading');
}

function setLoading(el: HTMLElement, binding: DirectiveBinding) {
  if (binding.value) {
    el.dataset.loadingStart = String(Date.now());
    el.classList.add('loading');
  } else {
    removeLoading(el);
  }
}

export const loading: DirectiveOptions = {
  inserted: setLoading,
  update: setLoading,
};

async function removeImageLoading(el: HTMLImageElement, start: number) {
  const duration = Math.max(minimumDuration - Date.now() + start, 0);
  await sleep(duration);

  if (!el.complete) return;

  el.style.setProperty('opacity', '1');
  const parent = el.parentNode;
  if (!(parent instanceof HTMLElement)) return;

  parent.classList.remove('img-loading');
}

export function imageLoading(errorPlaceholder: string): DirectiveOptions {
  return {
    bind(el) {
      if (!(el instanceof HTMLImageElement)) return;
      const start = Date.now();
      el.addEventListener('load', () => removeImageLoading(el, start));
      el.addEventListener('error', async () => {
        await removeImageLoading(el, start);
        el.src = errorPlaceholder;
      });
    },
    inserted(el) {
      if (!(el instanceof HTMLImageElement))
        return console.warn('v-img-loading set on none img');

      if (el.complete) return;

      el.style.setProperty('opacity', '0');
      const parent = el.parentNode;

      if (!(parent instanceof HTMLElement))
        return console.warn('v-img-loading img has no parent');

      parent.classList.add('img-loading');
    },
  };
}
