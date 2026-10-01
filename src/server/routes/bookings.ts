import { Router } from 'express';
import { getPool } from '../db';
import { requireAdmin } from '../middleware/auth';

const router = Router();

// POST /api/bookings — public
router.post('/', async (req, res) => {
  try {
    const pool = getPool();
    const { customer_name, whatsapp, booking_date, booking_time, party_size, notes } =
      req.body as {
        customer_name?: string; whatsapp?: string; booking_date?: string;
        booking_time?: string; party_size?: unknown; notes?: string;
      };

    if (!customer_name || !whatsapp || !booking_date || !booking_time || party_size == null) {
      res.status(400).json({
        error: 'Missing required fields: customer_name, whatsapp, booking_date, booking_time, party_size',
      });
      return;
    }

    const size = Number(party_size);
    if (!Number.isInteger(size) || size < 1 || size > 8) {
      res.status(400).json({ error: 'Party size must be between 1 and 8' });
      return;
    }

    // Date must not be in the past (compare YYYY-MM-DD strings to avoid timezone issues)
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    if (booking_date < todayStr) {
      res.status(400).json({ error: 'Booking date cannot be in the past' });
      return;
    }

    // WhatsApp: digits only, min 10
    const cleanWhatsapp = whatsapp.replace(/\D/g, '');
    if (cleanWhatsapp.length < 10) {
      res.status(400).json({ error: 'WhatsApp number must be at least 10 digits' });
      return;
    }

    const result = await pool.query(
      `INSERT INTO bookings
         (customer_name, whatsapp, booking_date, booking_time, party_size, notes, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'pending')
       RETURNING *`,
      [customer_name, cleanWhatsapp, booking_date, booking_time, size, notes ?? null],
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

// GET /api/bookings — admin only, sorted by nearest date first
router.get('/', requireAdmin, async (req, res) => {
  try {
    const pool = getPool();
    const result = await pool.query(
      'SELECT * FROM bookings ORDER BY booking_date ASC, booking_time ASC',
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// PATCH /api/bookings/:id — admin only, change status
router.patch('/:id', requireAdmin, async (req, res) => {
  try {
    const pool = getPool();
    const { id } = req.params;
    const { status } = req.body as { status?: string };

    if (!status) {
      res.status(400).json({ error: 'Missing required field: status' });
      return;
    }
    if (!['pending', 'confirmed', 'done', 'cancelled'].includes(status)) {
      res.status(400).json({
        error: 'Invalid status. Must be: pending, confirmed, done, or cancelled',
      });
      return;
    }

    const result = await pool.query(
      'UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *',
      [status, id],
    );
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Booking not found' });
      return;
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({ error: 'Failed to update booking' });
  }
});

export default router;
