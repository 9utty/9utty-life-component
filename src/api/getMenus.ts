import { sql } from '@vercel/postgres'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const result = await sql`SELECT 
    bi.id,
    bi.title,
    bi.path,
    bi.view_count,
    bi.tag,
    bi.created_at,
    bi.updated_at,
    bm.name AS main_menu_name,
    bsm.name AS sub_menu_name
FROM 
    blog_items bi
INNER JOIN 
    blog_main_menu bm ON bi.main_menu_id = bm.id
    LEFT JOIN 
        blog_sub_menu bsm ON bi.sub_menu_id = bsm.id;
    `

  res.status(200).json(result.rows)
}
