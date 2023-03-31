import { Entity, PrimaryGeneratedColumn, Column, Relation, OneToMany, JoinColumn  } from "typeorm";
import { Link } from "./Link";

@Entity()
class User {
  @PrimaryGeneratedColumn('uuid')
  userId: string;

  @Column({unique: true})
  userName: string;

  @Column({ unique: true})
  passwordhash: string;

  @Column({ default: false })
  isPro: boolean;

  @Column({ default: false })
  isAdmin: boolean;

  @OneToMany(() => Link, (links) => links.user)
  @JoinColumn()
  links: Relation<Link>[];

}

export {User};
