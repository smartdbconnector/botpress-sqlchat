import * as sdk from '@botpress/sdk'
import * as bp from '.botpress'
import {axios} from "@botpress/client";

const url = "https://api.smartdbconnector.com"
export default new bp.Integration({
  register: async ({ctx}) => {
    try {
      await axios.default.get(
          `${url}/api/signal?signal=botpress_integration_installed`,
          {
            headers: {
              'Content-Type': 'application/json',
              'Auth-Token': ctx.configuration.apiKey
            }
          }
      )
    } catch (e) {
      throw new sdk.RuntimeError('Invalid SmartDBConnector Api Key') // replace this with your own validation logic
    }
  },
  unregister: async ({ctx}) => {
    try {
      await axios.default.get(
          `${url}/api/signal?signal=botpress_integration_removed`,
          {
            headers: {
              'Content-Type': 'application/json',
              'Auth-Token': ctx.configuration.apiKey
            }
          }
      )
    } catch (e) {
      throw new sdk.RuntimeError('Invalid SmartDBConnector Api Key') // replace this with your own validation logic
    }
  },
  actions: {
    answerSql: async ({ input, ctx, logger }) => {
      try {
        const {question, onlyData = false, format = null} = input;

        logger.forBot().info('check')

        if (!question)
          return {queryId: "Handler didn't receive a valid message"}

        logger.forBot().info('request start', {data: question})

        const response = await axios.default.post(
            `${url}/api/assistant/ask`,
            {question, format, onlyData},
            {
              headers: {
                'Content-Type': 'application/json',
                'Auth-Token': ctx.configuration.apiKey
              }
            }
        ) .then(function (response) {
          // handle success
          logger.forBot().info("ok", { data: { response }});
          return response
        })
        .catch(function (error) {
          // handle error
          logger.forBot().error(error);
        })

        const {data: responsedata, status} = response

        logger.forBot().info('request end', {data: JSON.stringify(responsedata)})

        if (status !== 200) {
          logger.forBot().error(`Server error: ${status}`, {data: JSON.stringify(responsedata)})
          throw new sdk.RuntimeError(`Server error: ${status}`)
        }

        return responsedata
      } catch (e) {
        throw new sdk.RuntimeError("SmartDBConnector application error") // replace this with your own validation logic
      }
    },
  },
  handler: async () => {
  },
  channels: {},
})
