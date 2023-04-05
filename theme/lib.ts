// import './scss/index.scss';

import { UserVuetifyPreset } from 'vuetify';

export const themes: UserVuetifyPreset['themes'] = {
  light: {
    primary: '#7e489c',
    secondary: '#99ca3c',
    accent: '#82b1ff',
    error: '#dc3545',
    info: '#17a2b8',
    success: '#28a745',
    warning: '#d39e00',
    anchor: '#007185',
  },
  // dark: {},
};

export const breakpoint: UserVuetifyPreset['breakpoint'] = {
  mobileBreakpoint: 'md',
  thresholds: {
    xs: 640,
    sm: 768,
    md: 1024,
    lg: 1280,
    // xl: 1536,
  },
  scrollBarWidth: 0,
};
