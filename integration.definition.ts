import {IntegrationDefinition, z} from '@botpress/sdk'
import { integrationName } from './package.json'

export default new IntegrationDefinition({
  title: 'SQL chat [Text2Sql]',
  name: integrationName,
  description: 'Connect and chat with your databases without writing SQL code [text2sql]',
  version: '0.0.1',
  configuration: {
    schema: z.object({
      apiKey: z.string(), // users of your integration will provide this token to connect to their Telegram bot
    }),
  },
  readme: 'hub.md',
  icon: 'icon.svg',
  channels: {},
  actions: {
    answerSql: {
      title: 'Answer user question using smartDBConnector',
      description: 'Takes a link as an input and returns a link that notifies the author when the link is clicked.',
      input: {
        schema: z.object({
          question: z.string().describe('text query'),
          onlyData: z.boolean().describe('whether to receive one row data as a text answer'),
          format: z.optional(z.enum(["JSON_ARRAY", "CSV", "MARKDOWN"])).describe('format of API output'),
        }),
      },
      output: {
        schema: z.object({
          type: z.string().describe('one of \'text\', \'table\', \'barChart\', \'lineChart\', \'pieChart\''),
          queryId: z.string().describe('Id of the sql query'),
          message: z.optional(z.string()).describe("message if type = 'text'"),
          data: z.any().describe("table data if type = 'table'"),
          conf: z.any().describe("chart configuration if type is one of \'barChart\', \'lineChart\', \'pieChart\'"),
        })
      },
    }
  },
  user: {
    tags: {
      id: {}, // Add this line to tag users
    },
  },
})
