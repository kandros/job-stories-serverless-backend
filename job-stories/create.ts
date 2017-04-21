import * as AWS from 'aws-sdk'

const dynamoDb = new AWS.DynamoDB.DocumentClient()

export function handle(event, context, callback) {

    const timestamp = new Date().getTime()
    const data = JSON.parse(event.body)
    if (typeof data.story === 'undefined') {
        console.error('Validation Failed')
        callback(new Error('Couldn\'t create story.'))
        return
    }

    const params = {
        Item: {
            createdAt: timestamp,
            id: data.id,
            story: data.story,
            updatedAt: timestamp,
        },
        TableName: process.env.DYNAMODB_TABLE,
    }

    // write the todo to the database
    dynamoDb.put(params, (error) => {
        // handle potential errors
        if (error) {
            console.error(error)
            callback(new Error('Couldn\'t insert story in dynamo.'))
            return
        }

        // create a response
        const response = {
            body: JSON.stringify(params.Item),
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
            statusCode: 200,
        }
        callback(null, response)
    })
}
