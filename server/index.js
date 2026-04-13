const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const seedAdmin = require('./utils/seedAdmin');
const authRoutes = require('./routes/authRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const donationRoutes = require('./routes/donationRoutes');
const bloodRequestRoutes = require('./routes/bloodRequestRoutes');

// Load environment variables
dotenv.config();

// Connect to database
connectDB().then(() => {
    seedAdmin();
});

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: true, // Dynamically allow the requesting origin
        methods: ["GET", "POST", "PUT"],
        credentials: true
    }
});

// Middlewares
app.use(express.json());
app.use(cors({
    origin: true,
    credentials: true
}));
app.use(morgan('dev'));

// Socket.io connection
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('join', (userId) => {
        socket.join(userId);
        console.log(`User ${userId} joined room`);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Make io accessible to our routers
app.set('socketio', io);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/requests', bloodRequestRoutes);

app.get('/', (req, res) => {
  res.send('Blood Bank API is running...');
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
