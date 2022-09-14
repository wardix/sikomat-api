import { EntityRepository, Repository } from "typeorm";
import { Bidan } from "../entity/Bidan";

@EntityRepository(Bidan)
export class BidanRepository extends Repository<Bidan> {

    findByHp(hp: string) {
        return this.findOne({ hp });
    }
}