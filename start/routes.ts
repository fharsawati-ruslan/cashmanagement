import { middleware } from '#start/kernel'
import { controllers } from '#generated/controllers'
import router from '@adonisjs/core/services/router'

/*
|--------------------------------------------------------------------------
| Protected routes
|--------------------------------------------------------------------------
|
| Semua route di bawah ini hanya bisa diakses
| oleh user yang sudah login.
|
*/

router
  .group(() => {
    /*
    |--------------------------------------------------------------------------
    | Dashboard
    |--------------------------------------------------------------------------
    */

    router
      .get('/', [controllers.Dashboard, 'index'])
      .as('home')

    router
      .get('/dashboard/summary', [controllers.Dashboard, 'summary'])
      .as('dashboard.summary')

    /*
    |--------------------------------------------------------------------------
    | Cash Management - Transactions
    |--------------------------------------------------------------------------
    */

    router
      .get('/transactions', [controllers.CashTransactions, 'index'])
      .as('transactions.index')

    router
      .get('/transactions/create', [controllers.CashTransactions, 'create'])
      .as('transactions.create')

    router
      .post('/transactions', [controllers.CashTransactions, 'store'])
      .as('transactions.store')

    router
      .get('/transactions/:id', [controllers.CashTransactions, 'show'])
      .as('transactions.show')

    /*
    |--------------------------------------------------------------------------
    | Logout
    |--------------------------------------------------------------------------
    */

    router
      .post('/logout', [controllers.Session, 'destroy'])
      .as('session.destroy')
  })
  .use(middleware.auth())

/*
|--------------------------------------------------------------------------
| Guest routes
|--------------------------------------------------------------------------
|
| Route di bawah ini hanya bisa diakses
| oleh user yang belum login.
|
*/

router
  .group(() => {
    /*
    |--------------------------------------------------------------------------
    | Signup
    |--------------------------------------------------------------------------
    */

    router
      .get('/signup', [controllers.NewAccount, 'create'])
      .as('new_account.create')

    router
      .post('/signup', [controllers.NewAccount, 'store'])
      .as('new_account.store')

    /*
    |--------------------------------------------------------------------------
    | Login
    |--------------------------------------------------------------------------
    */

    router
      .get('/login', [controllers.Session, 'create'])
      .as('session.create')

    router
      .post('/login', [controllers.Session, 'store'])
      .as('session.store')
  })
  .use(middleware.guest())
