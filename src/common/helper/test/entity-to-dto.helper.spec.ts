import { Column, Entity } from "typeorm";
import { Base } from "../../entities/base.entity";
import { EntityToDto } from "../entity-to-dto.helper";

@Entity({
  name: 's_doctor'
})
export class Doctor extends Base {
  @Column({
    comment: "姓名",
  })
  name: string;
  @Column({
    comment: "密码",
  })
  password: string;
}
// 保留全部字段
let r1 = EntityToDto(Doctor)
// 过滤password字段, 其他字段保留
let r2 = EntityToDto(Doctor, { filterKeys: ["password"] })
// 只保留name字段
let r3 = EntityToDto(Doctor, { selectKeys: ["name"] })
