import dotenv from 'dotenv';
dotenv.config();

import app from './app';

// 🟢 Puerto del servicio
const PORT = process.env.PORT || 4003;

// 🟢 Arranque del servidor
app.listen(PORT, () => {
	console.log(`🧠 Labs Service running on port ${PORT}`);
	console.log(`🚀 API ready at http://localhost:${PORT}/api`);
});
