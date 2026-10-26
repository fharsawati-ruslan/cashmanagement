import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'cash_transactions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()

      table.string('transaction_code', 50).notNullable().unique()

      table
        .enum('type', ['cash_in', 'cash_out'])
        .notNullable()

      table.date('transaction_date').notNullable()

      table.string('category', 100).notNullable()

      table.decimal('amount', 18, 2).notNullable()

      table
        .enum('account_type', ['cash', 'bank'])
        .notNullable()
        .defaultTo('cash')

      table.string('source', 150).nullable()

      table.text('description').nullable()

      table.string('reference_number', 100).nullable()

      /**
       * File invoice/bukti transaksi di MinIO.
       */
      table.string('attachment_path', 500).nullable()

      table.string('attachment_original_name', 255).nullable()

      table.string('attachment_content_type', 100).nullable()

      table
        .enum('status', ['posted', 'cancelled'])
        .notNullable()
        .defaultTo('posted')

      table
        .integer('created_by')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('users')
        .onDelete('SET NULL')

      table.timestamp('created_at').notNullable()

      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
