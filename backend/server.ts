import app from "./src/app";

const PORT = process.env.PORT || 5000;

try {
  app.listen(PORT, () => {
    console.log(`Server is up Baby! Running on ${PORT}`);
  });
} catch (err) {
  console.error(`Sever failed to start ${err}`);
  process.exit(1);
}
