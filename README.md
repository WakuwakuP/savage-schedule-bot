# savage-schedule-bot

### test bot invite
[invite](https://discord.com/api/oauth2/authorize?client_id=777450886167003157&permissions=3221568&scope=bot)

### Migration

```sh
# migration file make
knex migrate:make {Filename}

# migration
docker-compose run --rm node knex migrate:latest

# migration up / down
docker-compose run --rm node knex migrate:up
docker-compose run --rm node knex migrate:down

# rollback
docker-compose run --rm node knex migrate:rollback all
```
