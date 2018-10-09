import test from './test.js';

import user from './user.js';
import getData from './getData.js';
import create from './create.js';
import deletes from './deletes.js';

export default (app) => {
  app.use('/test', test);

  app.use('/user', user);
  app.use('/create',create);
  app.use('/deletes',deletes);
  app.use('/getData',getData);
}
