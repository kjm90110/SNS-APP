import { DataTypes } from "sequelize";
import sequelize from "../db/database.mjs";

// 직접 쿼리를 짜지 않아도 되는 mysql 라이브러리 sequelize
// table model 정의
const User = sequelize.define(
    "User",
    {
        idx: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        userid: {
            type: DataTypes.STRING(50),
            allowNull: false, // not null
            unique: true,
        },
        password: {
            type: DataTypes.STRING(200),
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
    },
    {
        tableName: "user", // 실제 테이블 이름
        timestamps: false, // createdAt, updatedAt 끄기
        freezeTableName: true, // 테이블명 자동 복수화 방지
    }
);

// CREATE
export async function createUser({ userid, password, name, email }) {
    return await User.create({ userid, password, name, email });
}

// READ ALL
export async function getAllUsers() {
    return await User.findAll();
}

// READ ONE
export async function getUserByIdx(idx) {
    return await User.findOne({ where: { idx } });
}

// READ ONE by userid (로그인 시 필요)
export async function getUserByUserId(userid) {
    return await User.findOne({ where: { userid } });
}

// UPDATE
export async function updateUser(idx, fieldsToUpdate) {
    return await User.update(fieldsToUpdate, { where: { idx } });
}

// DELETE
export async function deleteUser(idx) {
    return await User.destroy({ where: { idx } });
}
