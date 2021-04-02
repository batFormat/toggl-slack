import { router } from 'yandex-cloud-functions-router';
import fetch from 'node-fetch';
import config from './config';

async function getTimeEntries() {
  const token = Buffer.from(`${config.togglToken}:api_token`).toString(
    'base64'
  );

  const { data } = await fetch(
    'https://api.track.toggl.com/api/v8/time_entries/current',
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${token}`,
      },
    }
  ).then((res) => res.json());

  return data?.description;
}

async function setSlackStatus(status_text: string) {
  await fetch('https://slack.com/api/users.profile.set', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      Authorization: `Bearer ${config.slackToken}`,
    },
    body: JSON.stringify({
      profile: {
        status_text,
      },
    }),
  }).then((res) => res.json());
}

export const handler = router({
  timer: [
    {
      triggerId: [config.cloudTriggerId],
      handler: async () => {
        const workDescription = await getTimeEntries();

        if (workDescription) {
          await setSlackStatus(workDescription);
        }

        return {
          statusCode: 200,
        };
      },
    },
  ],
});
