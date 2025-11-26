import { Sequelize } from "sequelize";
import { config } from "../config.mjs";

const sequelize = new Sequelize(
    config.db.name,
    config.db.user,
    config.db.passowrd,
    {
        host: config.db.host,
        dialect: "mysql",
        logging: true,
    }
);

// db connection
sequelize
    .authenticate()
    .then(() => console.log("db connected!"))
    .catch((err) => console.error("db connection error:", err));

module.exports = sequelize;
