import { BeforeInsert, Column, Entity } from "typeorm";
import { Base } from "../../common/entities/base.entity";
import { md5, randomString } from "../../utils/common";

@Entity({ name: 'user' })
export class User extends Base {
  @Column({
    comment: "登陆账号",
    unique: true,
  })
  loginAccount: string

  @Column({
    comment: "姓名",
  })
  name: string

  @Column({
    comment: "密码",
  })
  password: string

  @Column({
    comment: "密码加盐",
  })
  passwordSalt: string

  /**
   * @description: 设置密码
   */
  @BeforeInsert()
  hashPassword() {
    this.passwordSalt = randomString()
    this.password = md5(this.passwordSalt + this.password + this.passwordSalt)
    return true
  }

  validatePassword(password: string) {
    if (!password) {
      throw new Error("pwd can not be null");
    }
    let cText = md5(this.passwordSalt + password + this.passwordSalt)
    return cText === this.password
  }
}

