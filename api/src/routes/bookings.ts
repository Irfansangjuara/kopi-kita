import { Router } from 'express';
import { pool } from '../db.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();

// POST /api/bookings - Create new booking (public)
router.post('/', async (req, res) => {
  try {
    const { customer_name, whatsapp, booking_date, booking_time, party_size, notes } = req.body;
    
    // Validation
    if (!customer_name || !whatsapp || !booking_date || !booking_time || party_size == null) {
      return res.status(400).json({ 
        error: 'Missing required fields: customer_name, whatsapp, booking_date, booking_time, party_size' 
      });
    }
    
    // Validate party_size
    if (party_size < 1 || party_size > 8) {
      return res.status(400).json({ error: 'Party size must be between 1 and 8' });
    }
    
    // Validate date is not in the past
    const bookingDate = new Date(booking_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (bookingDate < today) {
      return res.status(400).json({ error: 'Booking date cannot be in the past' });
    }
    
    // Validate whatsapp format (digits only, min 10)
    const cleanWhatsapp = whatsapp.replace(/\D/g, '');
    if (cleanWhatsapp.length < 10) {
      return res.status(400).json({ error: 'WhatsApp number must be at least 10 digits' });
    }
    
    const result = await pool.query(
      `INSERT INTO bookings (customer_name, whatsapp, booking_date, booking_time, party_size, notes, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'pending')
       RETURNING *`,
      [customer_name, cleanWhatsapp, booking_date, booking_time, party_size, notes || null]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

// GET /api/bookings - List all bookings (admin only)
router.get('/', requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM bookings ORDER BY booking_date ASC, booking_time ASC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// PATCH /api/bookings/:id - Update booking status (admin only)
router.patch('/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    // Validation
    if (!status) {
      return res.status(400).json({ error: 'Missing required field: status' });
    }
    
    if (!['pending', 'confirmed', 'done', 'cancelled'].includes(status)) {
      return res.status(400).json({ 
        error: 'Invalid status. Must be: pending, confirmed, done, or cancelled' 
      });
    }
    
    const result = await pool.query(
      'UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({ error: 'Failed to update booking' });
  }
});

export default router;
