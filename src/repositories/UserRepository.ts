import { EntityRepository, IsNull, Not, Repository } from "typeorm";
import { User } from "../entity/User";

@EntityRepository(User)
export class UserRepository extends Repository<User> {

    findByHp(hp: string) {
        return this.findOne({ where: { hp: hp } });
    }

    findByHpNotActivated(hp: string) {
        return this.findOne({ where: { hp: hp, activation_date : Not(IsNull()) } });
    }
}
