import express from "express";
import sequelize from "./config/database";
import { associateModels } from "./models/associateModels";
import producerRoutes from "./routes/producerRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import productRoutes from "./routes/productRoutes";

const app = express();
const port = 3000;
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Olá, Mundo! :)");
});

app.use(producerRoutes);
app.use(categoryRoutes);
app.use(productRoutes);

associateModels();

sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Banco de dados foi sincronizado com sucesso");
  })
  .catch((error) => {
    console.error("Erro ao sincronizar o banco de dados:", error);
  });

app.listen(port, () => {
  console.log("Servidor rodando na porta ", port);
});
