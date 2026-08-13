import { Model } from 'sequelize-typescript';

/**
 * Generic base repository for CRUD operations
 * Provides common database operations for all entity repositories
 */
export class BaseRepository<T extends Model> {
  constructor(protected model: any) {}

  /**
   * Find all records with optional filtering and pagination
   */
  async findAll(options?: {
    where?: any;
    include?: any;
    order?: any;
    limit?: number;
    offset?: number;
  }): Promise<T[]> {
    return this.model.findAll(options);
  }

  /**
   * Find a single record by primary key
   */
  async findById(id: number | string, options?: { include?: any }): Promise<T | null> {
    return this.model.findByPk(id, options);
  }

  /**
   * Find a single record by custom criteria
   */
  async findOne(options: { where: any; include?: any }): Promise<T | null> {
    return this.model.findOne(options);
  }

  /**
   * Count records matching criteria
   */
  async count(options?: any): Promise<number> {
    return this.model.count(options || {});
  }

  /**
   * Create a new record
   */
  async create(data: any, options?: { include?: any }): Promise<T> {
    return this.model.create(data, options);
  }

  /**
   * Update a record by primary key
   */
  async update(id: number | string, data: any): Promise<[affectedCount: number]> {
    return this.model.update(data, {
      where: { id },
    });
  }

  /**
   * Update multiple records matching criteria
   */
  async updateWhere(data: any, where: any): Promise<[affectedCount: number]> {
    return this.model.update(data, { where });
  }

  /**
   * Delete a record by primary key
   */
  async delete(id: number | string): Promise<number> {
    return this.model.destroy({
      where: { id },
    });
  }

  /**
   * Delete multiple records matching criteria
   */
  async deleteWhere(where: any): Promise<number> {
    return this.model.destroy({ where });
  }

  /**
   * Check if a record exists
   */
  async exists(where: any): Promise<boolean> {
    const count = await this.model.count({ where });
    return count > 0;
  }

  /**
   * Find and count records (useful for pagination)
   */
  async findAndCount(options?: {
    where?: any;
    include?: any;
    order?: any;
    limit?: number;
    offset?: number;
  }): Promise<{ rows: T[]; count: number }> {
    const { rows, count } = await this.model.findAndCountAll(options);
    return { rows, count };
  }
}
