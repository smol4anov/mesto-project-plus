const defaultUserName = 'Жак-Ив Кусто';
const defaultUserAbout = 'Исследователь';
const defaultUserAvatar = 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png';

const rexExpUrl = /http(s)?:\/\/(www\.)?[-a-zA-Z0-9.]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_+.~#?&/=]*)/;

export {
  defaultUserName,
  defaultUserAbout,
  defaultUserAvatar,
  rexExpUrl,
};
