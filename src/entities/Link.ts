import { Entity, PrimaryColumn, Column, ManyToOne, Relation  } from "typeorm";
import { User } from "./User";
@Entity()
class Link {
  @PrimaryColumn()
  linkId: string;

  @Column()
  originalUrl: string;

  @Column()
  lastAccessedOn: Date;

  @Column()
  numHits: number;

  @ManyToOne( () => User, (user) => user.links )
  user: Relation<User>;
}

export { Link }
