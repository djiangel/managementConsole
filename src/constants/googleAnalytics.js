export const TRACKING_ID =
  location.hostname === 'beta.next.gastrograph.com' ||
  location.hostname === 'console.next.gastrograph.com'
    ? 'UA-47323518-7'
    : 'UA-47323518-6';
