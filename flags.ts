import { flag } from 'flags/next';
import { vercelAdapter } from '@flags-sdk/vercel';

export const showHelloBanner = flag<boolean>({
  key: 'show-hello-banner',
  description: 'Shows a hello world notification strip at top of site',
  defaultValue: false,
  options: [
    { value: false, label: 'Hidden' },
    { value: true, label: 'Visible' },
  ],
  adapter: vercelAdapter,
});

export const flags = [showHelloBanner] as const;
