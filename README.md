# toggl-slack

1. Создать пустую Yandex Cloud Functions.
2. Создать сервисный аккаунт и статический ключ к нему.
3. Создать таймер триггер и указать что он будет запускать нашу функцию по следующим крон выражением: `0/5 * * * ? *`
   ``
4. Форкнуть этот репозиторий и указать в нем следующие secrets (AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY. TOGGL_TOKEN, SLACK_TOKEN, SERVICE_ACCOUNT, TOKEN, BUCKET, CLOUD_TRIGGER_ID)

BUCKET - Указываем, бакет (нужно чтобы временно хранить билд для деплоя)

TOKEN - [Ссылка на получение токена](https://oauth.yandex.ru/authorize?response_type=token&client_id=1a6990aa636648e9b2ef855fa7bec2fb)

TOGGL_TOKEN - [Отсюда достать токен](https://track.toggl.com/profile)

SLACK_TOKEN

```
// https://api.slack.com/apps
// Create an app.
// In the menu -> OAuth & Permssions.
// User Token Scopes. Add "users.profile:write"
// Grab the "User OAuth Token"
// Copy app OAuth token
```

4. .github/workflows/main.yml в конфигурации деплоя заменить function_id на свой.
