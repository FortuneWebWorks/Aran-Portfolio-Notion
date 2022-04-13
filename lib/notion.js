import { Client } from '@notionhq/client';

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

export const getDatabase = async (databaseId) => {
  const response = await notion.databases.query({
    database_id: databaseId,
    sorts: [
      {
        property: 'sort',
        direction: 'ascending',
      },
    ],
  });
  return response.results;
};

export const getPage = async (pageId) => {
  const response = await notion.pages.retrieve({ page_id: pageId });
  return response;
};

export const getPageWithSlug = async (pageSlug) => {
  const response = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID,
    filter: {
      or: [
        {
          property: 'Name',
          rich_text: {
            ends_with: pageSlug,
          },
        },
      ],
    },
    sorts: [
      {
        property: 'sort',
        direction: 'ascending',
      },
    ],
  });

  return response.results;
};

export const getBlocks = async (blockId) => {
  const blocks = [];
  let cursor;
  while (true) {
    const { results, next_cursor } = await notion.blocks.children.list({
      start_cursor: cursor,
      block_id: blockId,
    });
    blocks.push(...results);
    if (!next_cursor) {
      break;
    }
    cursor = next_cursor;
  }
  return blocks;
};
