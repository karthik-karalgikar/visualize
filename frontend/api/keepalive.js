export default async function handler(req, res) {
  try {
    const response = await fetch(
      "https://dhristi-executor.onrender.com/health",
      {
        method: "GET",
      }
    );

    res.status(200).json({
      status: "ok",
      backendStatus: response.status,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
}
