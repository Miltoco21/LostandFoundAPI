import app from "./app.js";
import { PORT } from "./config.js"; // O usa directamente un valor fijo, como 3000

const startServer = async () => {
  try {
    console.log("Iniciando servidor...");
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en el puerto ${PORT}`);
    });
  } catch (error) {
    console.error("Error al iniciar el servidor:", error);
  }
};

startServer();
