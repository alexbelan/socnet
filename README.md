# socnet
Социальная сеть на Python Django с использованием rest framework, а front-end это SPA приложение на React.js

### Back-end:

Back-end сделан на Django с использованием rest framework, также есть куча других зависимостей.

**Зависимости:**

```
channels==2.4.0
djangorestframework==3.11.0
djangorestframework-simplejwt==4.4.0
django==3.1
djoser==2.0.3
psycopg2-binary==2.8.4
channels-redis==2.4.2
django-cors-headers
Pillow
```

Описание каждой зависимости:

- **channels** - Api для работы с WebSocket, нужен для чата;
- **djangorestframework** - RestAPI для Django;
- **djangorestframework-simplejwt** - Api для JWT авторизации на Django;
- **django** - Сам Django;
- **djoser** - Библиотека для обычной авторизации, нужно для djangorestframework-simplejwt;
- **psycopg2-binary** - Библиотека для работы с БД PostgreSQL;
- **channels-redis** - Библиотека для с NoSQL redis, для channels;
- **django-cors-headers** - Библиотека для получения запросов из других источников;
- **Pillow** - Нужен для работы с изображением;

Чтобы быстро подключить все зависимости, используете эту команду в терминале:

```ph
python manage.py -r requirements.txt
```

У вас всё должно нормально работать.

**Запуск сервера:**

Теперь нужно запустить сервер, для этого надо подключиться к БД, сделать миграции и создать супер пользователя, для первого нужно сделать файл **config.ini**, примерно так он должен выглядеть:

```ini
[database]
ENGINE=django.db.backends.postgresql_psycopg2
NAME=socnet
USER=admin
PASSWORD=1234
HOST=127.0.0.1
PORT=5432
```
В качестве СУБД тут используется PostgreSQL. Теперь можно сделать миграции, для этого введите это в терминал:

```ph
python manage.py migrate
```
Последние, что нужно сделать для запуска сервера, так это создать супер пользователя и запустить сервер.

Делаем супер пользователя:

```ph
python manage.py createsuperuser
```

Запускаем сервер:

```ph
python manage.py runserver
```

На этом запуск сервера закончен.

**Папки и приложения:**

- **socnetproject** - Главная папка с настройками;
- **chat** - Приложение чат;
- **users** - Приложение пользователей;
- **groups** - Приложение групп;
- **frontent** - В папке хранится вся логика SPA приложение на React.js;

Это самое основное, что можно сказать про back-end.

### Fron-end:

Вес front-end хранится в папке frontend, это SPA приложения на React.js, но так как это моё первое приложение оно возможно не много кривое и не доработанное, в остальном всё как надо.

Для скачивания всех компонентов воспользуйтесь командой npm:

```ph
npm install
```

Чтобы запустить используете другую команду:

```ph
npm start
```

Всё должно работать нормально.
