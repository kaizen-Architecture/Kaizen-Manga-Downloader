import cronParser from 'cron-parser';
import cronstrue from 'cronstrue';

export const sanitizer = (value: string): string => {
  return value
    .replaceAll(/[\\/<>:;"'|?!*{}#%&^+,~\s]/g, '_')
    .replaceAll(/__+/g, '_')
    .replaceAll(/^[_\-.]+|[_\-.]+$/g, '');
};

export const getCronLabel = (cron: string): string | undefined => {
  if (cron === 'never') {
    return 'never';
  }

  try {
    return cronstrue.toString(cron, { use24HourTimeFormat: true });
  } catch (err) {
    if (typeof window === 'undefined') {
      const { logger } = require('./logging');
      logger.error('failed to parse cron');
    } else {
      console.error('failed to parse cron');
    }
  }

  return undefined;
};

export const isCronValid = (cron: string): boolean => {
  if (cron === 'never') {
    return true;
  }

  try {
    cronParser.parseExpression(cron);
    cronstrue.toString(cron);
    return true;
  } catch (err) {
    return false;
  }
};
