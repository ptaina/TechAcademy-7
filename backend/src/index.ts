import express from "express";
import sequelize from "./config/database";
import producerRoutes from "./routes/producerRoutes";

const app = express();
const port = 3000;
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Olá, Mundo! :)");
});

app.use(producerRoutes);

sequelize
  .sync({ alter: true })
  .then(() => {
    console.log(" Banco de dados foi sincronizado com sucesso");
  })
  .catch((error) => {
    console.error("Erro ao sincronizar o banco de dados:", error);
  });

app.listen(port, () => {
  console.log("Servidor rodando na porta ", port);
});
