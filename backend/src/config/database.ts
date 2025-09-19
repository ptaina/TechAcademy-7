import { Sequelize } from "sequelize";

const sequelize = new Sequelize("agroconecta", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

export default sequelize;
