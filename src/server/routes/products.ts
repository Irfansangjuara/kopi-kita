import { Router } from 'express';
import { getPool } from '../db';
import { requireAdmin } from '../middleware/auth';
import { reportServerError } from '../observability';

const router = Router();

// GET /api/products — public, optional ?category= filter
router.get('/', async (req, res) => {
  try {
    const pool = getPool();
    const { category } = req.query;

    let query = 'SELECT * FROM products';
    const params: string[] = [];

    if (category && category !== 'all') {
      query += ' WHERE category = $1';
      params.push(category as string);
    }

    query += ' ORDER BY id ASC';
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    await reportServerError(error, 'Error fetching products');
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// POST /api/products — admin only
router.post('/', requireAdmin, async (req, res) => {
  try {
    const pool = getPool();
    const { name, description, price, category, image_url, available } = req.body as {
      name?: string; description?: string; price?: unknown; category?: string;
      image_url?: string; available?: boolean;
    };

    if (!name || price == null || !category) {
      res.status(400).json({ error: 'Missing required fields: name, price, category' });
      return;
    }
    if (!['kopi', 'non-kopi', 'pastry'].includes(category)) {
      res.status(400).json({ error: 'Invalid category. Must be: kopi, non-kopi, or pastry' });
      return;
    }
    if (Number(price) < 0) {
      res.status(400).json({ error: 'Price must be >= 0' });
      return;
    }

    const result = await pool.query(
      `INSERT INTO products (name, description, price, category, image_url, available)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [name, description ?? null, price, category, image_url ?? null, available !== false],
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    await reportServerError(error, 'Error creating product');
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// PUT /api/products/:id — admin only
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const pool = getPool();
    const { id } = req.params;
    const { name, description, price, category, image_url, available } = req.body as {
      name?: string; description?: string; price?: unknown; category?: string;
      image_url?: string; available?: boolean;
    };

    if (!name || price == null || !category) {
      res.status(400).json({ error: 'Missing required fields: name, price, category' });
      return;
    }
    if (!['kopi', 'non-kopi', 'pastry'].includes(category)) {
      res.status(400).json({ error: 'Invalid category. Must be: kopi, non-kopi, or pastry' });
      return;
    }
    if (Number(price) < 0) {
      res.status(400).json({ error: 'Price must be >= 0' });
      return;
    }

    const result = await pool.query(
      `UPDATE products
          SET name = $1, description = $2, price = $3, category = $4,
              image_url = $5, available = $6
        WHERE id = $7
        RETURNING *`,
      [name, description, price, category, image_url, available, id],
    );
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    res.json(result.rows[0]);
  } catch (error) {
    await reportServerError(error, 'Error updating product');
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// DELETE /api/products/:id — admin only
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const pool = getPool();
    const { id } = req.params;
    const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    res.status(204).end();
  } catch (error) {
    await reportServerError(error, 'Error deleting product');
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

export default router;
