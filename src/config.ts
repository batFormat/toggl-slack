export interface Config {
  cloudTriggerId: string;
  togglToken: string;
  slackToken: string;
}
const cloudTriggerId = process.env.CLOUD_TRIGGER_ID || '';
const togglToken = process.env.TOGGL_TOKEN || '';
const slackToken = process.env.SLACK_TOKEN || '';

/**
 * Creates error text about incorrect environment variable
 * @param {string} envName
 * @returns {string}
 */
function getErrorText(envName: string) {
  return `Environment variable ${envName} not passed or has incorrect format`;
}

if (cloudTriggerId === '') {
  getErrorText('CLOUD_TRIGGER_ID');
}

if (togglToken === '') {
  getErrorText('TOGGL_TOKEN');
}

if (slackToken === '') {
  getErrorText('SLACK_TOKEN');
}

const config: Config = {
  cloudTriggerId,
  togglToken,
  slackToken,
};

export default config;
