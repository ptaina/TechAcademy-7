import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";
import bcrypt from "bcrypt";

class ProducerModel extends Model {
  id!: number;
  name!: string;
  establishmentName?: string;
  email!: string;
  phone!: string;
  cpf!: string;
  address!: string;
  password!: string;

  public async hashPassword(): Promise<void> {
    this.password = await bcrypt.hash(this.password, 10);
  }

  public validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}

ProducerModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    establishmentName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cpf: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "ProducerModel",
    tableName: "producers",
  }
);

ProducerModel.beforeCreate(async (producer: ProducerModel) => {
  await producer.hashPassword();
});

ProducerModel.beforeUpdate(async (producer: ProducerModel) => {
  if (producer.changed("password")) {
    await producer.hashPassword();
  }
});

export default ProducerModel;
