const { DataTypes } = require('sequelize');
const sequelize = require('../db/database.mjs');

// 모델 정의
const Post = sequelize.define(
    'Post',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        content: {
            type: DataTypes.STRING(2000),
            allowNull: false,
        },
        useridx: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        tableName: 'post',       // 실제 테이블명
        timestamps: false,       // updatedAt 자동 생성 방지
        freezeTableName: true,
    }
);

// CREATE
export async function createPost({ title, content, useridx }) {
    return await Post.create({ title, content, useridx });
}

// READ ALL
export async function getAllPosts() {
    return await Post.findAll({
        order: [['createdAt', 'DESC']],
    });
}

// READ by ID
export async function getPostById(id) {
    return await Post.findOne({ where: { id } });
}

// READ by useridx (내가 쓴 글)
export async function getPostsByUser(useridx) {
    return await Post.findAll({
        where: { useridx },
        order: [['createdAt', 'DESC']],
    });
}

// UPDATE
export async function updatePost(id, fieldsToUpdate) {
    return await Post.update(fieldsToUpdate, { where: { id } });
}

// DELETE
export async function deletePost(id) {
    return await Post.destroy({ where: { id } });
}