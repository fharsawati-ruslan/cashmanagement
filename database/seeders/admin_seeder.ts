import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class AdminSeeder extends BaseSeeder {
  async run() {
    const existingAdmin = await User.findBy('email', 'herlina@oasis.my.id')

    if (existingAdmin) {
      console.log('Admin Herlina sudah tersedia')
      return
    }

    await User.create({
      fullName: 'Herlina',
      email: 'herlina@oasis.my.id',
      password: 'Admin@12345',
    })

    console.log('Admin Herlina berhasil dibuat')
  }
}
