export function notFound(req, res) {
    res.status(404).json({ message: "Risorsa non trovata" });
  }
  
  export function errorHandler(err, req, res, next) {
    console.error(err);
    const status = err.status || 500;
    res.status(status).json({
      message: status === 500 ? "Errore interno del server" : err.message,
    });
  }