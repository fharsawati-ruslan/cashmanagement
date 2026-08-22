import { middleware } from '#start/kernel'
import { controllers } from '#generated/controllers'
import router from '@adonisjs/core/services/router'

/*
|--------------------------------------------------------------------------
| Protected routes
|--------------------------------------------------------------------------
*/

router
  .group(() => {
    router.get('/', [controllers.Dashboard, 'index']).as('home')

    router
      .post('logout', [controllers.Session, 'destroy'])
      .as('session.destroy')
  })
  .use(middleware.auth())

/*
|--------------------------------------------------------------------------
| Guest routes
|--------------------------------------------------------------------------
*/

router
  .group(() => {
    router.get('signup', [controllers.NewAccount, 'create'])

    router.post('signup', [controllers.NewAccount, 'store'])

    router.get('login', [controllers.Session, 'create'])

    router.post('login', [controllers.Session, 'store'])
  })
  .use(middleware.guest())
