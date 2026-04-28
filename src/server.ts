import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { createServer } from 'http';
import { Server } from 'socket.io';

import { userRoutes } from './routes/userRoutes.js';
import { authRoutes } from './routes/authRoutes.js';
import { deliveryRoutes } from './routes/deliveryRoutes.js';
import { UpdateLocationService } from './services/UpdateLocationService.js';

const app = express();

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: '*',
  }
});

app.use(cors());
app.use(express.json());

app.use('/users', userRoutes);
app.use('/login', authRoutes);
app.use('/deliveries', deliveryRoutes);

io.on('connection', (socket) => {
  console.log(`🔌 Novo dispositivo conectado: ${socket.id}`);

  socket.on('join_delivery', (delivery_id) => {
    socket.join(delivery_id);
    console.log(`👀 Dispositivo entrou na sala da entrega: ${delivery_id}`);
  });

  socket.on('update_location', async (data) => {
    const { delivery_id, lat, lng } = data;
    console.log(`📍 GPS Recebido [${delivery_id}]: ${lat}, ${lng}`);

    try {
      const updateLocationService = new UpdateLocationService();
      await updateLocationService.execute(delivery_id, lat, lng);

      io.to(delivery_id).emit('new_location', { lat, lng });

    } catch (error) {
      console.error('Erro ao salvar histórico de localização:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log(`❌ Dispositivo desconectado: ${socket.id}`);
  });
});

app.get('/health', (req, res) => {
  return res.json({ status: 'OK', message: 'Servidor HTTP e WebSocket rodando!' });
});

const PORT = process.env.PORT || 3333;

httpServer.listen(PORT, () => {
  console.log(`🚀 Server started on http://localhost:${PORT}`);
});

export { io };