import { User } from "src/users/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Measure {
    @PrimaryGeneratedColumn("uuid")
    id : string;

    @Column()
    measure_datetime: Date;

    @Column()
    measure_type: string;

    @Column()
    has_confirmed: boolean;

    @Column()
    image_url: string;

    @Column()
    measure_value: number;

    @ManyToOne(()=> User, user => user.measures)
    user: User;
}