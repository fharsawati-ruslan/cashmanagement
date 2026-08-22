import type { HttpContext } from '@adonisjs/core/http'

export default class DashboardController {
  async index({ view, auth }: HttpContext) {
    return view.render('pages/dashboard', {
      user: auth.user,
    })
  }
}
