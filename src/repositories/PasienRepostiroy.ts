import { EntityManager, EntityRepository, Repository, Transaction, TransactionManager, TransactionRepository } from "typeorm";
import { DaftarKeluhanPasien } from "../entity/DaftarKeluhanPasien";
import { Keluhan } from "../entity/Keluhan";
import { Pasien } from "../entity/Pasien";

@EntityRepository(Pasien)
export class PasienRepository extends Repository<Pasien> {
    async saveKeluhanPasien(data) {
        
        console.log(data);
    }
}