/** @format */

import { Grid, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { sql } from '@vercel/postgres'
import { GetStaticPaths, GetStaticProps } from 'next'
import React from 'react'
import LeftButton from 'src/components/left-button'
import RightButton from 'src/components/right-button'

type MainRows = {
  type: string
  id: number
  main_menu_id: number
  sub_menu_id: number | null
  name: string | null
  title: string | null
  path: string | null
  view_count: number | null
  tag: string | null
  created_at: string
  updated_at: string
}

export default function MainIdComponent({ rows }: { rows: MainRows[] }) {
  console.log(rows)

  return (
    <Box sx={{ backgroundColor: '#c6c6c6' }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <LeftButton />
          <RightButton />
        </Grid>
        <Grid item xs={12}>
          url
        </Grid>
        <Grid item xs={12}>
          북마크
        </Grid>
        <Grid item xs={12}>
          헤더
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', backgroundColor: '#fff' }}>
            <Typography>MainIdComponent</Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const main: string | undefined = params?.main as string | undefined

  if (!main) {
    return {
      props: {
        rows: []
      }
    }
  }

  const { rows } = await sql`
  WITH main_menu AS (
    SELECT id
    FROM blog_main_menu
    WHERE name = ${main}
),
sub_menus AS (
    SELECT 
        id, 
        main_menu_id, 
        name, 
        TO_CHAR(created_at, 'YYYY-MM-DD"T"HH24:MI:SS"Z"') AS created_at, 
        TO_CHAR(updated_at, 'YYYY-MM-DD"T"HH24:MI:SS"Z"') AS updated_at, 
        NULL::INT AS sub_menu_id, 
        NULL::VARCHAR AS title, 
        NULL::VARCHAR AS path, 
        NULL::INT AS view_count, 
        NULL::VARCHAR AS tag
    FROM blog_sub_menu
    WHERE main_menu_id = (SELECT id FROM main_menu)
),
blog_items AS (
    SELECT 
        id, 
        main_menu_id, 
        sub_menu_id, 
        title, 
        path, 
        view_count, 
        tag, 
        TO_CHAR(created_at, 'YYYY-MM-DD"T"HH24:MI:SS"Z"') AS created_at, 
        TO_CHAR(updated_at, 'YYYY-MM-DD"T"HH24:MI:SS"Z"') AS updated_at
    FROM blog_items
    WHERE main_menu_id = (SELECT id FROM main_menu)
)
SELECT 'sub_menu' AS type, id, main_menu_id, sub_menu_id, name, title, path, view_count, tag, created_at, updated_at
FROM sub_menus
UNION ALL
SELECT 'blog_item' AS type, id, main_menu_id, sub_menu_id, NULL::VARCHAR AS name, title, path, view_count, tag, created_at, updated_at
FROM blog_items;`

  return {
    props: {
      rows
    }
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const { rows } = await sql`SELECT * FROM blog_main_menu;`

  return {
    paths: rows.map((row: any) => ({ params: { main: row.name } })),
    fallback: false
  }
}
