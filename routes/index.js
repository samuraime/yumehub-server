const Router = require('koa-router');
const koaJwt = require('koa-jwt');
const config = require('../config');
const users = require('../controllers/users');
const yumes = require('../controllers/yumes');
const plants = require('../controllers/plants');
const APIError = require('../middlewares/api-error');

const jwtMiddleware = koaJwt({
  secret: config.jwtSecret,
  key: 'user',
});

const router = new Router();

// handle all uncaught exceptions
router.use(APIError);

router.post('/login', users.login);

router.get('/plants/token', plants.token);

// need auth
router.use(jwtMiddleware);

router.get('/user', users.find);
router.put('/user', users.update);

router.get('/yumes', yumes.list);
router.post('/yumes', yumes.create);
router.get('/yumes/starred', yumes.starred);
router.get('/yumes/posts', yumes.posts);
router.put('/yume/starred/:id', yumes.star);
router.delete('/yume/starred/:id', yumes.unstar);
router.put('/yume/thumbupped/:id', yumes.thumbup);
router.delete('/yume/thumbupped/:id', yumes.unthumbup);

module.exports = router;
