import { EntityRepository, IsNull, Not, Repository } from "typeorm";
import { Superuser } from "../entity/Superuser";
import { User } from "../entity/User";

@EntityRepository(Superuser)
export class SuperUserRepository extends Repository<Superuser> {

    findByUsernamePassword(u: string, p: string) {
        return this.findOne({ where: { username: u, password: p } });
    }
}