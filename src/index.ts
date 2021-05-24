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
  const timestamp = new Date();
  timestamp.setMinutes(timestamp.getMinutes() + 2);

  let profile: any = {
    status_text,
    status_expiration: timestamp.getTime() / 1000,
  };

  const regExp = new RegExp(/(?<status_emoji>:[a-z_A-Z]+:)/);

  const status_emoji: string | undefined =
    status_text.match(regExp)?.groups?.status_emoji;

  if (status_emoji) {
    profile = {
      ...profile,
      status_text: status_text.replace(regExp, '').trim(),
      status_emoji,
    };
  }

  await updateProfile(profile);
  await disableSnooze();
}

async function updateProfile(profile: any) {
  await fetch('https://slack.com/api/users.profile.set', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      Authorization: `Bearer ${config.slackToken}`,
    },
    body: JSON.stringify({
      profile,
    }),
  });
}

async function disableSnooze() {
  await fetch('https://slack.com/api/dnd.endSnooze', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      Authorization: `Bearer ${config.slackToken}`,
    },
  });
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
