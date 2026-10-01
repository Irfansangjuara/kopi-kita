import { Router } from 'express';
import { pool } from '../db.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();

// GET /api/products - List all products, optional ?category= filter
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    
    let query = 'SELECT * FROM products WHERE 1=1';
    const params: string[] = [];
    
    if (category && category !== 'all') {
      query += ` AND category = $1`;
      params.push(category as string);
    }
    
    query += ' ORDER BY id ASC';
    
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// POST /api/products - Add new product (admin only)
router.post('/', requireAdmin, async (req, res) => {
  try {
    const { name, description, price, category, image_url, available } = req.body;
    
    // Validation
    if (!name || price == null || !category) {
      return res.status(400).json({ error: 'Missing required fields: name, price, category' });
    }
    
    if (!['kopi', 'non-kopi', 'pastry'].includes(category)) {
      return res.status(400).json({ error: 'Invalid category. Must be: kopi, non-kopi, or pastry' });
    }
    
    if (price < 0) {
      return res.status(400).json({ error: 'Price must be >= 0' });
    }
    
    const result = await pool.query(
      `INSERT INTO products (name, description, price, category, image_url, available)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [name, description || null, price, category, image_url || null, available !== false]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// PUT /api/products/:id - Update product (admin only)
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category, image_url, available } = req.body;
    
    // Validation
    if (!name || price == null || !category) {
      return res.status(400).json({ error: 'Missing required fields: name, price, category' });
    }
    
    if (!['kopi', 'non-kopi', 'pastry'].includes(category)) {
      return res.status(400).json({ error: 'Invalid category. Must be: kopi, non-kopi, or pastry' });
    }
    
    if (price < 0) {
      return res.status(400).json({ error: 'Price must be >= 0' });
    }
    
    const result = await pool.query(
      `UPDATE products 
       SET name = $1, description = $2, price = $3, category = $4, image_url = $5, available = $6
       WHERE id = $7
       RETURNING *`,
      [name, description, price, category, image_url, available, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// DELETE /api/products/:id - Delete product (admin only)
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json({ message: 'Product deleted successfully', product: result.rows[0] });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

export default router;
