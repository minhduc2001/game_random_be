import { PSQL } from '@/configs/db.config'
import { ListDto } from '@/dtos/base.dto'
import { User } from '@/entities/user.entity'
import NotFound from '@/middlewares/exception/Notfound'
import { BaseService } from '@/utils/baseService'
import { PaginateConfig } from '@/utils/paginate'

class UserService {
  async getAll() {
    const users = await PSQL.createQueryBuilder(User, 'users').getMany()
    return users
  }

  async getUserForAuth(id: number) {
    const user = await PSQL.createQueryBuilder(User, 'user')
      .where('user.id = :id', { id })
      .select(['user.id', 'user.full_name', 'user.avatar', 'user.email', 'user.phone', 'user.coin', 'user.role'])
      .getOne()

    if (!user) throw new NotFound()
    return user
  }
}

export default UserService
